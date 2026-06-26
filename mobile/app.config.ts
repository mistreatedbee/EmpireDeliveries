import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Empire Deliveries',
  slug: 'empire-deliveries',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  scheme: 'empire',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#0A0A0A',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: false,
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
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0A0A0A',
    },
    package: 'co.za.empiredeliveries',
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
    '@maplibre/maplibre-react-native',
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: process.env.EAS_PROJECT_ID ?? '33b6bbcd-1212-4683-bb21-41060f60387a',
    },
  },
  updates: {
    url: 'https://u.expo.dev/' + (process.env.EAS_PROJECT_ID ?? '33b6bbcd-1212-4683-bb21-41060f60387a'),
  },
  runtimeVersion: '1.0.0',
});
