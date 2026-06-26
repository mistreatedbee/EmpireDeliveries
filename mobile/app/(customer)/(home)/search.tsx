import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, SearchIcon } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { RestaurantCard } from '@/components/home/RestaurantCard';
import {
  Input,
  SkeletonList,
  SkeletonCard,
  EmptyState,
} from '@/components/empire';
import { restaurantService } from '@/services/restaurant.service';
import { queryKeys } from '@/constants/queryKeys';
import { T } from '@/constants/colors';
import { MenuItem, RestaurantCategory } from '@/types/restaurant.types';

const CATEGORY_FILTERS: Array<{ label: string; value: string }> = [
  { label: 'All', value: 'all' },
  { label: 'Fast Food', value: 'fast-food' },
  { label: 'Pizza', value: 'pizza' },
  { label: 'Sushi', value: 'sushi' },
  { label: 'Burgers', value: 'burgers' },
  { label: 'Chicken', value: 'chicken' },
  { label: 'Breakfast', value: 'breakfast' },
  { label: 'Indian', value: 'indian' },
];

const TRENDING = ['Pizza', 'Burger King', 'KFC', 'Sushi', 'Nandos', 'McDonald\'s'];

export default function SearchScreen() {
  const [inputValue, setInputValue] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChangeText = useCallback((text: string) => {
    setInputValue(text);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(text.trim());
    }, 300);
  }, []);

  const categoryFilter =
    activeFilter !== 'all' ? activeFilter as RestaurantCategory : undefined;

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.search(
      debouncedQuery,
      categoryFilter ? { category: categoryFilter } : undefined,
    ),
    queryFn: () =>
      restaurantService.search(
        debouncedQuery,
        categoryFilter ? { category: categoryFilter } : undefined,
      ),
    enabled: debouncedQuery.length >= 2,
    staleTime: 30_000,
  });

  const hasResults =
    data &&
    (data.restaurants.length > 0 || data.menuItems.length > 0);

  return (
    <ScreenWrapper bg="white" edges={['top', 'left', 'right']}>
      {/* Search bar */}
      <View
        style={{
          backgroundColor: T.bg,
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 8,
          borderBottomWidth: 1,
          borderBottomColor: T.border,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
          <ArrowLeft size={22} color={T.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Input
            variant="search"
            autoFocus
            value={inputValue}
            onChangeText={handleChangeText}
            placeholder="Search restaurants or dishes..."
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Category filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 8,
          paddingHorizontal: 16,
          paddingVertical: 10,
        }}
        style={{ flexGrow: 0, borderBottomWidth: 1, borderBottomColor: T.border }}
      >
        {CATEGORY_FILTERS.map((f) => {
          const active = activeFilter === f.value;
          return (
            <Pressable
              key={f.value}
              onPress={() => setActiveFilter(f.value)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 20,
                backgroundColor: active ? T.action : T.surface,
                borderWidth: 1,
                borderColor: active ? T.action : T.border,
              }}
            >
              <Text
                style={{
                  color: active ? '#FFFFFF' : T.text,
                  fontWeight: '600',
                  fontSize: 13,
                  fontFamily: 'Inter_700Bold',
                }}
              >
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        {/* Empty query — show trending */}
        {debouncedQuery.length < 2 && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 20, paddingBottom: 32 }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: '800',
                color: T.text,
                marginBottom: 14,
                fontFamily: 'Inter_700Bold',
              }}
            >
              Trending searches
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {TRENDING.map((term) => (
                <Pressable
                  key={term}
                  onPress={() => {
                    setInputValue(term);
                    setDebouncedQuery(term);
                  }}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: T.surface,
                    borderWidth: 1,
                    borderColor: T.border,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <SearchIcon size={13} color={T.textTer} />
                  <Text
                    style={{
                      color: T.textSec,
                      fontSize: 13,
                      fontFamily: 'Inter_400Regular',
                    }}
                  >
                    {term}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        )}

        {/* Loading skeleton */}
        {debouncedQuery.length >= 2 && isLoading && (
          <View style={{ paddingTop: 20, gap: 16 }}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonList rows={4} />
          </View>
        )}

        {/* Error */}
        {debouncedQuery.length >= 2 && isError && (
          <EmptyState
            icon={<SearchIcon size={32} color={T.textTer} />}
            title="Search failed"
            description="Could not load results. Please try again."
          />
        )}

        {/* No results */}
        {debouncedQuery.length >= 2 && !isLoading && !isError && !hasResults && (
          <EmptyState
            icon={<SearchIcon size={32} color={T.textTer} />}
            title="No results found"
            description={`No restaurants or dishes found for "${debouncedQuery}"`}
          />
        )}

        {/* Results */}
        {debouncedQuery.length >= 2 && !isLoading && hasResults && (
          <FlatList
            data={data.restaurants}
            keyExtractor={(r) => r.id}
            renderItem={({ item }) => <RestaurantCard restaurant={item} />}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              data.restaurants.length > 0 ? (
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '700',
                    color: T.text,
                    marginTop: 16,
                    marginBottom: 8,
                    fontFamily: 'Inter_700Bold',
                  }}
                >
                  {data.restaurants.length} restaurant
                  {data.restaurants.length !== 1 ? 's' : ''}
                </Text>
              ) : null
            }
            ListFooterComponent={
              data.menuItems.length > 0 ? (
                <View style={{ marginBottom: 32 }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '700',
                      color: T.text,
                      marginTop: 16,
                      marginBottom: 8,
                      fontFamily: 'Inter_700Bold',
                    }}
                  >
                    {data.menuItems.length} menu item
                    {data.menuItems.length !== 1 ? 's' : ''}
                  </Text>
                  {data.menuItems.map((item: MenuItem) => (
                    <Pressable
                      key={item.id}
                      onPress={() =>
                        router.push(
                          `/(customer)/(home)/restaurant/${item.restaurantId}`,
                        )
                      }
                      style={{
                        backgroundColor: T.bg,
                        borderRadius: 12,
                        padding: 14,
                        marginBottom: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                        borderWidth: 1,
                        borderColor: T.border,
                      }}
                    >
                      {item.image ? (
                        <Image
                          source={{ uri: item.image }}
                          style={{
                            width: 56,
                            height: 56,
                            borderRadius: 10,
                            backgroundColor: T.surface,
                          }}
                        />
                      ) : (
                        <View
                          style={{
                            width: 56,
                            height: 56,
                            borderRadius: 10,
                            backgroundColor: T.surface,
                          }}
                        />
                      )}
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontWeight: '700',
                            fontSize: 14,
                            color: T.text,
                            fontFamily: 'Inter_700Bold',
                          }}
                          numberOfLines={1}
                        >
                          {item.name}
                        </Text>
                        {item.description ? (
                          <Text
                            style={{
                              color: T.textSec,
                              fontSize: 13,
                              marginTop: 2,
                              fontFamily: 'Inter_400Regular',
                            }}
                            numberOfLines={1}
                          >
                            {item.description}
                          </Text>
                        ) : null}
                        <Text
                          style={{
                            fontWeight: '800',
                            fontSize: 14,
                            color: T.gold,
                            marginTop: 3,
                            fontFamily: 'Inter_700Bold',
                          }}
                        >
                          R{item.price.toFixed(2)}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              ) : null
            }
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        )}
      </View>
    </ScreenWrapper>
  );
}
