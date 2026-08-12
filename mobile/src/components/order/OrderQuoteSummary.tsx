import React from 'react';
import { View, Text } from 'react-native';
import { OrderQuote } from '@/types/order.types';
import { T } from '@/constants/colors';
import { formatPrice } from '@/utils/formatters';

interface OrderQuoteSummaryProps {
  quote: OrderQuote;
  itemCount?: number;
  showEta?: boolean;
  isEstimate?: boolean;
}

function FeeRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: 'success' | 'gold' | 'muted';
}) {
  const color = tone === 'success' ? T.success : tone === 'gold' ? '#B8860B' : T.text;
  const labelColor = tone === 'muted' ? T.textTer : tone ? color : T.textSec;

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
      <Text style={{ color: labelColor, flex: 1, paddingRight: 8 }}>{label}</Text>
      <Text style={{ fontWeight: '600', color: tone ? color : T.text }}>
        {value < 0 ? `−${formatPrice(Math.abs(value))}` : formatPrice(value)}
      </Text>
    </View>
  );
}

export function OrderQuoteSummary({ quote, itemCount, showEta, isEstimate }: OrderQuoteSummaryProps) {
  const servicePct = Math.round((quote.breakdown?.serviceFeePct ?? 0.05) * 100);
  const subtotalLabel = itemCount != null ? `Subtotal (${itemCount} items)` : 'Subtotal';

  return (
    <>
      <FeeRow label={subtotalLabel} value={quote.subtotal} />

      {quote.breakdown?.distanceCharge > 0 ? (
        <>
          <FeeRow label="Delivery (base)" value={quote.breakdown.baseFee} />
          <FeeRow
            label={`Distance (${quote.breakdown.distanceKm.toFixed(1)} km)`}
            value={quote.breakdown.distanceCharge}
          />
        </>
      ) : (
        <FeeRow
          label={quote.distanceKm > 0 ? `Delivery (${quote.distanceKm.toFixed(1)} km)` : 'Delivery fee'}
          value={quote.deliveryFee}
        />
      )}

      <FeeRow label={`Service fee (${servicePct}%)`} value={quote.serviceFee} />

      {quote.smallOrderFee > 0 && (
        <FeeRow label="Small order fee (under R100)" value={quote.smallOrderFee} />
      )}

      {quote.breakdown?.peakAmount > 0 && (
        <FeeRow label="Peak surcharge" value={quote.breakdown.peakAmount} />
      )}

      {quote.discount > 0 && (
        <FeeRow label="Promo discount" value={-quote.discount} tone="success" />
      )}

      {quote.loyaltyDiscount > 0 && (
        <FeeRow label="Empire Points" value={-quote.loyaltyDiscount} tone="gold" />
      )}

      {showEta && quote.estimatedDeliveryMinutes > 0 && (
        <Text style={{ fontSize: 12, color: T.textSec, marginBottom: 6 }}>
          Est. delivery ~{quote.estimatedDeliveryMinutes} min
        </Text>
      )}

      {quote.addressRequired && isEstimate && (
        <Text style={{ fontSize: 12, color: T.textTer, marginBottom: 6 }}>
          Add a delivery address at checkout for exact distance-based fees.
        </Text>
      )}

      <View style={{ height: 1, backgroundColor: T.border, marginVertical: 10 }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontWeight: '900', fontSize: 18, color: T.text }}>
          Total{isEstimate ? ' (est.)' : ''}
        </Text>
        <Text style={{ fontWeight: '900', fontSize: 18, color: T.text }}>{formatPrice(quote.total)}</Text>
      </View>
    </>
  );
}
