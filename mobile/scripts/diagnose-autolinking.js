const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== AUTOLINKING DIAGNOSTIC ===');
console.log('platform:', process.platform, 'node:', process.version, 'cwd:', process.cwd());
console.log('ANDROID_HOME:', process.env.ANDROID_HOME);
console.log('ANDROID_SDK_ROOT:', process.env.ANDROID_SDK_ROOT);
console.log('JAVA_HOME:', process.env.JAVA_HOME);

const targets = [
  '@maplibre/maplibre-react-native',
  '@react-native-async-storage/async-storage',
  '@react-native-community/netinfo',
  'react-native-gesture-handler',
  'react-native-maps',
  'react-native-reanimated',
  'react-native-safe-area-context',
  'react-native-svg',
  'react-native-worklets',
];

let raw;
try {
  raw = execSync(
    `node --no-warnings --eval "require('expo/bin/autolinking')" expo-modules-autolinking react-native-config --platform android --json`,
    { cwd: __dirname + '/..', encoding: 'utf8', maxBuffer: 1024 * 1024 * 20 }
  );
} catch (e) {
  console.log('COMMAND FAILED:', e.message);
  console.log('stdout:', e.stdout);
  console.log('stderr:', e.stderr);
  process.exit(0);
}

let data;
try {
  data = JSON.parse(raw);
} catch (e) {
  console.log('JSON PARSE FAILED. Raw output (first 2000 chars):');
  console.log(raw.slice(0, 2000));
  process.exit(0);
}

console.log('Top-level keys:', Object.keys(data));
console.log('Number of dependencies:', Object.keys(data.dependencies || {}).length);

for (const t of targets) {
  const d = data.dependencies && data.dependencies[t];
  if (!d) {
    console.log(`[${t}] MISSING FROM react-native-config OUTPUT`);
    continue;
  }
  const android = d.platforms && d.platforms.android;
  if (!android) {
    console.log(`[${t}] NO android platform entry at all`);
    continue;
  }
  const sourceDir = android.sourceDir;
  const exists = sourceDir ? fs.existsSync(sourceDir) : false;
  const buildGradlePath = sourceDir ? path.join(sourceDir, 'build.gradle') : null;
  const buildGradleExists = buildGradlePath ? fs.existsSync(buildGradlePath) : false;
  console.log(
    `[${t}] sourceDir=${sourceDir} | dirExists=${exists} | build.gradleExists=${buildGradleExists} | isPureCxxDependency=${android.isPureCxxDependency} | packageImportPath=${android.packageImportPath}`
  );
}

console.log('=== END AUTOLINKING DIAGNOSTIC ===');
