import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert, Image, Linking } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Store, Home, Navigation, Phone, MessageCircle, CheckCircle, Package, Camera } from 'lucide-react-native';
import { PlatformMap } from '@/components/map/PlatformMap';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { driverService } from '@/services/driver.service';
import { useLocationStore } from '@/stores/locationStore';
import { Colors } from '@/constants/colors';

type Step = 'pickup' | 'deliver' | 'complete';

export default function ActiveDelivery() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const queryClient = useQueryClient();
  const { currentLocation, setCurrentLocation } = useLocationStore();
  const [step, setStep] = useState<Step>('pickup');
  const [completedPayout, setCompletedPayout] = useState(0);
  const [deliveryPhoto, setDeliveryPhoto] = useState<string | null>(null);

  // Live location watch during active delivery — updates store + backend every 10s/15m
  useEffect(() => {
    if (step === 'complete') return;
    let sub: Location.LocationSubscription | null = null;
    Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 10000, distanceInterval: 15 },
      (loc) => {
        setCurrentLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
        void driverService.updateLocation(loc.coords.latitude, loc.coords.longitude).catch(() => null);
      }
    ).then((s) => { sub = s; }).catch(() => null);
    return () => { sub?.remove(); };
  }, [step]);

  const { data: delivery, isLoading } = useQuery({
    queryKey: ['driver', 'active'],
    queryFn: driverService.getActiveDelivery,
    enabled: step !== 'complete',
  });

  const pickupMutation = useMutation({
    mutationFn: () => driverService.pickupDelivery(orderId ?? delivery?.orderId ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver', 'active'] });
      setStep('deliver');
    },
    onError: () => Alert.alert('Error', 'Could not confirm pickup. Please try again.'),
  });

  const completeMutation = useMutation({
    mutationFn: () => driverService.completeDelivery(
      orderId ?? delivery?.orderId ?? '',
      deliveryPhoto ?? undefined
    ),
    onSuccess: (data) => {
      setCompletedPayout(data.payout);
      queryClient.invalidateQueries({ queryKey: ['driver', 'active'] });
      queryClient.invalidateQueries({ queryKey: ['driver', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['driver', 'history'] });
      queryClient.invalidateQueries({ queryKey: ['driver', 'wallet'] });
      setStep('complete');
    },
    onError: () => Alert.alert('Error', 'Could not confirm delivery. Please try again.'),
  });

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera access is needed to capture proof of delivery.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 1 });
    if (result.canceled || !result.assets[0]) return;
    const manipulated = await ImageManipulator.manipulateAsync(
      result.assets[0].uri,
      [{ resize: { width: 800 } }],
      { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );
    if (manipulated.base64) setDeliveryPhoto(manipulated.base64);
  };

  if (step === 'complete') {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <CheckCircle size={52} color={Colors.empire.success} />
        </View>
        <Text style={{ fontSize: 26, fontWeight: '900', color: Colors.empire.black, textAlign: 'center' }}>Delivery Complete!</Text>
        <Text style={{ color: '#888', marginTop: 8, fontSize: 15, textAlign: 'center' }}>
          You earned{' '}
          <Text style={{ fontWeight: '900', color: Colors.empire.success }}>R{completedPayout.toFixed(2)}</Text>{' '}
          for this delivery
        </Text>
        <Pressable
          onPress={() => router.replace('/(driver)')}
          style={{ marginTop: 32, backgroundColor: Colors.gold[500], paddingVertical: 16, paddingHorizontal: 48, borderRadius: 18 }}
        >
          <Text style={{ color: Colors.empire.black, fontWeight: '900', fontSize: 16 }}>Back to Dashboard</Text>
        </Pressable>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={Colors.gold[500]} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Map */}
      <View style={{ height: 260, position: 'relative' }}>
        <PlatformMap
          style={{ flex: 1 }}
          region={{
            latitude: currentLocation?.latitude ?? -26.2041,
            longitude: currentLocation?.longitude ?? 28.0473,
            latitudeDelta: 0.04,
            longitudeDelta: 0.04,
          }}
          markers={[
            ...(currentLocation
              ? [
                  {
                    id: 'self',
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    children: (
                      <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: Colors.gold[500], borderWidth: 3, borderColor: '#fff' }} />
                    ),
                  },
                ]
              : []),
            ...(step === 'pickup' && delivery?.restaurantLat != null && delivery?.restaurantLng != null
              ? [
                  {
                    id: 'restaurant',
                    latitude: delivery.restaurantLat,
                    longitude: delivery.restaurantLng,
                    children: (
                      <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.empire.warning, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' }}>
                        <Store size={16} color="#fff" />
                      </View>
                    ),
                  },
                ]
              : []),
            ...(step === 'deliver' && delivery?.destLat != null && delivery?.destLng != null
              ? [
                  {
                    id: 'customer',
                    latitude: delivery.destLat,
                    longitude: delivery.destLng,
                    children: (
                      <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.empire.success, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' }}>
                        <Home size={16} color="#fff" />
                      </View>
                    ),
                  },
                ]
              : []),
          ]}
        />
        <Pressable
          onPress={() => router.back()}
          style={{ position: 'absolute', top: 12, left: 16, width: 40, height: 40, backgroundColor: '#fff', borderRadius: 14, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 }}
        >
          <Text style={{ fontSize: 18 }}>‹</Text>
        </Pressable>
        <View
          style={{ position: 'absolute', bottom: 16, alignSelf: 'center', backgroundColor: step === 'pickup' ? Colors.empire.warning : Colors.empire.success, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 8 }}
        >
          {step === 'pickup' ? <Store size={14} color="#fff" /> : <Home size={14} color="#fff" />}
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>
            {step === 'pickup' ? 'Head to Restaurant' : 'Head to Customer'}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Location card */}
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface[100], borderRadius: 24, padding: 16, marginBottom: 16 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#aaa', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, fontWeight: '600' }}>
              {step === 'pickup' ? 'Pickup From' : 'Deliver To'}
            </Text>
            <Text style={{ fontWeight: '800', color: Colors.empire.black, fontSize: 16, marginTop: 4 }}>
              {step === 'pickup' ? (delivery?.restaurantName ?? '—') : (delivery?.customerName ?? '—')}
            </Text>
            <Text style={{ color: '#aaa', fontSize: 13, marginTop: 2 }}>
              {step === 'pickup' ? (delivery?.restaurantAddress ?? '') : (delivery?.customerAddress ?? '')}
            </Text>
          </View>
          <View style={{ width: 44, height: 44, backgroundColor: Colors.empire.black, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}>
            <Navigation size={18} color="#fff" />
          </View>
        </View>

        {step === 'pickup' ? (
          <View>
            <Text style={{ fontWeight: '800', color: Colors.empire.black, fontSize: 15, marginBottom: 12 }}>Order Items</Text>
            {(delivery?.items ?? []).map((item, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.surface[200], borderRadius: 16, padding: 14, marginBottom: 8 }}>
                <Package size={18} color="#bbb" style={{ marginRight: 12 }} />
                <Text style={{ fontWeight: '600', color: Colors.empire.black, fontSize: 14 }}>
                  {item.name} x{item.quantity}
                </Text>
              </View>
            ))}
            <Pressable
              onPress={() => pickupMutation.mutate()}
              disabled={pickupMutation.isPending}
              style={{ backgroundColor: Colors.gold[500], borderRadius: 18, paddingVertical: 18, alignItems: 'center', marginTop: 8 }}
            >
              {pickupMutation.isPending
                ? <ActivityIndicator color={Colors.empire.black} />
                : <Text style={{ color: Colors.empire.black, fontWeight: '900', fontSize: 16 }}>I've Picked Up the Order</Text>}
            </Pressable>
          </View>
        ) : (
          <View>
            {/* Customer card */}
            <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.surface[200], borderRadius: 24, padding: 16, marginBottom: 12 }}>
              <Text style={{ color: '#aaa', fontSize: 12, marginBottom: 6 }}>Customer</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '800', color: Colors.empire.black, fontSize: 15 }}>{delivery?.customerName ?? '—'}</Text>
                  {delivery?.deliveryNotes && (
                    <Text style={{ color: '#aaa', fontSize: 12, marginTop: 4 }}>Note: {delivery.deliveryNotes}</Text>
                  )}
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Pressable
                    onPress={() => { if (delivery?.customerPhone) void Linking.openURL(`tel:${delivery.customerPhone}`); }}
                    style={{ width: 40, height: 40, backgroundColor: Colors.surface[100], borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Phone size={18} color={Colors.empire.black} />
                  </Pressable>
                  <Pressable
                    onPress={() => { if (delivery?.customerPhone) void Linking.openURL(`sms:${delivery.customerPhone}`); }}
                    style={{ width: 40, height: 40, backgroundColor: Colors.empire.black, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <MessageCircle size={18} color="#fff" />
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Proof of delivery photo */}
            {deliveryPhoto ? (
              <Pressable
                onPress={handleTakePhoto}
                style={{ borderRadius: 18, overflow: 'hidden', marginBottom: 16, height: 160 }}
              >
                <Image
                  source={{ uri: `data:image/jpeg;base64,${deliveryPhoto}` }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
                <View style={{ position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>Retake</Text>
                </View>
              </Pressable>
            ) : (
              <Pressable
                onPress={handleTakePhoto}
                style={{ borderWidth: 2, borderStyle: 'dashed', borderColor: Colors.surface[300], borderRadius: 18, paddingVertical: 20, alignItems: 'center', marginBottom: 16 }}
              >
                <Camera size={28} color="#bbb" />
                <Text style={{ color: '#aaa', fontWeight: '600', fontSize: 14, marginTop: 6 }}>Take Proof of Delivery Photo</Text>
                <Text style={{ color: '#bbb', fontSize: 11, marginTop: 2 }}>Optional</Text>
              </Pressable>
            )}

            <Pressable
              onPress={() => completeMutation.mutate()}
              disabled={completeMutation.isPending}
              style={{ backgroundColor: Colors.gold[500], borderRadius: 18, paddingVertical: 18, alignItems: 'center' }}
            >
              {completeMutation.isPending
                ? <ActivityIndicator color={Colors.empire.black} />
                : <Text style={{ color: Colors.empire.black, fontWeight: '900', fontSize: 16 }}>Confirm Delivery</Text>}
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
