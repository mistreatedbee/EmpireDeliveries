import { useQuery } from '@tanstack/react-query';
import { restaurantService } from '@/services/restaurant.service';
import { queryKeys } from '@/constants/queryKeys';
import { SearchFilters } from '@/types/restaurant.types';

export function useSearch(query: string, filters?: SearchFilters) {
  return useQuery({
    queryKey: queryKeys.search(query, filters),
    queryFn: () => restaurantService.search(query, filters),
    enabled: query.trim().length >= 2,
    staleTime: 30 * 1000,
  });
}
