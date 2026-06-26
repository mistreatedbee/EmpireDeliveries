import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, Image, TextInput, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { Tag, X, CheckCircle, ShoppingCart } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button, EmptyState } from '@/components/empire';
import { useCartStore } from '@/stores/cartStore';
import { useUIStore } from '@/stores/uiStore';
import { orderService } from '@/services/order.service';
import { CartItem } from '@/types/order.types';
import { T } from '@/constants/colors';
import { formatPrice } from '@/utils/formatters';

function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCartStore();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: T.border, gap: 12 }}>
      <Image source={{ uri: item.menuItem.image }} style={{ width: 70, height: 70, borderRadius: 10, backgroundColor: T.surface }} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: '700', fontSize: 15, color: T.text, marginBottom: 2 }} numberOfLines={1}>{item.menuItem.name}</Text>
        {item.selectedAddons.length > 0 && (
          <Text style={{ fontSize: 12, color: T.textSec, marginBottom: 4 }}>{item.selectedAddons.map((a) => a.name).join(', ')}</Text>
        )}
        <Text style={{ fontWeight: '800', fontSize: 15, color: T.text }}>{formatPrice(item.totalPrice)}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Pressable
          onPress={() => updateQuantity(item.id, item.quantity - 1)}
          style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: T.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: T.border }}
        >
          <Text style={{ fontWeight: '700', fontSize: 16, color: T.text }}>−</Text>
        </Pressable>
        <Text style={{ fontWeight: '800', fontSize: 16, minWidth: 20, textAlign: 'center', color: T.text }}>{item.quantity}</Text>
        <Pressable
          onPress={() => updateQuantity(item.id, item.quantity + 1)}
          style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: T.action, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 16 }}>+</Text>
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
      <ScreenWrapper bg="white">
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: T.border }}>
          <Pressable onPress={() => router.back()} style={{ marginRight: 12, padding: 4 }}>
            <X size={20} color={T.text} />
          </Pressable>
          <Text style={{ fontSize: 20, fontWeight: '900', color: T.text }}>Your Cart</Text>
        </View>
        <EmptyState
          icon={<ShoppingCart size={28} color="#A3A3A3" />}
          title="Your cart is empty"
          description="Add items from a restaurant to get started"
          action={
            <Button variant="primary" size="sm" onPress={() => router.replace('/(customer)' as any)}>
              Browse Restaurants
            </Button>
          }
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper bg="white" edges={['bottom']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, backgroundColor: T.bg, borderBottomWidth: 1, borderBottomColor: T.border }}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 12, padding: 4 }}>
          <X size={20} color={T.text} />
        </Pressable>
        <View>
          <Text style={{ fontSize: 20, fontWeight: '900', color: T.text }}>Your Cart</Text>
          <Text style={{ fontSize: 13, color: T.textSec }}>{restaurantName} · {itemCount} items</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ backgroundColor: T.bg, paddingHorizontal: 20 }}>
          <FlatList
            data={items}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => <CartItemRow item={item} />}
            scrollEnabled={false}
          />
        </View>

        {/* Coupon */}
        <View style={{ margin: 16, backgroundColor: T.bg, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: T.border }}>
          <Text style={{ fontWeight: '800', fontSize: 15, color: T.text, marginBottom: 12 }}>Promo Code</Text>
          {coupon?.valid ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: T.successBg, alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle size={16} color={T.success} />
                </View>
                <View>
                  <Text style={{ fontWeight: '700', color: T.success, fontSize: 14 }}>{coupon.code}</Text>
                  <Text style={{ fontSize: 12, color: T.textSec }}>Discount applied</Text>
                </View>
              </View>
              <Pressable onPress={clearCoupon}>
                <Text style={{ color: T.danger, fontWeight: '600', fontSize: 13 }}>Remove</Text>
              </Pressable>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: T.surface, borderRadius: 10, paddingHorizontal: 10, gap: 8, borderWidth: 1, borderColor: T.border }}>
                <Tag size={14} color={T.textTer} />
                <TextInput
                  value={couponCode}
                  onChangeText={setCouponCode}
                  placeholder="Enter promo code"
                  autoCapitalize="characters"
                  placeholderTextColor={T.textTer}
                  style={{ flex: 1, paddingVertical: 10, fontSize: 14, color: T.text }}
                />
              </View>
              <Pressable
                onPress={() => validateCoupon.mutate()}
                disabled={!couponCode.trim() || validateCoupon.isPending}
                style={{ backgroundColor: T.action, borderRadius: 10, paddingHorizontal: 16, justifyContent: 'center', opacity: couponCode.trim() ? 1 : 0.4 }}
              >
                <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 14 }}>Apply</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Order Summary */}
        <View style={{ marginHorizontal: 16, backgroundColor: T.bg, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: T.border }}>
          <Text style={{ fontWeight: '800', fontSize: 15, color: T.text, marginBottom: 12 }}>Order Summary</Text>
          {[
            { label: 'Subtotal', value: subtotal },
            { label: 'Delivery fee', value: deliveryFee },
            { label: 'Service fee', value: serviceFee },
          ].map(({ label, value }) => (
            <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ color: T.textSec }}>{label}</Text>
              <Text style={{ fontWeight: '600', color: T.text }}>{formatPrice(value)}</Text>
            </View>
          ))}
          {discount > 0 && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ color: T.success }}>Discount</Text>
              <Text style={{ color: T.success, fontWeight: '600' }}>−{formatPrice(discount)}</Text>
            </View>
          )}
          <View style={{ height: 1, backgroundColor: T.border, marginVertical: 12 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontWeight: '900', fontSize: 17, color: T.text }}>Total</Text>
            <Text style={{ fontWeight: '900', fontSize: 17, color: T.text }}>{formatPrice(grandTotal)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout CTA */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: T.bg, padding: 20, borderTopWidth: 1, borderTopColor: T.border }}>
        <Button size="lg" onPress={() => router.push('/(modals)/checkout')}>
          Proceed to Checkout — {formatPrice(grandTotal)}
        </Button>
      </View>
    </ScreenWrapper>
  );
}
