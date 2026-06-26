import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Pressable, RefreshControl } from 'react-native';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { MapPin, ChevronDown, Bell, Search } from 'lucide-react-native';
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
import { T } from '@/constants/colors';
import { formatPrice } from '@/utils/formatters';
import { Restaurant } from '@/types/restaurant.types';

export default function HomeScreen() {
  const { selectedAddress, currentLocation, permissionStatus, setCurrentLocation } = useLocationStore();

  // Silently re-fetch GPS coords if they were lost after app restart
  useEffect(() => {
    if (!currentLocation && permissionStatus === 'granted') {
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
        .then((loc) => setCurrentLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude }))
        .catch(() => null);
    }
  }, []);
  const { unreadCount } = useNotificationStore();
  const { itemCount, subtotal } = useCartStore();
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

  const cartTotal = subtotal + 35 + Math.round(subtotal * 0.05 * 100) / 100;

  return (
    <ScreenWrapper bg="white" edges={['top', 'left', 'right']}>
      {/* Top bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10, backgroundColor: T.bg, borderBottomWidth: 1, borderBottomColor: T.border }}>
        <Pressable
          onPress={() => router.push('/(auth)/location-setup')}
          style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 }}
        >
          <MapPin size={15} color={T.action} />
          <Text style={{ fontSize: 14, fontWeight: '600', color: T.text, flex: 1 }} numberOfLines={1}>
            {selectedAddress?.formattedAddress ?? 'Set delivery location'}
          </Text>
          <ChevronDown size={14} color={T.textSec} />
        </Pressable>
        <Pressable
          onPress={() => router.push('/(customer)/(notifications)')}
          style={{ marginLeft: 16, padding: 4, position: 'relative' }}
        >
          <Bell size={22} color={T.text} />
          {unreadCount > 0 && (
            <View style={{ position: 'absolute', top: 2, right: 2, backgroundColor: T.danger, borderRadius: 5, width: 10, height: 10 }} />
          )}
        </Pressable>
      </View>

      {/* Search pill */}
      <Pressable
        onPress={() => router.push('/(customer)/(home)/search')}
        style={{ marginHorizontal: 16, marginTop: 12, marginBottom: 4, flexDirection: 'row', alignItems: 'center', backgroundColor: T.surface, borderRadius: 999, paddingHorizontal: 14, height: 48, gap: 8 }}
      >
        <Search size={16} color={T.textTer} />
        <Text style={{ color: T.textTer, fontSize: 15, flex: 1 }}>Search restaurants or food...</Text>
      </Pressable>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: itemCount > 0 ? 96 : 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={T.action} />}
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

        <SectionHeader title="Featured" onSeeAll={() => router.push('/(customer)/(home)/restaurant-list')} />
        {loadingFeatured
          ? [0, 1, 2].map((i) => <SkeletonCard key={i} />)
          : featured?.map((r: Restaurant) => <RestaurantCard key={r.id} restaurant={r} />)}

        <SectionHeader title="Popular near you" onSeeAll={() => router.push({ pathname: '/(customer)/(home)/restaurant-list', params: { sort: 'popular' } })} />
        {loadingPopular ? (
          <View style={{ height: 180 }} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 4 }}>
            {(popular ?? []).map((r: Restaurant) => <RestaurantCard key={r.id} restaurant={r} wide />)}
          </ScrollView>
        )}
      </ScrollView>

      {/* Floating cart pill */}
      {itemCount > 0 && (
        <Pressable
          onPress={() => router.push('/(modals)/cart')}
          style={{ position: 'absolute', bottom: 24, left: 16, right: 16, backgroundColor: T.action, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, width: 28, height: 28, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#FFF', fontWeight: '800', fontSize: 13 }}>{itemCount}</Text>
          </View>
          <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 15 }}>View cart</Text>
          <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 14 }}>{formatPrice(cartTotal)}</Text>
        </Pressable>
      )}
    </ScreenWrapper>
  );
}
