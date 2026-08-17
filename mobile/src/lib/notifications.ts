import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import { queryClient } from './queryClient';
import { queryKeys } from '@/constants/queryKeys';
import { useNotificationStore } from '@/stores/notificationStore';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';

/** Android Expo Go (SDK 53+) removed remote push — skip loading the native module. */
const PUSH_SUPPORTED = !(Platform.OS === 'android' && Constants.appOwnership === 'expo');

type NotificationSub = { remove: () => void };
let activeSubs: NotificationSub[] = [];

async function loadNotifications() {
  return import('expo-notifications');
}

// Never throws — push notifications are optional and must not block auth or startup.
export async function registerForPushNotifications(): Promise<string | null> {
  if (!PUSH_SUPPORTED) return null;

  try {
    const [Notifications, Device, ConstantsMod] = await Promise.all([
      loadNotifications(),
      import('expo-device'),
      import('expo-constants'),
    ]);

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

    const projectId = ConstantsMod.default.expoConfig?.extra?.eas?.projectId;
    if (!projectId) return null;

    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    useNotificationStore.getState().setPushToken(token);
    return token;
  } catch {
    return null;
  }
}

export function setupNotificationListeners() {
  if (!PUSH_SUPPORTED) return () => {};

  void loadNotifications()
    .then((Notifications) => {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });

      activeSubs.push(
        Notifications.addNotificationReceivedListener((notification) => {
          const data = notification.request.content.data as {
            type?: string;
            orderId?: string;
            conversationId?: string;
          };
          if (data?.type === 'order_update' && data.orderId) {
            queryClient.invalidateQueries({ queryKey: queryKeys.orders.tracking(data.orderId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.orders.list() });
          }
          if (data?.type === 'restaurant_new_order') {
            queryClient.invalidateQueries({ queryKey: ['restaurant', 'orders'] });
          }
          if (data?.type === 'driver_new_delivery') {
            queryClient.invalidateQueries({ queryKey: ['driver'] });
          }
          if (data?.type === 'new_message' && data.conversationId) {
            queryClient.invalidateQueries({ queryKey: queryKeys.messages.thread(data.conversationId) });
          }
          useNotificationStore.getState().incrementUnread();
          useUIStore.getState().showToast(notification.request.content.body ?? 'New notification', 'info');
        }),
      );

      activeSubs.push(
        Notifications.addNotificationResponseReceivedListener((response) => {
          const data = response.notification.request.content.data as {
            orderId?: string;
            restaurantId?: string;
            type?: string;
            conversationId?: string;
          };
          const role = useAuthStore.getState().user?.role;
          if (data?.type === 'new_message' && data.conversationId) {
            router.push({
              pathname: '/(modals)/chat/[conversationId]',
              params: { conversationId: data.conversationId },
            });
          } else if (data?.type === 'restaurant_new_order') {
            router.push('/(restaurant)/orders');
          } else if (data?.type === 'driver_new_delivery') {
            router.push('/(driver)');
          } else if (data?.orderId && role === 'customer') {
            router.push(`/(customer)/(orders)/tracking/${data.orderId}`);
          } else if (data?.orderId && role === 'driver') {
            router.push({ pathname: '/(driver)/delivery', params: { orderId: data.orderId } });
          } else if (data?.restaurantId) {
            router.push(`/(customer)/(home)/restaurant/${data.restaurantId}`);
          }
        }),
      );
    })
    .catch(() => null);

  return () => {
    activeSubs.forEach((sub) => sub.remove());
    activeSubs = [];
  };
}
