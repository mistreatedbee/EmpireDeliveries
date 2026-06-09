import { useQuery } from '@tanstack/react-query';
import { restaurantService } from '@/services/restaurant.service';
import { queryKeys } from '@/constants/queryKeys';
import { RestaurantFilters } from '@/types/restaurant.types';

export function useRestaurants(filters?: RestaurantFilters) {
  return useQuery({
    queryKey: queryKeys.restaurants.list(filters),
    queryFn: () => restaurantService.getList(filters),
  });
}

export function useFeaturedRestaurants() {
  return useQuery({
    queryKey: queryKeys.restaurants.featured,
    queryFn: restaurantService.getFeatured,
  });
}

export function usePopularRestaurants() {
  return useQuery({
    queryKey: queryKeys.restaurants.popular,
    queryFn: restaurantService.getPopular,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: restaurantService.getCategories,
    staleTime: 60 * 60 * 1000,
  });
}
