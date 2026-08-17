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
  Animated,
  Easing,
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
import { useAuthStore } from '@/stores/authStore';
import { getUserErrorMessage } from '@/utils/errorHandler';

const STEPS = ['placed', 'confirmed', 'preparing', 'ready', 'picked_up', 'on_way', 'delivered'] as const;
const STEP_LABELS = ['Placed', 'Confirmed', 'Preparing', 'Ready', 'Picked Up', 'On the Way', 'Delivered'];

// Sonar-style expanding rings — two rings, staggered, looping forever. Used
// under the customer marker while searching and around the driver marker
// while its live location is active, echoing Uber/Bolt's live-map feel.
function RadarRings({ color, size = 60 }: { color: string; size?: number }) {
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const make = (val: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, { toValue: 1, duration: 1800, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(val, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      );
    const loop1 = make(ring1, 0);
    const loop2 = make(ring2, 900);
    loop1.start();
    loop2.start();
    return () => {
      loop1.stop();
      loop2.stop();
    };
  }, [ring1, ring2]);

  const ringStyle = (val: Animated.Value) => ({
    position: 'absolute' as const,
    top: '50%' as const,
    left: '50%' as const,
    marginTop: -size / 2,
    marginLeft: -size / 2,
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: 2,
    borderColor: color,
    opacity: val.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }),
    transform: [{ scale: val.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) }],
  });

  return (
    <>
      <Animated.View style={ringStyle(ring1)} />
      <Animated.View style={ringStyle(ring2)} />
    </>
  );
}

