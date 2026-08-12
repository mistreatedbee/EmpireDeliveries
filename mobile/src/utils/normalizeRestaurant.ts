import { Coordinates, Restaurant, RestaurantCategory } from '@/types/restaurant.types';

type RawRestaurant = Record<string, unknown>;

function toNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function toCoordinates(raw: RawRestaurant): Coordinates {
  const lat = raw.latitude ?? raw.lat;
  const lng = raw.longitude ?? raw.lng;
  return {
    latitude: lat != null ? toNumber(lat) : 0,
    longitude: lng != null ? toNumber(lng) : 0,
  };
}

function toCategories(raw: RawRestaurant): RestaurantCategory[] {
  const category = raw.category as { slug?: string } | null | undefined;
  if (category?.slug) return [category.slug as RestaurantCategory];
  if (Array.isArray(raw.categories)) return raw.categories as RestaurantCategory[];
  return [];
}

/** Normalizes Empire backend restaurant payloads to the mobile Restaurant shape. */
export function normalizeRestaurant(raw: RawRestaurant): Restaurant {
  const deliveryTimeMin = toNumber(raw.deliveryTimeMin ?? raw.delivery_time_min, 30);
  const deliveryTimeMax = toNumber(raw.deliveryTimeMax ?? raw.delivery_time_max, deliveryTimeMin + 15);
  const deliveryTime = toNumber(raw.deliveryTime ?? raw.delivery_time, deliveryTimeMin || deliveryTimeMax);

  return {
    id: String(raw.id ?? ''),
    name: String(raw.name ?? ''),
    description: String(raw.description ?? ''),
    logo: String(raw.logo ?? ''),
    coverImage: String(raw.coverImage ?? raw.cover_image ?? ''),
    address: String(raw.address ?? ''),
    coordinates: toCoordinates(raw),
    rating: toNumber(raw.rating),
    reviewCount: toNumber(raw.reviewCount ?? raw.review_count),
    deliveryFee: toNumber(raw.deliveryFee ?? raw.delivery_fee),
    deliveryTime: deliveryTime || deliveryTimeMin || 30,
    minOrder: toNumber(raw.minOrder ?? raw.min_order),
    status: (raw.isOpen ?? raw.is_open) ? 'open' : 'closed',
    categories: toCategories(raw),
    isOpen: Boolean(raw.isOpen ?? raw.is_open ?? true),
    isFeatured: Boolean(raw.isFeatured ?? raw.is_featured),
    isFavourited: raw.isFavourited != null ? Boolean(raw.isFavourited) : undefined,
    distance: raw.distance != null ? toNumber(raw.distance) : undefined,
    promoText: raw.promoText != null ? String(raw.promoText) : raw.promo_text != null ? String(raw.promo_text) : undefined,
  };
}

export function normalizeRestaurantList(raw: unknown): Restaurant[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => normalizeRestaurant(item as RawRestaurant));
}
