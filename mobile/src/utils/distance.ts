/** Great-circle distance between two GPS points in kilometres. */
export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export function hasValidCoordinates(coords?: Coordinates | null): coords is Coordinates {
  if (!coords) return false;
  const { latitude, longitude } = coords;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return false;
  if (latitude === 0 && longitude === 0) return false;
  return Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180;
}

export function deliveryDistanceKm(
  restaurant?: Coordinates | null,
  customer?: Coordinates | null,
): number {
  if (!hasValidCoordinates(restaurant) || !hasValidCoordinates(customer)) return 0;
  return Math.round(haversineKm(
    restaurant.latitude,
    restaurant.longitude,
    customer.latitude,
    customer.longitude,
  ) * 10) / 10;
}
