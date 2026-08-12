import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MapPin, CreditCard, Wallet, Banknote, ChevronRight, Award, AlertCircle } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button } from '@/components/empire';
import { useCartStore } from '@/stores/cartStore';
import { useLocationStore } from '@/stores/locationStore';
import { useOrderStore } from '@/stores/orderStore';
import { useUIStore } from '@/stores/uiStore';
import { orderService } from '@/services/order.service';
import { useOrderQuote } from '@/hooks/useOrderQuote';
import { OrderQuoteSummary } from '@/components/order/OrderQuoteSummary';
import { CheckoutErrorBanner } from '@/components/order/CheckoutErrorBanner';
import { paymentService } from '@/services/payment.service';
import { userService } from '@/services/user.service';
import { T, Colors } from '@/constants/colors';
import { getUserErrorMessage } from '@/utils/errorHandler';
import { formatPrice } from '@/utils/formatters';
import { getDeliveryCoordinates } from '@/utils/locationHelpers';
import { hasValidCoordinates } from '@/utils/distance';

const PAYMENT_METHODS = [
  { id: 'payfast', label: 'PayFast', Icon: CreditCard, subtitle: 'Credit/Debit card & EFT' },
  { id: 'wallet', label: 'Empire Wallet', Icon: Wallet, subtitle: 'Pay with balance' },
  { id: 'cash', label: 'Cash on Delivery', Icon: Banknote, subtitle: 'Pay when delivered' },
];

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const footerPad = insets.bottom + 20;
  const [selectedPayment, setSelectedPayment] = useState('payfast');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [checkoutError, setCheckoutError] = useState('');

  const { items, restaurantId, restaurantLatitude, restaurantLongitude, discount, coupon, loyaltyPointsToRedeem, setLoyaltyPoints, clearCart } = useCartStore();
  const { selectedAddress, currentLocation } = useLocationStore();
  const { setActiveOrder } = useOrderStore();
  const { showToast } = useUIStore();

  const deliveryCoordinates = getDeliveryCoordinates(selectedAddress, currentLocation);
  const restaurantCoordinates =
    restaurantLatitude != null &&
    restaurantLongitude != null &&
    hasValidCoordinates({ latitude: restaurantLatitude, longitude: restaurantLongitude })
      ? { latitude: restaurantLatitude, longitude: restaurantLongitude }
      : null;

  const { displayQuote, displayTotal, isEstimate, isLoading: quoteLoading, isError: quoteError, refetch: refetchQuote } = useOrderQuote({
    restaurantId,
    items,
    deliveryAddressId: selectedAddress?.id,
    deliveryCoordinates,
    restaurantCoordinates,
    couponCode: coupon?.valid ? coupon.code : undefined,
    loyaltyPointsToRedeem,
    cartDiscount: discount,
  });

  const grandTotal = displayTotal;

  const { data: loyalty } = useQuery({
    queryKey: ['user', 'loyalty'],
    queryFn: () => userService.getLoyalty(),
    staleTime: 30000,
  });

  const loyaltyBalance = loyalty?.balance ?? 0;
  const QUICK_OPTIONS = [100, 200, loyaltyBalance >= 100 ? Math.floor(loyaltyBalance / 100) * 100 : 0]
    .filter((v, i, arr) => v > 0 && arr.indexOf(v) === i && v <= loyaltyBalance)
    .slice(0, 3);

  const placeOrder = useMutation({
    mutationFn: async () => {
      setCheckoutError('');
      if (!selectedAddress) {
        throw new Error('Please add a delivery address before placing your order.');
      }
      if (!restaurantId || items.length === 0) {
        throw new Error('Your cart is empty. Add items before checking out.');
      }

      const order = await orderService.create({
        restaurantId: restaurantId!,
        items: items.map((i) => ({
          menuItemId: i.menuItem.id,
          quantity: i.quantity,
          addonIds: i.selectedAddons.map((a) => a.id),
          instructions: i.instructions,
        })),
        deliveryAddressId: selectedAddress.id,
        deliveryLatitude: deliveryCoordinates?.latitude,
        deliveryLongitude: deliveryCoordinates?.longitude,
        restaurantLatitude: restaurantCoordinates?.latitude,
        restaurantLongitude: restaurantCoordinates?.longitude,
        paymentMethod: selectedPayment,
        couponCode: coupon?.code,
        deliveryNotes: deliveryNotes || undefined,
        loyaltyPointsToRedeem: loyaltyPointsToRedeem > 0 ? loyaltyPointsToRedeem : undefined,
      });

      if (selectedPayment === 'payfast') {
        const result = await paymentService.initiatePayFast(order.id);
        if (result === 'cancelled' || result === 'dismissed') {
          throw new Error('Payment was cancelled. Your order was saved — you can pay from your orders list.');
        }
      } else if (selectedPayment === 'wallet') {
        await paymentService.payWithWallet(order.id);
      }

      return order;
    },
    onSuccess: (order) => {
      setCheckoutError('');
      setActiveOrder(order.id);
      clearCart();
      router.replace('/(modals)/payment-success');
    },
    onError: (error) => {
      const message = getUserErrorMessage(error);
      setCheckoutError(message);
      showToast(message, 'error');
    },
  });

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      const message = 'Please add a delivery address before placing your order.';
      setCheckoutError(message);
      showToast(message, 'error');
      return;
    }
    placeOrder.mutate();
  };

  return (
    <ScreenWrapper bg="white" edges={['bottom']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, backgroundColor: T.bg, borderBottomWidth: 1, borderBottomColor: T.border }}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Text style={{ fontSize: 22, color: T.text }}>←</Text>
        </Pressable>
        <Text style={{ fontSize: 20, fontWeight: '900', color: T.text }}>Checkout</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 16, gap: 12 }}
        showsVerticalScrollIndicator={false}
      >
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

        {/* Empire Points */}
        {loyaltyBalance >= 100 && (
          <View style={{ backgroundColor: T.bg, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: loyaltyPointsToRedeem > 0 ? Colors.gold[500] : T.border }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Award size={18} color={Colors.gold[500]} />
                <Text style={{ fontWeight: '800', fontSize: 15, color: T.text }}>Empire Points</Text>
              </View>
              <Text style={{ fontSize: 13, color: T.textSec }}>{loyaltyBalance.toLocaleString()} pts available</Text>
            </View>
            <Text style={{ fontSize: 12, color: T.textSec, marginBottom: 10 }}>100 pts = R10 off — tap to apply</Text>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              {QUICK_OPTIONS.map((pts) => {
                const isSelected = loyaltyPointsToRedeem === pts;
                const label = pts === Math.floor(loyaltyBalance / 100) * 100 && pts > 200 ? `All (${pts} pts)` : `${pts} pts`;
                return (
                  <Pressable
                    key={pts}
                    onPress={() => setLoyaltyPoints(isSelected ? 0 : pts)}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 14,
                      borderRadius: 20,
                      borderWidth: 1.5,
                      borderColor: isSelected ? Colors.gold[500] : T.border,
                      backgroundColor: isSelected ? Colors.gold[500] + '18' : T.surface,
                    }}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '700', color: isSelected ? Colors.gold[500] : T.textSec }}>
                      {label} (−{formatPrice((pts / 100) * 10)})
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Order Summary */}
        <View style={{ backgroundColor: T.bg, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: T.border }}>
          <Text style={{ fontWeight: '800', fontSize: 15, color: T.text, marginBottom: 12 }}>Summary</Text>
          {quoteError && (
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 10, padding: 10, backgroundColor: T.surface, borderRadius: 8 }}>
              <AlertCircle size={16} color={T.textSec} style={{ marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: T.textSec, lineHeight: 18 }}>
                  Could not refresh fees from the server. Showing estimated fees below.
                </Text>
                <Pressable onPress={() => refetchQuote()} style={{ marginTop: 6 }}>
                  <Text style={{ color: T.action, fontWeight: '700', fontSize: 13 }}>Retry</Text>
                </Pressable>
              </View>
            </View>
          )}
          <OrderQuoteSummary
            quote={displayQuote}
            itemCount={items.reduce((n, i) => n + i.quantity, 0)}
            showEta
            isEstimate={isEstimate}
          />
        </View>
      </ScrollView>

      <View
        style={{
          backgroundColor: T.bg,
          paddingTop: 16,
          paddingHorizontal: 20,
          paddingBottom: footerPad,
          borderTopWidth: 1,
          borderTopColor: T.border,
        }}
      >
        <CheckoutErrorBanner message={checkoutError} onDismiss={() => setCheckoutError('')} />
        {!selectedAddress && !checkoutError && (
          <Text style={{ color: T.textSec, fontSize: 13, marginBottom: 10, textAlign: 'center' }}>
            Add a delivery address to place your order
          </Text>
        )}
        <Button
          size="lg"
          fullWidth
          style={{ width: '100%', minHeight: 52 }}
          onPress={handlePlaceOrder}
          loading={placeOrder.isPending || quoteLoading}
          disabled={!selectedAddress || items.length === 0}
        >
          {`Place Order — ${formatPrice(grandTotal)}`}
        </Button>
      </View>
    </ScreenWrapper>
  );
}
