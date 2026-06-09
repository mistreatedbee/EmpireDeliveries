import React, { useState, useRef } from 'react';
import { ScrollView, View, Text, Image, Pressable, FlatList, SectionList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useRestaurantDetail, useMenuItems } from '@/hooks/useRestaurantDetail';
import { useCartStore } from '@/stores/cartStore';
import { useUIStore } from '@/stores/uiStore';
import { MenuItem } from '@/types/restaurant.types';
import { Colors } from '@/constants/colors';
import { formatPrice } from '@/utils/formatters';

function MenuItemRow({ item, onAdd }: { item: MenuItem; onAdd: (item: MenuItem) => void }) {
  return (
    <Pressable
      onPress={() => router.push(`/(customer)/(home)/food/${item.id}?restaurantId=${item.restaurantId}`)}
      style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', gap: 12 }}
    >
      <Image source={{ uri: item.image }} style={{ width: 80, height: 80, borderRadius: 12, backgroundColor: '#F0F0F0' }} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.empire.black, marginBottom: 4 }} numberOfLines={1}>{item.name}</Text>
        <Text style={{ fontSize: 13, color: '#666', marginBottom: 6 }} numberOfLines={2}>{item.description}</Text>
        <Text style={{ fontSize: 15, fontWeight: '800', color: Colors.empire.black }}>{formatPrice(item.price)}</Text>
      </View>
      <Pressable
        onPress={(e) => { e.stopPropagation(); onAdd(item); }}
        style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.empire.black, alignItems: 'center', justifyContent: 'center' }}
      >
        <Text style={{ color: Colors.gold[500], fontSize: 22, fontWeight: '300', lineHeight: 28 }}>+</Text>
      </Pressable>
    </Pressable>
  );
}

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews'>('menu');
  const { data: restaurant, isLoading: loadingRestaurant } = useRestaurantDetail(id);
  const { data: menuCategories, isLoading: loadingMenu } = useMenuItems(id);
  const { addItem, itemCount, restaurantId, clearForNewRestaurant, restaurantName } = useCartStore();
  const { showToast } = useUIStore();

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
    showToast(`${item.name} added to cart`, 'success');
  };

  if (loadingRestaurant) {
    return <ScreenWrapper bg="surface"><View style={{ padding: 20 }}><SkeletonCard /></View></ScreenWrapper>;
  }

  if (!restaurant) {
    return <ScreenWrapper bg="surface"><EmptyState title="Restaurant not found" /></ScreenWrapper>;
  }

  return (
    <ScreenWrapper bg="surface" edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={{ position: 'relative' }}>
          <Image source={{ uri: restaurant.coverImage }} style={{ width: '100%', height: 220, backgroundColor: '#F0F0F0' }} />
          <Pressable
            onPress={() => router.back()}
            style={{ position: 'absolute', top: 48, left: 16, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: '#FFF', fontSize: 18 }}>←</Text>
          </Pressable>
          {!restaurant.isOpen && (
            <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}>
              <Badge label="Currently Closed" variant="dark" size="md" />
            </View>
          )}
        </View>

        <View style={{ padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
          <Text style={{ fontSize: 24, fontWeight: '900', color: Colors.empire.black, marginBottom: 6 }}>{restaurant.name}</Text>
          <Text style={{ fontSize: 14, color: '#666', marginBottom: 12, lineHeight: 20 }}>{restaurant.description}</Text>
          <View style={{ flexDirection: 'row', gap: 20, marginBottom: 12 }}>
            <View style={{ alignItems: 'center' }}>
              <StarRating rating={restaurant.rating} showValue size={16} />
              <Text style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{restaurant.reviewCount} reviews</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: Colors.empire.black }}>🕐 {restaurant.deliveryTime} min</Text>
              <Text style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Delivery time</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: Colors.empire.black }}>
                {restaurant.deliveryFee === 0 ? '🆓 Free' : formatPrice(restaurant.deliveryFee)}
              </Text>
              <Text style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Delivery</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={{ flexDirection: 'row', backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
          {(['menu', 'reviews'] as const).map((tab) => (
            <Pressable key={tab} onPress={() => setActiveTab(tab)} style={{ flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: activeTab === tab ? Colors.gold[500] : 'transparent' }}>
              <Text style={{ fontWeight: '700', color: activeTab === tab ? Colors.empire.black : '#888', textTransform: 'capitalize' }}>{tab}</Text>
            </Pressable>
          ))}
        </View>

        {/* Menu */}
        {activeTab === 'menu' && (
          <View style={{ paddingHorizontal: 20 }}>
            {loadingMenu ? (
              [0, 1].map((i) => <SkeletonCard key={i} />)
            ) : (
              menuCategories?.map((cat: import('@/types/restaurant.types').MenuCategory) => (
                <View key={cat.id}>
                  <Text style={{ fontSize: 18, fontWeight: '900', color: Colors.empire.black, marginTop: 24, marginBottom: 4 }}>{cat.name}</Text>
                  {cat.items.map((item: import('@/types/restaurant.types').MenuItem) => (
                    <MenuItemRow key={item.id} item={item} onAdd={handleAddItem} />
                  ))}
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'reviews' && (
          <View style={{ padding: 20 }}>
            <Text style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>Reviews coming soon</Text>
          </View>
        )}

        <View style={{ height: itemCount > 0 ? 90 : 32 }} />
      </ScrollView>

      {/* View Cart FAB */}
      {itemCount > 0 && (
        <View style={{ position: 'absolute', bottom: 24, left: 20, right: 20 }}>
          <Pressable
            onPress={() => router.push('/(modals)/cart')}
            style={{ backgroundColor: Colors.empire.black, borderRadius: 20, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: Colors.gold[500], shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 }}
          >
            <View style={{ backgroundColor: Colors.gold[500], borderRadius: 12, width: 28, height: 28, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: Colors.empire.black, fontWeight: '800', fontSize: 13 }}>{itemCount}</Text>
            </View>
            <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 16 }}>View Cart</Text>
            <Text style={{ color: Colors.gold[500], fontWeight: '700', fontSize: 14 }}>→</Text>
          </Pressable>
        </View>
      )}
    </ScreenWrapper>
  );
}
