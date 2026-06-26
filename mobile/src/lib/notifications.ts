import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import { queryClient } from './queryClient';
import { queryKeys } from '@/constants/queryKeys';
import { useNotificationStore } from '@/stores/notificationStore';
import { useUIStore } from '@/stores/uiStore';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Empire Deliveries',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#D4AF37',
    });
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  if (!projectId) return null;

  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  useNotificationStore.getState().setPushToken(token);
  return token;
}

export function setupNotificationListeners() {
  const foregroundSub = Notifications.addNotificationReceivedListener((notification) => {
    const data = notification.request.content.data as { type?: string; orderId?: string };
    if (data?.type === 'order_update' && data.orderId) {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.tracking(data.orderId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.list() });
    }
    useNotificationStore.getState().incrementUnread();
    useUIStore.getState().showToast(notification.request.content.body ?? 'New notification', 'info');
  });

  const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data as { orderId?: string; restaurantId?: string };
    if (data?.orderId) {
      router.push(`/(customer)/(orders)/tracking/${data.orderId}`);
    } else if (data?.restaurantId) {
      router.push(`/(customer)/(home)/restaurant/${data.restaurantId}`);
    }
  });

  return () => {
    foregroundSub.remove();
    responseSub.remove();
  };
}
