export type RestaurantStatus = 'open' | 'closed' | 'busy';
export type RestaurantCategory =
  | 'fast-food'
  | 'pizza'
  | 'burgers'
  | 'chicken'
  | 'groceries'
  | 'pharmacy'
  | 'courier'
  | 'sushi'
  | 'chinese'
  | 'indian'
  | 'halaal'
  | 'breakfast';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  address: string;
  coordinates: Coordinates;
  rating: number;
  reviewCount: number;
  deliveryFee: number;
  deliveryTime: number;
  minOrder: number;
  status: RestaurantStatus;
  categories: RestaurantCategory[];
  isOpen: boolean;
  isFeatured: boolean;
  isFavourited?: boolean;
  distance?: number;
  promoText?: string;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  isRequired?: boolean;
}

export interface AddonGroup {
  id: string;
  name: string;
  minSelections: number;
  maxSelections: number;
  addons: Addon[];
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isAvailable: boolean;
  isPopular: boolean;
  isVegetarian?: boolean;
  isHalaal?: boolean;
  calories?: number;
  addonGroups?: AddonGroup[];
}

export interface MenuCategory {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  sortOrder: number;
  items: MenuItem[];
}

export interface Review {
  id: string;
  userId: string;
  restaurantId: string;
  orderId: string;
  rating: number;
  comment: string;
  userAvatar?: string;
  userName: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: RestaurantCategory;
  icon: string;
  color: string;
}

export interface RestaurantFilters {
  category?: RestaurantCategory;
  latitude?: number;
  longitude?: number;
  maxDeliveryFee?: number;
  minRating?: number;
  maxDeliveryTime?: number;
  sortBy?: 'rating' | 'delivery_time' | 'delivery_fee' | 'distance';
  page?: number;
  limit?: number;
  featured?: boolean;
  popular?: boolean;
}

export interface SearchFilters {
  category?: RestaurantCategory;
  sortBy?: string;
  maxDeliveryFee?: number;
  minRating?: number;
}
