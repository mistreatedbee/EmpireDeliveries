import React, { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, TextInput, ScrollView } from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button } from '@/components/ui';
import { useLocationStore } from '@/stores/locationStore';
import { useAuthStore } from '@/stores/authStore';
import { geocodingService } from '@/services/geocoding.service';
import { useUIStore } from '@/stores/uiStore';
import { Colors } from '@/constants/colors';
import api from '@/services/api';

export default function LocationSetupScreen() {
  const [detecting, setDetecting] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [saving, setSaving] = useState(false);
  const [street, setStreet] = useState('');
  const [suburb, setSuburb] = useState('');
  const [city, setCity] = useState('');

  const { setCurrentLocation, setSelectedAddress } = useLocationStore();
  const { user } = useAuthStore();
  const destination = user?.role === 'driver' ? '/(driver)' : '/(customer)';
  const { showToast } = useUIStore();

  const detectLocation = async () => {
    setDetecting(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showToast('Location permission denied. Please enter your address manually.', 'error');
        setShowManual(true);
        return;
      }
      const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setCurrentLocation({ latitude: coords.latitude, longitude: coords.longitude });

      try {
        const result = await geocodingService.reverseGeocode(coords.latitude, coords.longitude);
        if (result) {
          // Save to DB so we get a real UUID
          const res = await api.post('/users/addresses', {
            label: 'Home',
            street: result.street || `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`,
            suburb: result.suburb || '',
            city: result.city || 'Unknown',
            province: result.province || '',
            postalCode: result.postalCode || '',
            latitude: coords.latitude,
            longitude: coords.longitude,
            isDefault: true,
          });
          const saved = (res as { data: { data: { id: string; street: string; suburb: string; city: string; province: string; postalCode: string } } }).data.data;
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
          });
          router.replace(destination);
          return;
        }
      } catch {
        // Geocoding failed — fall through to manual entry with coords pre-filled
      }

      // Geocoding unavailable: pre-fill coords and show manual form
      setStreet(`GPS: ${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`);
      setShowManual(true);
      showToast('Address lookup unavailable. Please confirm your address below.', 'warning');
    } catch {
      showToast('Failed to detect location. Please enter your address manually.', 'error');
      setShowManual(true);
    } finally {
      setDetecting(false);
    }
  };

  const saveManualAddress = async () => {
    if (!street.trim() || !city.trim()) {
      showToast('Please enter at least a street and city.', 'error');
      return;
    }
    setSaving(true);
    try {
      const res = await api.post('/users/addresses', {
        label: 'Home',
        street: street.trim(),
        suburb: suburb.trim() || undefined,
        city: city.trim(),
        isDefault: true,
      });
      const saved = (res as { data: { data: { id: string; street: string; suburb: string; city: string } } }).data.data;
      setSelectedAddress({
        id: saved.id,
        label: 'other',
        street: saved.street,
        suburb: saved.suburb ?? '',
        city: saved.city,
        province: '',
        postalCode: '',
        coordinates: { latitude: 0, longitude: 0 },
        formattedAddress: [saved.street, saved.suburb, saved.city].filter(Boolean).join(', '),
      });
      router.replace(destination);
    } catch {
      showToast('Could not save address. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenWrapper bg="black">
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 }}>
        <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '900', marginBottom: 8 }}>Where are you?</Text>
        <Text style={{ color: '#888', fontSize: 15, marginBottom: 32 }}>Set your delivery location to get started.</Text>

        {!showManual && (
          <>
            <Pressable
              onPress={detectLocation}
              disabled={detecting}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: Colors.gold[500],
                borderRadius: 16,
                padding: 16,
                marginBottom: 16,
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

            <Pressable
              onPress={() => setShowManual(true)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#1A1A1A',
                borderRadius: 16,
                padding: 16,
                marginBottom: 24,
              }}
            >
              <Text style={{ fontSize: 24, marginRight: 12 }}>✏️</Text>
              <View>
                <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 16 }}>Enter Manually</Text>
                <Text style={{ color: '#666', fontSize: 13, marginTop: 2 }}>Type your delivery address</Text>
              </View>
            </Pressable>
          </>
        )}

        {showManual && (
          <View style={{ marginBottom: 24 }}>
            <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 16, marginBottom: 16 }}>Enter Delivery Address</Text>

            {[
              { label: 'Street *', value: street, setter: setStreet, placeholder: 'e.g. 12 Main Road' },
              { label: 'Suburb', value: suburb, setter: setSuburb, placeholder: 'e.g. Sandton' },
              { label: 'City *', value: city, setter: setCity, placeholder: 'e.g. Johannesburg' },
            ].map(({ label, value, setter, placeholder }) => (
              <View key={label} style={{ marginBottom: 12 }}>
                <Text style={{ color: '#AAA', fontSize: 13, marginBottom: 6 }}>{label}</Text>
                <TextInput
                  value={value}
                  onChangeText={setter}
                  placeholder={placeholder}
                  placeholderTextColor="#555"
                  style={{
                    backgroundColor: '#1A1A1A',
                    borderRadius: 12,
                    padding: 14,
                    color: '#FFF',
                    fontSize: 15,
                  }}
                />
              </View>
            ))}

            <Button
              variant="gold"
              size="md"
              onPress={saveManualAddress}
              loading={saving}
              style={{ marginTop: 8 }}
            >
              Save & Continue
            </Button>

            <Pressable onPress={() => setShowManual(false)} style={{ alignItems: 'center', marginTop: 16 }}>
              <Text style={{ color: '#666', fontSize: 14 }}>← Back</Text>
            </Pressable>
          </View>
        )}

        <Button variant="ghost" size="md" onPress={() => router.replace(destination)} fullWidth={false} style={{ alignSelf: 'center', marginTop: 16 }}>
          Skip for now
        </Button>
      </ScrollView>
    </ScreenWrapper>
  );
}
