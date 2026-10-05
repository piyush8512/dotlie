import React, { useEffect, useState } from "react";
import { Pressable, Alert, StyleSheet, Switch, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  getNotificationsEnabled,
  setNotificationsEnabled,
} from "../services/notifications";

export default function SettingsScreen() {
  const router = useRouter();

  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    getNotificationsEnabled()
      .then(setNotifications)
      .catch(() => undefined);
  }, []);

  const handleNotificationsChange = async (enabled: boolean) => {
    if (!enabled) {
      await setNotificationsEnabled(false);
      setNotifications(false);
      return;
    }

    const allowed = await setNotificationsEnabled(true);
    if (allowed) {
      setNotifications(true);
    } else {
      setNotifications(false);
      Alert.alert(
        "Notifications are off",
        "Allow notifications in your device settings to receive Dotly reminders.",
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>

        <Text style={styles.title}>Settings</Text>

        <View style={styles.headerSpace} />
      </View>

      {/* Section */}
      <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>

      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.iconContainer}>
            <Ionicons name="notifications-outline" size={21} color="#aaa" />
          </View>

          <View style={styles.content}>
            <Text style={styles.rowTitle}>Notifications</Text>

            <Text style={styles.description}>
              Get reminders and updates from Dotly
            </Text>
          </View>

          <Switch
            value={notifications}
            onValueChange={handleNotificationsChange}
            trackColor={{
              false: "#333",
              true: "#FFB020",
            }}
            thumbColor="#fff"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 18,
    paddingTop: 55,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },

  headerSpace: {
    width: 42,
  },

  sectionTitle: {
    color: "#666",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.8,
    marginLeft: 4,
    marginBottom: 9,
  },

  section: {
    backgroundColor: "#101012",
    borderWidth: 1,
    borderColor: "#202023",
    borderRadius: 18,
    overflow: "hidden",
  },

  row: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#19191C",
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,
    marginLeft: 12,
    marginRight: 10,
  },

  rowTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  description: {
    color: "#666",
    fontSize: 11,
    marginTop: 4,
  },
});
