import { OrderStatus } from '@/types/order.types';

export function canCancelOrderStatus(status: OrderStatus | string): boolean {
  return ['pending_payment', 'placed', 'confirmed', 'preparing'].includes(status);
}
