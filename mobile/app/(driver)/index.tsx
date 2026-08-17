import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Switch, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Location from 'expo-location';
import { PlatformMap } from '@/components/map/PlatformMap';
import { Bike, MapPin, Navigation } from 'lucide-react-native';
import { useAuthStore } from '@/stores/authStore';
import { useLocationStore } from '@/stores/locationStore';
import { driverService, AvailableDelivery } from '@/services/driver.service';
import { QueryErrorState } from '@/components/empire';
import { Colors } from '@/constants/colors';

const COUNTDOWN_SECONDS = 28;

function RequestCard({
  request,
  countdown,
  onAccept,
  onDecline,
  accepting,
  declining,
}: {
  request: AvailableDelivery;
  countdown: number;
  onAccept: () => void;
  onDecline: () => void;
  accepting: boolean;
  declining: boolean;
}) {
  return (
    <View style={{ backgroundColor: '#fff', borderRadius: 24, borderWidth: 2, borderColor: Colors.gold[500], marginBottom: 12, overflow: 'hidden' }}>
      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <View style={{ backgroundColor: Colors.gold[500], paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 }}>
            <Text style={{ color: Colors.empire.black, fontWeight: '800', fontSize: 12 }}>New Request</Text>
          </View>
          <Text style={{ color: Colors.empire.error, fontWeight: '700', fontSize: 13 }}>
            Expires in 0:{String(countdown).padStart(2, '0')}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: Colors.surface[200], alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={22} color={Colors.gold[500]} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '700', color: Colors.empire.black, fontSize: 15 }}>{request.restaurantName}</Text>
            <Text style={{ color: '#888', fontSize: 12, marginTop: 2 }} numberOfLines={1}>{request.restaurantAddress}</Text>
          </View>
        </View>

        <View style={{ backgroundColor: Colors.surface[100], borderRadius: 14, padding: 12, marginBottom: 12 }}>
          <Text style={{ color: '#aaa', fontSize: 11, fontWeight: '600', textTransform: 'uppercase' }}>Deliver to</Text>
          <Text style={{ fontWeight: '700', color: Colors.empire.black, fontSize: 14, marginTop: 4 }}>{request.customerName}</Text>
          <Text style={{ color: '#888', fontSize: 12, marginTop: 2 }} numberOfLines={2}>{request.customerAddress}</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          {[
            { label: 'ETA', value: `${request.etaMinutes} min` },
            { label: 'Items', value: String(request.itemCount) },
            { label: 'Payout', value: `R${request.payout.toFixed(0)}` },
            ...(request.distanceKm != null ? [{ label: 'Distance', value: `${request.distanceKm.toFixed(1)} km` }] : []),
          ].map((s) => (
            <View key={s.label} style={{ flex: 1, backgroundColor: Colors.surface[100], borderRadius: 14, padding: 10, alignItems: 'center' }}>
              <Text style={{ fontWeight: '800', color: Colors.empire.black, fontSize: 14 }}>{s.value}</Text>
              <Text style={{ color: '#aaa', fontSize: 11, marginTop: 2 }}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Pressable
            onPress={onDecline}
            disabled={declining || accepting}
            style={{ flex: 1, paddingVertical: 14, borderRadius: 16, borderWidth: 2, borderColor: Colors.surface[300], alignItems: 'center' }}
          >
            <Text style={{ color: '#888', fontWeight: '700' }}>{declining ? 'Declining…' : 'Decline'}</Text>
          </Pressable>
          <Pressable
            onPress={onAccept}
            disabled={accepting || declining}
            style={{ flex: 1, paddingVertical: 14, borderRadius: 16, backgroundColor: Colors.empire.success, alignItems: 'center' }}
          >
            {accepting
              ? <ActivityIndicator color="#fff" />
              : <Text style={{ color: '#fff', fontWeight: '800' }}>Accept</Text>}
          </Pressable>
        </View>
      </View>
      <View style={{ height: 4, backgroundColor: Colors.surface[200] }}>
        <View style={{ width: `${(countdown / COUNTDOWN_SECONDS) * 100}%`, height: '100%', backgroundColor: Colors.gold[500] }} />
      </View>
    </View>
  );
}

export default function DriverDashboard() {
  const { user } = useAuthStore();
  const { currentLocation, setCurrentLocation } = useLocationStore();
  const queryClient = useQueryClient();
  const [online, setOnline] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const locationWatchRef = useRef<Location.LocationSubscription | null>(null);
  const resumedDeliveryRef = useRef(false);
  const autoDeclinedRef = useRef<string | null>(null);

  const { data: stats, isLoading: statsLoading, isError: statsError, refetch: refetchStats } = useQuery({
    queryKey: ['driver', 'stats'],
    queryFn: driverService.getStats,
    enabled: online,
    refetchInterval: online ? 30000 : false,
  });

  const { data: availableList = [], isLoading: availLoading } = useQuery({
    queryKey: ['driver', 'available'],
    queryFn: driverService.getAvailableDeliveries,
    enabled: online,
    refetchInterval: online ? 5000 : false,
  });

  const { data: activeDelivery } = useQuery({
    queryKey: ['driver', 'active'],
    queryFn: driverService.getActiveDelivery,
    enabled: online,
    refetchInterval: online ? 8000 : false,
  });

  useEffect(() => {
    if (!activeDelivery?.orderId) {
      resumedDeliveryRef.current = false;
      return;
    }
    if (!online || resumedDeliveryRef.current) return;
    resumedDeliveryRef.current = true;
    router.push({ pathname: '/(driver)/delivery', params: { orderId: activeDelivery.orderId } });
  }, [online, activeDelivery?.orderId]);

  const { data: history } = useQuery({
    queryKey: ['driver', 'history'],
    queryFn: driverService.getHistory,
  });

  const statusMutation = useMutation({
    mutationFn: async (on: boolean) => {
      if (on) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          setCurrentLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
          await driverService.setStatus(true, loc.coords.latitude, loc.coords.longitude);
        } else {
          await driverService.setStatus(true);
        }
      } else {
        await driverService.setStatus(false);
      }
      return on;
    },
    onSuccess: (on) => {
      setOnline(on);
      if (on) {
        startLocationWatch();
      } else {
        stopLocationWatch();
        queryClient.removeQueries({ queryKey: ['driver', 'available'] });
      }
    },
  });

  const acceptMutation = useMutation({
    mutationFn: (orderId: string) => driverService.acceptDelivery(orderId),
    onMutate: (orderId) => setPendingOrderId(orderId),
    onSuccess: async (_, orderId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['driver', 'available'] }),
        queryClient.invalidateQueries({ queryKey: ['driver', 'active'] }),
        queryClient.invalidateQueries({ queryKey: ['driver', 'stats'] }),
      ]);
      router.push({ pathname: '/(driver)/delivery', params: { orderId } });
    },
    onError: () => Alert.alert('Could not accept', 'This delivery may have been taken by another driver. Pull to refresh.'),
    onSettled: () => setPendingOrderId(null),
  });

  const rejectMutation = useMutation({
    mutationFn: (orderId: string) => driverService.rejectDelivery(orderId),
    onMutate: (orderId) => setPendingOrderId(orderId),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['driver', 'available'] }),
    onError: () => Alert.alert('Could not decline', 'Please try again.'),
    onSettled: () => setPendingOrderId(null),
  });

  function startLocationWatch() {
    stopLocationWatch();
    Location.watchPositionAsync(
      { accuracy: Location.Accuracy.Balanced, timeInterval: 30000, distanceInterval: 50 },
      (loc) => {
        setCurrentLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
        void driverService.updateLocation(loc.coords.latitude, loc.coords.longitude).catch(() => null);
      }
    ).then((sub) => { locationWatchRef.current = sub; }).catch(() => null);
  }

  function stopLocationWatch() {
    if (locationWatchRef.current) {
      locationWatchRef.current.remove();
      locationWatchRef.current = null;
    }
  }

  useEffect(() => () => { stopLocationWatch(); }, []);

  const requestsKey = availableList.map((r) => r.orderId).join(',');

  useEffect(() => {
    if (!availableList.length || activeDelivery) return;
    autoDeclinedRef.current = null;
    setCountdown(COUNTDOWN_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [requestsKey, activeDelivery]);

  useEffect(() => {
    if (countdown !== 0 || !availableList.length || activeDelivery) return;
    const first = availableList[0];
    if (!first || autoDeclinedRef.current === first.orderId) return;
    autoDeclinedRef.current = first.orderId;
    void driverService.rejectDelivery(first.orderId)
      .then(() => queryClient.invalidateQueries({ queryKey: ['driver', 'available'] }))
      .catch(() => null);
  }, [countdown, availableList, activeDelivery, queryClient]);

  const handleToggle = (v: boolean) => {
    statusMutation.mutate(v);
  };

  const hasActiveDelivery = Boolean(activeDelivery?.orderId);
  const showRequests = online && !hasActiveDelivery && availableList.length > 0;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.surface[100] }}>
      <View style={{ backgroundColor: Colors.empire.black, paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Welcome back,</Text>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '900' }}>{user?.firstName ?? 'Driver'}</Text>
          </View>
          <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.empire.charcoal, borderWidth: 2, borderColor: Colors.gold[500], alignItems: 'center', justifyContent: 'center' }}>
            <Bike size={22} color={Colors.gold[500]} />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View style={{ borderRadius: 24, padding: 20, backgroundColor: online ? Colors.empire.success : '#9E9E9E', marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: '900' }}>{online ? "You're Online" : "You're Offline"}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 }}>
                {online ? 'Ready to receive deliveries' : 'Toggle to start earning'}
              </Text>
            </View>
            <Switch
              value={online}
              onValueChange={handleToggle}
              disabled={statusMutation.isPending}
              trackColor={{ false: 'rgba(0,0,0,0.2)', true: 'rgba(255,255,255,0.3)' }}
              thumbColor="#fff"
            />
          </View>
          {online && (
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
              {statsError ? (
                <QueryErrorState message="Could not load today's stats." onRetry={() => refetchStats()} />
              ) : statsLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                [
                  { label: 'Today', value: `R${(stats?.earnings ?? 0).toFixed(0)}` },
                  { label: 'Deliveries', value: String(stats?.trips ?? 0) },
                  { label: 'Acceptance', value: `${(stats?.acceptanceRate ?? 100).toFixed(0)}%` },
                ].map((s) => (
                  <View key={s.label} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 12, alignItems: 'center' }}>
                    <Text style={{ color: '#fff', fontWeight: '900', fontSize: 18 }}>{s.value}</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2 }}>{s.label}</Text>
                  </View>
                ))
              )}
            </View>
          )}
        </View>

        {online && hasActiveDelivery && activeDelivery && (
          <Pressable
            onPress={() => router.push({ pathname: '/(driver)/delivery', params: { orderId: activeDelivery.orderId } })}
            style={{ backgroundColor: Colors.empire.black, borderRadius: 20, padding: 16, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}
          >
            <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.gold[500], alignItems: 'center', justifyContent: 'center' }}>
              <Navigation size={20} color={Colors.empire.black} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>Active delivery in progress</Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 }}>
                {activeDelivery.restaurantName} → {activeDelivery.customerName}
              </Text>
            </View>
            <Text style={{ color: Colors.gold[500], fontWeight: '800' }}>Continue</Text>
          </Pressable>
        )}

        {online && !hasActiveDelivery && availLoading && (
          <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            <ActivityIndicator color={Colors.gold[500]} />
            <Text style={{ color: '#888', marginTop: 8 }}>Looking for deliveries...</Text>
          </View>
        )}

        {showRequests && (
          <>
            <Text style={{ fontWeight: '800', color: Colors.empire.black, fontSize: 16, marginBottom: 10 }}>
              {availableList.length} request{availableList.length !== 1 ? 's' : ''} nearby
            </Text>
            {availableList.map((request) => (
              <RequestCard
                key={request.orderId}
                request={request}
                countdown={countdown}
                accepting={acceptMutation.isPending && pendingOrderId === request.orderId}
                declining={rejectMutation.isPending && pendingOrderId === request.orderId}
                onAccept={() => acceptMutation.mutate(request.orderId)}
                onDecline={() => rejectMutation.mutate(request.orderId)}
              />
            ))}
          </>
        )}

        {online && !hasActiveDelivery && !availLoading && availableList.length === 0 && (
          <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: Colors.surface[200] }}>
            <Text style={{ color: '#888', fontSize: 15, textAlign: 'center' }}>No deliveries available right now</Text>
            <Text style={{ color: '#bbb', fontSize: 13, marginTop: 4 }}>New requests will appear here automatically</Text>
          </View>
        )}

        {currentLocation ? (
          <View style={{ borderRadius: 24, overflow: 'hidden', height: 160, marginBottom: 20 }}>
            <PlatformMap
              style={{ flex: 1 }}
              region={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }}
              markers={[
                {
                  id: 'self',
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                  children: (
                    <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: Colors.gold[500], borderWidth: 3, borderColor: '#fff' }} />
                  ),
                },
              ]}
            />
          </View>
        ) : (
          <View style={{ borderRadius: 24, overflow: 'hidden', height: 160, marginBottom: 20, backgroundColor: Colors.surface[200], alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={40} color="#bbb" />
            <Text style={{ color: '#999', marginTop: 8, fontWeight: '600' }}>Go online to show your location</Text>
          </View>
        )}

        <Text style={{ fontWeight: '800', color: Colors.empire.black, fontSize: 16, marginBottom: 12 }}>Recent Deliveries</Text>
        {(history ?? []).slice(0, 5).map((d) => (
          <View key={d.orderId} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: Colors.surface[200] }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.surface[100], alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Bike size={18} color={Colors.gold[500]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700', fontSize: 13, color: Colors.empire.black }}>{d.restaurantName}</Text>
              <Text style={{ color: '#aaa', fontSize: 12, marginTop: 2 }}>
                {new Date(d.deliveredAt).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            <Text style={{ fontWeight: '800', color: Colors.empire.success, fontSize: 14 }}>R{d.payout.toFixed(0)}</Text>
          </View>
        ))}
        {(!history || history.length === 0) && (
          <Text style={{ color: '#bbb', textAlign: 'center', fontSize: 14, paddingVertical: 8 }}>No completed deliveries yet</Text>
        )}
      </ScrollView>
    </View>
  );
}
