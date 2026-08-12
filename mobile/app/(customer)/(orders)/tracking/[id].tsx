import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Linking,
  ActivityIndicator,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Animated,
} from 'react-native';
import { PlatformMap } from '@/components/map/PlatformMap';
import { useLocalSearchParams, router } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Check,
  Car,
  Phone,
  Star,
  MessageCircle,
  MapPin,
  Clock,
  Pencil,
  X,
  Navigation,
  UserCheck,
} from 'lucide-react-native';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/empire';
import { useOrderTracking, useOrderDetail } from '@/hooks/useOrders';
import { useOrderConversation } from '@/hooks/useChat';
import { chatService } from '@/services/chat.service';
import { orderService } from '@/services/order.service';
import { useLocationStore } from '@/stores/locationStore';
import { useUIStore } from '@/stores/uiStore';
import { queryKeys } from '@/constants/queryKeys';
import { Coordinates, deliveryDistanceKm, hasValidCoordinates } from '@/utils/distance';
import { canCancelOrderStatus } from '@/utils/orderStatus';
import { statusSubtitle } from '@/utils/normalizeOrder';
import { T } from '@/constants/colors';
import { formatOrderStatus, formatETA, formatPrice, formatDistanceAway } from '@/utils/formatters';
import { getUserErrorMessage } from '@/utils/errorHandler';

const STEPS = ['placed', 'confirmed', 'preparing', 'picked_up', 'on_way', 'delivered'] as const;
const STEP_LABELS = ['Placed', 'Confirmed', 'Preparing', 'Picked Up', 'On the Way', 'Delivered'];

