import React, { useRef, useEffect } from 'react';
import { View, Text, Pressable, Linking, ActivityIndicator, ScrollView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, AnimatedRegion } from 'react-native-maps';
import { Animated } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Check, Car, Phone, Star } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { useOrderTracking, useOrderDetail } from '@/hooks/useOrders';
import { useLocationStore } from '@/stores/locationStore';
import { T } from '@/constants/colors';
import { formatOrderStatus, formatETA } from '@/utils/formatters';

const STEPS = ['placed', 'confirmed', 'preparing', 'picked_up', 'on_way', 'delivered'];
const STEP_LABELS = ['Placed', 'Confirmed', 'Preparing', 'Picked Up', 'On the Way', 'Delivered'];

export default function OrderTrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: tracking, isLoading } = useOrderTracking(id);
  const { data: order } = useOrderDetail(id);
  const { currentLocation } = useLocationStore();

  const driverRegion = useRef(
    new AnimatedRegion({ latitude: -26.2041, longitude: 28.0473, latitudeDelta: 0.015, longitudeDelta: 0.015 }),
  ).current;

  useEffect(() => {
    if (tracking?.driver) {
      (driverRegion as AnimatedRegion & { timing: (cfg: object) => { start: () => void } }).timing({
        toValue: 0,
        latitude: tracking.driver.latitude,
        longitude: tracking.driver.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [tracking?.driver, driverRegion]);

  const currentStepIndex = tracking ? STEPS.indexOf(tracking.status) : 0;

  return (
    <ScreenWrapper bg="white" edges={['bottom']}>
      {/* Back button */}
      <View style={{ position: 'absolute', top: 52, left: 16, zIndex: 10 }}>
        <Pressable
          onPress={() => router.back()}
          style={{ backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: T.border }}
        >
          <Text style={{ fontSize: 18, color: T.text }}>←</Text>
        </Pressable>
      </View>

      {/* Map */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ height: '50%' }}
        initialRegion={{
          latitude: currentLocation?.latitude ?? -26.2041,
          longitude: currentLocation?.longitude ?? 28.0473,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {currentLocation && (
          <Marker coordinate={currentLocation} title="Your location">
            <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: T.action, borderWidth: 3, borderColor: '#FFF' }} />
          </Marker>
        )}
        {tracking?.driver && (
          <Marker coordinate={{ latitude: tracking.driver.latitude, longitude: tracking.driver.longitude }} title={tracking.driver.firstName}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: T.action, borderWidth: 2, borderColor: '#FFF', alignItems: 'center', justifyContent: 'center' }}>
              <Car size={18} color="#FFF" />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Status panel */}
      <ScrollView style={{ backgroundColor: T.bg, borderTopLeftRadius: 20, borderTopRightRadius: 20 }} contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
        {isLoading ? (
          <View style={{ alignItems: 'center', paddingVertical: 32 }}>
            <ActivityIndicator size="large" color={T.action} />
          </View>
        ) : (
          <>
            {/* ETA hero */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <View>
                <Text style={{ fontWeight: '900', fontSize: 28, color: T.text, lineHeight: 32 }}>
                  {tracking?.eta ? formatETA(tracking.eta) : '—'}
                </Text>
                <Text style={{ color: T.textSec, fontSize: 14, marginTop: 2 }}>
                  {formatOrderStatus(tracking?.status ?? 'placed')}
                </Text>
              </View>
              <Badge
                label={formatOrderStatus(tracking?.status ?? 'placed')}
                variant={tracking?.status === 'delivered' ? 'success' : 'default'}
              />
            </View>

            {/* Progress steps */}
            <View style={{ marginBottom: 20 }}>
              {STEPS.slice(0, 6).map((step, i) => (
                <View key={step} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                  <View style={{ alignItems: 'center' }}>
                    <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: i <= currentStepIndex ? T.action : T.border, alignItems: 'center', justifyContent: 'center' }}>
                      {i <= currentStepIndex
                        ? <Check size={12} color="#FFF" strokeWidth={3} />
                        : <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: T.textTer }} />}
                    </View>
                    {i < 5 && <View style={{ width: 2, height: 22, backgroundColor: i < currentStepIndex ? T.action : T.border, marginTop: 2 }} />}
                  </View>
                  <Text style={{ fontWeight: i === currentStepIndex ? '800' : '500', color: i <= currentStepIndex ? T.text : T.textTer, fontSize: 14, paddingTop: 3 }}>
                    {STEP_LABELS[i]}
                  </Text>
                </View>
              ))}
            </View>

            {/* Driver info */}
            {tracking?.driver && (
              <View style={{ backgroundColor: T.surface, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: T.border }}>
                <Avatar uri={tracking.driver.avatar} name={`${tracking.driver.firstName} ${tracking.driver.lastName}`} size={48} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', fontSize: 15, color: T.text }}>{tracking.driver.firstName} {tracking.driver.lastName}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <Star size={11} color={T.text} fill={T.text} />
                    <Text style={{ fontSize: 13, color: T.textSec }}>{tracking.driver.rating.toFixed(1)} · Your driver</Text>
                  </View>
                </View>
                <Pressable
                  onPress={() => Linking.openURL(`tel:${tracking.driver!.phone}`)}
                  style={{ backgroundColor: T.action, borderRadius: 12, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Phone size={18} color="#FFF" />
                </Pressable>
              </View>
            )}

            {order && (
              <View style={{ marginTop: 12, backgroundColor: T.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: T.border }}>
                <Text style={{ fontWeight: '800', fontSize: 14, color: T.text, marginBottom: 8 }}>Order #{order.id.slice(-6).toUpperCase()}</Text>
                {order.items.map((item: import('@/types/order.types').OrderItem) => (
                  <Text key={item.id} style={{ color: T.textSec, fontSize: 13, marginBottom: 3 }}>
                    {item.quantity}× {item.menuItemName}
                  </Text>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}
