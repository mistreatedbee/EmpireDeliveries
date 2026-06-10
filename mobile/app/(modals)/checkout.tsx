import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { MapPin, CreditCard, Building2, Layers, Wallet, Banknote, ChevronRight } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/stores/cartStore';
import { useLocationStore } from '@/stores/locationStore';
import { useOrderStore } from '@/stores/orderStore';
import { useUIStore } from '@/stores/uiStore';
import { orderService } from '@/services/order.service';
import { paymentService } from '@/services/payment.service';
import { T } from '@/constants/colors';
import { formatPrice } from '@/utils/formatters';

const PAYMENT_METHODS = [
  { id: 'payfast', label: 'PayFast', Icon: CreditCard, subtitle: 'Credit/Debit card' },
  { id: 'ozow', label: 'Ozow', Icon: Building2, subtitle: 'Instant EFT' },
  { id: 'peach', label: 'Peach Payments', Icon: Layers, subtitle: 'Multiple options' },
  { id: 'wallet', label: 'Empire Wallet', Icon: Wallet, subtitle: 'Pay with balance' },
  { id: 'cash', label: 'Cash on Delivery', Icon: Banknote, subtitle: 'Pay when delivered' },
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
    <ScreenWrapper bg="white" edges={['bottom']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, backgroundColor: T.bg, borderBottomWidth: 1, borderBottomColor: T.border }}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Text style={{ fontSize: 22, color: T.text }}>←</Text>
        </Pressable>
        <Text style={{ fontSize: 20, fontWeight: '900', color: T.text }}>Checkout</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120, gap: 12 }}>
        {/* Delivery Address */}
        <View style={{ backgroundColor: T.bg, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: T.border }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontWeight: '800', fontSize: 15, color: T.text }}>Delivery Address</Text>
            <Pressable onPress={() => router.push('/(auth)/location-setup')} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ color: T.action, fontWeight: '600', fontSize: 14 }}>Change</Text>
              <ChevronRight size={14} color={T.action} />
            </Pressable>
          </View>
          {selectedAddress ? (
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
              <MapPin size={16} color={T.textSec} style={{ marginTop: 2 }} />
              <Text style={{ flex: 1, color: T.textSec, fontSize: 14, lineHeight: 20 }}>{selectedAddress.formattedAddress}</Text>
            </View>
          ) : (
            <Pressable
              onPress={() => router.push('/(auth)/location-setup')}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: T.surface, borderRadius: 10, padding: 12 }}
            >
              <MapPin size={16} color={T.textTer} />
              <Text style={{ color: T.textSec, flex: 1, fontSize: 14 }}>Set delivery address</Text>
              <ChevronRight size={14} color={T.textTer} />
            </Pressable>
          )}
        </View>

        {/* Delivery Notes */}
        <View style={{ backgroundColor: T.bg, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: T.border }}>
          <Text style={{ fontWeight: '800', fontSize: 15, color: T.text, marginBottom: 10 }}>Delivery Notes</Text>
          <TextInput
            value={deliveryNotes}
            onChangeText={setDeliveryNotes}
            placeholder="Gate code, leave at door, ring bell..."
            placeholderTextColor={T.textTer}
            multiline
            numberOfLines={3}
            style={{ backgroundColor: T.surface, borderRadius: 10, padding: 12, fontSize: 14, color: T.text, textAlignVertical: 'top', minHeight: 72 }}
          />
        </View>

        {/* Payment Method */}
        <View style={{ backgroundColor: T.bg, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: T.border }}>
          <Text style={{ fontWeight: '800', fontSize: 15, color: T.text, marginBottom: 12 }}>Payment Method</Text>
          {PAYMENT_METHODS.map((method, idx) => {
            const IconComp = method.Icon;
            const isLast = idx === PAYMENT_METHODS.length - 1;
            return (
              <Pressable
                key={method.id}
                onPress={() => setSelectedPayment(method.id)}
                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: isLast ? 0 : 1, borderBottomColor: T.border, gap: 12 }}
              >
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: T.surface, alignItems: 'center', justifyContent: 'center' }}>
                  <IconComp size={18} color={T.textSec} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', fontSize: 15, color: T.text }}>{method.label}</Text>
                  <Text style={{ fontSize: 12, color: T.textSec }}>{method.subtitle}</Text>
                </View>
                <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: selectedPayment === method.id ? T.action : T.border, alignItems: 'center', justifyContent: 'center' }}>
                  {selectedPayment === method.id && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: T.action }} />}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Order Summary */}
        <View style={{ backgroundColor: T.bg, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: T.border }}>
          <Text style={{ fontWeight: '800', fontSize: 15, color: T.text, marginBottom: 12 }}>Summary</Text>
          {[
            { label: `Subtotal (${items.reduce((n, i) => n + i.quantity, 0)} items)`, value: subtotal },
            { label: 'Delivery fee', value: deliveryFee },
            { label: 'Service fee', value: serviceFee },
          ].map(({ label, value }) => (
            <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ color: T.textSec }}>{label}</Text>
              <Text style={{ fontWeight: '600', color: T.text }}>{formatPrice(value)}</Text>
            </View>
          ))}
          {discount > 0 && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ color: T.success }}>Discount ({coupon?.code})</Text>
              <Text style={{ color: T.success, fontWeight: '600' }}>−{formatPrice(discount)}</Text>
            </View>
          )}
          <View style={{ height: 1, backgroundColor: T.border, marginVertical: 10 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontWeight: '900', fontSize: 18, color: T.text }}>Total</Text>
            <Text style={{ fontWeight: '900', fontSize: 18, color: T.text }}>{formatPrice(grandTotal)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: T.bg, padding: 20, borderTopWidth: 1, borderTopColor: T.border }}>
        <Button size="lg" onPress={() => placeOrder.mutate()} loading={placeOrder.isPending} disabled={!selectedAddress}>
          Place Order — {formatPrice(grandTotal)}
        </Button>
      </View>
    </ScreenWrapper>
  );
}
