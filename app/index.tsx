import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { hasCompletedOnboarding } from "../src/screens/OnboardingScreen";
import { hasCompletedLogin } from "./login";

export default function Index() {
  const [destination, setDestination] = useState<
    "/onboarding/1" | "/login" | "/(tabs)" | null
  >(null);

  useEffect(() => {
    Promise.all([hasCompletedOnboarding(), hasCompletedLogin()]).then(
      ([onboardingComplete, loginComplete]) => {
        if (!onboardingComplete) {
          setDestination("/onboarding/1");
        } else if (!loginComplete) {
          setDestination("/login");
        } else {
          setDestination("/(tabs)");
        }
      },
    );
  }, []);

  if (destination === null) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color="#FFB020" />
      </View>
    );
  }

  return <Redirect href={destination} />;
}
