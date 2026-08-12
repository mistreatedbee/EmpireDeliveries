import api from './api';
import {
  Restaurant,
  MenuCategory,
  MenuItem,
  Review,
  Category,
  RestaurantFilters,
} from '@/types/restaurant.types';
import { ApiResponse, PaginatedResponse } from '@/types/api.types';
import { normalizeRestaurant, normalizeRestaurantList } from '@/utils/normalizeRestaurant';

function normalizeMenuCategory(raw: MenuCategory, restaurantId: string): MenuCategory {
  return {
    ...raw,
    restaurantId,
    items: (raw.items ?? []).map((item) => ({
      ...item,
      restaurantId,
      categoryId: raw.id,
    })),
  };
}

function normalizeReview(raw: Record<string, unknown>): Review {
  const user = raw.user as { firstName?: string; lastName?: string } | undefined;
  const firstName = String(raw.firstName ?? raw.first_name ?? user?.firstName ?? '');
  const lastName = String(raw.lastName ?? raw.last_name ?? user?.lastName ?? '');
  const fullName = `${firstName} ${lastName}`.trim();
  const userName = String(raw.userName ?? (fullName || 'Customer'));

  return {
    id: String(raw.id ?? ''),
    userId: String(raw.userId ?? raw.user_id ?? ''),
    restaurantId: String(raw.restaurantId ?? raw.restaurant_id ?? ''),
    orderId: String(raw.orderId ?? raw.order_id ?? ''),
    rating: Number(raw.rating ?? 0),
    comment: String(raw.comment ?? raw.review ?? ''),
    userAvatar: raw.userAvatar != null ? String(raw.userAvatar) : undefined,
    userName,
    createdAt: String(raw.createdAt ?? raw.created_at ?? new Date().toISOString()),
  };
}

export const restaurantService = {
  async getList(filters?: RestaurantFilters): Promise<PaginatedResponse<Restaurant>> {
    const res = await api.get<never, ApiResponse<{ data: Restaurant[]; total: number } | Restaurant[]>>('/restaurants', { params: filters });
    const payload = res.data;
    const rows = Array.isArray(payload) ? payload : payload?.data ?? [];
    const restaurants = normalizeRestaurantList(rows);
    const total = Array.isArray(payload) ? restaurants.length : (payload?.total ?? restaurants.length);
    return {
      success: res.success,
      data: restaurants,
      pagination: {
        page: filters?.page ?? 1,
        limit: filters?.limit ?? restaurants.length,
        total,
        totalPages: Math.max(1, Math.ceil(total / (filters?.limit ?? Math.max(total, 1)))),
      },
    };
  },

  async getFeatured(): Promise<Restaurant[]> {
    const res = await api.get<never, ApiResponse<Restaurant[]>>('/restaurants/featured');
    return normalizeRestaurantList(res.data);
  },

  async getPopular(): Promise<Restaurant[]> {
    const res = await api.get<never, ApiResponse<Restaurant[]>>('/restaurants/popular');
    return normalizeRestaurantList(res.data);
  },

  async getById(id: string): Promise<Restaurant> {
    const res = await api.get<never, ApiResponse<Restaurant>>(`/restaurants/${encodeURIComponent(id)}`);
    return normalizeRestaurant(res.data as unknown as Record<string, unknown>);
  },

  async getMenu(restaurantId: string): Promise<MenuCategory[]> {
    const res = await api.get<never, ApiResponse<MenuCategory[]>>(`/restaurants/${encodeURIComponent(restaurantId)}/menu`);
    return (res.data ?? []).map((cat) => normalizeMenuCategory(cat, restaurantId));
  },

  async getMenuItem(restaurantId: string, itemId: string): Promise<MenuItem> {
    const res = await api.get<never, ApiResponse<MenuItem>>(
      `/restaurants/${encodeURIComponent(restaurantId)}/menu/${encodeURIComponent(itemId)}`,
    );
    return { ...res.data, restaurantId };
  },

  async getReviews(restaurantId: string, page = 1): Promise<Review[]> {
    const res = await api.get<
      never,
      ApiResponse<{ data: Record<string, unknown>[]; total: number; page: number; limit: number } | Record<string, unknown>[]>
    >(`/restaurants/${encodeURIComponent(restaurantId)}/reviews`, { params: { page } });

    const payload = res.data;
    const rows = Array.isArray(payload) ? payload : (payload?.data ?? []);
    return rows.map((row) => normalizeReview(row as Record<string, unknown>));
  },

  async toggleFavourite(restaurantId: string): Promise<{ isFavourited: boolean }> {
    const res = await api.post<never, ApiResponse<{ isFavourited: boolean }>>(`/restaurants/${restaurantId}/favourite`);
    return res.data;
  },

  async getCategories(): Promise<Category[]> {
    const res = await api.get<never, ApiResponse<Category[]>>('/categories');
    return res.data;
  },

  async search(query: string, filters?: object): Promise<{ restaurants: Restaurant[]; menuItems: MenuItem[] }> {
    const res = await api.get<never, ApiResponse<{ restaurants: Restaurant[]; menuItems: MenuItem[] }>>('/restaurants/search', {
      params: { q: query, ...filters },
    });
    return {
      restaurants: normalizeRestaurantList(res.data?.restaurants),
      menuItems: res.data?.menuItems ?? [],
    };
  },
};
