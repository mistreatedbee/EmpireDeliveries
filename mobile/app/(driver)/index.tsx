import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Switch, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Location from 'expo-location';
import { PlatformMap } from '@/components/map/PlatformMap';
import { Bike, MapPin } from 'lucide-react-native';
import { useAuthStore } from '@/stores/authStore';
import { useLocationStore } from '@/stores/locationStore';
import { driverService } from '@/services/driver.service';
import { Colors } from '@/constants/colors';

const COUNTDOWN_SECONDS = 28;

export default function DriverDashboard() {
  const { user } = useAuthStore();
  const { currentLocation, setCurrentLocation } = useLocationStore();
  const queryClient = useQueryClient();
  const [online, setOnline] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const locationWatchRef = useRef<Location.LocationSubscription | null>(null);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['driver', 'stats'],
    queryFn: driverService.getStats,
    enabled: online,
    refetchInterval: online ? 30000 : false,
  });

  const { data: available, isLoading: availLoading } = useQuery({
    queryKey: ['driver', 'available'],
    queryFn: driverService.getAvailableDelivery,
    enabled: online,
    refetchInterval: online ? 8000 : false,
  });

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
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['driver', 'available'] });
      queryClient.invalidateQueries({ queryKey: ['driver', 'stats'] });
      router.push({ pathname: '/(driver)/delivery', params: { orderId } });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (orderId: string) => driverService.rejectDelivery(orderId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['driver', 'available'] }),
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

  // Cleanup on unmount
  useEffect(() => () => { stopLocationWatch(); }, []);

  // Reset countdown whenever a new delivery request appears
  useEffect(() => {
    if (!available) return;
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
  }, [available?.orderId]);

  const handleToggle = (v: boolean) => {
    statusMutation.mutate(v);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.surface[100] }}>
      {/* Header */}
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
        {/* Online Toggle */}
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
              {statsLoading ? (
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

        {/* Delivery Request */}
        {online && availLoading && (
          <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            <ActivityIndicator color={Colors.gold[500]} />
            <Text style={{ color: '#888', marginTop: 8 }}>Looking for deliveries...</Text>
          </View>
        )}

        {online && !availLoading && available && (
          <View style={{ backgroundColor: '#fff', borderRadius: 24, borderWidth: 2, borderColor: Colors.gold[500], marginBottom: 16, overflow: 'hidden' }}>
            <View style={{ padding: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <View style={{ backgroundColor: Colors.gold[500], paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 }}>
                  <Text style={{ color: Colors.empire.black, fontWeight: '800', fontSize: 12 }}>New Request</Text>
                </View>
                <Text style={{ color: Colors.empire.error, fontWeight: '700', fontSize: 13 }}>
                  Expires in 0:{String(countdown).padStart(2, '0')}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: Colors.surface[200], alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={22} color={Colors.gold[500]} />
                </View>
                <View>
                  <Text style={{ fontWeight: '700', color: Colors.empire.black, fontSize: 15 }}>{available.restaurantName}</Text>
                  <Text style={{ color: '#888', fontSize: 12, marginTop: 2 }}>{available.itemCount} item{available.itemCount !== 1 ? 's' : ''}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                {[
                  { label: 'ETA', value: `${available.etaMinutes} min` },
                  { label: 'Payout', value: `R${available.payout.toFixed(0)}` },
                ].map((s) => (
                  <View key={s.label} style={{ flex: 1, backgroundColor: Colors.surface[100], borderRadius: 14, padding: 10, alignItems: 'center' }}>
                    <Text style={{ fontWeight: '800', color: Colors.empire.black, fontSize: 14 }}>{s.value}</Text>
                    <Text style={{ color: '#aaa', fontSize: 11, marginTop: 2 }}>{s.label}</Text>
                  </View>
                ))}
              </View>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Pressable
                  onPress={() => rejectMutation.mutate(available.orderId)}
                  disabled={rejectMutation.isPending || acceptMutation.isPending}
                  style={{ flex: 1, paddingVertical: 14, borderRadius: 16, borderWidth: 2, borderColor: Colors.surface[300], alignItems: 'center' }}
                >
                  <Text style={{ color: '#888', fontWeight: '700' }}>Decline</Text>
                </Pressable>
                <Pressable
                  onPress={() => acceptMutation.mutate(available.orderId)}
                  disabled={acceptMutation.isPending || rejectMutation.isPending}
                  style={{ flex: 1, paddingVertical: 14, borderRadius: 16, backgroundColor: Colors.empire.success, alignItems: 'center' }}
                >
                  {acceptMutation.isPending
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={{ color: '#fff', fontWeight: '800' }}>Accept</Text>}
                </Pressable>
              </View>
            </View>
            {/* Progress bar indicating countdown */}
            <View style={{ height: 4, backgroundColor: Colors.surface[200] }}>
              <View style={{ width: `${(countdown / COUNTDOWN_SECONDS) * 100}%`, height: '100%', backgroundColor: Colors.gold[500] }} />
            </View>
          </View>
        )}

        {online && !availLoading && !available && (
          <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: Colors.surface[200] }}>
            <Text style={{ color: '#888', fontSize: 15, textAlign: 'center' }}>No deliveries available right now</Text>
            <Text style={{ color: '#bbb', fontSize: 13, marginTop: 4 }}>We'll notify you when a request comes in</Text>
          </View>
        )}

        {/* Driver location map */}
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

        {/* Recent Deliveries */}
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
