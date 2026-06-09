import { Config } from '@/constants/config';

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

interface GoogleGeocodeResult {
  formatted_address: string;
  geometry: { location: { lat: number; lng: number } };
  address_components: Array<{ long_name: string; short_name: string; types: string[] }>;
}

function parseComponents(components: GoogleGeocodeResult['address_components']): Partial<GeocodeResult> {
  const get = (type: string) => components.find((c) => c.types.includes(type))?.long_name ?? '';
  return {
    street: `${get('street_number')} ${get('route')}`.trim(),
    suburb: get('sublocality') || get('neighborhood'),
    city: get('locality'),
    province: get('administrative_area_level_1'),
    postalCode: get('postal_code'),
  };
}

export const geocodingService = {
  async reverseGeocode(latitude: number, longitude: number): Promise<GeocodeResult | null> {
    const url = `${Config.GOOGLE_GEOCODING_URL}?latlng=${latitude},${longitude}&region=za&key=${Config.GOOGLE_MAPS_KEY}`;
    const response = await fetch(url);
    const data = await response.json() as { status: string; results: GoogleGeocodeResult[] };
    if (data.status !== 'OK' || !data.results[0]) return null;
    const result = data.results[0];
    return {
      formattedAddress: result.formatted_address,
      latitude,
      longitude,
      ...parseComponents(result.address_components),
    } as GeocodeResult;
  },

  async geocodeAddress(address: string): Promise<{ latitude: number; longitude: number } | null> {
    const encoded = encodeURIComponent(address);
    const url = `${Config.GOOGLE_GEOCODING_URL}?address=${encoded}&region=za&key=${Config.GOOGLE_MAPS_KEY}`;
    const response = await fetch(url);
    const data = await response.json() as { status: string; results: GoogleGeocodeResult[] };
    if (data.status !== 'OK' || !data.results[0]) return null;
    const loc = data.results[0].geometry.location;
    return { latitude: loc.lat, longitude: loc.lng };
  },
};
