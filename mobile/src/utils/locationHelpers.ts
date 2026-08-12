import { Address } from '@/types/order.types';
import { Coordinates, hasValidCoordinates } from '@/utils/distance';

export function getDeliveryCoordinates(
  selectedAddress: Address | null,
  currentLocation: Coordinates | null,
): Coordinates | null {
  if (selectedAddress?.coordinates && hasValidCoordinates(selectedAddress.coordinates)) {
    return selectedAddress.coordinates;
  }
  if (currentLocation && hasValidCoordinates(currentLocation)) {
    return currentLocation;
  }
  return null;
}
