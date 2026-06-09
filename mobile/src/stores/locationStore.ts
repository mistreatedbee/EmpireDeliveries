import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Address } from '@/types/order.types';

interface Coordinates {
  latitude: number;
  longitude: number;
}

type PermissionStatus = 'granted' | 'denied' | 'undetermined';

interface LocationStore {
  currentLocation: Coordinates | null;
  selectedAddress: Address | null;
  savedAddresses: Address[];
  permissionStatus: PermissionStatus;
  setCurrentLocation: (coords: Coordinates) => void;
  setSelectedAddress: (address: Address) => void;
  addSavedAddress: (address: Address) => void;
  updateSavedAddress: (address: Address) => void;
  removeSavedAddress: (id: string) => void;
  setPermissionStatus: (status: PermissionStatus) => void;
}

export const useLocationStore = create<LocationStore>()(
  persist(
    (set, get) => ({
      currentLocation: null,
      selectedAddress: null,
      savedAddresses: [],
      permissionStatus: 'undetermined',

      setCurrentLocation: (coords) => set({ currentLocation: coords }),

      setSelectedAddress: (address) => set({ selectedAddress: address }),

      addSavedAddress: (address) =>
        set({ savedAddresses: [...get().savedAddresses, address] }),

      updateSavedAddress: (address) =>
        set({ savedAddresses: get().savedAddresses.map((a) => (a.id === address.id ? address : a)) }),

      removeSavedAddress: (id) =>
        set({ savedAddresses: get().savedAddresses.filter((a) => a.id !== id) }),

      setPermissionStatus: (status) => set({ permissionStatus: status }),
    }),
    {
      name: 'empire-location',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedAddress: state.selectedAddress,
        savedAddresses: state.savedAddresses,
        permissionStatus: state.permissionStatus,
      }),
    },
  ),
);
