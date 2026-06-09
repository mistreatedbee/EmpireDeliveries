import React, { useState, useDeferredValue } from 'react';
import { View, Text, TextInput, FlatList, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { RestaurantCard } from '@/components/home/RestaurantCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { useSearch } from '@/hooks/useSearch';
import { Colors } from '@/constants/colors';

const FILTERS = ['All', 'Fast Food', 'Pizza', 'Sushi', 'Burgers', 'Chicken'];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const deferredQuery = useDeferredValue(query);

  const { data, isLoading } = useSearch(deferredQuery);

  return (
    <ScreenWrapper bg="surface">
      {/* Search bar */}
      <View style={{ backgroundColor: Colors.empire.black, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Pressable onPress={() => router.back()}>
            <Text style={{ color: Colors.gold[500], fontSize: 16 }}>←</Text>
          </Pressable>
          <TextInput
            autoFocus
            value={query}
            onChangeText={setQuery}
            placeholder="Search restaurants or dishes..."
            placeholderTextColor="#666"
            style={{ flex: 1, backgroundColor: Colors.empire.charcoal, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, color: '#FFF', fontSize: 15 }}
          />
        </View>

        {/* Filter pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingTop: 12 }}>
          {FILTERS.map((f) => (
            <Pressable
              key={f}
              onPress={() => setActiveFilter(f)}
              style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: activeFilter === f ? Colors.gold[500] : Colors.empire.charcoal }}
            >
              <Text style={{ color: activeFilter === f ? Colors.empire.black : '#FFF', fontWeight: '600', fontSize: 13 }}>{f}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        {query.length < 2 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🔍</Text>
            <Text style={{ color: '#888', fontSize: 16, textAlign: 'center' }}>Search for your favourite food or restaurant</Text>
          </View>
        ) : isLoading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={Colors.gold[500]} />
          </View>
        ) : !data || (data.restaurants.length === 0 && data.menuItems.length === 0) ? (
          <EmptyState title="No results found" subtitle={`No matches for "${query}"`} />
        ) : (
          <FlatList
            data={data.restaurants}
            keyExtractor={(r) => r.id}
            renderItem={({ item }) => <RestaurantCard restaurant={item} />}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              data.restaurants.length > 0 ? (
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#0A0A0A', marginTop: 16, marginBottom: 8 }}>
                  {data.restaurants.length} restaurants
                </Text>
              ) : null
            }
            contentContainerStyle={{ paddingBottom: 32 }}
          />
        )}
      </View>
    </ScreenWrapper>
  );
}
