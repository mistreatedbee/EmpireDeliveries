// EAS Build never runs `expo prebuild` for this project (the android/ folder
// is checked into git, so it's treated as a bare/native project) — so the
// config-plugin step that would normally copy `googleServicesFile` into
// android/app/google-services.json never runs on the build server. Wired up
// as the eas-build-post-install hook (NOT eas-build-pre-build — that hook
// name doesn't exist and silently never runs; see git history for how that
// was found).
//
// google-services.json is deliberately gitignored (real Firebase project
// config) and instead uploaded as the GOOGLE_SERVICES_JSON file-type env var
// (see `eas env:list --environment preview`). EAS Build materializes that to
// a real path on disk and exposes it via the env var — this script just
// copies it into the one place Gradle's google-services plugin actually
// looks, right before `./gradlew` runs.
//
// Locally this is a no-op: `expo prebuild` already places the gitignored
// mobile/google-services.json copy at android/app/google-services.json
// directly, so GOOGLE_SERVICES_JSON won't be set and this script exits early.

const fs = require('fs');
const path = require('path');

const src = process.env.GOOGLE_SERVICES_JSON;
if (!src) {
  console.log('GOOGLE_SERVICES_JSON not set — skipping (expected for local builds).');
  process.exit(0);
}

const dest = path.join(__dirname, '..', 'android', 'app', 'google-services.json');
fs.copyFileSync(src, dest);
console.log(`Copied google-services.json (from ${src}) to ${dest}`);
