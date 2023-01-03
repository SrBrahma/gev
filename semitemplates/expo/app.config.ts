// https://docs.expo.dev/workflow/configuration/#using-typescript-for-configuration-appconfigts-instead-of
import type { ConfigContext, ExpoConfig } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const appName = 'Your App Name';
  const appId = 'com.x.y';
  const version = '1.0.0'; // SemVer

  return {
    name: appName,
    slug: 'your-app-name',
    version,
    orientation: 'portrait',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'cover',
      backgroundColor: '#ffffff',
    },
    userInterfaceStyle: 'automatic',
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['./assets/**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: appId,
      buildNumber: version,
    },
    android: {
      package: appId,
      versionCode: getAndroidVersion(version),
    },
    plugins: [['./easPlugins/withDisableForcedDarkModeAndroid.js', {}]],
  };
};

/** From 2.10.4, return 002010004.
 * Based on https://blog.dipien.com/versioning-android-apps-d6ec171cfd82 */
function getAndroidVersion(semver: string) {
  const parts = semver.split('.');
  return Number(parts.reduce((versionCode, part) => versionCode + part.padStart(3, '0'), ''));
}
