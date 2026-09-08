// expo-notifications' Android builder falls back to the app's small status-bar
// icon (a monochrome silhouette — that part is an Android OS restriction, not
// fixable) unless a manifest meta-data key points it at a separate full-color
// "large icon" drawable, shown next to the notification text in the shade.
// expo-notifications' own config plugin doesn't expose this option, so this
// local plugin adds it by hand: copies the pre-resized logo PNGs (generated
// from assets/icon.png, see assets/notification-large-icon/) into each
// density's res/drawable-*dpi/ folder, and points the manifest meta-data
// expo.modules.notifications.large_notification_icon at the resulting
// drawable. Runs on every `expo prebuild`, so it survives regeneration.
const { withAndroidManifest, withDangerousMod, AndroidConfig } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const DRAWABLE_NAME = 'notification_large_icon.png';
const DENSITIES = ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'];
const META_DATA_KEY = 'expo.modules.notifications.large_notification_icon';

function withNotificationLargeIconFiles(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const resDir = path.join(config.modRequest.platformProjectRoot, 'app/src/main/res');
      for (const density of DENSITIES) {
        const src = path.join(projectRoot, 'assets/notification-large-icon', `${density}.png`);
        const destDir = path.join(resDir, `drawable-${density}`);
        fs.mkdirSync(destDir, { recursive: true });
        fs.copyFileSync(src, path.join(destDir, DRAWABLE_NAME));
      }
      return config;
    },
  ]);
}

function withNotificationLargeIconManifest(config) {
  return withAndroidManifest(config, (config) => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);
    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      META_DATA_KEY,
      '@drawable/notification_large_icon',
      'resource',
    );
    return config;
  });
}

module.exports = function withNotificationLargeIcon(config) {
  config = withNotificationLargeIconFiles(config);
  config = withNotificationLargeIconManifest(config);
  return config;
};
