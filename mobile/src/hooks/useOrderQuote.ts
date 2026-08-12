import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/order.service';
import { queryKeys } from '@/constants/queryKeys';
import { CartItem, OrderQuote } from '@/types/order.types';
import { buildEstimatedQuote, estimateOrderTotal } from '@/utils/orderPricing';
import { Coordinates, deliveryDistanceKm, hasValidCoordinates } from '@/utils/distance';

export { estimateOrderTotal };

interface UseOrderQuoteParams {
  restaurantId: string | null;
  items: CartItem[];
  deliveryAddressId?: string;
  deliveryCoordinates?: Coordinates | null;
  restaurantCoordinates?: Coordinates | null;
  couponCode?: string;
  loyaltyPointsToRedeem?: number;
  cartDiscount?: number;
  enabled?: boolean;
}

function cartItemsToPayload(items: CartItem[]) {
  return items.map((i) => ({
    menuItemId: i.menuItem.id,
    quantity: i.quantity,
    addonIds: i.selectedAddons.map((a) => a.id),
    instructions: i.instructions,
  }));
}

function coordFields(coords?: Coordinates | null) {
  if (!hasValidCoordinates(coords)) return {};
  return {
    latitude: coords.latitude,
    longitude: coords.longitude,
  };
}

export function useOrderQuote({
  restaurantId,
  items,
  deliveryAddressId,
  deliveryCoordinates,
  restaurantCoordinates,
  couponCode,
  loyaltyPointsToRedeem,
  cartDiscount = 0,
  enabled = true,
}: UseOrderQuoteParams) {
  const cartSubtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.totalPrice, 0),
    [items],
  );

  const loyaltyDiscount = useMemo(() => {
    const pts = typeof loyaltyPointsToRedeem === 'number' ? Math.floor(loyaltyPointsToRedeem / 100) * 100 : 0;
    return pts > 0 ? (pts / 100) * 10 : 0;
  }, [loyaltyPointsToRedeem]);

  const distanceKm = useMemo(
    () => deliveryDistanceKm(restaurantCoordinates, deliveryCoordinates),
    [restaurantCoordinates, deliveryCoordinates],
  );

  const deliveryCoords = coordFields(deliveryCoordinates);
  const restaurantCoords = coordFields(restaurantCoordinates);

  const payload = useMemo(
    () => ({
      restaurantId: restaurantId ?? '',
      items: cartItemsToPayload(items),
      deliveryAddressId,
      deliveryLatitude: deliveryCoords.latitude,
      deliveryLongitude: deliveryCoords.longitude,
      restaurantLatitude: restaurantCoords.latitude,
      restaurantLongitude: restaurantCoords.longitude,
      couponCode,
      loyaltyPointsToRedeem,
    }),
    [
      restaurantId,
      items,
      deliveryAddressId,
      deliveryCoords.latitude,
      deliveryCoords.longitude,
      restaurantCoords.latitude,
      restaurantCoords.longitude,
      couponCode,
      loyaltyPointsToRedeem,
    ],
  );

  const query = useQuery({
    queryKey: queryKeys.orders.quote(payload),
    queryFn: () => orderService.getQuote(payload),
    enabled: enabled && !!restaurantId && items.length > 0,
    staleTime: 15000,
  });

  const estimatedQuote = useMemo(
    () =>
      buildEstimatedQuote(cartSubtotal, {
        discount: cartDiscount,
        loyaltyDiscount,
        distanceKm,
        addressRequired: !hasValidCoordinates(deliveryCoordinates),
      }),
    [cartSubtotal, cartDiscount, loyaltyDiscount, distanceKm, deliveryCoordinates],
  );

  const quote = query.data as OrderQuote | undefined;
  const displayQuote = quote ?? estimatedQuote;

  return {
    ...query,
    quote,
    displayQuote,
    displayTotal: displayQuote.total,
    distanceKm: quote?.distanceKm ?? distanceKm,
    isEstimate: !quote,
  };
}
