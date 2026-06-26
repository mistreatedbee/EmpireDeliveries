import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Landmark, CreditCard, X, Wallet, TrendingUp, ArrowDownCircle } from 'lucide-react-native';
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Badge,
  StatCard,
  EmptyState,
  SkeletonList,
  Skeleton,
} from '@/components/empire';
import { driverService, WalletTransaction } from '@/services/driver.service';
import { useUIStore } from '@/stores/uiStore';
import { T, Fonts, Shadows, Radius } from '@/constants/colors';

const QUICK_AMOUNTS = [100, 200, 500, 1000];
const MIN_WITHDRAWAL = 50;

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();
  const time = d.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
  if (isToday) return `Today · ${time}`;
  if (isYesterday) return `Yesterday · ${time}`;
  return d.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric', year: 'numeric' });
}

function txBadgeVariant(type: string): 'success' | 'gold' | 'neutral' {
  switch (type?.toLowerCase()) {
    case 'earning': return 'success';
    case 'bonus':
    case 'tip': return 'gold';
    default: return 'neutral';
  }
}

function txBadgeLabel(type: string): string {
  if (!type) return 'Unknown';
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}

function isCredit(tx: WalletTransaction): boolean {
  return tx.type !== 'withdrawal' && tx.amount > 0;
}

