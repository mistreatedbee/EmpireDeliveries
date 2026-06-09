import { RestaurantFilters, SearchFilters } from '@/types/restaurant.types';

export const queryKeys = {
  restaurants: {
    all: ['restaurants'] as const,
    list: (filters?: RestaurantFilters) => ['restaurants', 'list', filters ?? {}] as const,
    featured: ['restaurants', 'featured'] as const,
    popular: ['restaurants', 'popular'] as const,
    detail: (id: string) => ['restaurants', 'detail', id] as const,
    menu: (id: string) => ['restaurants', 'menu', id] as const,
    reviews: (id: string, page?: number) => ['restaurants', 'reviews', id, page ?? 1] as const,
  },
  orders: {
    all: ['orders'] as const,
    list: (status?: string) => ['orders', 'list', status ?? 'all'] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
    tracking: (id: string) => ['orders', 'tracking', id] as const,
  },
  user: {
    profile: ['user', 'profile'] as const,
    addresses: ['user', 'addresses'] as const,
    paymentMethods: ['user', 'payment-methods'] as const,
    wallet: ['user', 'wallet'] as const,
    notifications: (page?: number) => ['user', 'notifications', page ?? 1] as const,
    loyaltyPoints: ['user', 'loyalty'] as const,
  },
  search: (query: string, filters?: SearchFilters) =>
    ['search', query, filters ?? {}] as const,
  categories: ['categories'] as const,
  coupon: (code: string) => ['coupon', code] as const,
  banners: ['banners'] as const,
};
