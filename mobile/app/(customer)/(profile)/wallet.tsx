import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert, Modal, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Wallet, Plus, TrendingUp, TrendingDown } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { paymentService } from '@/services/payment.service';
import { T } from '@/constants/colors';

const TOP_UP_AMOUNTS = [50, 100, 200, 500];

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();
  const timeStr = d.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
  if (isToday) return `Today ${timeStr}`;
  if (isYesterday) return `Yesterday ${timeStr}`;
  return d.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' });
}

export default function CustomerWalletScreen() {
  const queryClient = useQueryClient();
  const [topUpVisible, setTopUpVisible] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const { data: balance, isLoading: balanceLoading } = useQuery({
    queryKey: ['wallet', 'balance'],
    queryFn: paymentService.getWalletBalance,
  });

  const { data: transactions, isLoading: txLoading } = useQuery({
    queryKey: ['wallet', 'transactions'],
    queryFn: paymentService.getWalletTransactions,
  });

  const topupMutation = useMutation({
    mutationFn: (amount: number) => paymentService.topupWallet(amount),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['wallet'] });
      setTopUpVisible(false);
      setSelectedAmount(null);
      setCustomAmount('');
    },
    onError: () => Alert.alert('Top-up Failed', 'Could not initiate top-up. Please try again.'),
  });

  const handleTopUp = () => {
    const amount = selectedAmount ?? parseFloat(customAmount);
    if (!amount || amount < 10) {
      Alert.alert('Invalid Amount', 'Minimum top-up is R10.');
      return;
    }
    topupMutation.mutate(amount);
  };

  return (
    <ScreenWrapper bg="white">
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, backgroundColor: T.bg, borderBottomWidth: 1, borderBottomColor: T.border }}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 12 }}>
          <ArrowLeft size={22} color={T.text} />
        </Pressable>
        <Text style={{ fontSize: 20, fontWeight: '900', color: T.text }}>Empire Wallet</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        {/* Balance card */}
        <View style={{ backgroundColor: '#1C1C1C', borderRadius: 20, padding: 24, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Wallet size={20} color="#C9A227" />
            <Text style={{ color: '#C9A227', fontWeight: '700', fontSize: 13, letterSpacing: 1 }}>AVAILABLE BALANCE</Text>
          </View>
          {balanceLoading ? (
            <ActivityIndicator color="#C9A227" style={{ marginVertical: 8 }} />
          ) : (
            <Text style={{ color: '#fff', fontSize: 40, fontWeight: '900' }}>R{(balance ?? 0).toFixed(2)}</Text>
          )}
          <Pressable
            onPress={() => setTopUpVisible(true)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16, backgroundColor: '#C9A227', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 14, alignSelf: 'flex-start' }}
          >
            <Plus size={16} color="#1C1C1C" />
            <Text style={{ color: '#1C1C1C', fontWeight: '800', fontSize: 14 }}>Top Up Wallet</Text>
          </Pressable>
        </View>

        {/* How to use */}
        <View style={{ backgroundColor: T.surface, borderRadius: 16, padding: 16, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Wallet size={22} color={T.action} />
          <Text style={{ flex: 1, color: T.textSec, fontSize: 13, lineHeight: 18 }}>
            Use your wallet balance at checkout — faster than card, no payment gateway required.
          </Text>
        </View>

        {/* Transaction history */}
        <Text style={{ fontWeight: '800', fontSize: 16, color: T.text, marginBottom: 12 }}>Transaction History</Text>
        <View style={{ backgroundColor: T.bg, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: T.border }}>
          {txLoading && <ActivityIndicator color={T.action} style={{ margin: 20 }} />}
          {!txLoading && (transactions ?? []).map((t, i) => {
            const isCredit = t.type === 'topup' || t.type === 'refund';
            return (
              <View
                key={t.id}
                style={{ flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: i < (transactions?.length ?? 0) - 1 ? 1 : 0, borderBottomColor: T.border, gap: 12 }}
              >
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: isCredit ? '#E8F5E9' : '#FFEBEE', alignItems: 'center', justifyContent: 'center' }}>
                  {isCredit
                    ? <TrendingUp size={16} color="#2E7D32" />
                    : <TrendingDown size={16} color="#C62828" />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600', fontSize: 14, color: T.text }}>{t.description ?? t.type}</Text>
                  <Text style={{ color: T.textSec, fontSize: 12, marginTop: 2 }}>{formatTime(t.createdAt)}</Text>
                </View>
                <Text style={{ fontWeight: '800', fontSize: 14, color: isCredit ? '#2E7D32' : '#C62828' }}>
                  {isCredit ? '+' : '−'}R{Math.abs(t.amount).toFixed(2)}
                </Text>
              </View>
            );
          })}
          {!txLoading && (!transactions || transactions.length === 0) && (
            <Text style={{ color: T.textTer, textAlign: 'center', fontSize: 13, padding: 24 }}>No transactions yet</Text>
          )}
        </View>
      </ScrollView>

      {/* Top-up modal */}
      <Modal visible={topUpVisible} animationType="slide" transparent presentationStyle="overFullScreen">
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 }}>
            <Text style={{ fontWeight: '900', fontSize: 20, color: T.text, marginBottom: 4 }}>Top Up Wallet</Text>
            <Text style={{ color: T.textSec, fontSize: 14, marginBottom: 20 }}>Choose an amount or enter a custom value</Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
              {TOP_UP_AMOUNTS.map((a) => (
                <Pressable
                  key={a}
                  onPress={() => { setSelectedAmount(a); setCustomAmount(''); }}
                  style={{ paddingVertical: 12, paddingHorizontal: 20, borderRadius: 14, borderWidth: 2, borderColor: selectedAmount === a ? T.action : T.border, backgroundColor: selectedAmount === a ? T.action + '15' : T.surface }}
                >
                  <Text style={{ fontWeight: '800', fontSize: 15, color: selectedAmount === a ? T.action : T.text }}>R{a}</Text>
                </Pressable>
              ))}
            </View>

            <TextInput
              value={customAmount}
              onChangeText={(v) => { setCustomAmount(v); setSelectedAmount(null); }}
              placeholder="Custom amount (e.g. 150)"
              placeholderTextColor={T.textTer}
              keyboardType="numeric"
              style={{ backgroundColor: T.surface, borderRadius: 12, padding: 14, fontSize: 15, color: T.text, borderWidth: 1, borderColor: customAmount ? T.action : T.border, marginBottom: 20 }}
            />

            <Pressable
              onPress={handleTopUp}
              disabled={topupMutation.isPending}
              style={{ backgroundColor: T.action, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 10 }}
            >
              {topupMutation.isPending
                ? <ActivityIndicator color="#fff" />
                : <Text style={{ color: '#fff', fontWeight: '900', fontSize: 16 }}>
                    Top Up {selectedAmount ? `R${selectedAmount}` : customAmount ? `R${customAmount}` : ''}
                  </Text>}
            </Pressable>
            <Pressable onPress={() => { setTopUpVisible(false); setSelectedAmount(null); setCustomAmount(''); }}>
              <Text style={{ textAlign: 'center', color: T.textSec, fontSize: 14, paddingVertical: 8 }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}
