import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Header } from '@/components/layout/Header';
import { EmptyState } from '@/components/ui/EmptyState';
import { paymentService } from '@/services/payment.service';
import { queryKeys } from '@/constants/queryKeys';
import { Colors } from '@/constants/colors';

const BRAND_EMOJI: Record<string, string> = { visa: '💳', mastercard: '💳', amex: '💳' };

export default function PaymentMethodsScreen() {
  const { data: methods, isLoading } = useQuery({
    queryKey: queryKeys.user.paymentMethods,
    queryFn: paymentService.getSavedMethods,
  });

  return (
    <ScreenWrapper bg="surface">
      <Header title="Payment Methods" />
      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Colors.gold[500]} />
        </View>
      ) : !methods || methods.length === 0 ? (
        <EmptyState title="No saved payment methods" subtitle="Your saved cards will appear here after checkout" />
      ) : (
        <View style={{ padding: 20 }}>
          {methods.map((m: import('@/types/payment.types').PaymentMethod) => (
            <View key={m.id} style={{ backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Text style={{ fontSize: 28 }}>{BRAND_EMOJI[m.brand ?? ''] ?? '💳'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '700', fontSize: 15, textTransform: 'capitalize' }}>{m.brand} •••• {m.last4}</Text>
                <Text style={{ color: '#888', fontSize: 13 }}>Expires {m.expiryMonth}/{m.expiryYear}</Text>
              </View>
              {m.isDefault && (
                <View style={{ backgroundColor: Colors.gold[50], borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                  <Text style={{ color: Colors.gold[700], fontSize: 11, fontWeight: '700' }}>Default</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </ScreenWrapper>
  );
}
