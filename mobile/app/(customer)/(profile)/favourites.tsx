import React from 'react';
import { View, ActivityIndicator, FlatList, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Header } from '@/components/layout/Header';
import { RestaurantCard } from '@/components/home/RestaurantCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { userService } from '@/services/user.service';
import { restaurantService } from '@/services/restaurant.service';
import { Restaurant } from '@/types/restaurant.types';
import { T } from '@/constants/colors';

function mapFavToRestaurant(r: Record<string, unknown>): Restaurant {
  return {
    id: r.id as string,
    name: r.name as string,
    description: (r.description ?? '') as string,
    logo: (r.logo ?? '') as string,
    coverImage: (r.coverImage ?? r.cover_image ?? '') as string,
    address: (r.address ?? '') as string,
    coordinates: { latitude: 0, longitude: 0 },
    rating: Number(r.rating ?? 0),
    reviewCount: Number(r.reviewCount ?? r.review_count ?? 0),
    deliveryFee: Number(r.deliveryFee ?? r.delivery_fee ?? 0),
    deliveryTime: Number(r.deliveryTime ?? r.deliveryTimeMin ?? r.delivery_time_min ?? 30),
    minOrder: Number(r.minOrder ?? r.min_order ?? 0),
    status: (r.isOpen ?? r.is_open) ? 'open' : 'closed',
    categories: [],
    isOpen: Boolean(r.isOpen ?? r.is_open),
    isFeatured: Boolean(r.isFeatured ?? r.is_featured),
    isFavourited: true,
  };
}

export default function FavouritesScreen() {
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ['user', 'favourites'],
    queryFn: () => userService.getFavourites(),
  });

  const removeMutation = useMutation({
    mutationFn: (restaurantId: string) => restaurantService.toggleFavourite(restaurantId),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['user', 'favourites'] }),
  });

  const restaurants = (data as Record<string, unknown>[]).map(mapFavToRestaurant);

  if (isLoading) {
    return (
      <ScreenWrapper bg="white">
        <Header title="Favourites" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={T.action} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper bg="white">
      <Header title="Favourites" />
      {restaurants.length === 0 ? (
        <EmptyState
          title="No favourites yet"
          subtitle="Heart a restaurant to save it here"
          actionLabel="Browse Restaurants"
          onAction={() => router.replace('/(customer)' as any)}
        />
      ) : (
        <FlatList
          data={restaurants}
          keyExtractor={(r) => r.id}
          renderItem={({ item }) => (
            <View style={{ position: 'relative' }}>
              <RestaurantCard restaurant={item} />
              <Pressable
                onPress={() => removeMutation.mutate(item.id)}
                disabled={removeMutation.isPending}
                hitSlop={8}
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: 'rgba(255,255,255,0.92)',
                  borderWidth: 1,
                  borderColor: T.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                }}
              >
                <X size={14} color="#E53935" strokeWidth={2.5} />
              </Pressable>
            </View>
          )}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenWrapper>
  );
}
