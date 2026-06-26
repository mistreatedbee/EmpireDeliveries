import React, { useState } from 'react';
import { ScrollView, View, Text, Image, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Clock, Tag, Heart, Star } from 'lucide-react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useRestaurantDetail, useMenuItems } from '@/hooks/useRestaurantDetail';
import { useCartStore } from '@/stores/cartStore';
import { useUIStore } from '@/stores/uiStore';
import { MenuItem, MenuCategory } from '@/types/restaurant.types';
import { restaurantService } from '@/services/restaurant.service';
import { userService } from '@/services/user.service';
import { queryKeys } from '@/constants/queryKeys';
import { T } from '@/constants/colors';
import { formatPrice } from '@/utils/formatters';

function MenuItemRow({ item, onAdd }: { item: MenuItem; onAdd: (item: MenuItem) => void }) {
  return (
    <Pressable
      onPress={() => router.push(`/(customer)/(home)/food/${item.id}?restaurantId=${item.restaurantId}`)}
      style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: T.border, gap: 12 }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: T.text, marginBottom: 3 }} numberOfLines={1}>{item.name}</Text>
        <Text style={{ fontSize: 13, color: T.textSec, marginBottom: 6 }} numberOfLines={2}>{item.description}</Text>
        <Text style={{ fontSize: 15, fontWeight: '700', color: T.text }}>{formatPrice(item.price)}</Text>
      </View>
      <View style={{ position: 'relative' }}>
        <Image source={{ uri: item.image }} style={{ width: 88, height: 88, borderRadius: 10, backgroundColor: T.surface }} />
        <Pressable
          onPress={(e) => { e.stopPropagation(); onAdd(item); }}
          style={{ position: 'absolute', bottom: -8, right: -8, width: 28, height: 28, borderRadius: 14, backgroundColor: T.action, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 4 }}
        >
          <Text style={{ color: '#FFF', fontSize: 20, fontWeight: '300', lineHeight: 26 }}>+</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews'>('menu');
  const queryClient = useQueryClient();

  const { data: restaurant, isLoading: loadingRestaurant } = useRestaurantDetail(id);
  const { data: menuCategories, isLoading: loadingMenu } = useMenuItems(id);
  const { addItem, itemCount, restaurantId, restaurantName } = useCartStore();
  const { showToast } = useUIStore();

  // Reviews
  const { data: reviewsPage, isLoading: reviewsLoading } = useQuery({
    queryKey: queryKeys.restaurants.reviews(id),
    queryFn: () => restaurantService.getReviews(id),
    enabled: activeTab === 'reviews' && !!id,
  });

  // Favourites state (derived from cached list)
  const { data: favourites } = useQuery({
    queryKey: ['user', 'favourites'],
    queryFn: userService.getFavourites,
    enabled: !!id,
  });
  const isFavourited = Array.isArray(favourites)
    ? (favourites as Array<{ id: string }>).some((r) => r.id === id)
    : false;

  const favouriteMutation = useMutation({
    mutationFn: () => restaurantService.toggleFavourite(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['user', 'favourites'] }),
  });

  const handleAddItem = (item: MenuItem) => {
    if (restaurantId && restaurantId !== id) {
      useUIStore.getState().showToast(`Your cart has items from ${restaurantName}. Clear cart to order from here?`, 'warning');
      return;
    }
    if (item.addonGroups && item.addonGroups.length > 0) {
      router.push(`/(customer)/(home)/food/${item.id}?restaurantId=${id}`);
      return;
    }
    addItem(item, [], 1);
    showToast(`${item.name} added`, 'success');
  };

  if (loadingRestaurant) {
    return <ScreenWrapper bg="white"><View style={{ padding: 16 }}><SkeletonCard /></View></ScreenWrapper>;
  }

  if (!restaurant) {
    return <ScreenWrapper bg="white"><EmptyState title="Restaurant not found" /></ScreenWrapper>;
  }

  return (
    <ScreenWrapper bg="white" edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={{ position: 'relative' }}>
          <Image source={{ uri: restaurant.coverImage }} style={{ width: '100%', height: 220, backgroundColor: T.surface }} />
          {/* Back button */}
          <Pressable
            onPress={() => router.back()}
            style={{ position: 'absolute', top: 48, left: 16, backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: T.border }}
          >
            <Text style={{ color: T.text, fontSize: 18 }}>←</Text>
          </Pressable>
          {/* Favourite heart button */}
          <Pressable
            onPress={() => favouriteMutation.mutate()}
            disabled={favouriteMutation.isPending}
            style={{ position: 'absolute', top: 48, right: 16, backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: T.border }}
          >
            <Heart
              size={20}
              color={isFavourited ? '#E53935' : T.textTer}
              fill={isFavourited ? '#E53935' : 'transparent'}
            />
          </Pressable>
          {!restaurant.isOpen && (
            <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ backgroundColor: T.bg, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 6, borderWidth: 1, borderColor: T.border }}>
                <Text style={{ color: T.text, fontWeight: '700' }}>Currently Closed</Text>
              </View>
            </View>
          )}
        </View>

        {/* Info block */}
        <View style={{ padding: 20, backgroundColor: T.bg, borderBottomWidth: 1, borderBottomColor: T.border }}>
          <Text style={{ fontSize: 24, fontWeight: '800', color: T.text, marginBottom: 4 }}>{restaurant.name}</Text>
          <Text style={{ fontSize: 14, color: T.textSec, marginBottom: 14, lineHeight: 20 }}>{restaurant.description}</Text>
          <View style={{ flexDirection: 'row', gap: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Clock size={14} color={T.textSec} />
              <View>
                <Text style={{ fontSize: 14, fontWeight: '700', color: T.text }}>{restaurant.deliveryTime} min</Text>
                <Text style={{ fontSize: 11, color: T.textTer }}>Delivery</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Tag size={14} color={T.textSec} />
              <View>
                <Text style={{ fontSize: 14, fontWeight: '700', color: T.text }}>
                  {restaurant.deliveryFee === 0 ? 'Free' : formatPrice(restaurant.deliveryFee)}
                </Text>
                <Text style={{ fontSize: 11, color: T.textTer }}>Delivery fee</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={{ flexDirection: 'row', backgroundColor: T.bg, borderBottomWidth: 1, borderBottomColor: T.border }}>
          {(['menu', 'reviews'] as const).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{ flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: activeTab === tab ? T.action : 'transparent' }}
            >
              <Text style={{ fontWeight: '700', color: activeTab === tab ? T.text : T.textTer, textTransform: 'capitalize' }}>{tab}</Text>
            </Pressable>
          ))}
        </View>

        {/* Menu */}
        {activeTab === 'menu' && (
          <View style={{ paddingHorizontal: 20 }}>
            {loadingMenu
              ? [0, 1].map((i) => <SkeletonCard key={i} />)
              : menuCategories?.map((cat: MenuCategory) => (
                  <View key={cat.id} style={{ marginBottom: 8 }}>
                    <Text style={{ fontSize: 17, fontWeight: '800', color: T.text, marginTop: 24, marginBottom: 4 }}>{cat.name}</Text>
                    {cat.items.map((item: MenuItem) => (
                      <MenuItemRow key={item.id} item={item} onAdd={handleAddItem} />
                    ))}
                  </View>
                ))}
          </View>
        )}

        {/* Reviews */}
        {activeTab === 'reviews' && (
          <View style={{ padding: 20 }}>
            {reviewsLoading && (
              <ActivityIndicator color={T.action} style={{ marginTop: 40 }} />
            )}
            {!reviewsLoading && (!reviewsPage?.data || reviewsPage.data.length === 0) && (
              <Text style={{ color: T.textTer, textAlign: 'center', marginTop: 40 }}>No reviews yet</Text>
            )}
            {!reviewsLoading && (reviewsPage?.data ?? []).map((r) => {
              // Backend may return firstName/lastName or userName — handle both shapes
              const raw = r as typeof r & { firstName?: string; lastName?: string; review?: string };
              const displayName = r.userName || `${raw.firstName ?? ''} ${raw.lastName ?? ''}`.trim() || 'Customer';
              const reviewText = r.comment || raw.review || '';
              return (
                <View
                  key={r.id}
                  style={{ backgroundColor: T.bg, borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: T.border }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <Text style={{ fontWeight: '700', color: T.text, flex: 1, marginRight: 8 }}>{displayName}</Text>
                    <View style={{ flexDirection: 'row', gap: 2 }}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} size={13} color={T.text} fill={n <= r.rating ? T.text : 'transparent'} />
                      ))}
                    </View>
                  </View>
                  {reviewText ? (
                    <Text style={{ color: T.textSec, fontSize: 13, lineHeight: 19 }}>{reviewText}</Text>
                  ) : null}
                  <Text style={{ color: T.textTer, fontSize: 11, marginTop: 6 }}>
                    {new Date(r.createdAt).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        <View style={{ height: itemCount > 0 ? 96 : 32 }} />
      </ScrollView>

      {/* View Cart FAB */}
      {itemCount > 0 && (
        <View style={{ position: 'absolute', bottom: 24, left: 16, right: 16 }}>
          <Pressable
            onPress={() => router.push('/(modals)/cart')}
            style={{ backgroundColor: T.action, borderRadius: 12, paddingVertical: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, width: 28, height: 28, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#FFF', fontWeight: '800', fontSize: 13 }}>{itemCount}</Text>
            </View>
            <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 15 }}>View cart</Text>
            <Text style={{ color: '#FFF', fontSize: 14 }}>→</Text>
          </Pressable>
        </View>
      )}
    </ScreenWrapper>
  );
}
