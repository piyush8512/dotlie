import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

const ENABLED_KEY = "dotly-notifications-enabled";
const SCHEDULED_IDS_KEY = "dotly-notification-ids";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission() {
  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  if (existingStatus === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function getNotificationsEnabled() {
  const value = await AsyncStorage.getItem(ENABLED_KEY);
  return value !== "false";
}

async function cancelDotlySchedules() {
  const storedIds = await AsyncStorage.getItem(SCHEDULED_IDS_KEY);
  const ids: string[] = storedIds ? JSON.parse(storedIds) : [];

  await Promise.all(
    ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)),
  );
  await AsyncStorage.removeItem(SCHEDULED_IDS_KEY);
}

export async function scheduleMorningNotification() {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: "Good morning!",
      body: "Ready to complete today's tasks?",
      data: { source: "dotly", reminder: "morning" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 8,
      minute: 0,
    },
  });
}

export async function scheduleNightNotification() {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: "Plan tomorrow",
      body: "Take a few minutes to plan tomorrow's tasks.",
      data: { source: "dotly", reminder: "night" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 22,
      minute: 38,
    },
  });
}

export async function scheduleDotlyNotifications() {
  await cancelDotlySchedules();

  const ids = await Promise.all([
    scheduleMorningNotification(),
    scheduleNightNotification(),
  ]);

  await AsyncStorage.setItem(SCHEDULED_IDS_KEY, JSON.stringify(ids));
}

export async function setNotificationsEnabled(enabled: boolean) {
  if (!enabled) {
    await cancelDotlySchedules();
    await AsyncStorage.setItem(ENABLED_KEY, "false");
    return false;
  }

  const allowed = await requestNotificationPermission();
  if (!allowed) {
    await AsyncStorage.setItem(ENABLED_KEY, "false");
    return false;
  }

  await AsyncStorage.setItem(ENABLED_KEY, "true");
  await scheduleDotlyNotifications();
  return true;
}

export async function initializeNotifications() {
  if (!(await getNotificationsEnabled())) return false;

  const allowed = await requestNotificationPermission();
  if (!allowed) {
    await AsyncStorage.setItem(ENABLED_KEY, "false");
    return false;
  }

  await scheduleDotlyNotifications();
  return true;
}