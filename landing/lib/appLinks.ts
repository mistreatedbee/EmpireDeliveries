// Central place for the mobile app download links shown on the landing page.
// The APK link points at an EAS Build artifact. It is NOT permanent — EAS artifact
// URLs are tied to a specific build, so update APK_DOWNLOAD_URL (and APK_VERSION)
// whenever a new "preview" build is cut:
//   cd mobile && eas build --platform android --profile preview
// then grab the "Application Archive URL" from the build output / expo.dev dashboard.

export const APK_DOWNLOAD_URL =
  "https://expo.dev/artifacts/eas/H4ef8CQEbkqyV3jSdEKySntjUiFHYSKELdfD-TdPhIs.apk" // build 0bc074ee, SDK 57, versionCode 18, working push notifications + logo

export const APK_VERSION = "1.0.18"

// Store links — flip these on once the app is actually published.
export const APP_STORE_URL: string | null = null
export const PLAY_STORE_URL: string | null = null