export default function DriverWallet() {
  const queryClient = useQueryClient();
  const showToast = useUIStore((s) => s.showToast);

  const [withdrawVisible, setWithdrawVisible] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedQuick, setSelectedQuick] = useState<number | null>(null);

  const effectiveAmount = selectedQuick !== null ? selectedQuick.toString() : customAmount;

  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: ['driver', 'wallet'],
    queryFn: driverService.getWallet,
  });

  const { data: earningsToday } = useQuery({
    queryKey: ['driver', 'earnings', 'today'],
    queryFn: () => driverService.getEarnings('today'),
  });

  const { data: earningsWeek } = useQuery({
    queryKey: ['driver', 'earnings', 'week'],
    queryFn: () => driverService.getEarnings('week'),
  });

  const { data: earningsMonth } = useQuery({
    queryKey: ['driver', 'earnings', 'month'],
    queryFn: () => driverService.getEarnings('month'),
  });

  const withdrawMutation = useMutation({
    mutationFn: (amount: number) => driverService.requestWithdrawal(amount),
    onSuccess: (result) => {
      setWithdrawVisible(false);
      setCustomAmount('');
      setSelectedQuick(null);
      void queryClient.invalidateQueries({ queryKey: ['driver', 'wallet'] });
      showToast(result.message ?? 'Withdrawal requested. Processed in 2–3 business days.', 'success');
    },
    onError: (err: any) => {
      showToast(err?.message ?? 'Could not process withdrawal. Please try again.', 'error');
    },
  });

  function openWithdraw() {
    if (!wallet?.bankAccount) {
      showToast('Add a bank account before withdrawing.', 'warning');
      router.push('/(driver)/bank-account');
      return;
    }
    setCustomAmount('');
    setSelectedQuick(null);
    setWithdrawVisible(true);
  }

  function handleWithdrawConfirm() {
    const amount = parseFloat(effectiveAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid amount.', 'error');
      return;
    }
    if (amount < MIN_WITHDRAWAL) {
      showToast(`Minimum withdrawal is R${MIN_WITHDRAWAL}.`, 'error');
      return;
    }
    if (amount > (wallet?.balance ?? 0)) {
      showToast(`Insufficient balance. Max: R${(wallet?.balance ?? 0).toFixed(2)}.`, 'error');
      return;
    }
    withdrawMutation.mutate(amount);
  }

  const transactions = wallet?.transactions ?? [];

  return (
    <SafeAreaView className="flex-1 bg-t-dark" style={{ flex: 1, backgroundColor: T.dark }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="px-5 pt-4 pb-5">
        <Text
          className="text-2xl text-white"
          style={{ fontFamily: Fonts.headingExtra }}
        >
          Wallet
        </Text>
        <Text
          className="text-t-textTer text-sm mt-0.5"
          style={{ fontFamily: Fonts.body }}
        >
          Your earnings &amp; payouts
        </Text>
      </View>

      <ScrollView
        className="flex-1 bg-t-bg rounded-t-3xl"
        style={{ flex: 1, backgroundColor: T.bg, borderTopLeftRadius: Radius.lg, borderTopRightRadius: Radius.lg }}
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Balance Card ──────────────────────────────────── */}
        {walletLoading ? (
          <Skeleton height={160} rounded="lg" width="100%" className="mb-4" />
        ) : (
          <View
            className="rounded-3xl p-6 mb-5"
            style={{ backgroundColor: T.dark, borderWidth: 1, borderColor: 'rgba(212,175,55,0.25)', ...Shadows.glow }}
          >
            <View className="flex-row items-center gap-2 mb-2">
              <Wallet size={14} color={T.gold} />
              <Text
                className="text-xs text-t-gold uppercase tracking-widest"
                style={{ fontFamily: Fonts.bodyMedium }}
              >
                Available Balance
              </Text>
            </View>

            <Text
              className="text-5xl text-white"
              style={{ fontFamily: Fonts.headingExtra }}
            >
              R{(wallet?.balance ?? 0).toFixed(2)}
            </Text>

            <View className="mt-5">
              <Button
                variant="primary"
                size="md"
                onPress={openWithdraw}
                disabled={(wallet?.balance ?? 0) < MIN_WITHDRAWAL}
                leftIcon={<ArrowDownCircle size={16} color={T.goldForeground} />}
              >
                Withdraw
              </Button>
            </View>
          </View>
        )}

        {/* ─── Bank Account ──────────────────────────────────── */}
        <Card className="mb-5">
          <CardHeader className="pb-2">
            <CardTitle>Bank Account</CardTitle>
          </CardHeader>
          <CardBody className="pt-0">
            {walletLoading ? (
              <SkeletonList rows={1} />
            ) : wallet?.bankAccount ? (
              <View className="flex-row items-center bg-t-surface2 rounded-2xl p-3">
                <View className="w-10 h-10 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: T.dark }}>
                  <Landmark size={16} color={T.gold} />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-t-text text-sm"
                    style={{ fontFamily: Fonts.bodyBold }}
                  >
                    {wallet.bankAccount.bankName} · {wallet.bankAccount.accountType}
                  </Text>
                  <Text
                    className="text-t-textSec text-xs mt-0.5"
                    style={{ fontFamily: Fonts.body }}
                  >
                    **** {wallet.bankAccount.accountNo?.slice(-4) ?? '????'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => router.push('/(driver)/bank-account')}
                  activeOpacity={0.7}
                >
                  <Text
                    className="text-t-gold text-sm"
                    style={{ fontFamily: Fonts.bodyBold }}
                  >
                    Change
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => router.push('/(driver)/bank-account')}
                activeOpacity={0.7}
                className="flex-row items-center gap-2 py-3 px-3 rounded-2xl border border-dashed"
                style={{ borderColor: T.border }}
              >
                <CreditCard size={18} color={T.gold} />
                <Text
                  className="text-t-gold text-sm"
                  style={{ fontFamily: Fonts.bodySemibold }}
                >
                  Set up bank account
                </Text>
              </TouchableOpacity>
            )}
          </CardBody>
        </Card>

        {/* ─── Earnings Summary ──────────────────────────────── */}
        <View className="mb-5">
          <Text
            className="text-base text-t-text mb-3"
            style={{ fontFamily: Fonts.bodyBold }}
          >
            Earnings Summary
          </Text>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <StatCard
                label="Today"
                value={`R${(earningsToday?.totalEarnings ?? 0).toFixed(0)}`}
                icon={<TrendingUp size={14} color={T.gold} />}
              />
            </View>
            <View className="flex-1">
              <StatCard
                label="This Week"
                value={`R${(earningsWeek?.totalEarnings ?? 0).toFixed(0)}`}
                icon={<TrendingUp size={14} color={T.gold} />}
              />
            </View>
          </View>
          <View className="mt-3">
            <StatCard
              label="This Month"
              value={`R${(earningsMonth?.totalEarnings ?? 0).toFixed(0)}`}
              delta={earningsMonth ? `${earningsMonth.tripCount} trips` : undefined}
              deltaTrend="up"
            />
          </View>
        </View>

        {/* ─── Transaction History ───────────────────────────── */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardBody className="pt-1">
            {walletLoading ? (
              <SkeletonList rows={4} />
            ) : transactions.length === 0 ? (
              <EmptyState
                icon={<Wallet size={28} color={T.textTer} />}
                title="No transactions yet"
                description="Completed deliveries and withdrawals will appear here."
                className="py-8"
              />
            ) : (
              <FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                ItemSeparatorComponent={() => (
                  <View className="h-px bg-t-border mx-1" />
                )}
                renderItem={({ item: tx }) => {
                  const credit = isCredit(tx);
                  return (
                    <View className="flex-row items-center py-3 gap-3">
                      {/* Icon */}
                      <View
                        className={[
                          'w-9 h-9 rounded-xl items-center justify-center',
                          credit ? 'bg-t-successBg' : 'bg-t-dangerBg',
                        ].join(' ')}
                      >
                        {credit ? (
                          <TrendingUp size={16} color={T.success} />
                        ) : (
                          <ArrowDownCircle size={16} color={T.danger} />
                        )}
                      </View>

                      {/* Description + date */}
                      <View className="flex-1">
                        <Text
                          className="text-t-text text-sm"
                          style={{ fontFamily: Fonts.bodySemibold }}
                          numberOfLines={1}
                        >
                          {tx.description ?? tx.type}
                        </Text>
                        <Text
                          className="text-t-textSec text-xs mt-0.5"
                          style={{ fontFamily: Fonts.body }}
                        >
                          {formatDate(tx.createdAt)}
                        </Text>
                      </View>

                      {/* Amount + badge */}
                      <View className="items-end gap-1">
                        <Text
                          className={[
                            'text-sm',
                            credit ? 'text-t-success' : 'text-t-danger',
                          ].join(' ')}
                          style={{ fontFamily: Fonts.bodyBold }}
                        >
                          {credit ? '+' : '-'}R{Math.abs(tx.amount).toFixed(2)}
                        </Text>
                        {tx.type && (
                          <Badge variant={txBadgeVariant(tx.type)}>
                            {txBadgeLabel(tx.type)}
                          </Badge>
                        )}
                      </View>
                    </View>
                  );
                }}
              />
            )}
          </CardBody>
        </Card>
      </ScrollView>

      {/* ─── Withdraw Modal ──────────────────────────────────── */}
      <Modal
        visible={withdrawVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setWithdrawVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-end"
          onPress={() => setWithdrawVisible(false)}
        >
          <Pressable onPress={() => {}}>
            <SafeAreaView className="bg-t-bg rounded-t-3xl">
              <View className="px-6 pt-6 pb-8">
                {/* Modal header */}
                <View className="flex-row items-center justify-between mb-5">
                  <Text
                    className="text-xl text-t-text"
                    style={{ fontFamily: Fonts.headingExtra }}
                  >
                    Withdraw Funds
                  </Text>
                  <TouchableOpacity
                    onPress={() => setWithdrawVisible(false)}
                    activeOpacity={0.7}
                    className="w-8 h-8 items-center justify-center rounded-full bg-t-surface2"
                  >
                    <X size={18} color={T.text} />
                  </TouchableOpacity>
                </View>

                {/* Balance + destination */}
                <View className="bg-t-surface2 rounded-2xl p-4 mb-5 gap-2">
                  <View className="flex-row justify-between">
                    <Text
                      className="text-t-textSec text-sm"
                      style={{ fontFamily: Fonts.body }}
                    >
                      Available balance
                    </Text>
                    <Text
                      className="text-t-text text-sm"
                      style={{ fontFamily: Fonts.bodyBold }}
                    >
                      R{(wallet?.balance ?? 0).toFixed(2)}
                    </Text>
                  </View>
                  {wallet?.bankAccount && (
                    <View className="flex-row justify-between">
                      <Text
                        className="text-t-textSec text-sm"
                        style={{ fontFamily: Fonts.body }}
                      >
                        Withdraw to
                      </Text>
                      <Text
                        className="text-t-text text-sm"
                        style={{ fontFamily: Fonts.bodyBold }}
                      >
                        {wallet.bankAccount.bankName} ···· {wallet.bankAccount.accountNo?.slice(-4)}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Quick amount chips */}
                <Text
                  className="text-t-text text-sm mb-2"
                  style={{ fontFamily: Fonts.bodyMedium }}
                >
                  Quick amounts
                </Text>
                <View className="flex-row gap-2 mb-4">
                  {QUICK_AMOUNTS.map((amt) => {
                    const active = selectedQuick === amt;
                    return (
                      <TouchableOpacity
                        key={amt}
                        onPress={() => {
                          setSelectedQuick(active ? null : amt);
                          setCustomAmount('');
                        }}
                        activeOpacity={0.75}
                        className={[
                          'flex-1 h-10 items-center justify-center rounded-2xl border-2',
                          active
                            ? 'border-t-gold bg-t-goldBg'
                            : 'border-t-border bg-t-surface2',
                        ].join(' ')}
                      >
                        <Text
                          className={active ? 'text-t-gold' : 'text-t-textSec'}
                          style={{
                            fontFamily: active ? Fonts.bodyBold : Fonts.body,
                            fontSize: 13,
                          }}
                        >
                          R{amt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Custom amount input */}
                <Input
                  label="Or enter custom amount (R)"
                  placeholder="0.00"
                  value={customAmount}
                  onChangeText={(v) => {
                    setCustomAmount(v);
                    setSelectedQuick(null);
                  }}
                  keyboardType="decimal-pad"
                  helperText={`Minimum withdrawal: R${MIN_WITHDRAWAL}`}
                />

                {/* No bank account notice */}
                {!wallet?.bankAccount && (
                  <View className="bg-t-warningBg border border-t-warning rounded-2xl p-4 mb-4">
                    <Text
                      className="text-t-warning text-sm"
                      style={{ fontFamily: Fonts.bodyMedium }}
                    >
                      Set up a bank account first to withdraw funds.
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setWithdrawVisible(false);
                        router.push('/(driver)/bank-account');
                      }}
                      activeOpacity={0.7}
                      className="mt-2"
                    >
                      <Text
                        className="text-t-gold text-sm"
                        style={{ fontFamily: Fonts.bodyBold }}
                      >
                        Add Bank Account →
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Confirm button */}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={withdrawMutation.isPending}
                  disabled={!wallet?.bankAccount || !effectiveAmount || parseFloat(effectiveAmount) <= 0}
                  onPress={handleWithdrawConfirm}
                >
                  Request Withdrawal
                </Button>

                <Text
                  className="text-t-textTer text-xs text-center mt-3"
                  style={{ fontFamily: Fonts.body }}
                >
                  Processed within 2–3 business days
                </Text>
              </View>
            </SafeAreaView>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
