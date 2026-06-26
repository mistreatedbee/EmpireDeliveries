import React, { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useLocationStore } from '@/stores/locationStore';
import { useAuthStore } from '@/stores/authStore';
import { geocodingService } from '@/services/geocoding.service';
import { useUIStore } from '@/stores/uiStore';
import { T, Fonts, Radius, Shadows } from '@/constants/colors';
import api from '@/services/api';
import { Address } from '@/types/order.types';

export default function LocationSetupScreen() {
  const [detecting, setDetecting] = useState(false);

  const { setCurrentLocation, setSelectedAddress } = useLocationStore();
  const { user } = useAuthStore();
  const destination = (user?.role === 'driver' ? '/(driver)' : '/(customer)') as any;
  const { showToast } = useUIStore();

  const detectLocation = async () => {
    setDetecting(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showToast('Location permission denied.', 'error');
        return;
      }
      const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setCurrentLocation({ latitude: coords.latitude, longitude: coords.longitude });

      let result: Awaited<ReturnType<typeof geocodingService.reverseGeocode>> = null;
      try {
        result = await geocodingService.reverseGeocode(coords.latitude, coords.longitude);
      } catch {
        // Address lookup unavailable — fall back to raw coordinates below
      }

      const street = result?.street || `GPS: ${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`;
      const city = result?.city || 'Unknown';

      const res = await api.post('/users/addresses', {
        label: 'Home',
        street,
        suburb: result?.suburb || '',
        city,
        province: result?.province || '',
        postalCode: result?.postalCode || '',
        latitude: coords.latitude,
        longitude: coords.longitude,
        isDefault: true,
      });
      const saved = (res as { data: { id: string; street: string; suburb: string; city: string; province: string; postalCode: string } }).data;
      setSelectedAddress({
        id: saved.id,
        label: 'other',
        street: saved.street,
        suburb: saved.suburb ?? '',
        city: saved.city,
        province: saved.province ?? '',
        postalCode: saved.postalCode ?? '',
        coordinates: { latitude: coords.latitude, longitude: coords.longitude },
        formattedAddress: [saved.street, saved.suburb, saved.city].filter(Boolean).join(', '),
      } as Address);
      router.replace(destination);
    } catch {
      showToast('Failed to detect location. Please try again.', 'error');
    } finally {
      setDetecting(false);
    }
  };

  return (
    <ScreenWrapper bg="white">
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 }}>
        <Text style={{ fontFamily: Fonts.headingExtra, color: T.text, fontSize: 28, marginBottom: 8 }}>Where are you?</Text>
        <Text style={{ fontFamily: Fonts.body, color: T.textSec, fontSize: 15, marginBottom: 32 }}>
          Set your delivery location to get started.
        </Text>

        <Pressable
          onPress={detectLocation}
          disabled={detecting}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: T.gold,
            borderRadius: Radius.md,
            padding: 16,
            marginBottom: 24,
            opacity: detecting ? 0.7 : 1,
            ...Shadows.sm,
          }}
        >
          {detecting ? (
            <ActivityIndicator size="small" color={T.goldForeground} style={{ marginRight: 12 }} />
          ) : (
            <Text style={{ fontSize: 24, marginRight: 12 }}>📍</Text>
          )}
          <View>
            <Text style={{ fontFamily: Fonts.bodySemibold, color: T.goldForeground, fontSize: 16 }}>Use Current Location</Text>
            <Text style={{ fontFamily: Fonts.body, color: T.goldForeground, fontSize: 13, marginTop: 2, opacity: 0.7 }}>
              Auto-detect via GPS
            </Text>
          </View>
        </Pressable>

        <Pressable onPress={() => router.replace(destination)} style={{ alignSelf: 'center', marginTop: 16 }}>
          <Text style={{ fontFamily: Fonts.bodySemibold, color: T.textSec, fontSize: 15 }}>Skip for now</Text>
        </Pressable>
      </ScrollView>
    </ScreenWrapper>
  );
}
