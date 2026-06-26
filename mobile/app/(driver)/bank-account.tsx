import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react-native';
import {
  Button,
  Input,
  Select,
  Card,
  CardBody,
  Skeleton,
} from '@/components/empire';
import { driverService } from '@/services/driver.service';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { T, Fonts, Radius } from '@/constants/colors';

const BANK_OPTIONS = [
  { label: 'FNB', value: 'FNB' },
  { label: 'Nedbank', value: 'Nedbank' },
  { label: 'ABSA', value: 'ABSA' },
  { label: 'Standard Bank', value: 'Standard Bank' },
  { label: 'Capitec', value: 'Capitec' },
  { label: 'TymeBank', value: 'TymeBank' },
  { label: 'Discovery Bank', value: 'Discovery Bank' },
  { label: 'African Bank', value: 'African Bank' },
];

const ACCOUNT_TYPES: Array<'Cheque' | 'Savings'> = ['Cheque', 'Savings'];

interface FormState {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  accountType: 'Cheque' | 'Savings';
}

export default function BankAccount() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const showToast = useUIStore((s) => s.showToast);

  const [form, setForm] = useState<FormState>({
    bankName: '',
    accountHolderName: user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : '',
    accountNumber: '',
    accountType: 'Cheque',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [initialised, setInitialised] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['driver', 'profile'],
    queryFn: driverService.getProfile,
  });

  useEffect(() => {
    if (profile && !initialised) {
      setForm({
        bankName: profile.bankName ?? '',
        accountHolderName:
          profile.bankHolderName ??
          (user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : ''),
        accountNumber: profile.bankAccountNo ?? '',
        accountType: (profile.bankAccountType as 'Cheque' | 'Savings') ?? 'Cheque',
      });
      setInitialised(true);
    }
  }, [profile, initialised, user]);

  const saveMutation = useMutation({
    mutationFn: () =>
      driverService.updateProfile({
        bankName: form.bankName.trim(),
        bankHolderName: form.accountHolderName.trim(),
        bankAccountNo: form.accountNumber.trim(),
        bankAccountType: form.accountType,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['driver', 'profile'] });
      void queryClient.invalidateQueries({ queryKey: ['driver', 'wallet'] });
      showToast('Bank account saved successfully.', 'success');
      router.back();
    },
    onError: (err: any) => {
      showToast(err?.message ?? 'Could not save bank account. Please try again.', 'error');
    },
  });

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.bankName) next.bankName = 'Please select a bank.';
    if (!form.accountHolderName.trim()) next.accountHolderName = 'Account holder name is required.';
    if (!form.accountNumber.trim()) next.accountNumber = 'Account number is required.';
    else if (!/^\d+$/.test(form.accountNumber.trim())) next.accountNumber = 'Account number must be numeric.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    saveMutation.mutate();
  }

  return (
    <SafeAreaView className="flex-1 bg-t-dark" style={{ flex: 1, backgroundColor: T.dark }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="flex-row items-center gap-3 px-5 pt-4 pb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="w-9 h-9 items-center justify-center rounded-full bg-white/10"
        >
          <ArrowLeft size={20} color={T.textOnDark} />
        </TouchableOpacity>
        <Text
          className="text-xl text-white"
          style={{ fontFamily: Fonts.headingExtra }}
        >
          Bank Account
        </Text>
      </View>

      {/* Content area */}
      <ScrollView
        className="flex-1 bg-t-surface rounded-t-3xl"
        style={{ flex: 1, backgroundColor: T.surface, borderTopLeftRadius: Radius.lg, borderTopRightRadius: Radius.lg }}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {isLoading ? (
          <View className="gap-4 mt-2">
            <Skeleton height={56} rounded="lg" width="100%" />
            <Skeleton height={56} rounded="lg" width="100%" />
            <Skeleton height={56} rounded="lg" width="100%" />
            <View className="flex-row gap-3">
              <Skeleton height={48} rounded="lg" width="48%" />
              <Skeleton height={48} rounded="lg" width="48%" />
            </View>
            <Skeleton height={48} rounded="lg" width="100%" />
          </View>
        ) : (
          <>
            {/* Info card */}
            <Card className="mb-5 bg-t-goldBg border-t-gold">
              <CardBody>
                <Text
                  className="text-t-warning text-sm"
                  style={{ fontFamily: 'Inter_500Medium' }}
                >
                  Your bank details are used for payouts. Make sure they are accurate.
                </Text>
              </CardBody>
            </Card>

            {/* Bank Name */}
            <Select
              label="Bank Name"
              placeholder="Select your bank"
              options={BANK_OPTIONS}
              value={form.bankName}
              onChange={(v) => {
                setForm((f) => ({ ...f, bankName: v }));
                setErrors((e) => ({ ...e, bankName: undefined }));
              }}
              error={errors.bankName}
            />

            {/* Account Holder Name */}
            <Input
              label="Account Holder Name"
              placeholder="Full name as on account"
              value={form.accountHolderName}
              onChangeText={(v) => {
                setForm((f) => ({ ...f, accountHolderName: v }));
                setErrors((e) => ({ ...e, accountHolderName: undefined }));
              }}
              error={errors.accountHolderName}
              autoCapitalize="words"
            />

            {/* Account Number */}
            <Input
              label="Account Number"
              placeholder="Enter account number"
              value={form.accountNumber}
              onChangeText={(v) => {
                const numeric = v.replace(/\D/g, '');
                setForm((f) => ({ ...f, accountNumber: numeric }));
                setErrors((e) => ({ ...e, accountNumber: undefined }));
              }}
              keyboardType="number-pad"
              error={errors.accountNumber}
            />

            {/* Account Type pills */}
            <View className="mb-5">
              <Text
                className="text-t-text text-sm mb-2"
                style={{ fontFamily: 'Inter_500Medium' }}
              >
                Account Type
              </Text>
              <View className="flex-row gap-3">
                {ACCOUNT_TYPES.map((type) => {
                  const selected = form.accountType === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      onPress={() => setForm((f) => ({ ...f, accountType: type }))}
                      activeOpacity={0.75}
                      className={[
                        'flex-1 h-12 items-center justify-center rounded-2xl border-2',
                        selected
                          ? 'border-t-gold bg-t-goldBg'
                          : 'border-t-border bg-t-surface2',
                      ].join(' ')}
                    >
                      <Text
                        className={[
                          'text-sm',
                          selected ? 'text-t-gold' : 'text-t-textSec',
                        ].join(' ')}
                        style={{
                          fontFamily: selected ? 'Inter_700Bold' : 'Inter_500Medium',
                        }}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Save button */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={saveMutation.isPending}
              onPress={handleSave}
            >
              Save Bank Account
            </Button>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
