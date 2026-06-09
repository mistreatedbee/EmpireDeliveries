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

export const restaurantService = {
  async getList(filters?: RestaurantFilters): Promise<PaginatedResponse<Restaurant>> {
    return api.get('/restaurants', { params: filters });
  },

  async getFeatured(): Promise<Restaurant[]> {
    const res = await api.get<never, ApiResponse<Restaurant[]>>('/restaurants/featured');
    return res.data;
  },

  async getPopular(): Promise<Restaurant[]> {
    const res = await api.get<never, ApiResponse<Restaurant[]>>('/restaurants/popular');
    return res.data;
  },

  async getById(id: string): Promise<Restaurant> {
    const res = await api.get<never, ApiResponse<Restaurant>>(`/restaurants/${id}`);
    return res.data;
  },

  async getMenu(restaurantId: string): Promise<MenuCategory[]> {
    const res = await api.get<never, ApiResponse<MenuCategory[]>>(`/restaurants/${restaurantId}/menu`);
    return res.data;
  },

  async getMenuItem(restaurantId: string, itemId: string): Promise<MenuItem> {
    const res = await api.get<never, ApiResponse<MenuItem>>(`/restaurants/${restaurantId}/menu/${itemId}`);
    return res.data;
  },

  async getReviews(restaurantId: string, page = 1): Promise<PaginatedResponse<Review>> {
    return api.get(`/restaurants/${restaurantId}/reviews`, { params: { page } });
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
    return res.data;
  },
};
