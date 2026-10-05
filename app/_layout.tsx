import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DotlyProvider } from "../src/context/DotlyProvider";
import { CHANGELOG } from "../src/lib/changelog";
import { hasUnseenUpdate, markUpdateSeen } from "../src/lib/whatsNew";
import { initializeNotifications } from "../src/services/notifications";

export default function RootLayout() {
  const [showWhatsNew, setShowWhatsNew] = useState(false);

  useEffect(() => {
    hasUnseenUpdate()
      .then(setShowWhatsNew)
      .catch(() => undefined);

    initializeNotifications().catch(() => undefined);
  }, []);

  const dismissWhatsNew = async () => {
    await markUpdateSeen();
    setShowWhatsNew(false);
  };

  return (
    <SafeAreaProvider>
      <DotlyProvider>
        <StatusBar style="light" backgroundColor="#000000" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#000" },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="update-history" />
        </Stack>

        <Modal
          visible={showWhatsNew}
          transparent
          animationType="fade"
          onRequestClose={dismissWhatsNew}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>
                What&apos;s new in v{CHANGELOG[0].version}
              </Text>

              {CHANGELOG[0].changes.map((change) => (
                <Text
                  key={`${change.type}-${change.text}`}
                  style={styles.modalChange}
                >
                  {"\u2022 "}
                  {change.text}
                </Text>
              ))}

              <Pressable
                style={({ pressed }) => [
                  styles.dismissButton,
                  pressed && styles.dismissPressed,
                ]}
                onPress={dismissWhatsNew}
              >
                <Text style={styles.dismissText}>Got it</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </DotlyProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "#000a",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    backgroundColor: "#111",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#242424",
    padding: 20,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  modalChange: {
    color: "#ccc",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
  dismissButton: {
    alignSelf: "flex-end",
    marginTop: 16,
    padding: 4,
  },
  dismissPressed: {
    opacity: 0.65,
  },
  dismissText: {
    color: "#4ade80",
    fontSize: 14,
    fontWeight: "600",
  },
});
