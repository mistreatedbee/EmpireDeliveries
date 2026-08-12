import React from 'react';
import { ScrollView, Pressable, Text } from 'react-native';
import { router } from 'expo-router';
import { Category } from '@/types/restaurant.types';

interface CategoryRowProps {
  categories: Category[];
  activeCategory?: string;
  onSelect?: (slug: string) => void;
}

export function CategoryRow({ categories, activeCategory, onSelect }: CategoryRowProps) {
  const openCategory = (slug: string) => {
    onSelect?.(slug);
    if (slug) {
      router.push({ pathname: '/(customer)/(home)/restaurant-list', params: { category: slug } });
    } else {
      router.push('/(customer)/(home)/restaurant-list');
    }
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16, gap: 10 }}>
      <Pressable
        onPress={() => openCategory('')}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20,
          backgroundColor: !activeCategory ? '#0A0A0A' : '#F0F0F0',
        }}
      >
        <Text style={{ color: !activeCategory ? '#FFFFFF' : '#0A0A0A', fontWeight: '600', fontSize: 14 }}>All</Text>
      </Pressable>
      {categories.map((cat) => (
        <Pressable
          key={cat.id}
          onPress={() => openCategory(cat.slug)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: activeCategory === cat.slug ? '#0A0A0A' : '#F0F0F0',
            gap: 6,
          }}
        >
          <Text style={{ fontSize: 16 }}>{cat.icon}</Text>
          <Text style={{ color: activeCategory === cat.slug ? '#FFFFFF' : '#0A0A0A', fontWeight: '600', fontSize: 14 }}>
            {cat.name}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
