import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button, Input } from '@/components/ui';
import { useLocationStore } from '@/stores/locationStore';
import { useAuthStore } from '@/stores/authStore';
import { geocodingService } from '@/services/geocoding.service';
import { useUIStore } from '@/stores/uiStore';
import { Colors } from '@/constants/colors';

export default function LocationSetupScreen() {
  const [query, setQuery] = useState('');
  const [detecting, setDetecting] = useState(false);
  const { setCurrentLocation, setSelectedAddress, setPermissionStatus } = useLocationStore();
  const { user } = useAuthStore();
  const destination = user?.role === 'driver' ? '/(driver)' : '/(customer)';
  const { showToast } = useUIStore();

  const detectLocation = async () => {
    setDetecting(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status as 'granted' | 'denied' | 'undetermined');
      if (status !== 'granted') {
        showToast('Location permission denied. Please enable it in settings.', 'error');
        return;
      }
      const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setCurrentLocation({ latitude: coords.latitude, longitude: coords.longitude });
      const result = await geocodingService.reverseGeocode(coords.latitude, coords.longitude);
      if (result) {
        setSelectedAddress({
          id: 'current',
          label: 'other',
          street: result.street,
          suburb: result.suburb,
          city: result.city,
          province: result.province,
          postalCode: result.postalCode,
          formattedAddress: result.formattedAddress,
          coordinates: { latitude: coords.latitude, longitude: coords.longitude },
        });
        router.replace(destination);
      } else {
        showToast('Could not determine your address. Please search manually.', 'warning');
      }
    } catch {
      showToast('Failed to detect location. Please try again.', 'error');
    } finally {
      setDetecting(false);
    }
  };

  return (
    <ScreenWrapper bg="black">
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 60 }}>
        <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '900', marginBottom: 8 }}>Where are you?</Text>
        <Text style={{ color: '#888', fontSize: 15, marginBottom: 32 }}>Set your delivery location to get started.</Text>

        <Pressable
          onPress={detectLocation}
          disabled={detecting}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.gold[500],
            borderRadius: 16,
            padding: 16,
            marginBottom: 24,
            opacity: detecting ? 0.7 : 1,
          }}
        >
          {detecting ? (
            <ActivityIndicator size="small" color={Colors.empire.black} style={{ marginRight: 12 }} />
          ) : (
            <Text style={{ fontSize: 24, marginRight: 12 }}>📍</Text>
          )}
          <View>
            <Text style={{ color: Colors.empire.black, fontWeight: '700', fontSize: 16 }}>Use Current Location</Text>
            <Text style={{ color: Colors.empire.charcoal, fontSize: 13, marginTop: 2 }}>Auto-detect via GPS</Text>
          </View>
        </Pressable>

        <Input
          value={query}
          onChangeText={setQuery}
          placeholder="Search for an area or street..."
          leftIcon={<Text style={{ fontSize: 18 }}>🔍</Text>}
        />

        <Button variant="ghost" size="md" onPress={() => router.replace(destination)} fullWidth={false} style={{ alignSelf: 'center', marginTop: 32 }}>
          Skip for now
        </Button>
      </View>
    </ScreenWrapper>
  );
}
