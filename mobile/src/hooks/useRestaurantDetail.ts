import { useQuery } from '@tanstack/react-query';
import { restaurantService } from '@/services/restaurant.service';
import { queryKeys } from '@/constants/queryKeys';

export function useRestaurantDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.restaurants.detail(id),
    queryFn: () => restaurantService.getById(id),
    enabled: !!id,
  });
}

export function useMenuItems(restaurantId: string) {
  return useQuery({
    queryKey: queryKeys.restaurants.menu(restaurantId),
    queryFn: () => restaurantService.getMenu(restaurantId),
    enabled: !!restaurantId,
  });
}

export function useRestaurantReviews(restaurantId: string, page = 1) {
  return useQuery({
    queryKey: queryKeys.restaurants.reviews(restaurantId, page),
    queryFn: () => restaurantService.getReviews(restaurantId, page),
    enabled: !!restaurantId,
  });
}
