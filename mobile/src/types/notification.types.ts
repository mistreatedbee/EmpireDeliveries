export type NotificationType =
  | 'order_placed'
  | 'order_confirmed'
  | 'order_preparing'
  | 'order_picked_up'
  | 'order_on_way'
  | 'order_delivered'
  | 'order_cancelled'
  | 'promo'
  | 'loyalty'
  | 'general';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: {
    orderId?: string;
    restaurantId?: string;
    promoCode?: string;
    [key: string]: unknown;
  };
  isRead: boolean;
  createdAt: string;
}
