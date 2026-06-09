import { Addon, MenuItem } from './restaurant.types';

export type OrderStatus =
  | 'pending_payment'
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'picked_up'
  | 'on_way'
  | 'delivered'
  | 'cancelled';

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedAddons: Addon[];
  instructions?: string;
  totalPrice: number;
}

export interface Address {
  id: string;
  userId?: string;
  label: 'home' | 'work' | 'other';
  street: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  formattedAddress: string;
  instructions?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItemName: string;
  menuItemImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  addons: Addon[];
  instructions?: string;
}

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone: string;
  vehicle: {
    make: string;
    model: string;
    color: string;
    plateNumber: string;
  };
  rating: number;
}

export interface TrackingUpdate {
  orderId: string;
  status: OrderStatus;
  driver?: {
    latitude: number;
    longitude: number;
    heading?: number;
  } & Omit<Driver, 'id'> & { id: string };
  estimatedArrival?: string;
  eta?: number;
  waypoints?: Array<{ latitude: number; longitude: number }>;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  restaurantLogo: string;
  driverId?: string;
  driver?: Driver;
  items: OrderItem[];
  deliveryAddress: Address;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  vatAmount: number;
  discount: number;
  total: number;
  couponCode?: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  deliveryNotes?: string;
  estimatedDeliveryTime?: number;
  placedAt: string;
  confirmedAt?: string;
  preparedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  rating?: number;
  review?: string;
}

export interface CreateOrderPayload {
  restaurantId: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
    addonIds: string[];
    instructions?: string;
  }>;
  deliveryAddressId: string;
  paymentMethod: string;
  couponCode?: string;
  deliveryNotes?: string;
}

export interface CouponValidation {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxDiscount?: number;
  minOrderAmount?: number;
  valid: boolean;
  message?: string;
}
