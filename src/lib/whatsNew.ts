import AsyncStorage from "@react-native-async-storage/async-storage";
import { LATEST_VERSION } from "./changelog";

export const LAST_SEEN_VERSION_KEY = "lastSeenVersion";

export async function hasUnseenUpdate() {
  const seen = await AsyncStorage.getItem(LAST_SEEN_VERSION_KEY);

  if (seen === null) {
    await AsyncStorage.setItem(LAST_SEEN_VERSION_KEY, LATEST_VERSION);
    return false;
  }

  return seen !== LATEST_VERSION;
}

export const markUpdateSeen = () =>
  AsyncStorage.setItem(LAST_SEEN_VERSION_KEY, LATEST_VERSION);