export const Config = {
  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL ?? 'https://insforge.dev',
  GOOGLE_MAPS_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY ?? '',
  GOOGLE_GEOCODING_URL: 'https://maps.googleapis.com/maps/api/geocode/json',
  REQUEST_TIMEOUT: 15_000,
  APP_SCHEME: 'empire',
  SUPPORT_EMAIL: 'support@empiredeliveries.co.za',
  SUPPORT_PHONE: '+27 10 000 0000',
} as const;

export const OrderPollingIntervals: Record<string, number | null> = {
  pending_payment: 30_000,
  placed: 30_000,
  confirmed: 20_000,
  preparing: 20_000,
  picked_up: 10_000,
  on_way: 5_000,
  delivered: null,
  cancelled: null,
};
