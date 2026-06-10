import React from 'react';
import { Pressable, Text, View, Image } from 'react-native';
import { router } from 'expo-router';
import { Star, Clock, Heart } from 'lucide-react-native';
import { Restaurant } from '@/types/restaurant.types';
import { T } from '@/constants/colors';

interface RestaurantCardProps {
  restaurant: Restaurant;
  wide?: boolean;
}

export function RestaurantCard({ restaurant, wide = false }: RestaurantCardProps) {
  const { id, name, coverImage, rating, deliveryTime, deliveryFee, isOpen, promoText } = restaurant;

  return (
    <Pressable
      onPress={() => router.push(`/(customer)/(home)/restaurant/${id}`)}
      style={{
        width: wide ? 260 : '100%',
        backgroundColor: T.bg,
        borderRadius: 12,
        overflow: 'hidden',
        marginRight: wide ? 0 : 0,
        marginBottom: wide ? 0 : 12,
        borderWidth: 1,
        borderColor: T.border,
        opacity: isOpen ? 1 : 0.7,
      }}
    >
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: coverImage }}
          style={{ width: '100%', height: 140, backgroundColor: T.surface }}
          resizeMode="cover"
        />
        {promoText && (
          <View style={{ position: 'absolute', top: 10, left: 10, backgroundColor: T.danger, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 }}>
            <Text style={{ color: '#FFF', fontSize: 11, fontWeight: '700' }}>{promoText}</Text>
          </View>
        )}
        <Pressable
          style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' }}
          onPress={(e) => e.stopPropagation()}
        >
          <Heart size={16} color={T.textSec} />
        </Pressable>
        {!isOpen && (
          <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.5)', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ backgroundColor: T.bg, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4, borderWidth: 1, borderColor: T.border }}>
              <Text style={{ color: T.text, fontWeight: '700', fontSize: 12 }}>Closed</Text>
            </View>
          </View>
        )}
      </View>
      <View style={{ padding: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: T.text, marginBottom: 5 }} numberOfLines={1}>{name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Star size={12} color={T.text} fill={T.text} />
            <Text style={{ fontSize: 13, color: T.textSec, fontWeight: '500' }}>{rating.toFixed(1)}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Clock size={12} color={T.textTer} />
            <Text style={{ fontSize: 13, color: T.textSec }}>{deliveryTime} min</Text>
          </View>
          <Text style={{ fontSize: 13, color: T.textSec }}>
            {deliveryFee === 0 ? 'Free delivery' : `R${deliveryFee.toFixed(0)} delivery`}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
