import * as Location from 'expo-location';

interface GeocodeResult {
  formattedAddress: string;
  street: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
  latitude: number;
  longitude: number;
}

export const geocodingService = {
  // Uses the device's native geocoder (Apple on iOS, Play services on Android) —
  // no Google Maps API key or billing required.
  async reverseGeocode(latitude: number, longitude: number): Promise<GeocodeResult | null> {
    const results = await Location.reverseGeocodeAsync({ latitude, longitude });
    const r = results[0];
    if (!r) return null;

    const street = [r.streetNumber, r.street].filter(Boolean).join(' ');
    const suburb = r.district ?? '';
    const city = r.city ?? '';
    const province = r.region ?? '';

    return {
      formattedAddress: [street, suburb, city, province].filter(Boolean).join(', '),
      street,
      suburb,
      city,
      province,
      postalCode: r.postalCode ?? '',
      latitude,
      longitude,
    };
  },

  async geocodeAddress(address: string): Promise<{ latitude: number; longitude: number } | null> {
    const results = await Location.geocodeAsync(address);
    const r = results[0];
    if (!r) return null;
    return { latitude: r.latitude, longitude: r.longitude };
  },
};
