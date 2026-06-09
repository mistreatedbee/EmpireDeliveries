import React from 'react';
import { Pressable, Text, View, Image } from 'react-native';
import { router } from 'expo-router';
import { Restaurant } from '@/types/restaurant.types';
import { Badge } from '@/components/ui/Badge';
import { Colors } from '@/constants/colors';

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
        width: wide ? 280 : '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        overflow: 'hidden',
        marginRight: wide ? 12 : 0,
        marginBottom: wide ? 0 : 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        opacity: isOpen ? 1 : 0.6,
      }}
    >
      <View style={{ position: 'relative' }}>
        <Image source={{ uri: coverImage }} style={{ width: '100%', height: 140, backgroundColor: '#F0F0F0' }} resizeMode="cover" />
        {promoText && (
          <View style={{ position: 'absolute', top: 10, left: 10 }}>
            <Badge label={promoText} variant="gold" />
          </View>
        )}
        {!isOpen && (
          <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 14 }}>Closed</Text>
          </View>
        )}
      </View>
      <View style={{ padding: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: '800', color: Colors.empire.black, marginBottom: 4 }} numberOfLines={1}>{name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Text style={{ fontSize: 13, color: '#666' }}>⭐ {rating.toFixed(1)}</Text>
          <Text style={{ fontSize: 13, color: '#666' }}>🕐 {deliveryTime} min</Text>
          <Text style={{ fontSize: 13, color: '#666' }}>
            {deliveryFee === 0 ? '🆓 Free delivery' : `R${deliveryFee.toFixed(0)} delivery`}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
