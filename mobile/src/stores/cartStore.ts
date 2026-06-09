import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, CouponValidation } from '@/types/order.types';
import { MenuItem, Addon } from '@/types/restaurant.types';

interface CartStore {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  coupon: CouponValidation | null;
  // Computed
  itemCount: number;
  subtotal: number;
  discount: number;
  total: number;
  // Actions
  addItem: (menuItem: MenuItem, selectedAddons: Addon[], quantity: number, instructions?: string) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  applyCoupon: (coupon: CouponValidation) => void;
  clearCoupon: () => void;
  clearCart: () => void;
  clearForNewRestaurant: (restaurantId: string, restaurantName: string) => void;
}

function computeTotals(items: CartItem[], coupon: CouponValidation | null) {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  let discount = 0;
  if (coupon?.valid) {
    discount = coupon.discountType === 'percentage'
      ? subtotal * (coupon.discountValue / 100)
      : coupon.discountValue;
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  }
  return { subtotal, discount, total: Math.max(0, subtotal - discount) };
}

function buildCartItem(menuItem: MenuItem, selectedAddons: Addon[], quantity: number, instructions?: string): CartItem {
  const addonTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  return {
    id: `${menuItem.id}_${Date.now()}`,
    menuItem,
    quantity,
    selectedAddons,
    instructions,
    totalPrice: (menuItem.price + addonTotal) * quantity,
  };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,
      restaurantName: null,
      coupon: null,
      itemCount: 0,
      subtotal: 0,
      discount: 0,
      total: 0,

      addItem: (menuItem, selectedAddons, quantity, instructions) => {
        const state = get();
        const newItem = buildCartItem(menuItem, selectedAddons, quantity, instructions);
        const items = [...state.items, newItem];
        const { subtotal, discount, total } = computeTotals(items, state.coupon);
        set({
          items,
          restaurantId: state.restaurantId ?? menuItem.restaurantId,
          itemCount: items.reduce((n, i) => n + i.quantity, 0),
          subtotal,
          discount,
          total,
        });
      },

      removeItem: (cartItemId) => {
        const state = get();
        const items = state.items.filter((i) => i.id !== cartItemId);
        const { subtotal, discount, total } = computeTotals(items, state.coupon);
        set({
          items,
          restaurantId: items.length === 0 ? null : state.restaurantId,
          restaurantName: items.length === 0 ? null : state.restaurantName,
          itemCount: items.reduce((n, i) => n + i.quantity, 0),
          subtotal,
          discount,
          total,
        });
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) { get().removeItem(cartItemId); return; }
        const state = get();
        const items = state.items.map((item) => {
          if (item.id !== cartItemId) return item;
          const addonTotal = item.selectedAddons.reduce((s, a) => s + a.price, 0);
          return { ...item, quantity, totalPrice: (item.menuItem.price + addonTotal) * quantity };
        });
        const { subtotal, discount, total } = computeTotals(items, state.coupon);
        set({ items, itemCount: items.reduce((n, i) => n + i.quantity, 0), subtotal, discount, total });
      },

      applyCoupon: (coupon) => {
        const state = get();
        const { subtotal, discount, total } = computeTotals(state.items, coupon);
        set({ coupon, discount, total, subtotal });
      },

      clearCoupon: () => {
        const state = get();
        const { subtotal, discount, total } = computeTotals(state.items, null);
        set({ coupon: null, discount, total, subtotal });
      },

      clearCart: () => set({ items: [], restaurantId: null, restaurantName: null, coupon: null, itemCount: 0, subtotal: 0, discount: 0, total: 0 }),

      clearForNewRestaurant: (restaurantId, restaurantName) => {
        set({ items: [], restaurantId, restaurantName, coupon: null, itemCount: 0, subtotal: 0, discount: 0, total: 0 });
      },
    }),
    {
      name: 'empire-cart',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
