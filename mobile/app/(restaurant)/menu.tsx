import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Switch, Alert, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, Check, X, FolderPlus } from 'lucide-react-native';
import { restaurantManagementService, RestaurantMenuItem, RestaurantMenuCategory } from '@/services/restaurant-management.service';
import { Colors } from '@/constants/colors';

export default function RestaurantMenu() {
  const queryClient = useQueryClient();
  const categories = useQuery({
    queryKey: ['restaurant', 'menu'],
    queryFn: restaurantManagementService.getMenu,
  });

  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  const invalidateMenu = () => void queryClient.invalidateQueries({ queryKey: ['restaurant', 'menu'] });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      restaurantManagementService.updateItem(id, { isAvailable }),
    onSuccess: invalidateMenu,
  });

  const deleteMutation = useMutation({
    mutationFn: restaurantManagementService.deleteItem,
    onSuccess: invalidateMenu,
  });

  const addCategoryMutation = useMutation({
    mutationFn: (name: string) => restaurantManagementService.addCategory(name),
    onSuccess: () => {
      invalidateMenu();
      setAddingCategory(false);
      setNewCategoryName('');
    },
    onError: () => Alert.alert('Error', 'Could not add category. Please try again.'),
  });

  const renameCategoryMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => restaurantManagementService.renameCategory(id, name),
    onSuccess: () => {
      invalidateMenu();
      setEditingCategoryId(null);
    },
    onError: () => Alert.alert('Error', 'Could not rename category. Please try again.'),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: restaurantManagementService.deleteCategory,
    onSuccess: invalidateMenu,
    onError: (err: any) => Alert.alert('Error', err?.message ?? 'Could not delete category.'),
  });

  const reorderMutation = useMutation({
    mutationFn: restaurantManagementService.reorderCategories,
    onSuccess: invalidateMenu,
  });

  const handleDelete = (item: RestaurantMenuItem) => {
    Alert.alert('Remove Item', `Mark "${item.name}" as unavailable?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => deleteMutation.mutate(item.id) },
    ]);
  };

  const handleDeleteCategory = (cat: RestaurantMenuCategory) => {
    if (cat.items.length > 0) {
      Alert.alert('Category Not Empty', 'Move or delete all items in this category before removing it.');
      return;
    }
    Alert.alert('Delete Category', `Delete "${cat.name}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteCategoryMutation.mutate(cat.id) },
    ]);
  };

  const moveCategory = (index: number, direction: -1 | 1) => {
    const list = categories.data ?? [];
    const target = index + direction;
    if (target < 0 || target >= list.length) return;
    const ids = list.map((c) => c.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    reorderMutation.mutate(ids);
  };

  const startEditCategory = (cat: RestaurantMenuCategory) => {
    setEditingCategoryId(cat.id);
    setEditCategoryName(cat.name);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.surface[100] }}>
      <View style={{ backgroundColor: Colors.empire.black, paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900' }}>Menu</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable
            onPress={() => setAddingCategory(true)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.empire.charcoal, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 14, borderWidth: 1, borderColor: '#333' }}
          >
            <FolderPlus size={16} color={Colors.gold[500]} />
          </Pressable>
          <Pressable
            onPress={() => router.push('/(restaurant)/add-item')}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.gold[500], paddingVertical: 8, paddingHorizontal: 14, borderRadius: 14 }}
          >
            <Plus size={16} color={Colors.empire.black} />
            <Text style={{ color: Colors.empire.black, fontWeight: '800', fontSize: 13 }}>Add Item</Text>
          </Pressable>
        </View>
      </View>

      {categories.isLoading ? (
        <ActivityIndicator color={Colors.gold[500]} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          {addingCategory && (
            <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 12, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: Colors.gold[500] }}>
              <TextInput
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                placeholder="New category name"
                autoFocus
                style={{ flex: 1, fontSize: 14, color: Colors.empire.black, paddingVertical: 6 }}
              />
              <Pressable
                onPress={() => newCategoryName.trim() && addCategoryMutation.mutate(newCategoryName.trim())}
                disabled={addCategoryMutation.isPending}
                style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.empire.success + '22', alignItems: 'center', justifyContent: 'center' }}
              >
                {addCategoryMutation.isPending
                  ? <ActivityIndicator size="small" color={Colors.empire.success} />
                  : <Check size={16} color={Colors.empire.success} />}
              </Pressable>
              <Pressable
                onPress={() => { setAddingCategory(false); setNewCategoryName(''); }}
                style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.surface[100], alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={16} color="#888" />
              </Pressable>
            </View>
          )}

          {(categories.data ?? []).map((cat, index) => (
            <View key={cat.id} style={{ marginBottom: 20 }}>
              {editingCategoryId === cat.id ? (
                <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 10, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: Colors.gold[500] }}>
                  <TextInput
                    value={editCategoryName}
                    onChangeText={setEditCategoryName}
                    autoFocus
                    style={{ flex: 1, fontSize: 14, color: Colors.empire.black, paddingVertical: 4 }}
                  />
                  <Pressable
                    onPress={() => editCategoryName.trim() && renameCategoryMutation.mutate({ id: cat.id, name: editCategoryName.trim() })}
                    disabled={renameCategoryMutation.isPending}
                    style={{ width: 30, height: 30, borderRadius: 9, backgroundColor: Colors.empire.success + '22', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Check size={14} color={Colors.empire.success} />
                  </Pressable>
                  <Pressable
                    onPress={() => setEditingCategoryId(null)}
                    style={{ width: 30, height: 30, borderRadius: 9, backgroundColor: Colors.surface[100], alignItems: 'center', justifyContent: 'center' }}
                  >
                    <X size={14} color="#888" />
                  </Pressable>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ fontWeight: '800', fontSize: 16, color: Colors.empire.black, flex: 1 }}>{cat.name}</Text>
                  <Pressable onPress={() => moveCategory(index, -1)} disabled={index === 0} style={{ padding: 4, opacity: index === 0 ? 0.3 : 1 }}>
                    <ChevronUp size={18} color={Colors.empire.black} />
                  </Pressable>
                  <Pressable onPress={() => moveCategory(index, 1)} disabled={index === (categories.data?.length ?? 0) - 1} style={{ padding: 4, opacity: index === (categories.data?.length ?? 0) - 1 ? 0.3 : 1, marginRight: 4 }}>
                    <ChevronDown size={18} color={Colors.empire.black} />
                  </Pressable>
                  <Pressable onPress={() => startEditCategory(cat)} style={{ padding: 4, marginRight: 2 }}>
                    <Pencil size={15} color="#888" />
                  </Pressable>
                  <Pressable onPress={() => handleDeleteCategory(cat)} style={{ padding: 4 }}>
                    <Trash2 size={15} color={Colors.empire.error} />
                  </Pressable>
                </View>
              )}

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
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <Text style={{ fontWeight: '800', color: Colors.gold[500], fontSize: 14 }}>R{item.price.toFixed(2)}</Text>
                      {item.addonGroups.length > 0 && (
                        <Text style={{ color: '#aaa', fontSize: 11, fontWeight: '600' }}>
                          · {item.addonGroups.length} addon {item.addonGroups.length === 1 ? 'group' : 'groups'}
                        </Text>
                      )}
                    </View>
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
