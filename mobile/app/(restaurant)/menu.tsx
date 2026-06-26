import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Switch, Alert } from 'react-native';
import { router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react-native';
import { restaurantManagementService, RestaurantMenuItem } from '@/services/restaurant-management.service';
import { Colors } from '@/constants/colors';

export default function RestaurantMenu() {
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['restaurant', 'menu'],
    queryFn: restaurantManagementService.getMenu,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      restaurantManagementService.updateItem(id, { isAvailable }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['restaurant', 'menu'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: restaurantManagementService.deleteItem,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['restaurant', 'menu'] }),
  });

  const handleDelete = (item: RestaurantMenuItem) => {
    Alert.alert('Remove Item', `Mark "${item.name}" as unavailable?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => deleteMutation.mutate(item.id) },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.surface[100] }}>
      <View style={{ backgroundColor: Colors.empire.black, paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900' }}>Menu</Text>
        <Pressable
          onPress={() => router.push('/(restaurant)/add-item')}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.gold[500], paddingVertical: 8, paddingHorizontal: 14, borderRadius: 14 }}
        >
          <Plus size={16} color={Colors.empire.black} />
          <Text style={{ color: Colors.empire.black, fontWeight: '800', fontSize: 13 }}>Add Item</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <ActivityIndicator color={Colors.gold[500]} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          {(categories ?? []).map((cat) => (
            <View key={cat.id} style={{ marginBottom: 20 }}>
              <Text style={{ fontWeight: '800', fontSize: 16, color: Colors.empire.black, marginBottom: 10 }}>{cat.name}</Text>
              {cat.items.length === 0 && (
                <Text style={{ color: '#bbb', fontSize: 13 }}>No items in this category</Text>
              )}
              {cat.items.map((item) => (
                <View key={item.id} style={{ backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.surface[200], opacity: item.isAvailable ? 1 : 0.55 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '700', color: Colors.empire.black, fontSize: 14 }}>{item.name}</Text>
                    {item.description && (
                      <Text style={{ color: '#888', fontSize: 12, marginTop: 2 }} numberOfLines={1}>{item.description}</Text>
                    )}
                    <Text style={{ fontWeight: '800', color: Colors.gold[500], fontSize: 14, marginTop: 4 }}>R{item.price.toFixed(2)}</Text>
                  </View>
                  <Switch
                    value={item.isAvailable}
                    onValueChange={(v) => toggleMutation.mutate({ id: item.id, isAvailable: v })}
                    trackColor={{ false: Colors.surface[300], true: Colors.empire.success + '88' }}
                    thumbColor={item.isAvailable ? Colors.empire.success : '#aaa'}
                    style={{ marginRight: 8 }}
                  />
                  <Pressable
                    onPress={() => router.push({ pathname: '/(restaurant)/edit-item', params: { itemId: item.id, categoryId: item.categoryId, name: item.name, description: item.description ?? '', price: String(item.price), imageUrl: item.image ?? '' } })}
                    style={{ width: 34, height: 34, backgroundColor: Colors.surface[100], borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 6 }}
                  >
                    <Pencil size={15} color={Colors.empire.black} />
                  </Pressable>
                  <Pressable
                    onPress={() => handleDelete(item)}
                    style={{ width: 34, height: 34, backgroundColor: '#FFEBEE', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Trash2 size={15} color={Colors.empire.error} />
                  </Pressable>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
