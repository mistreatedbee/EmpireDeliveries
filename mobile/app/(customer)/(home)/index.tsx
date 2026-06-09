import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, FlatList, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { PromoBanner } from '@/components/home/PromoBanner';
import { ServiceGrid } from '@/components/home/ServiceGrid';
import { CategoryRow } from '@/components/home/CategoryRow';
import { RestaurantCard } from '@/components/home/RestaurantCard';
import { SectionHeader } from '@/components/home/SectionHeader';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { useAuthStore } from '@/stores/authStore';
import { useLocationStore } from '@/stores/locationStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { useCartStore } from '@/stores/cartStore';
import { useFeaturedRestaurants, usePopularRestaurants, useCategories } from '@/hooks/useRestaurants';
import { Colors } from '@/constants/colors';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { selectedAddress } = useLocationStore();
  const { unreadCount } = useNotificationStore();
  const { itemCount } = useCartStore();
  const [activeCategory, setActiveCategory] = useState('');

  const { data: featured, isLoading: loadingFeatured, refetch: refetchFeatured } = useFeaturedRestaurants();
  const { data: popular, isLoading: loadingPopular } = usePopularRestaurants();
  const { data: categories } = useCategories();

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await refetchFeatured();
    setRefreshing(false);
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <ScreenWrapper bg="surface" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={{ backgroundColor: Colors.empire.black, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <View>
            <Text style={{ color: Colors.gold[500], fontSize: 11, fontWeight: '700', letterSpacing: 3 }}>EMPIRE DELIVERIES</Text>
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800', marginTop: 2 }}>
              {greeting()}{user ? `, ${user.firstName}` : ''} 👋
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Pressable onPress={() => router.push('/(customer)/(notifications)')} style={{ position: 'relative' }}>
              <Text style={{ fontSize: 24 }}>🔔</Text>
              {unreadCount > 0 && (
                <View style={{ position: 'absolute', top: -4, right: -4, backgroundColor: Colors.gold[500], borderRadius: 8, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#000', fontSize: 9, fontWeight: '800' }}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                </View>
              )}
            </Pressable>
            {itemCount > 0 && (
              <Pressable onPress={() => router.push('/(modals)/cart')} style={{ position: 'relative' }}>
                <Text style={{ fontSize: 24 }}>🛒</Text>
                <View style={{ position: 'absolute', top: -4, right: -4, backgroundColor: Colors.empire.error, borderRadius: 8, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 9, fontWeight: '800' }}>{itemCount}</Text>
                </View>
              </Pressable>
            )}
          </View>
        </View>

        {/* Location */}
        <Pressable
          onPress={() => router.push('/(auth)/location-setup')}
          style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.empire.charcoal, borderRadius: 12, padding: 10, gap: 8 }}
        >
          <Text style={{ fontSize: 16 }}>📍</Text>
          <Text style={{ color: '#FFFFFF', flex: 1, fontSize: 14 }} numberOfLines={1}>
            {selectedAddress?.formattedAddress ?? 'Set your delivery location'}
          </Text>
          <Text style={{ color: Colors.gold[500], fontSize: 12, fontWeight: '600' }}>Change</Text>
        </Pressable>
      </View>

      {/* Search Bar */}
      <Pressable
        onPress={() => router.push('/(customer)/(home)/search')}
        style={{ marginHorizontal: 20, marginTop: 16, marginBottom: 4, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, gap: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}
      >
        <Text style={{ fontSize: 18 }}>🔍</Text>
        <Text style={{ color: '#AAA', fontSize: 15 }}>Search restaurants or food...</Text>
      </Pressable>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.gold[500]} />}
      >
        <SectionHeader title="Quick Services" />
        <ServiceGrid />

        <SectionHeader title="Promotions" />
        <PromoBanner />

        {categories && categories.length > 0 && (
          <>
            <SectionHeader title="Categories" />
            <CategoryRow categories={categories} activeCategory={activeCategory} onSelect={setActiveCategory} />
          </>
        )}

        <SectionHeader title="Featured Restaurants" onSeeAll={() => router.push('/(customer)/(home)/restaurant-list')} />
        {loadingFeatured ? (
          <>{[0, 1, 2].map((i) => <SkeletonCard key={i} />)}</>
        ) : (
          featured?.map((r: import('@/types/restaurant.types').Restaurant) => <RestaurantCard key={r.id} restaurant={r} />)
        )}

        <SectionHeader title="Popular Near You" onSeeAll={() => router.push({ pathname: '/(customer)/(home)/restaurant-list', params: { sort: 'popular' } })} />
        {loadingPopular ? (
          <View style={{ height: 180 }} />
        ) : (
          <FlatList
            horizontal
            data={popular ?? []}
            keyExtractor={(r) => r.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }: { item: import('@/types/restaurant.types').Restaurant }) => <RestaurantCard restaurant={item} wide />}
            scrollEnabled
          />
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}
