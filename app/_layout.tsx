import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DotlyProvider } from "../src/context/DotlyProvider";

export default function RootLayout() {
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
          <Stack.Screen name="(tabs)" />
        </Stack>
      </DotlyProvider>
    </SafeAreaProvider>
  );
}
