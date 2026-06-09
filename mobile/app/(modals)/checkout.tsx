import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/stores/cartStore';
import { useLocationStore } from '@/stores/locationStore';
import { useOrderStore } from '@/stores/orderStore';
import { useUIStore } from '@/stores/uiStore';
import { orderService } from '@/services/order.service';
import { paymentService } from '@/services/payment.service';
import { queryKeys } from '@/constants/queryKeys';
import { Colors } from '@/constants/colors';
import { formatPrice } from '@/utils/formatters';

const PAYMENT_METHODS = [
  { id: 'payfast', label: 'PayFast', emoji: '💳', subtitle: 'Credit/Debit card' },
  { id: 'ozow', label: 'Ozow', emoji: '🏦', subtitle: 'Instant EFT' },
  { id: 'peach', label: 'Peach Payments', emoji: '🍑', subtitle: 'Multiple options' },
  { id: 'wallet', label: 'Empire Wallet', emoji: '👛', subtitle: 'Pay with balance' },
  { id: 'cash', label: 'Cash on Delivery', emoji: '💵', subtitle: 'Pay when delivered' },
];

export default function CheckoutScreen() {
  const [selectedPayment, setSelectedPayment] = useState('payfast');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  const { items, restaurantId, subtotal, total, discount, coupon, clearCart } = useCartStore();
  const { selectedAddress } = useLocationStore();
  const { setActiveOrder } = useOrderStore();
  const { showToast } = useUIStore();

  const deliveryFee = subtotal > 0 ? 35 : 0;
  const serviceFee = Math.round(subtotal * 0.05 * 100) / 100;
  const grandTotal = total + deliveryFee + serviceFee;

  const placeOrder = useMutation({
    mutationFn: async () => {
      if (!selectedAddress) throw new Error('Please select a delivery address');
      const order = await orderService.create({
        restaurantId: restaurantId!,
        items: items.map((i) => ({
          menuItemId: i.menuItem.id,
          quantity: i.quantity,
          addonIds: i.selectedAddons.map((a) => a.id),
          instructions: i.instructions,
        })),
        deliveryAddressId: selectedAddress.id,
        paymentMethod: selectedPayment,
        couponCode: coupon?.code,
        deliveryNotes: deliveryNotes || undefined,
      });
      return order;
    },
    onSuccess: async (order) => {
      setActiveOrder(order.id);
      if (selectedPayment === 'payfast') await paymentService.initiatePayFast(order.id);
      else if (selectedPayment === 'ozow') await paymentService.initiateOzow(order.id);
      else if (selectedPayment === 'peach') await paymentService.initiatePeach(order.id);
      else if (selectedPayment === 'wallet') await paymentService.payWithWallet(order.id);
      clearCart();
      router.replace('/(modals)/payment-success');
    },
    onError: (error: Error) => showToast(error.message, 'error'),
  });

  return (
    <ScreenWrapper bg="surface" edges={['bottom']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Text style={{ fontSize: 22 }}>←</Text>
        </Pressable>
        <Text style={{ fontSize: 20, fontWeight: '900' }}>Checkout</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        {/* Delivery Address */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontWeight: '800', fontSize: 15 }}>Delivery Address</Text>
            <Pressable onPress={() => router.push('/(auth)/location-setup')}>
              <Text style={{ color: Colors.gold[600], fontWeight: '600', fontSize: 14 }}>Change</Text>
            </Pressable>
          </View>
          {selectedAddress ? (
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
              <Text style={{ fontSize: 20 }}>📍</Text>
              <Text style={{ flex: 1, color: '#444', fontSize: 14, lineHeight: 20 }}>{selectedAddress.formattedAddress}</Text>
            </View>
          ) : (
            <Pressable onPress={() => router.push('/(auth)/location-setup')} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F8F8F8', borderRadius: 12, padding: 12 }}>
              <Text style={{ fontSize: 18 }}>📍</Text>
              <Text style={{ color: '#888', flex: 1 }}>Set delivery address</Text>
              <Text style={{ color: Colors.gold[500] }}>→</Text>
            </Pressable>
          )}
        </View>

        {/* Delivery Notes */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <Text style={{ fontWeight: '800', fontSize: 15, marginBottom: 10 }}>Delivery Notes</Text>
          <TextInput
            value={deliveryNotes}
            onChangeText={setDeliveryNotes}
            placeholder="Gate code, leave at door, ring bell..."
            multiline
            numberOfLines={3}
            style={{ backgroundColor: '#F8F8F8', borderRadius: 12, padding: 12, fontSize: 14, color: '#0A0A0A', textAlignVertical: 'top', minHeight: 72 }}
          />
        </View>

        {/* Payment Method */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <Text style={{ fontWeight: '800', fontSize: 15, marginBottom: 12 }}>Payment Method</Text>
          {PAYMENT_METHODS.map((method) => (
            <Pressable
              key={method.id}
              onPress={() => setSelectedPayment(method.id)}
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', gap: 12 }}
            >
              <Text style={{ fontSize: 24 }}>{method.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '700', fontSize: 15, color: Colors.empire.black }}>{method.label}</Text>
                <Text style={{ fontSize: 12, color: '#888' }}>{method.subtitle}</Text>
              </View>
              <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: selectedPayment === method.id ? Colors.empire.black : '#D0D0D0', alignItems: 'center', justifyContent: 'center' }}>
                {selectedPayment === method.id && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.empire.black }} />}
              </View>
            </Pressable>
          ))}
        </View>

        {/* Order Summary */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 16, padding: 16 }}>
          <Text style={{ fontWeight: '800', fontSize: 15, marginBottom: 12 }}>Summary</Text>
          {[
            { label: `Subtotal (${items.reduce((n, i) => n + i.quantity, 0)} items)`, value: subtotal },
            { label: 'Delivery fee', value: deliveryFee },
            { label: 'Service fee', value: serviceFee },
          ].map(({ label, value }) => (
            <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ color: '#666' }}>{label}</Text>
              <Text style={{ fontWeight: '600' }}>{formatPrice(value)}</Text>
            </View>
          ))}
          {discount > 0 && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ color: Colors.empire.success }}>Discount ({coupon?.code})</Text>
              <Text style={{ color: Colors.empire.success, fontWeight: '600' }}>−{formatPrice(discount)}</Text>
            </View>
          )}
          <View style={{ height: 1, backgroundColor: '#F0F0F0', marginVertical: 10 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontWeight: '900', fontSize: 18 }}>Total</Text>
            <Text style={{ fontWeight: '900', fontSize: 18, color: Colors.empire.black }}>{formatPrice(grandTotal)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', padding: 20, borderTopWidth: 1, borderTopColor: '#F0F0F0' }}>
        <Button variant="gold" size="lg" onPress={() => placeOrder.mutate()} loading={placeOrder.isPending} disabled={!selectedAddress}>
          Place Order — {formatPrice(grandTotal)}
        </Button>
      </View>
    </ScreenWrapper>
  );
}
