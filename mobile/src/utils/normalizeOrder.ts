import { Order, OrderItem, OrderStatus, TrackingUpdate } from '@/types/order.types';
import { formatDistanceAway } from '@/utils/formatters';

type RawRecord = Record<string, unknown>;

function toNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return { firstName: 'Driver', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

export function canCancelOrderStatus(status: OrderStatus | string): boolean {
  return ['pending_payment', 'placed', 'confirmed', 'preparing'].includes(status);
}

export function normalizeOrderItem(raw: RawRecord): OrderItem {
  const quantity = toNumber(raw.quantity, 1);
  const unitPrice = toNumber(raw.unitPrice ?? raw.unit_price);
  return {
    id: String(raw.id ?? ''),
    menuItemId: String(raw.menuItemId ?? raw.menu_item_id ?? ''),
    menuItemName: String(raw.menuItemName ?? raw.name ?? raw.item_name ?? 'Item'),
    menuItemImage: String(raw.menuItemImage ?? raw.image ?? raw.item_image ?? ''),
    quantity,
    unitPrice,
    totalPrice: toNumber(raw.totalPrice ?? raw.total_price, unitPrice * quantity),
    addons: Array.isArray(raw.addons) ? (raw.addons as OrderItem['addons']) : [],
    instructions: raw.instructions != null ? String(raw.instructions) : undefined,
  };
}

export function normalizeOrder(raw: RawRecord): Order {
  const restaurant = (raw.restaurant as RawRecord | undefined) ?? {};
  const deliveryAddress = raw.deliveryAddress ?? raw.delivery_address;

  return {
    id: String(raw.id ?? ''),
    userId: String(raw.userId ?? raw.user_id ?? ''),
    restaurantId: String(raw.restaurantId ?? raw.restaurant_id ?? ''),
    restaurantName: String(raw.restaurantName ?? raw.restaurant_name ?? restaurant.name ?? ''),
    restaurantLogo: String(raw.restaurantLogo ?? raw.restaurant_logo ?? restaurant.logo ?? ''),
    items: Array.isArray(raw.items) ? raw.items.map((item) => normalizeOrderItem(item as RawRecord)) : [],
    deliveryAddress: deliveryAddress as Order['deliveryAddress'],
    status: (raw.status as OrderStatus) ?? 'placed',
    subtotal: toNumber(raw.subtotal),
    deliveryFee: toNumber(raw.deliveryFee ?? raw.delivery_fee),
    serviceFee: toNumber(raw.serviceFee ?? raw.service_fee),
    vatAmount: toNumber(raw.vatAmount ?? raw.vat_amount),
    discount: toNumber(raw.discount),
    total: toNumber(raw.total),
    couponCode: raw.couponCode != null ? String(raw.couponCode) : raw.coupon_code != null ? String(raw.coupon_code) : undefined,
    paymentMethod: String(raw.paymentMethod ?? raw.payment_method ?? ''),
    paymentStatus: (raw.paymentStatus ?? raw.payment_status ?? 'pending') as Order['paymentStatus'],
    deliveryNotes: raw.deliveryNotes != null ? String(raw.deliveryNotes) : raw.delivery_notes != null ? String(raw.delivery_notes) : undefined,
    estimatedDeliveryTime: raw.estimatedDeliveryTime != null
      ? toNumber(raw.estimatedDeliveryTime)
      : raw.estimated_delivery_minutes != null
        ? toNumber(raw.estimated_delivery_minutes)
        : undefined,
    placedAt: String(raw.placedAt ?? raw.placed_at ?? new Date().toISOString()),
    confirmedAt: raw.confirmedAt != null ? String(raw.confirmedAt) : raw.confirmed_at != null ? String(raw.confirmed_at) : undefined,
    preparedAt: raw.preparedAt != null ? String(raw.preparedAt) : raw.prepared_at != null ? String(raw.prepared_at) : undefined,
    pickedUpAt: raw.pickedUpAt != null ? String(raw.pickedUpAt) : raw.picked_up_at != null ? String(raw.picked_up_at) : undefined,
    deliveredAt: raw.deliveredAt != null ? String(raw.deliveredAt) : raw.delivered_at != null ? String(raw.delivered_at) : undefined,
    cancelledAt: raw.cancelledAt != null ? String(raw.cancelledAt) : raw.cancelled_at != null ? String(raw.cancelled_at) : undefined,
    cancelReason: raw.cancelReason != null ? String(raw.cancelReason) : raw.cancel_reason != null ? String(raw.cancel_reason) : undefined,
    rating: raw.rating != null ? toNumber(raw.rating) : undefined,
    review: raw.review != null ? String(raw.review) : undefined,
  };
}

export function normalizeTrackingUpdate(raw: RawRecord, orderId?: string): TrackingUpdate {
  const driverRaw = raw.driver as RawRecord | undefined;
  const eta = raw.eta != null
    ? toNumber(raw.eta)
    : raw.etaMinutes != null
      ? toNumber(raw.etaMinutes)
      : raw.estimatedDeliveryMinutes != null
        ? toNumber(raw.estimatedDeliveryMinutes)
        : undefined;

  let driver: TrackingUpdate['driver'];
  if (driverRaw) {
    const fullName = String(driverRaw.name ?? `${driverRaw.firstName ?? driverRaw.first_name ?? ''} ${driverRaw.lastName ?? driverRaw.last_name ?? ''}`.trim());
    const { firstName, lastName } = driverRaw.firstName || driverRaw.first_name
      ? { firstName: String(driverRaw.firstName ?? driverRaw.first_name), lastName: String(driverRaw.lastName ?? driverRaw.last_name ?? '') }
      : splitName(fullName);

    const lat = toNumber(driverRaw.latitude ?? driverRaw.lat, NaN);
    const lng = toNumber(driverRaw.longitude ?? driverRaw.lng, NaN);

    driver = {
      id: String(driverRaw.id ?? ''),
      firstName,
      lastName,
      avatar: driverRaw.avatar != null ? String(driverRaw.avatar) : driverRaw.avatar_url != null ? String(driverRaw.avatar_url) : undefined,
      phone: String(driverRaw.phone ?? ''),
      rating: toNumber(driverRaw.rating),
      latitude: Number.isFinite(lat) ? lat : 0,
      longitude: Number.isFinite(lng) ? lng : 0,
      vehicle: {
        make: String((driverRaw.vehicle as RawRecord | undefined)?.make ?? driverRaw.vehicle_type ?? ''),
        model: String((driverRaw.vehicle as RawRecord | undefined)?.model ?? ''),
        color: String((driverRaw.vehicle as RawRecord | undefined)?.color ?? ''),
        plateNumber: String((driverRaw.vehicle as RawRecord | undefined)?.plateNumber ?? ''),
      },
    };
  }

  const customerLocationRaw = raw.customerLocation as RawRecord | undefined;
  const restaurantLocationRaw = raw.restaurantLocation as RawRecord | undefined;

  return {
    orderId: String(raw.orderId ?? raw.order_id ?? orderId ?? ''),
    status: (raw.status as OrderStatus) ?? 'placed',
    driver,
    eta,
    driverAccepted: raw.driverAccepted != null
      ? Boolean(raw.driverAccepted)
      : raw.driver_accepted != null
        ? Boolean(raw.driver_accepted)
        : Boolean(driver?.id),
    driverAcceptedAt: raw.driverAcceptedAt != null
      ? String(raw.driverAcceptedAt)
      : raw.driver_accepted_at != null
        ? String(raw.driver_accepted_at)
        : undefined,
    driverDistanceKm: raw.driverDistanceKm != null
      ? toNumber(raw.driverDistanceKm, NaN)
      : raw.driver_distance_km != null
        ? toNumber(raw.driver_distance_km, NaN)
        : null,
    restaurantDistanceKm: raw.restaurantDistanceKm != null
      ? toNumber(raw.restaurantDistanceKm, NaN)
      : raw.restaurant_distance_km != null
        ? toNumber(raw.restaurant_distance_km, NaN)
        : null,
    customerLocation: customerLocationRaw?.latitude != null && customerLocationRaw?.longitude != null
      ? { latitude: toNumber(customerLocationRaw.latitude), longitude: toNumber(customerLocationRaw.longitude) }
      : null,
    restaurantLocation: restaurantLocationRaw?.latitude != null && restaurantLocationRaw?.longitude != null
      ? { latitude: toNumber(restaurantLocationRaw.latitude), longitude: toNumber(restaurantLocationRaw.longitude) }
      : null,
    estimatedArrival: raw.estimatedArrival != null ? String(raw.estimatedArrival) : undefined,
    updatedAt: String(raw.updatedAt ?? raw.updated_at ?? new Date().toISOString()),
  };
}

export function statusSubtitle(status: OrderStatus | string, opts?: { driverAccepted?: boolean; driverDistanceKm?: number | null }): string {
  if (opts?.driverAccepted && opts.driverDistanceKm != null && ['picked_up', 'on_way'].includes(status)) {
    return `Your driver is ${formatDistanceAway(opts.driverDistanceKm).replace(' away', '')} from you`;
  }
  if (opts?.driverAccepted && !['picked_up', 'on_way', 'delivered', 'cancelled'].includes(status)) {
    return 'Your driver accepted and is heading to the restaurant';
  }
  if (!opts?.driverAccepted && ['placed', 'confirmed', 'preparing'].includes(status)) {
    return 'Looking for a nearby driver to accept your order';
  }

  const map: Record<string, string> = {
    pending_payment: 'Complete payment to confirm your order',
    placed: 'Waiting for the restaurant to confirm',
    confirmed: 'Restaurant confirmed — your order is being prepared',
    preparing: 'The kitchen is preparing your food',
    picked_up: 'Your driver has collected your order',
    on_way: 'Your driver is heading to you',
    delivered: 'Enjoy your meal!',
    cancelled: 'This order was cancelled',
  };
  return map[status] ?? 'Tracking your order';
}
