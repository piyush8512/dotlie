import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

export const LOGIN_KEY = "dotly-login-complete";

export async function hasCompletedLogin() {
  return (await AsyncStorage.getItem(LOGIN_KEY)) === "true";
}

export default function LoginScreen() {
  const router = useRouter();

  const handleGoogleLogin = () => {
    /*
     * TODO:
     * Implement Google authentication here.
     *
     * Example later:
     * await signInWithGoogle();
     */

    console.log("Google login");
  };

  const handleAppleLogin = () => {
    /*
     * TODO:
     * Implement Apple authentication here.
     *
     * Example later:
     * await signInWithApple();
     */

    console.log("Apple login");
  };

  const handleSkip = async () => {
    /*
     * User wants to use the app locally
     * without creating/logging into an account.
     */

    await AsyncStorage.setItem(LOGIN_KEY, "true");
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* -------------------------------------------------------------- */}
        {/* LOGO / BRAND                                                   */}
        {/* -------------------------------------------------------------- */}

        <View style={styles.brandContainer}>
          <View style={styles.logo}>
            <View style={styles.logoDot} />
          </View>

          <Text style={styles.brand}>DOTLY</Text>
        </View>

        {/* -------------------------------------------------------------- */}
        {/* TITLE                                                          */}
        {/* -------------------------------------------------------------- */}

        <View style={styles.headingContainer}>
          <Text style={styles.title}>Keep your progress{"\n"}with you.</Text>

          <Text style={styles.subtitle}>
            Sign in to sync your habits and streaks{"\n"}
            across your devices.
          </Text>
        </View>

        {/* -------------------------------------------------------------- */}
        {/* AUTH BUTTONS                                                   */}
        {/* -------------------------------------------------------------- */}

        <View style={styles.authContainer}>
          {/* Google */}

          <Pressable
            onPress={handleGoogleLogin}
            style={({ pressed }) => [
              styles.authButton,
              styles.googleButton,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.googleIcon}>G</Text>
            </View>

            <Text style={styles.googleText}>Continue with Google</Text>

            <View style={styles.rightIcon}>
              <Ionicons name="arrow-forward" size={18} color="#17181B" />
            </View>
          </Pressable>

          {/* Apple */}

          <Pressable
            onPress={handleAppleLogin}
            style={({ pressed }) => [
              styles.authButton,
              styles.appleButton,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="logo-apple" size={21} color="#FFFFFF" />
            </View>

            <Text style={styles.appleText}>Continue with Apple</Text>

            <View style={styles.rightIcon}>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </View>
          </Pressable>
        </View>

        {/* -------------------------------------------------------------- */}
        {/* LOCAL MODE                                                     */}
        {/* -------------------------------------------------------------- */}

        <View style={styles.localContainer}>
          <View style={styles.dividerRow}>
            <View style={styles.divider} />

            <Text style={styles.orText}>OR</Text>

            <View style={styles.divider} />
          </View>

          <Pressable
            onPress={handleSkip}
            style={({ pressed }) => [
              styles.skipButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.skipText}>Skip for now</Text>
          </Pressable>

          <Text style={styles.localDescription}>
            Continue without an account and keep your{"\n"}
            progress on this device.
          </Text>
        </View>
      </View>

      {/* -------------------------------------------------------------- */}
      {/* FOOTER                                                         */}
      {/* -------------------------------------------------------------- */}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          You can create an account later from Settings.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  /* ================================================================== */
  /* CONTAINER                                                          */
  /* ================================================================== */

  container: {
    flex: 1,
    backgroundColor: "#101114",
    paddingHorizontal: 24,
  },

  content: {
    flex: 1,
  },

  /* ================================================================== */
  /* BRAND                                                              */
  /* ================================================================== */

  brandContainer: {
    alignItems: "center",
    paddingTop: 42,
  },

  logo: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#1A1B1F",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#292A2E",
  },

  logoDot: {
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: "#FFAE1B",
  },

  brand: {
    color: "#F4F4F4",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 3,
    marginTop: 12,
  },

  /* ================================================================== */
  /* HEADING                                                            */
  /* ================================================================== */

  headingContainer: {
    marginTop: 75,
  },

  title: {
    color: "#F5F5F5",
    fontSize: 31,
    lineHeight: 37,
    fontWeight: "800",
    letterSpacing: -0.8,
    textAlign: "center",
  },

  subtitle: {
    color: "#A3A3A5",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 15,
  },

  /* ================================================================== */
  /* AUTH                                                               */
  /* ================================================================== */

  authContainer: {
    marginTop: 45,
    gap: 12,
  },

  authButton: {
    height: 58,
    borderRadius: 29,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
  },

  googleButton: {
    backgroundColor: "#FFAE1B",
  },

  appleButton: {
    backgroundColor: "#1A1B1F",
    borderWidth: 1,
    borderColor: "#303136",
  },

  iconContainer: {
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  googleIcon: {
    color: "#17181B",
    fontSize: 20,
    fontWeight: "800",
  },

  googleText: {
    flex: 1,
    color: "#17181B",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    marginRight: 30,
  },

  appleText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    marginRight: 30,
  },

  rightIcon: {
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  /* ================================================================== */
  /* LOCAL MODE                                                         */
  /* ================================================================== */

  localContainer: {
    marginTop: 32,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#292A2E",
  },

  orText: {
    color: "#66676A",
    fontSize: 10,
    fontWeight: "700",
    marginHorizontal: 14,
    letterSpacing: 1,
  },

  skipButton: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  skipText: {
    color: "#FFAE1B",
    fontSize: 15,
    fontWeight: "600",
  },

  localDescription: {
    color: "#6F7074",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 4,
  },

  /* ================================================================== */
  /* FOOTER                                                             */
  /* ================================================================== */

  footer: {
    paddingBottom: 20,
    alignItems: "center",
  },

  footerText: {
    color: "#515257",
    fontSize: 11,
    textAlign: "center",
  },

  /* ================================================================== */
  /* PRESS                                                              */
  /* ================================================================== */

  pressed: {
    opacity: 0.7,
  },
});
