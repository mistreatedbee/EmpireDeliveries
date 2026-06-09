import React, { useState } from 'react';
import { ScrollView, View, Text, Image, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCartStore } from '@/stores/cartStore';
import { useUIStore } from '@/stores/uiStore';
import { restaurantService } from '@/services/restaurant.service';
import { queryKeys } from '@/constants/queryKeys';
import { Addon } from '@/types/restaurant.types';
import { Colors } from '@/constants/colors';
import { formatPrice } from '@/utils/formatters';

export default function FoodDetailScreen() {
  const { id, restaurantId } = useLocalSearchParams<{ id: string; restaurantId: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [instructions, setInstructions] = useState('');

  const { data: item, isLoading } = useQuery({
    queryKey: [...queryKeys.restaurants.menu(restaurantId), id],
    queryFn: () => restaurantService.getMenuItem(restaurantId, id),
    enabled: !!id && !!restaurantId,
  });

  const { addItem, restaurantId: cartRestaurantId, clearForNewRestaurant } = useCartStore();
  const { showToast } = useUIStore();

  const toggleAddon = (addon: Addon) => {
    setSelectedAddons((prev) =>
      prev.find((a) => a.id === addon.id) ? prev.filter((a) => a.id !== addon.id) : [...prev, addon],
    );
  };

  const addonTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const total = item ? (item.price + addonTotal) * quantity : 0;

  const handleAddToCart = () => {
    if (!item) return;
    if (cartRestaurantId && cartRestaurantId !== restaurantId) {
      clearForNewRestaurant(restaurantId, item.restaurantId);
    }
    addItem(item, selectedAddons, quantity, instructions || undefined);
    showToast(`${item.name} added to cart`, 'success');
    router.back();
  };

  if (isLoading) {
    return (
      <ScreenWrapper bg="surface">
        <View style={{ padding: 20 }}>
          <Skeleton height={280} borderRadius={20} style={{ marginBottom: 16 }} />
          <Skeleton height={28} width="70%" style={{ marginBottom: 12 }} />
          <Skeleton height={16} style={{ marginBottom: 8 }} />
          <Skeleton height={16} width="80%" />
        </View>
      </ScreenWrapper>
    );
  }

  if (!item) return null;

  return (
    <ScreenWrapper bg="surface" edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image */}
        <View style={{ position: 'relative' }}>
          <Image source={{ uri: item.image }} style={{ width: '100%', height: 280, backgroundColor: '#F0F0F0' }} resizeMode="cover" />
          <Pressable
            onPress={() => router.back()}
            style={{ position: 'absolute', top: 52, left: 16, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: '#FFF', fontSize: 18 }}>←</Text>
          </Pressable>
        </View>

        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <Text style={{ fontSize: 24, fontWeight: '900', color: Colors.empire.black, flex: 1, marginRight: 12 }}>{item.name}</Text>
            <Text style={{ fontSize: 22, fontWeight: '900', color: Colors.empire.black }}>{formatPrice(item.price)}</Text>
          </View>
          <Text style={{ fontSize: 15, color: '#666', lineHeight: 22, marginBottom: 24 }}>{item.description}</Text>

          {/* Addons */}
          {item.addonGroups?.map((group: import('@/types/restaurant.types').AddonGroup) => (
            <View key={group.id} style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: Colors.empire.black, flex: 1 }}>{group.name}</Text>
                {group.minSelections > 0 && <Text style={{ fontSize: 12, color: Colors.empire.error, fontWeight: '600' }}>Required</Text>}
              </View>
              {group.addons.map((addon: import('@/types/restaurant.types').Addon) => {
                const selected = selectedAddons.some((a) => a.id === addon.id);
                return (
                  <Pressable
                    key={addon.id}
                    onPress={() => toggleAddon(addon)}
                    style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}
                  >
                    <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: selected ? Colors.empire.black : '#D0D0D0', backgroundColor: selected ? Colors.empire.black : 'transparent', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                      {selected && <Text style={{ color: Colors.gold[500], fontSize: 14 }}>✓</Text>}
                    </View>
                    <Text style={{ flex: 1, fontSize: 15, color: Colors.empire.black }}>{addon.name}</Text>
                    {addon.price > 0 && <Text style={{ fontSize: 14, color: '#666', fontWeight: '600' }}>+{formatPrice(addon.price)}</Text>}
                  </Pressable>
                );
              })}
            </View>
          ))}

          {/* Quantity */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24, marginVertical: 20, backgroundColor: '#F8F8F8', borderRadius: 16, padding: 12 }}>
            <Pressable
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.empire.black, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ color: '#FFF', fontSize: 22, lineHeight: 26 }}>−</Text>
            </Pressable>
            <Text style={{ fontSize: 22, fontWeight: '900', color: Colors.empire.black, minWidth: 32, textAlign: 'center' }}>{quantity}</Text>
            <Pressable
              onPress={() => setQuantity((q) => q + 1)}
              style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.empire.black, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ color: Colors.gold[500], fontSize: 22, lineHeight: 26 }}>+</Text>
            </Pressable>
          </View>

          <View style={{ height: 80 }} />
        </View>
      </ScrollView>

      {/* Add to cart */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', padding: 20, borderTopWidth: 1, borderTopColor: '#F0F0F0' }}>
        <Button variant="gold" size="lg" onPress={handleAddToCart}>
          Add to Cart — {formatPrice(total)}
        </Button>
      </View>
    </ScreenWrapper>
  );
}
