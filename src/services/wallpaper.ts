import { Platform } from 'react-native';
import { requireNativeModule } from 'expo-modules-core';

const nativeModule = Platform.OS === 'android' ? requireNativeModule('LockscreenWallpaper') : null;
export const wallpaperAvailable = Boolean(nativeModule);

export async function setLockWallpaper(base64: string) {
  if (!nativeModule) throw new Error('Lockscreen wallpaper is only available on Android.');
  return nativeModule.setLockWallpaper(base64);
}
