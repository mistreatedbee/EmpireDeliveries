import { create } from 'zustand';
import { TrackingUpdate } from '@/types/order.types';

interface OrderStore {
  activeOrderId: string | null;
  trackingData: TrackingUpdate | null;
  setActiveOrder: (orderId: string) => void;
  updateTracking: (data: TrackingUpdate) => void;
  clearActiveOrder: () => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  activeOrderId: null,
  trackingData: null,

  setActiveOrder: (orderId) => set({ activeOrderId: orderId, trackingData: null }),

  updateTracking: (data) => set({ trackingData: data }),

  clearActiveOrder: () => set({ activeOrderId: null, trackingData: null }),
}));
