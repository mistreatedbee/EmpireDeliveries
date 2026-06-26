import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Star } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { orderService } from '@/services/order.service';
import { queryKeys } from '@/constants/queryKeys';
import { useUIStore } from '@/stores/uiStore';
import { T } from '@/constants/colors';

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

export default function RateOrderModal() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { showToast } = useUIStore();
  const queryClient = useQueryClient();

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const mutation = useMutation({
    mutationFn: () => orderService.rate(orderId, rating, review.trim() || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      showToast('Thank you for your review!', 'success');
      router.back();
    },
    onError: () => showToast('Could not submit review. Please try again.', 'error'),
  });

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Drag handle */}
      <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 4 }}>
        <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: T.border }} />
      </View>

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: T.border }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: '900', color: T.text }}>Rate Your Order</Text>
          <Text style={{ fontSize: 13, color: T.textSec, marginTop: 2 }}>How was your experience?</Text>
        </View>
        <Pressable onPress={() => router.back()} style={{ padding: 6 }}>
          <X size={20} color={T.textSec} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, gap: 24 }}>
        {/* Star selector */}
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: T.text, marginBottom: 16 }}>
            Tap a star to rate
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable key={star} onPress={() => setRating(star)}>
                <Star
                  size={40}
                  color={T.gold}
                  fill={star <= rating ? T.gold : 'transparent'}
                  strokeWidth={1.5}
                />
              </Pressable>
            ))}
          </View>
          {rating > 0 && (
            <Text style={{ fontSize: 14, color: T.textSec, marginTop: 10 }}>
              {RATING_LABELS[rating]}
            </Text>
          )}
        </View>

        {/* Optional comment */}
        <View>
          <Text style={{ fontSize: 14, fontWeight: '700', color: T.text, marginBottom: 8 }}>
            Leave a comment{' '}
            <Text style={{ color: T.textTer, fontWeight: '400' }}>(optional)</Text>
          </Text>
          <TextInput
            value={review}
            onChangeText={setReview}
            placeholder="Tell us about your experience..."
            placeholderTextColor={T.textTer}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={{
              backgroundColor: T.surface,
              borderRadius: 12,
              padding: 14,
              fontSize: 14,
              color: T.text,
              minHeight: 100,
              borderWidth: 1,
              borderColor: T.border,
            }}
          />
        </View>

        <Button
          size="lg"
          onPress={() => mutation.mutate()}
          disabled={rating === 0}
          loading={mutation.isPending}
        >
          Submit Review
        </Button>
      </ScrollView>
    </View>
  );
}
