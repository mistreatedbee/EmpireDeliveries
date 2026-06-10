import React, { useState } from 'react';
import { ScrollView, View, Text, Image, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Check } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCartStore } from '@/stores/cartStore';
import { useUIStore } from '@/stores/uiStore';
import { restaurantService } from '@/services/restaurant.service';
import { queryKeys } from '@/constants/queryKeys';
import { Addon } from '@/types/restaurant.types';
import { T } from '@/constants/colors';
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
      <ScreenWrapper bg="white">
        <View style={{ padding: 20 }}>
          <Skeleton height={280} borderRadius={12} style={{ marginBottom: 16 }} />
          <Skeleton height={28} width="70%" style={{ marginBottom: 12 }} />
          <Skeleton height={16} style={{ marginBottom: 8 }} />
          <Skeleton height={16} width="80%" />
        </View>
      </ScreenWrapper>
    );
  }

  if (!item) return null;

  return (
    <ScreenWrapper bg="white" edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image */}
        <View style={{ position: 'relative' }}>
          <Image source={{ uri: item.image }} style={{ width: '100%', height: 280, backgroundColor: T.surface }} resizeMode="cover" />
          <Pressable
            onPress={() => router.back()}
            style={{ position: 'absolute', top: 52, left: 16, backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: T.border }}
          >
            <Text style={{ color: T.text, fontSize: 18 }}>←</Text>
          </Pressable>
        </View>

        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <Text style={{ fontSize: 24, fontWeight: '900', color: T.text, flex: 1, marginRight: 12 }}>{item.name}</Text>
            <Text style={{ fontSize: 22, fontWeight: '900', color: T.text }}>{formatPrice(item.price)}</Text>
          </View>
          <Text style={{ fontSize: 15, color: T.textSec, lineHeight: 22, marginBottom: 24 }}>{item.description}</Text>

          {/* Addons */}
          {item.addonGroups?.map((group: import('@/types/restaurant.types').AddonGroup) => (
            <View key={group.id} style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: T.text, flex: 1 }}>{group.name}</Text>
                {group.minSelections > 0 && <Text style={{ fontSize: 12, color: T.danger, fontWeight: '600' }}>Required</Text>}
              </View>
              {group.addons.map((addon: import('@/types/restaurant.types').Addon) => {
                const selected = selectedAddons.some((a) => a.id === addon.id);
                return (
                  <Pressable
                    key={addon.id}
                    onPress={() => toggleAddon(addon)}
                    style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: T.border }}
                  >
                    <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: selected ? T.action : T.border, backgroundColor: selected ? T.action : 'transparent', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                      {selected && <Check size={12} color="#FFF" strokeWidth={3} />}
                    </View>
                    <Text style={{ flex: 1, fontSize: 15, color: T.text }}>{addon.name}</Text>
                    {addon.price > 0 && <Text style={{ fontSize: 14, color: T.textSec, fontWeight: '600' }}>+{formatPrice(addon.price)}</Text>}
                  </Pressable>
                );
              })}
            </View>
          ))}

          {/* Quantity */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24, marginVertical: 20, backgroundColor: T.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: T.border }}>
            <Pressable
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: T.surface2, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: T.border }}
            >
              <Text style={{ color: T.text, fontSize: 22, lineHeight: 26 }}>−</Text>
            </Pressable>
            <Text style={{ fontSize: 22, fontWeight: '900', color: T.text, minWidth: 32, textAlign: 'center' }}>{quantity}</Text>
            <Pressable
              onPress={() => setQuantity((q) => q + 1)}
              style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: T.action, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ color: '#FFF', fontSize: 22, lineHeight: 26 }}>+</Text>
            </Pressable>
          </View>

          <View style={{ height: 80 }} />
        </View>
      </ScrollView>

      {/* Add to cart */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: T.bg, padding: 20, borderTopWidth: 1, borderTopColor: T.border }}>
        <Button size="lg" onPress={handleAddToCart}>
          Add to Cart — {formatPrice(total)}
        </Button>
      </View>
    </ScreenWrapper>
  );
}
