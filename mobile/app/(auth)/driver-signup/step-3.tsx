import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Input, Button } from '@/components/empire';
import { T, Fonts } from '@/constants/colors';

const BANKS = ['FNB', 'Nedbank', 'ABSA', 'Standard Bank', 'Capitec', 'TymeBank'] as const;
const ACCOUNT_TYPES = ['Cheque', 'Savings'] as const;

function StepHeader({ current, total, title }: { current: number; total: number; title: string }) {
  return (
    <View style={{ paddingHorizontal: 24, paddingTop: 56, paddingBottom: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={22} color={T.text} />
        </Pressable>
        <View style={{ flex: 1, flexDirection: 'row', gap: 4 }}>
          {Array.from({ length: total }).map((_, i) => (
            <View
              key={i}
              style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: i < current ? T.gold : T.border }}
            />
          ))}
        </View>
        <Text style={{ fontFamily: Fonts.bodyBold, color: T.textTer, fontSize: 12 }}>
          {current}/{total}
        </Text>
      </View>
      <Text style={{ fontFamily: Fonts.headingExtra, color: T.text, fontSize: 24 }}>{title}</Text>
    </View>
  );
}

export default function DriverStep3() {
  const params = useLocalSearchParams<Record<string, string>>();

  const [bankName, setBankName] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState<string>('Cheque');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!bankName) e.bankName = 'Please select a bank';
    if (!accountHolder.trim()) e.accountHolder = 'Account holder name is required';
    if (!accountNumber.trim()) e.accountNumber = 'Account number is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    router.push({
      pathname: '/(auth)/driver-signup/step-4',
      params: {
        ...params,
        bankName,
        bankHolder: accountHolder.trim(),
        bankAccountNo: accountNumber.trim(),
        accountType,
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: T.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StepHeader current={3} total={4} title="Banking Details" />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 60 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontFamily: Fonts.body, color: T.textSec, fontSize: 14, marginBottom: 20 }}>
          Your earnings will be paid into this account.
        </Text>

        <Text style={{ fontFamily: Fonts.bodyBold, color: T.textTer, fontSize: 12, marginBottom: 10, letterSpacing: 0.5 }}>
          BANK
        </Text>
        {errors.bankName && (
          <Text style={{ fontFamily: Fonts.body, color: T.danger, fontSize: 12, marginBottom: 8 }}>{errors.bankName}</Text>
        )}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {BANKS.map((b) => (
            <Pressable
              key={b}
              onPress={() => setBankName(b)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 18,
                borderWidth: 1.5,
                borderColor: bankName === b ? T.gold : T.border,
                backgroundColor: bankName === b ? T.goldBg : T.surface,
              }}
            >
              <Text
                style={{ fontFamily: Fonts.bodySemibold, color: bankName === b ? T.goldDeep : T.textSec, fontSize: 13 }}
              >
                {b}
              </Text>
            </Pressable>
          ))}
        </View>

        <Input
          label="Account Holder Name"
          value={accountHolder}
          onChangeText={setAccountHolder}
          autoCapitalize="words"
          placeholder="Full name as on bank card"
          error={errors.accountHolder}
        />

        <Input
          label="Account Number"
          value={accountNumber}
          onChangeText={setAccountNumber}
          keyboardType="number-pad"
          placeholder="Enter account number"
          error={errors.accountNumber}
        />

        <Text style={{ fontFamily: Fonts.bodyBold, color: T.textTer, fontSize: 12, marginBottom: 10, marginTop: 4, letterSpacing: 0.5 }}>
          ACCOUNT TYPE
        </Text>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
          {ACCOUNT_TYPES.map((t) => (
            <Pressable
              key={t}
              onPress={() => setAccountType(t)}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: accountType === t ? T.gold : T.border,
                backgroundColor: accountType === t ? T.goldBg : T.surface,
                alignItems: 'center',
              }}
            >
              <Text
                style={{ fontFamily: Fonts.bodyBold, color: accountType === t ? T.goldDeep : T.textSec, fontSize: 14 }}
              >
                {t}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={{ marginTop: 8 }}>
          <Button onPress={handleNext} size="lg">
            Next
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
