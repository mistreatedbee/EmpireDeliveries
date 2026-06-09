import React from 'react';
import { FlatList, View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Header } from '@/components/layout/Header';
import { RestaurantCard } from '@/components/home/RestaurantCard';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useRestaurants } from '@/hooks/useRestaurants';
import { RestaurantCategory } from '@/types/restaurant.types';
import { Colors } from '@/constants/colors';

export default function RestaurantListScreen() {
  const { category, sort } = useLocalSearchParams<{ category?: string; sort?: string }>();
  const { data, isLoading } = useRestaurants({ category: category as RestaurantCategory, sortBy: sort as never });

  const restaurants = data?.data ?? [];

  return (
    <ScreenWrapper bg="surface">
      <Header title={category ? `${category.charAt(0).toUpperCase()}${category.slice(1)}` : 'All Restaurants'} />
      {isLoading ? (
        <View style={{ paddingHorizontal: 20 }}>
          {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </View>
      ) : restaurants.length === 0 ? (
        <EmptyState title="No restaurants found" subtitle="Try a different category or location" />
      ) : (
        <FlatList
          data={restaurants}
          keyExtractor={(r) => r.id}
          renderItem={({ item }) => <RestaurantCard restaurant={item} />}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32, paddingTop: 12 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenWrapper>
  );
}