export default function OrderTrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderId = String(id ?? '');
  const queryClient = useQueryClient();
  const { showToast } = useUIStore();
  const { currentLocation } = useLocationStore();
  const { data: tracking, isLoading: trackingLoading } = useOrderTracking(orderId);
  const { data: order, isLoading: orderLoading } = useOrderDetail(orderId);
  const { data: driverConversation } = useOrderConversation(orderId, 'customer_driver');

  const [ratePrompted, setRatePrompted] = useState(false);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [notesDraft, setNotesDraft] = useState('');
  const stepPulse = useRef(new Animated.Value(1)).current;

  const status = tracking?.status ?? order?.status ?? 'placed';
  const currentStepIndex = Math.max(0, STEPS.indexOf(status as typeof STEPS[number]));
  const etaMinutes = tracking?.eta ?? order?.estimatedDeliveryTime ?? 35;
  const canEditNotes = ['placed', 'confirmed', 'preparing'].includes(status);
  const canCancel = canCancelOrderStatus(status);

  useEffect(() => {
    if (!orderId || !order?.restaurantId) return;
    void chatService.ensureOrderConversations({
      orderId,
      restaurantId: order.restaurantId,
      driverId: tracking?.driver?.id,
    });
  }, [orderId, order?.restaurantId, tracking?.driver?.id]);

  useEffect(() => {
    if (status === 'delivered' && !ratePrompted) {
      setRatePrompted(true);
      const t = setTimeout(() => {
        router.push({ pathname: '/(modals)/rate-order', params: { orderId } });
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [status, ratePrompted, orderId]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(stepPulse, { toValue: 1.08, duration: 700, useNativeDriver: true }),
        Animated.timing(stepPulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [stepPulse]);

  const updateNotesMutation = useMutation({
    mutationFn: (deliveryNotes: string) => orderService.updateDeliveryNotes(orderId, deliveryNotes),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.orders.detail(orderId), updated);
      setNotesModalOpen(false);
      showToast('Delivery instructions updated', 'success');
    },
    onError: (error) => showToast(getUserErrorMessage(error, 'Could not update instructions.'), 'error'),
  });

  const cancelMutation = useMutation({
    mutationFn: () => orderService.cancel(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      showToast('Order cancelled', 'success');
      router.replace('/(customer)/(orders)');
    },
    onError: (error) => showToast(getUserErrorMessage(error, 'This order can no longer be cancelled.'), 'error'),
  });

  const openNotesEditor = () => {
    setNotesDraft(order?.deliveryNotes ?? '');
    setNotesModalOpen(true);
  };

  const confirmCancel = () => {
    Alert.alert(
      'Cancel order?',
      'You can cancel while the restaurant is still preparing your order and before a driver picks it up.',
      [
        { text: 'Keep Order', style: 'cancel' },
        { text: 'Cancel Order', style: 'destructive', onPress: () => cancelMutation.mutate() },
      ],
    );
  };

  const deliveryAddressLabel = useMemo(() => {
    const addr = order?.deliveryAddress;
    if (!addr) return null;
    if (addr.formattedAddress) return addr.formattedAddress;
    return [addr.street, addr.suburb, addr.city].filter(Boolean).join(', ');
  }, [order?.deliveryAddress]);

  const customerCoords = useMemo((): Coordinates | null => {
    if (tracking?.customerLocation && hasValidCoordinates(tracking.customerLocation)) {
      return tracking.customerLocation;
    }
    if (order?.deliveryAddress?.coordinates && hasValidCoordinates(order.deliveryAddress.coordinates)) {
      return order.deliveryAddress.coordinates;
    }
    if (currentLocation && hasValidCoordinates(currentLocation)) {
      return currentLocation;
    }
    return null;
  }, [tracking?.customerLocation, order?.deliveryAddress?.coordinates, currentLocation]);

  const driverCoords = useMemo((): Coordinates | null => {
    if (!tracking?.driver) return null;
    const coords = { latitude: tracking.driver.latitude, longitude: tracking.driver.longitude };
    return hasValidCoordinates(coords) ? coords : null;
  }, [tracking?.driver]);

  const driverAccepted = tracking?.driverAccepted ?? Boolean(tracking?.driver?.id);
  const driverDistanceKm = useMemo(() => {
    if (tracking?.driverDistanceKm != null && Number.isFinite(tracking.driverDistanceKm)) {
      return tracking.driverDistanceKm;
    }
    if (driverCoords && customerCoords) {
      return deliveryDistanceKm(driverCoords, customerCoords);
    }
    return null;
  }, [tracking?.driverDistanceKm, driverCoords, customerCoords]);

  const mapRegion = useMemo(() => {
    const points: Coordinates[] = [];
    if (customerCoords) points.push(customerCoords);
    if (driverCoords) points.push(driverCoords);
    if (tracking?.restaurantLocation && hasValidCoordinates(tracking.restaurantLocation)) {
      points.push(tracking.restaurantLocation);
    }
    if (points.length === 0) {
      return {
        latitude: currentLocation?.latitude ?? -26.2041,
        longitude: currentLocation?.longitude ?? 28.0473,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }
    if (points.length === 1) {
      return { ...points[0], latitudeDelta: 0.03, longitudeDelta: 0.03 };
    }
    const lats = points.map((p) => p.latitude);
    const lngs = points.map((p) => p.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(0.03, (maxLat - minLat) * 1.8),
      longitudeDelta: Math.max(0.03, (maxLng - minLng) * 1.8),
    };
  }, [customerCoords, driverCoords, tracking?.restaurantLocation, currentLocation]);

  const mapMarkers = useMemo(() => {
    const markers = [];
    if (customerCoords) {
      markers.push({
        id: 'customer',
        latitude: customerCoords.latitude,
        longitude: customerCoords.longitude,
        children: (
          <View style={{ alignItems: 'center' }}>
            <View style={{ backgroundColor: T.action, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginBottom: 4 }}>
              <Text style={{ color: '#FFF', fontSize: 10, fontWeight: '800' }}>YOU</Text>
            </View>
            <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: T.action, borderWidth: 3, borderColor: '#FFF' }} />
          </View>
        ),
      });
    }
    if (driverCoords && driverAccepted) {
      markers.push({
        id: 'driver',
        latitude: driverCoords.latitude,
        longitude: driverCoords.longitude,
        children: (
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: T.success, borderWidth: 3, borderColor: '#FFF', alignItems: 'center', justifyContent: 'center' }}>
              <Car size={18} color="#FFF" />
            </View>
          </View>
        ),
      });
    }
    return markers;
  }, [customerCoords, driverCoords, driverAccepted]);

  const isLoading = trackingLoading || orderLoading;

  return (
    <ScreenWrapper bg="white" edges={['bottom']}>
      <View style={{ position: 'absolute', top: 52, left: 16, zIndex: 10 }}>
        <Pressable
          onPress={() => router.back()}
          style={{
            backgroundColor: 'rgba(255,255,255,0.92)',
            borderRadius: 20,
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: T.border,
          }}
        >
          <Text style={{ fontSize: 18, color: T.text }}>←</Text>
        </Pressable>
      </View>

      <PlatformMap
        style={{ height: '42%' }}
        region={mapRegion}
        markers={mapMarkers}
      />

      <ScrollView
        style={{ backgroundColor: T.bg, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 36 }}
      >
        {isLoading ? (
          <View style={{ alignItems: 'center', paddingVertical: 32 }}>
            <ActivityIndicator size="large" color={T.action} />
            <Text style={{ marginTop: 12, color: T.textSec }}>Loading live order status…</Text>
          </View>
        ) : (
          <>
            <View style={{ backgroundColor: T.surface, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: T.border, marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <Clock size={14} color={T.action} />
                    <Text style={{ color: T.textTer, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 }}>
                      ESTIMATED ARRIVAL
                    </Text>
                  </View>
                  <Text style={{ fontWeight: '900', fontSize: 34, color: T.text, lineHeight: 38 }}>
                    {status === 'delivered' ? 'Delivered' : formatETA(etaMinutes)}
                  </Text>
                  <Text style={{ color: T.textSec, fontSize: 14, marginTop: 6, lineHeight: 20 }}>
                    {statusSubtitle(status, { driverAccepted, driverDistanceKm })}
                  </Text>
                </View>
                <Badge
                  label={formatOrderStatus(status)}
                  variant={status === 'delivered' ? 'success' : status === 'cancelled' ? 'danger' : 'outline'}
                />
              </View>
            </View>

            <View style={{ backgroundColor: driverAccepted ? T.successBg : T.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: driverAccepted ? T.success : T.border, marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: driverAccepted ? T.success : T.border, alignItems: 'center', justifyContent: 'center' }}>
                  {driverAccepted ? <UserCheck size={20} color="#FFF" /> : <Navigation size={20} color={T.textSec} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '800', fontSize: 15, color: T.text }}>
                    {driverAccepted
                      ? tracking?.driver
                        ? `${tracking.driver.firstName} accepted your order`
                        : 'Driver accepted your order'
                      : 'Waiting for a driver'}
                  </Text>
                  <Text style={{ color: T.textSec, fontSize: 13, marginTop: 4, lineHeight: 18 }}>
                    {driverAccepted
                      ? driverDistanceKm != null
                        ? ['picked_up', 'on_way'].includes(status)
                          ? `Your driver is ${formatDistanceAway(driverDistanceKm)}`
                          : `Driver is ${formatDistanceAway(driverDistanceKm)} (live location)`
                        : 'Driver location is updating…'
                      : 'We are matching you with a nearby driver now'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ marginBottom: 16 }}>
              {STEPS.map((step, i) => {
                const done = i <= currentStepIndex;
                const active = i === currentStepIndex && status !== 'delivered' && status !== 'cancelled';
                return (
                  <View key={step} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                    <View style={{ alignItems: 'center' }}>
                      <Animated.View
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 13,
                          backgroundColor: done ? T.action : T.border,
                          alignItems: 'center',
                          justifyContent: 'center',
                          transform: active ? [{ scale: stepPulse }] : undefined,
                        }}
                      >
                        {done ? (
                          <Check size={13} color="#FFF" strokeWidth={3} />
                        ) : (
                          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: T.textTer }} />
                        )}
                      </Animated.View>
                      {i < STEPS.length - 1 && (
                        <View style={{ width: 2, height: 24, backgroundColor: i < currentStepIndex ? T.action : T.border, marginTop: 2 }} />
                      )}
                    </View>
                    <Text
                      style={{
                        fontWeight: active ? '800' : done ? '700' : '500',
                        color: done ? T.text : T.textTer,
                        fontSize: 14,
                        paddingTop: 4,
                        marginBottom: i < STEPS.length - 1 ? 8 : 0,
                      }}
                    >
                      {STEP_LABELS[i]}
                    </Text>
                  </View>
                );
              })}
            </View>

            <View style={{ backgroundColor: T.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: T.border, marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ fontWeight: '800', fontSize: 15, color: T.text }}>Delivery instructions</Text>
                {canEditNotes && (
                  <Pressable onPress={openNotesEditor} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Pencil size={14} color={T.action} />
                    <Text style={{ color: T.action, fontWeight: '700', fontSize: 13 }}>
                      {order?.deliveryNotes ? 'Edit' : 'Add'}
                    </Text>
                  </Pressable>
                )}
              </View>
              <Text style={{ color: order?.deliveryNotes ? T.textSec : T.textTer, fontSize: 14, lineHeight: 20 }}>
                {order?.deliveryNotes?.trim() || 'No instructions added yet. Tap Add to tell the driver about gate codes, buzzers, or drop-off preferences.'}
              </Text>
            </View>

            {deliveryAddressLabel && (
              <View style={{ backgroundColor: T.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: T.border, marginBottom: 12, flexDirection: 'row', gap: 10 }}>
                <MapPin size={16} color={T.textSec} style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '800', fontSize: 14, color: T.text, marginBottom: 4 }}>Delivering to</Text>
                  <Text style={{ color: T.textSec, fontSize: 14, lineHeight: 20 }}>{deliveryAddressLabel}</Text>
                </View>
              </View>
            )}

            {tracking?.driver && (
              <View style={{ backgroundColor: T.surface, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: T.border, marginBottom: 12 }}>
                <Avatar uri={tracking.driver.avatar} name={`${tracking.driver.firstName} ${tracking.driver.lastName}`} size={48} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', fontSize: 15, color: T.text }}>
                    {tracking.driver.firstName} {tracking.driver.lastName}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <Star size={11} color={T.text} fill={T.text} />
                    <Text style={{ fontSize: 13, color: T.textSec }}>{tracking.driver.rating.toFixed(1)} · Your driver</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Pressable
                    onPress={() => {
                      if (!driverConversation) return;
                      router.push({
                        pathname: '/(modals)/chat/[conversationId]',
                        params: { conversationId: driverConversation.id, title: `${tracking.driver!.firstName} (Driver)` },
                      });
                    }}
                    disabled={!driverConversation}
                    style={{ backgroundColor: T.surface, borderWidth: 1, borderColor: T.border, borderRadius: 12, width: 44, height: 44, alignItems: 'center', justifyContent: 'center', opacity: driverConversation ? 1 : 0.5 }}
                  >
                    <MessageCircle size={18} color={T.text} />
                  </Pressable>
                  <Pressable
                    onPress={() => Linking.openURL(`tel:${tracking.driver!.phone}`)}
                    style={{ backgroundColor: T.action, borderRadius: 12, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Phone size={18} color="#FFF" />
                  </Pressable>
                </View>
              </View>
            )}

            {order && (
              <View style={{ backgroundColor: T.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: T.border, marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                  <Text style={{ fontWeight: '800', fontSize: 14, color: T.text }}>
                    {order.restaurantName || 'Your order'}
                  </Text>
                  <Text style={{ fontWeight: '800', color: T.text }}>{formatPrice(order.total)}</Text>
                </View>
                <Text style={{ color: T.textTer, fontSize: 12, marginBottom: 8 }}>#{order.id.slice(-6).toUpperCase()}</Text>
                {order.items.map((item) => (
                  <View key={item.id} style={{ marginBottom: 6 }}>
                    <Text style={{ color: T.textSec, fontSize: 13 }}>
                      {item.quantity}× {item.menuItemName}
                    </Text>
                    {item.instructions ? (
                      <Text style={{ color: T.textTer, fontSize: 12, marginTop: 2, fontStyle: 'italic' }}>
                        Note: {item.instructions}
                      </Text>
                    ) : null}
                  </View>
                ))}
              </View>
            )}

            {canCancel && (
              <Button
                variant="destructive"
                size="lg"
                fullWidth
                loading={cancelMutation.isPending}
                onPress={confirmCancel}
              >
                Cancel Order
              </Button>
            )}
          </>
        )}
      </ScrollView>

      <Modal visible={notesModalOpen} animationType="slide" transparent onRequestClose={() => setNotesModalOpen(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: T.bg, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 32 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <Text style={{ fontSize: 18, fontWeight: '900', color: T.text }}>Delivery instructions</Text>
              <Pressable onPress={() => setNotesModalOpen(false)} style={{ padding: 4 }}>
                <X size={20} color={T.text} />
              </Pressable>
            </View>
            <TextInput
              value={notesDraft}
              onChangeText={setNotesDraft}
              placeholder="Gate code, leave at door, ring bell…"
              placeholderTextColor={T.textTer}
              multiline
              numberOfLines={5}
              maxLength={500}
              style={{
                backgroundColor: T.surface,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: T.border,
                padding: 14,
                minHeight: 120,
                textAlignVertical: 'top',
                color: T.text,
                fontSize: 15,
              }}
            />
            <Text style={{ color: T.textTer, fontSize: 12, marginTop: 8, marginBottom: 16 }}>
              {notesDraft.length}/500 characters
            </Text>
            <Button
              size="lg"
              fullWidth
              loading={updateNotesMutation.isPending}
              onPress={() => updateNotesMutation.mutate(notesDraft)}
            >
              Save Instructions
            </Button>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}
