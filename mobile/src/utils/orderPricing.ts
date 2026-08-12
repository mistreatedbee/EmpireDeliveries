import { OrderQuote } from '@/types/order.types';

/** Mirrors Empire-backend DEFAULT_PRICING_RULES for client-side estimates. */
const RULES = {
  baseFee: 20,
  includedKm: 3,
  midKmRate: 5,
  midKmUntil: 7,
  longKmRate: 7,
  serviceFeePct: 0.05,
  smallOrderThreshold: 100,
  smallOrderFee: 10,
  peakMultiplier: 1,
};

function deliveryFeeFromDistance(distanceKm: number) {
  const km = Math.max(0, distanceKm);
  const baseFee = RULES.baseFee;
  let distanceCharge = 0;

  if (km > RULES.includedKm) {
    const midEnd = Math.min(km, RULES.midKmUntil);
    const midKm = Math.max(0, midEnd - RULES.includedKm);
    distanceCharge += midKm * RULES.midKmRate;
    if (km > RULES.midKmUntil) {
      distanceCharge += (km - RULES.midKmUntil) * RULES.longKmRate;
    }
  }

  const prePeak = baseFee + distanceCharge;
  const peakMultiplier = RULES.peakMultiplier > 1 ? RULES.peakMultiplier : 1;
  const deliveryFee = Math.round(prePeak * peakMultiplier * 100) / 100;
  const peakAmount = Math.round((deliveryFee - prePeak) * 100) / 100;

  return {
    baseFee,
    distanceKm: Math.round(km * 10) / 10,
    distanceCharge: Math.round(distanceCharge * 100) / 100,
    peakMultiplier,
    peakAmount,
    deliveryFee,
  };
}

export function buildEstimatedQuote(
  subtotal: number,
  options: {
    discount?: number;
    loyaltyDiscount?: number;
    distanceKm?: number;
    addressRequired?: boolean;
  } = {},
): OrderQuote {
  const discount = Math.max(0, options.discount ?? 0);
  const loyaltyDiscount = Math.max(0, options.loyaltyDiscount ?? 0);
  const delivery = deliveryFeeFromDistance(options.distanceKm ?? 0);
  const serviceFee = Math.round(subtotal * RULES.serviceFeePct * 100) / 100;
  const smallOrderApplied = subtotal > 0 && subtotal < RULES.smallOrderThreshold;
  const smallOrderFee = smallOrderApplied ? RULES.smallOrderFee : 0;
  const total = Math.max(
    0,
    Math.round((subtotal + delivery.deliveryFee + serviceFee + smallOrderFee - discount - loyaltyDiscount) * 100) / 100,
  );

  return {
    subtotal,
    deliveryFee: delivery.deliveryFee,
    serviceFee,
    smallOrderFee,
    discount,
    loyaltyDiscount,
    total,
    distanceKm: delivery.distanceKm,
    estimatedDeliveryMinutes: Math.round(25 + delivery.distanceKm * 3),
    breakdown: {
      ...delivery,
      serviceFeePct: RULES.serviceFeePct,
      smallOrderApplied,
    },
    driverPayout: Math.round(delivery.deliveryFee * 0.75 * 100) / 100,
    addressRequired: options.addressRequired ?? true,
  };
}

export function estimateOrderTotal(subtotal: number): number {
  return buildEstimatedQuote(subtotal).total;
}
