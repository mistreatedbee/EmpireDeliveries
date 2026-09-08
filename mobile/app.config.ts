import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Empire Deliveries',
  slug: process.env.EAS_PROJECT_SLUG ?? 'emp',
    version: '1.0.17',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  scheme: 'empire',
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'co.za.empiredeliveries',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSLocationWhenInUseUsageDescription:
        'Empire Deliveries needs your location to find nearby restaurants and track your delivery.',
      NSLocationAlwaysUsageDescription:
        'Empire Deliveries uses your location to track your delivery in real time.',
      NSCameraUsageDescription:
        'Empire Deliveries needs camera access to capture proof of delivery and upload photos.',
      NSPhotoLibraryUsageDescription:
        'Empire Deliveries needs photo library access for proof of delivery.',
    },
    associatedDomains: ['applinks:empiredeliveries.co.za'],
  },
  android: {
    versionCode: 17,
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0A0A0A',
    },
    package: 'co.za.empiredeliveries',
    // On EAS Build this resolves to the materialized path of the
    // GOOGLE_SERVICES_JSON file-type env var; locally it falls back to a
    // gitignored copy at mobile/google-services.json. Required for push
    // notifications — without it the app can't register with FCM at all.
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
    config: {
      googleMaps: {
        // Was hardcoded here and got flagged by GitHub secret scanning once
        // pushed. Set via `eas env:create` (or the EAS dashboard) per build
        // profile instead — see eas.json's "env" blocks for the pattern
        // already used for EAS_PROJECT_ID.
        apiKey: process.env.GOOGLE_MAPS_API_KEY ?? '',
      },
    },
    permissions: [
      'ACCESS_FINE_LOCATION',
      'ACCESS_COARSE_LOCATION',
      'CAMERA',
      'READ_EXTERNAL_STORAGE',
      'RECEIVE_BOOT_COMPLETED',
      'VIBRATE',
    ],
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: [
          {
            scheme: 'https',
            host: 'empiredeliveries.co.za',
            pathPrefix: '/',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    [
      'expo-notifications',
      {
        icon: './assets/notification-icon.png',
        color: '#D4AF37',
      },
    ],
    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission:
          'Allow Empire Deliveries to use your location.',
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission: 'Empire Deliveries needs photo library access for proof of delivery.',
        cameraPermission: 'Empire Deliveries needs camera access to capture proof of delivery.',
      },
    ],
    'expo-font',
    'expo-image',
    'expo-status-bar',
    'expo-web-browser',
    [
      'expo-splash-screen',
      {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#0A0A0A',
      },
    ],
    '@maplibre/maplibre-react-native',
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: process.env.EAS_PROJECT_ID ?? '9ef1f2ef-eb72-4aac-b9a5-342f0fdff1a6',
    },
  },
  updates: {
    url: 'https://u.expo.dev/' + (process.env.EAS_PROJECT_ID ?? '9ef1f2ef-eb72-4aac-b9a5-342f0fdff1a6'),
  },
  runtimeVersion: '1.0.0',
});
