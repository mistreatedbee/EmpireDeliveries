import React, { useRef, useEffect } from 'react';
import { View, Text, Pressable, Linking, ActivityIndicator, ScrollView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, AnimatedRegion } from 'react-native-maps';
import { Animated } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { useOrderTracking, useOrderDetail } from '@/hooks/useOrders';
import { useLocationStore } from '@/stores/locationStore';
import { Colors } from '@/constants/colors';
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
    <ScreenWrapper bg="surface" edges={['bottom']}>
      {/* Back button */}
      <View style={{ position: 'absolute', top: 52, left: 16, zIndex: 10 }}>
        <Pressable
          onPress={() => router.back()}
          style={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}
        >
          <Text style={{ fontSize: 18, color: Colors.empire.black }}>←</Text>
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
            <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.gold[500], borderWidth: 3, borderColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 }} />
          </Marker>
        )}
        {tracking?.driver && (
          <Marker coordinate={{ latitude: tracking.driver.latitude, longitude: tracking.driver.longitude }} title={tracking.driver.firstName}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.empire.black, borderWidth: 2, borderColor: Colors.gold[500], alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 20 }}>🚗</Text>
            </View>
          </Marker>
        )}
      </MapView>

      {/* Status panel */}
      <ScrollView style={{ backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24 }} contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
        {isLoading ? (
          <View style={{ alignItems: 'center', paddingVertical: 32 }}>
            <ActivityIndicator size="large" color={Colors.gold[500]} />
          </View>
        ) : (
          <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <View>
                <Text style={{ fontWeight: '900', fontSize: 18, color: Colors.empire.black }}>
                  {formatOrderStatus(tracking?.status ?? 'placed')}
                </Text>
                {tracking?.eta && (
                  <Text style={{ color: '#666', fontSize: 14, marginTop: 2 }}>ETA: {formatETA(tracking.eta)}</Text>
                )}
              </View>
              <Badge
                label={formatOrderStatus(tracking?.status ?? 'placed')}
                variant={tracking?.status === 'delivered' ? 'success' : 'gold'}
              />
            </View>

            {/* Progress steps */}
            <View style={{ marginBottom: 20 }}>
              {STEPS.slice(0, 6).map((step, i) => (
                <View key={step} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                  <View style={{ alignItems: 'center' }}>
                    <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: i <= currentStepIndex ? Colors.empire.black : '#E8E8E8', alignItems: 'center', justifyContent: 'center' }}>
                      {i <= currentStepIndex ? (
                        <Text style={{ color: Colors.gold[500], fontSize: 12, fontWeight: '800' }}>✓</Text>
                      ) : (
                        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#D0D0D0' }} />
                      )}
                    </View>
                    {i < 5 && <View style={{ width: 2, height: 24, backgroundColor: i < currentStepIndex ? Colors.empire.black : '#E8E8E8', marginTop: 2 }} />}
                  </View>
                  <Text style={{ fontWeight: i === currentStepIndex ? '800' : '500', color: i <= currentStepIndex ? Colors.empire.black : '#AAA', fontSize: 14, paddingTop: 3 }}>
                    {STEP_LABELS[i]}
                  </Text>
                </View>
              ))}
            </View>

            {/* Driver info */}
            {tracking?.driver && (
              <View style={{ backgroundColor: '#F8F8F8', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Avatar uri={tracking.driver.avatar} name={`${tracking.driver.firstName} ${tracking.driver.lastName}`} size={48} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', fontSize: 15, color: Colors.empire.black }}>{tracking.driver.firstName} {tracking.driver.lastName}</Text>
                  <Text style={{ fontSize: 13, color: '#888' }}>⭐ {tracking.driver.rating.toFixed(1)} • Your driver</Text>
                </View>
                <Pressable
                  onPress={() => Linking.openURL(`tel:${tracking.driver!.phone}`)}
                  style={{ backgroundColor: Colors.empire.black, borderRadius: 12, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Text style={{ fontSize: 20 }}>📞</Text>
                </Pressable>
              </View>
            )}

            {order && (
              <View style={{ marginTop: 16, backgroundColor: '#F8F8F8', borderRadius: 16, padding: 16 }}>
                <Text style={{ fontWeight: '800', fontSize: 14, marginBottom: 10 }}>Order #{order.id.slice(-6).toUpperCase()}</Text>
                {order.items.map((item: import('@/types/order.types').OrderItem) => (
                  <Text key={item.id} style={{ color: '#444', fontSize: 13, marginBottom: 4 }}>
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