export default function OrderTrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderId = String(id ?? '');
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { showToast } = useUIStore();
  const { currentLocation } = useLocationStore();
  const { data: tracking, isLoading: trackingLoading, isError: trackingError } = useOrderTracking(orderId);
  const { data: order, isLoading: orderLoading } = useOrderDetail(orderId);
  const { data: driverConversation } = useOrderConversation(orderId, 'customer_driver');

  const [ratePrompted, setRatePrompted] = useState(false);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [notesDraft, setNotesDraft] = useState('');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState<string | null>(null);
  const [cancelOtherText, setCancelOtherText] = useState('');
  const stepPulse = useRef(new Animated.Value(1)).current;

  // ─── Animation refs ──────────────────────────────────────────────────────
  // Staggered fade+slide entrance for the info cards, once real data is in.
  const cardsIn = useRef(new Animated.Value(0)).current;
  // Smooth gliding driver marker — lat/lng eased toward each new fix instead
  // of snapping, the signature Uber-Eats-style live-map feel.
  const driverAnimCoord = useRef(new Animated.ValueXY()).current;
  const [smoothDriverCoords, setSmoothDriverCoords] = useState<Coordinates | null>(null);
  const hasDriverCoordRef = useRef(false);
  // Celebratory burst when the order flips to delivered.
  const deliveredBurst = useRef(new Animated.Value(0)).current;
  const deliveredFiredRef = useRef(false);

  const status = tracking?.status ?? order?.status ?? 'placed';
  const currentStepIndex = Math.max(0, STEPS.indexOf(status as typeof STEPS[number]));
  const etaMinutes = tracking?.eta ?? order?.estimatedDeliveryTime ?? 35;
  const canEditNotes = ['placed', 'confirmed', 'preparing'].includes(status);
  const canCancel = canCancelOrderStatus(status);

  useEffect(() => {
    if (!orderId || !order?.restaurantId) return;
    void chatService.ensureOrderConversations({
      orderId,
      customerId: user?.id,
      restaurantId: order.restaurantId,
      driverId: tracking?.driver?.id,
    });
  }, [orderId, user?.id, order?.restaurantId, tracking?.driver?.id]);

  useEffect(() => {
    if (status === 'delivered' && !ratePrompted && !order?.rating) {
      setRatePrompted(true);
      const t = setTimeout(() => {
        router.push({ pathname: '/(modals)/rate-order', params: { orderId } });
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [status, ratePrompted, orderId, order?.rating]);

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
    mutationFn: (reason: string) => orderService.cancel(orderId, reason),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      const fee = updated.cancellationFee ?? 0;
      showToast(
        fee > 0
          ? `Order cancelled — a ${formatPrice(fee)} cancellation fee applies.`
          : 'Order cancelled',
        'success',
      );
      setCancelModalOpen(false);
      router.replace('/(customer)/(orders)');
    },
    onError: (error) => showToast(getUserErrorMessage(error, 'This order can no longer be cancelled.'), 'error'),
  });

  const openNotesEditor = () => {
    setNotesDraft(order?.deliveryNotes ?? '');
    setNotesModalOpen(true);
  };

  const CANCEL_REASONS = ['Changed my mind', 'Ordering elsewhere', 'Taking too long', 'Other'];
  const cancelFeeApplies = status === 'preparing';
  const cancelFeeEstimate = order ? Math.round(order.total * 0.10 * 100) / 100 : 0;

  const openCancelModal = () => {
    setCancelReason(null);
    setCancelOtherText('');
    setCancelModalOpen(true);
  };

  const confirmCancel = () => {
    const reason = cancelReason === 'Other' ? cancelOtherText.trim() : cancelReason;
    if (!reason) {
      showToast('Please select a reason for cancelling.', 'error');
      return;
    }
    cancelMutation.mutate(reason);
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

  // Glide the driver marker smoothly toward each new GPS fix instead of
  // snapping — jump straight there the first time we see the driver, then
  // ease over subsequent updates.
  useEffect(() => {
    if (!driverCoords) return;
    if (!hasDriverCoordRef.current) {
      hasDriverCoordRef.current = true;
      driverAnimCoord.setValue({ x: driverCoords.latitude, y: driverCoords.longitude });
      setSmoothDriverCoords(driverCoords);
      return;
    }
    Animated.timing(driverAnimCoord, {
      toValue: { x: driverCoords.latitude, y: driverCoords.longitude },
      duration: 2200,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [driverCoords, driverAnimCoord]);

  useEffect(() => {
    const id = driverAnimCoord.addListener(({ x, y }) => setSmoothDriverCoords({ latitude: x, longitude: y }));
    return () => driverAnimCoord.removeListener(id);
  }, [driverAnimCoord]);

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
            <View style={{ width: 18, height: 18, alignItems: 'center', justifyContent: 'center' }}>
              {!driverAccepted && <RadarRings color={T.action} size={44} />}
              <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: T.action, borderWidth: 3, borderColor: '#FFF' }} />
            </View>
          </View>
        ),
      });
    }
    const driverMarkerCoords = smoothDriverCoords ?? driverCoords;
    if (driverMarkerCoords && driverAccepted) {
      markers.push({
        id: 'driver',
        latitude: driverMarkerCoords.latitude,
        longitude: driverMarkerCoords.longitude,
        children: (
          <View style={{ alignItems: 'center', justifyContent: 'center', width: 60, height: 60 }}>
            <RadarRings color={T.success} size={60} />
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: T.success, borderWidth: 3, borderColor: '#FFF', alignItems: 'center', justifyContent: 'center' }}>
              <Car size={18} color="#FFF" />
            </View>
          </View>
        ),
      });
    }
    return markers;
  }, [customerCoords, driverCoords, smoothDriverCoords, driverAccepted]);

  const isLoading = trackingLoading || orderLoading;

  // The backend can cold-start after being idle (hosting free-tier sleep),
  // which can take up to a minute on the first request — surface that after
  // a few seconds instead of leaving a bare spinner with no explanation.
  const [showColdStartHint, setShowColdStartHint] = useState(false);
  useEffect(() => {
    if (!isLoading) {
      setShowColdStartHint(false);
      return;
    }
    const t = setTimeout(() => setShowColdStartHint(true), 4000);
    return () => clearTimeout(t);
  }, [isLoading]);

  // Fade + slide the info cards in together once real data is ready.
  useEffect(() => {
    if (isLoading) return;
    Animated.timing(cardsIn, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [isLoading, cardsIn]);

  // One-shot celebratory burst the moment the order flips to delivered.
  useEffect(() => {
    if (status === 'delivered' && !deliveredFiredRef.current) {
      deliveredFiredRef.current = true;
      deliveredBurst.setValue(0);
      Animated.sequence([
        Animated.spring(deliveredBurst, { toValue: 1, useNativeDriver: true, tension: 80, friction: 6 }),
      ]).start();
    }
  }, [status, deliveredBurst]);

  // Staggered entrance style for the Nth card — same driving value, offset ranges.
  const cardEntrance = (index: number) => {
    const start = index * 0.08;
    const end = Math.min(1, start + 0.5);
    return {
      opacity: cardsIn.interpolate({ inputRange: [start, end], outputRange: [0, 1], extrapolate: 'clamp' }),
      transform: [
        {
          translateY: cardsIn.interpolate({ inputRange: [start, end], outputRange: [16, 0], extrapolate: 'clamp' }),
        },
      ],
    };
  };

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
            {showColdStartHint && (
              <Text style={{ marginTop: 8, color: T.textTer, fontSize: 12, textAlign: 'center', paddingHorizontal: 24 }}>
                This can take up to a minute if our server was idle. Hang tight…
              </Text>
            )}
          </View>
        ) : (
          <>
            {trackingError && !tracking && (
              <View style={{ backgroundColor: T.dangerBg, borderRadius: 14, padding: 14, marginBottom: 16 }}>
                <Text style={{ color: T.danger, fontSize: 13, lineHeight: 19 }}>
                  Live tracking is temporarily unavailable — showing your last known order status below.
                  We'll keep retrying automatically.
                </Text>
              </View>
            )}
            <Animated.View style={[{ backgroundColor: T.surface, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: T.border, marginBottom: 16, overflow: 'hidden' }, cardEntrance(0)]}>
              {status === 'delivered' && (
                <Animated.View
                  pointerEvents="none"
                  style={{
                    position: 'absolute',
                    top: -30,
                    right: -30,
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    backgroundColor: T.successBg,
                    opacity: deliveredBurst.interpolate({ inputRange: [0, 1], outputRange: [0, 0.6] }),
                    transform: [{ scale: deliveredBurst }],
                  }}
                />
              )}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <Clock size={14} color={T.action} />
                    <Text style={{ color: T.textTer, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 }}>
                      ESTIMATED ARRIVAL
                    </Text>
                  </View>
                  <Animated.Text
                    style={{
                      fontWeight: '900',
                      fontSize: 34,
                      color: T.text,
                      lineHeight: 38,
                      transform: [{ scale: status === 'delivered' ? deliveredBurst.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) : 1 }],
                    }}
                  >
                    {status === 'delivered' ? '🎉 Delivered' : formatETA(etaMinutes)}
                  </Animated.Text>
                  <Text style={{ color: T.textSec, fontSize: 14, marginTop: 6, lineHeight: 20 }}>
                    {statusSubtitle(status, { driverAccepted, driverDistanceKm })}
                  </Text>
                </View>
                <Badge
                  label={formatOrderStatus(status)}
                  variant={status === 'delivered' ? 'success' : status === 'cancelled' ? 'danger' : 'outline'}
                />
              </View>
            </Animated.View>

            <Animated.View style={[{ backgroundColor: driverAccepted ? T.successBg : T.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: driverAccepted ? T.success : T.border, marginBottom: 16 }, cardEntrance(1)]}>
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
            </Animated.View>

            <Animated.View style={[{ marginBottom: 16 }, cardEntrance(2)]}>
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
                          // Keep a stable transform array (never toggle to `undefined`) —
                          // avoids a known RN Animated native-module crash, see payment-success.tsx.
                          transform: [{ scale: active ? stepPulse : 1 }],
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
            </Animated.View>

            <Animated.View style={[{ backgroundColor: T.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: T.border, marginBottom: 12 }, cardEntrance(3)]}>
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
            </Animated.View>

            {deliveryAddressLabel && (
              <Animated.View style={[{ backgroundColor: T.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: T.border, marginBottom: 12, flexDirection: 'row', gap: 10 }, cardEntrance(4)]}>
                <MapPin size={16} color={T.textSec} style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '800', fontSize: 14, color: T.text, marginBottom: 4 }}>Delivering to</Text>
                  <Text style={{ color: T.textSec, fontSize: 14, lineHeight: 20 }}>{deliveryAddressLabel}</Text>
                </View>
              </Animated.View>
            )}

            {tracking?.driver && (
              <Animated.View style={[{ backgroundColor: T.surface, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: T.border, marginBottom: 12 }, cardEntrance(5)]}>
                <Avatar uri={tracking.driver.avatar} name={`${tracking.driver.firstName} ${tracking.driver.lastName}`} size={48} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', fontSize: 15, color: T.text }}>
                    {tracking.driver.firstName} {tracking.driver.lastName}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <Star size={11} color={T.text} fill={T.text} />
                    <Text style={{ fontSize: 13, color: T.textSec }}>{tracking.driver.rating.toFixed(1)} · Your driver</Text>
                  </View>
                  {(tracking.driver.vehicle.make || tracking.driver.vehicleType || tracking.driver.vehicle.plateNumber) && (
                    <Text style={{ fontSize: 12, color: T.textTer, marginTop: 2 }}>
                      {[tracking.driver.vehicleType, tracking.driver.vehicle.make].filter(Boolean).join(' · ')}
                      {tracking.driver.vehicle.plateNumber ? ` · ${tracking.driver.vehicle.plateNumber}` : ''}
                    </Text>
                  )}
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
              </Animated.View>
            )}

            {order && (
              <Animated.View style={[{ backgroundColor: T.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: T.border, marginBottom: 16 }, cardEntrance(6)]}>
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
                    {item.addons.length > 0 && (
                      <Text style={{ color: T.textTer, fontSize: 12, marginTop: 2 }}>
                        + {item.addons.map((a) => a.name).join(', ')}
                      </Text>
                    )}
                    {item.instructions ? (
                      <Text style={{ color: T.textTer, fontSize: 12, marginTop: 2, fontStyle: 'italic' }}>
                        Note: {item.instructions}
                      </Text>
                    ) : null}
                  </View>
                ))}

                <View style={{ height: 1, backgroundColor: T.border, marginVertical: 10 }} />
                {[
                  ['Subtotal', order.subtotal],
                  ['Delivery Fee', order.deliveryFee],
                  ['Service Fee', order.serviceFee],
                  ...(order.discount > 0 ? [['Discount', -order.discount] as const] : []),
                ].map(([label, value]) => (
                  <View key={label as string} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={{ color: T.textSec, fontSize: 13 }}>{label}</Text>
                    <Text style={{ color: T.textSec, fontSize: 13 }}>
                      {(value as number) < 0 ? '-' : ''}{formatPrice(Math.abs(value as number))}
                    </Text>
                  </View>
                ))}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                  <Text style={{ color: T.text, fontWeight: '800', fontSize: 14 }}>Total</Text>
                  <Text style={{ color: T.text, fontWeight: '800', fontSize: 14 }}>{formatPrice(order.total)}</Text>
                </View>
              </Animated.View>
            )}

            {canCancel && (
              <Button
                variant="destructive"
                size="lg"
                fullWidth
                loading={cancelMutation.isPending}
                onPress={openCancelModal}
              >
                Cancel Order
              </Button>
            )}

            {status === 'delivered' && !order?.rating && (
              <View style={{ marginTop: canCancel ? 12 : 0 }}>
                <Button
                  size="lg"
                  fullWidth
                  onPress={() => router.push({ pathname: '/(modals)/rate-order', params: { orderId } })}
                >
                  Rate order & driver
                </Button>
              </View>
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

      <Modal visible={cancelModalOpen} animationType="slide" transparent onRequestClose={() => setCancelModalOpen(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: T.bg, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 32 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <Text style={{ fontSize: 18, fontWeight: '900', color: T.text }}>Cancel order?</Text>
              <Pressable onPress={() => setCancelModalOpen(false)} style={{ padding: 4 }}>
                <X size={20} color={T.text} />
              </Pressable>
            </View>

            <Text style={{ color: T.textSec, fontSize: 13, marginBottom: 12 }}>Tell us why you're cancelling:</Text>
            {CANCEL_REASONS.map((reason) => (
              <Pressable
                key={reason}
                onPress={() => setCancelReason(reason)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 14,
                  borderRadius: 12,
                  borderWidth: 1.5,
                  borderColor: cancelReason === reason ? T.action : T.border,
                  backgroundColor: cancelReason === reason ? T.goldBg : T.surface,
                  marginBottom: 8,
                }}
              >
                <Text style={{ color: T.text, fontSize: 14, fontWeight: cancelReason === reason ? '700' : '500' }}>{reason}</Text>
              </Pressable>
            ))}

            {cancelReason === 'Other' && (
              <TextInput
                value={cancelOtherText}
                onChangeText={setCancelOtherText}
                placeholder="Tell us more…"
                placeholderTextColor={T.textTer}
                multiline
                numberOfLines={3}
                maxLength={300}
                style={{
                  backgroundColor: T.surface,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: T.border,
                  padding: 12,
                  minHeight: 80,
                  textAlignVertical: 'top',
                  color: T.text,
                  fontSize: 14,
                  marginBottom: 8,
                }}
              />
            )}

            {cancelFeeApplies && (
              <View style={{ backgroundColor: T.dangerBg, borderRadius: 12, padding: 12, marginTop: 8, marginBottom: 8 }}>
                <Text style={{ color: T.danger, fontSize: 13, lineHeight: 19 }}>
                  A 10% cancellation fee ({formatPrice(cancelFeeEstimate)}) applies since the restaurant has already
                  started preparing your order.
                </Text>
              </View>
            )}

            <Button
              variant="destructive"
              size="lg"
              fullWidth
              loading={cancelMutation.isPending}
              onPress={confirmCancel}
              style={{ marginTop: 8 }}
            >
              Confirm Cancellation
            </Button>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}
