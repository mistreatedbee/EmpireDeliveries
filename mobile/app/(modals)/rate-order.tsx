import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Star } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { orderService } from '@/services/order.service';
import { queryKeys } from '@/constants/queryKeys';
import { useUIStore } from '@/stores/uiStore';
import { getUserErrorMessage } from '@/utils/errorHandler';
import { T } from '@/constants/colors';

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
const TIP_PRESETS = [0, 10, 20, 50];

function StarRow({ value, onChange, size = 36 }: { value: number; onChange: (n: number) => void; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable key={star} onPress={() => onChange(star)}>
          <Star
            size={size}
            color={T.gold}
            fill={star <= value ? T.gold : 'transparent'}
            strokeWidth={1.5}
          />
        </Pressable>
      ))}
    </View>
  );
}

export default function RateOrderModal() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { showToast } = useUIStore();
  const queryClient = useQueryClient();

  const [restaurantRating, setRestaurantRating] = useState(0);
  const [restaurantReview, setRestaurantReview] = useState('');
  const [driverRating, setDriverRating] = useState(0);
  const [driverReview, setDriverReview] = useState('');
  const [tipAmount, setTipAmount] = useState(0);

  const { data: order, isLoading } = useQuery({
    queryKey: queryKeys.orders.detail(orderId),
    queryFn: () => orderService.getById(orderId),
    enabled: Boolean(orderId),
  });

  const hasDriver = Boolean(order?.driverId);
  const isCash = order?.paymentMethod === 'cash';
  const alreadyRated = Boolean(order?.rating);
  const canTip = !isCash && hasDriver && !(order?.tipAmount && order.tipAmount > 0);

  const mutation = useMutation({
    mutationFn: () => orderService.rate(orderId, {
      rating: restaurantRating,
      review: restaurantReview.trim() || undefined,
      driverRating: hasDriver && driverRating > 0 ? driverRating : undefined,
      driverReview: hasDriver && driverReview.trim() ? driverReview.trim() : undefined,
      tipAmount: canTip && tipAmount > 0 ? tipAmount : undefined,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(orderId) });
      showToast('Thank you for your feedback!', 'success');
      router.back();
    },
    onError: (err) => showToast(getUserErrorMessage(err, 'Could not submit review. Please try again.'), 'error'),
  });

  const canSubmit = restaurantRating > 0 && (!hasDriver || driverRating > 0);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: T.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={T.gold} />
      </View>
    );
  }

  if (alreadyRated) {
    return (
      <View style={{ flex: 1, backgroundColor: T.bg, padding: 24, alignItems: 'center', justifyContent: 'center' }}>
        <Star size={48} color={T.gold} fill={T.gold} />
        <Text style={{ fontSize: 20, fontWeight: '900', color: T.text, marginTop: 16 }}>Already rated</Text>
        <Text style={{ color: T.textSec, marginTop: 8, textAlign: 'center' }}>
          You rated this order {order?.rating}★{order?.driverRating ? ` · Driver ${order.driverRating}★` : ''}
        </Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 24, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: T.gold, borderRadius: 14 }}>
          <Text style={{ fontWeight: '800', color: T.text }}>Close</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 4 }}>
        <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: T.border }} />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: T.border }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: '900', color: T.text }}>Rate Your Order</Text>
          <Text style={{ fontSize: 13, color: T.textSec, marginTop: 2 }}>{order?.restaurantName ?? 'How was everything?'}</Text>
        </View>
        <Pressable onPress={() => router.back()} style={{ padding: 6 }}>
          <X size={20} color={T.textSec} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, gap: 28, paddingBottom: 40 }}>
        <View>
          <Text style={{ fontSize: 15, fontWeight: '800', color: T.text, marginBottom: 4 }}>Food & restaurant</Text>
          <Text style={{ fontSize: 13, color: T.textSec, marginBottom: 14 }}>How was the food from {order?.restaurantName ?? 'the restaurant'}?</Text>
          <StarRow value={restaurantRating} onChange={setRestaurantRating} />
          {restaurantRating > 0 && (
            <Text style={{ fontSize: 14, color: T.textSec, marginTop: 10, textAlign: 'center' }}>
              {RATING_LABELS[restaurantRating]}
            </Text>
          )}
          <TextInput
            value={restaurantReview}
            onChangeText={setRestaurantReview}
            placeholder="Comment about the food (optional)"
            placeholderTextColor={T.textTer}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            style={{
              backgroundColor: T.surface,
              borderRadius: 12,
              padding: 14,
              fontSize: 14,
              color: T.text,
              minHeight: 80,
              borderWidth: 1,
              borderColor: T.border,
              marginTop: 14,
            }}
          />
        </View>

        {hasDriver && (
          <View style={{ borderTopWidth: 1, borderTopColor: T.border, paddingTop: 24 }}>
            <Text style={{ fontSize: 15, fontWeight: '800', color: T.text, marginBottom: 4 }}>Your driver</Text>
            <Text style={{ fontSize: 13, color: T.textSec, marginBottom: 14 }}>How was the delivery experience?</Text>
            <StarRow value={driverRating} onChange={setDriverRating} />
            {driverRating > 0 && (
              <Text style={{ fontSize: 14, color: T.textSec, marginTop: 10, textAlign: 'center' }}>
                {RATING_LABELS[driverRating]}
              </Text>
            )}
            <TextInput
              value={driverReview}
              onChangeText={setDriverReview}
              placeholder="Comment about your driver (optional)"
              placeholderTextColor={T.textTer}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              style={{
                backgroundColor: T.surface,
                borderRadius: 12,
                padding: 14,
                fontSize: 14,
                color: T.text,
                minHeight: 80,
                borderWidth: 1,
                borderColor: T.border,
                marginTop: 14,
              }}
            />
          </View>
        )}

        {canTip && (
          <View style={{ borderTopWidth: 1, borderTopColor: T.border, paddingTop: 24 }}>
            <Text style={{ fontSize: 15, fontWeight: '800', color: T.text, marginBottom: 4 }}>Tip your driver</Text>
            <Text style={{ fontSize: 13, color: T.textSec, marginBottom: 14 }}>
              Optional — charged from your Empire Wallet
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {TIP_PRESETS.map((amount) => (
                <Pressable
                  key={amount}
                  onPress={() => setTipAmount(amount)}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 12,
                    alignItems: 'center',
                    backgroundColor: tipAmount === amount ? T.goldBg : T.surface,
                    borderWidth: 1.5,
                    borderColor: tipAmount === amount ? T.gold : T.border,
                  }}
                >
                  <Text style={{ fontWeight: '800', color: tipAmount === amount ? T.gold : T.text }}>
                    {amount === 0 ? 'No tip' : `R${amount}`}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <Button
          size="lg"
          onPress={() => mutation.mutate()}
          disabled={!canSubmit}
          loading={mutation.isPending}
        >
          Submit Review{tipAmount > 0 ? ` · R${tipAmount} tip` : ''}
        </Button>
      </ScrollView>
    </View>
  );
}
