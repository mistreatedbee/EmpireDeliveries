import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, Image, TextInput, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useCartStore } from '@/stores/cartStore';
import { useUIStore } from '@/stores/uiStore';
import { orderService } from '@/services/order.service';
import { CartItem } from '@/types/order.types';
import { Colors } from '@/constants/colors';
import { formatPrice } from '@/utils/formatters';

function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCartStore();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', gap: 12 }}>
      <Image source={{ uri: item.menuItem.image }} style={{ width: 70, height: 70, borderRadius: 12, backgroundColor: '#F0F0F0' }} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: '700', fontSize: 15, color: Colors.empire.black, marginBottom: 2 }} numberOfLines={1}>{item.menuItem.name}</Text>
        {item.selectedAddons.length > 0 && (
          <Text style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{item.selectedAddons.map((a) => a.name).join(', ')}</Text>
        )}
        <Text style={{ fontWeight: '800', fontSize: 15, color: Colors.empire.black }}>{formatPrice(item.totalPrice)}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Pressable
          onPress={() => updateQuantity(item.id, item.quantity - 1)}
          style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontWeight: '700', fontSize: 16 }}>−</Text>
        </Pressable>
        <Text style={{ fontWeight: '800', fontSize: 16, minWidth: 20, textAlign: 'center' }}>{item.quantity}</Text>
        <Pressable
          onPress={() => updateQuantity(item.id, item.quantity + 1)}
          style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.empire.black, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: Colors.gold[500], fontWeight: '700', fontSize: 16 }}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function CartScreen() {
  const { items, restaurantName, subtotal, discount, total, coupon, applyCoupon, clearCoupon, itemCount } = useCartStore();
  const { showToast } = useUIStore();
  const [couponCode, setCouponCode] = useState('');

  const deliveryFee = subtotal > 0 ? 35 : 0;
  const serviceFee = subtotal > 0 ? Math.round(subtotal * 0.05 * 100) / 100 : 0;
  const grandTotal = total + deliveryFee + serviceFee;

  const validateCoupon = useMutation({
    mutationFn: () => orderService.validateCoupon(couponCode.trim().toUpperCase()),
    onSuccess: (data) => {
      if (data.valid) {
        applyCoupon(data);
        showToast(`Coupon applied! You save ${formatPrice(discount)}`, 'success');
      } else {
        showToast(data.message ?? 'Invalid coupon code', 'error');
      }
    },
    onError: () => showToast('Could not validate coupon. Please try again.', 'error'),
  });

  if (items.length === 0) {
    return (
      <ScreenWrapper bg="surface">
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
          <Pressable onPress={() => router.back()} style={{ marginRight: 12 }}>
            <Text style={{ fontSize: 22 }}>✕</Text>
          </Pressable>
          <Text style={{ fontSize: 20, fontWeight: '900' }}>Your Cart</Text>
        </View>
        <EmptyState title="Your cart is empty" subtitle="Add items from a restaurant to get started" actionLabel="Browse Restaurants" onAction={() => router.replace('/(customer)')} />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper bg="surface" edges={['bottom']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Text style={{ fontSize: 22 }}>✕</Text>
        </Pressable>
        <View>
          <Text style={{ fontSize: 20, fontWeight: '900' }}>Your Cart</Text>
          <Text style={{ fontSize: 13, color: '#888' }}>{restaurantName} • {itemCount} items</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ backgroundColor: '#FFF', paddingHorizontal: 20 }}>
          <FlatList
            data={items}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => <CartItemRow item={item} />}
            scrollEnabled={false}
          />
        </View>

        {/* Coupon */}
        <View style={{ margin: 20, backgroundColor: '#FFF', borderRadius: 16, padding: 16 }}>
          <Text style={{ fontWeight: '800', fontSize: 15, marginBottom: 12 }}>Promo Code</Text>
          {coupon?.valid ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 18 }}>🎉</Text>
                <View>
                  <Text style={{ fontWeight: '700', color: Colors.empire.success }}>{coupon.code}</Text>
                  <Text style={{ fontSize: 12, color: '#888' }}>Discount applied</Text>
                </View>
              </View>
              <Pressable onPress={clearCoupon}>
                <Text style={{ color: Colors.empire.error, fontWeight: '600' }}>Remove</Text>
              </Pressable>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TextInput
                value={couponCode}
                onChangeText={setCouponCode}
                placeholder="Enter promo code"
                autoCapitalize="characters"
                style={{ flex: 1, backgroundColor: '#F8F8F8', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14 }}
              />
              <Pressable
                onPress={() => validateCoupon.mutate()}
                disabled={!couponCode.trim() || validateCoupon.isPending}
                style={{ backgroundColor: Colors.empire.black, borderRadius: 12, paddingHorizontal: 16, justifyContent: 'center', opacity: couponCode.trim() ? 1 : 0.4 }}
              >
                <Text style={{ color: Colors.gold[500], fontWeight: '700', fontSize: 14 }}>Apply</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Order Summary */}
        <View style={{ marginHorizontal: 20, backgroundColor: '#FFF', borderRadius: 16, padding: 16 }}>
          <Text style={{ fontWeight: '800', fontSize: 15, marginBottom: 12 }}>Order Summary</Text>
          {[
            { label: 'Subtotal', value: subtotal },
            { label: 'Delivery fee', value: deliveryFee },
            { label: 'Service fee', value: serviceFee },
          ].map(({ label, value }) => (
            <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ color: '#666' }}>{label}</Text>
              <Text style={{ fontWeight: '600' }}>{formatPrice(value)}</Text>
            </View>
          ))}
          {discount > 0 && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ color: Colors.empire.success }}>Discount</Text>
              <Text style={{ color: Colors.empire.success, fontWeight: '600' }}>−{formatPrice(discount)}</Text>
            </View>
          )}
          <View style={{ height: 1, backgroundColor: '#F0F0F0', marginVertical: 12 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontWeight: '900', fontSize: 17 }}>Total</Text>
            <Text style={{ fontWeight: '900', fontSize: 17 }}>{formatPrice(grandTotal)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout CTA */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', padding: 20, borderTopWidth: 1, borderTopColor: '#F0F0F0' }}>
        <Button variant="gold" size="lg" onPress={() => router.push('/(modals)/checkout')}>
          Proceed to Checkout — {formatPrice(grandTotal)}
        </Button>
      </View>
    </ScreenWrapper>
  );
}
