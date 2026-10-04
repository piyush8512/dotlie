import React from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const APP_VERSION = "1.0.0";

export default function AboutScreen() {
  const router = useRouter();

  const openEmail = async () => {
    const url =
      "mailto:support@dotly.app?subject=Dotly%20Support";

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Email not available", "No email app is available.");
    }
  };

  const openWebsite = async () => {
    const url = "https://dotly.app";

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Unable to open website");
    }
  };

  const sendFeedback = async () => {
    const url =
      "mailto:feedback@dotly.app?subject=Dotly%20Feedback";

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Email not available");
    }
  };

  const showComingSoon = (title: string) => {
    Alert.alert(title, "This feature will be available soon.");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>

        <Text style={styles.headerTitle}>About</Text>

        <View style={styles.headerSpace} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* App identity */}
        <View style={styles.appSection}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>D</Text>
          </View>

          <Text style={styles.appName}>Dotly</Text>

          <Text style={styles.tagline}>
            Your personal productivity space
          </Text>

          <Text style={styles.version}>
            Version {APP_VERSION}
          </Text>
        </View>

        {/* About */}
        <Text style={styles.sectionTitle}>ABOUT</Text>

        <View style={styles.card}>
          <Text style={styles.description}>
            Dotly helps you organize your trackers, wallpapers,
            and personal productivity in one simple place.
          </Text>
        </View>

        {/* Support */}
        <Text style={styles.sectionTitle}>SUPPORT</Text>

        <View style={styles.card}>
          <AboutRow
            icon="mail-outline"
            title="Email Support"
            subtitle="Get help with Dotly"
            onPress={openEmail}
          />

          <Divider />

          <AboutRow
            icon="globe-outline"
            title="Website"
            subtitle="Visit dotly.app"
            onPress={openWebsite}
          />

          <Divider />

          <AboutRow
            icon="chatbubble-ellipses-outline"
            title="Send Feedback"
            subtitle="Tell us what you think"
            onPress={sendFeedback}
          />
        </View>

        {/* Legal */}
        <Text style={styles.sectionTitle}>LEGAL</Text>

        <View style={styles.card}>
          <AboutRow
            icon="shield-checkmark-outline"
            title="Privacy Policy"
            subtitle="How your data is handled"
            onPress={() => showComingSoon("Privacy Policy")}
          />

          <Divider />

          <AboutRow
            icon="document-text-outline"
            title="Terms of Service"
            subtitle="Terms for using Dotly"
            onPress={() => showComingSoon("Terms of Service")}
          />

          <Divider />

          <AboutRow
            icon="code-slash-outline"
            title="Open Source Licenses"
            subtitle="Libraries used by Dotly"
            onPress={() => showComingSoon("Open Source Licenses")}
          />
        </View>

        {/* Developer */}
        <Text style={styles.sectionTitle}>DEVELOPER</Text>

        <View style={styles.card}>
          <AboutRow
            icon="person-outline"
            title="Piyush"
            subtitle="Developer of Dotly"
            onPress={() => {}}
            hideArrow
          />
        </View>

        {/* Bottom */}
        <View style={styles.footer}>
          <Text style={styles.footerName}>Piyush</Text>

          <Text style={styles.footerVersion}>
            Version {APP_VERSION}
          </Text>

          <Text style={styles.copyright}>
            Made with care for Dotly
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------------------------------- */
/* Components */
/* ---------------------------------- */

type AboutRowProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  subtitle: string;
  onPress: () => void;
  hideArrow?: boolean;
};

function AboutRow({
  icon,
  title,
  subtitle,
  onPress,
  hideArrow = false,
}: AboutRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        pressed && styles.rowPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={21} color="#aaa" />
      </View>

      <View style={styles.rowContent}>
        <Text style={styles.rowTitle}>{title}</Text>

        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>

      {!hideArrow && (
        <Ionicons
          name="chevron-forward"
          size={18}
          color="#555"
        />
      )}
    </Pressable>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

/* ---------------------------------- */
/* Styles */
/* ---------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#151515",
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  headerSpace: {
    width: 40,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 40,
  },

  /* App */

  appSection: {
    alignItems: "center",
    marginBottom: 35,
  },

  logo: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  logoText: {
    color: "#000",
    fontSize: 38,
    fontWeight: "800",
  },

  appName: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
  },

  tagline: {
    color: "#777",
    fontSize: 14,
    marginTop: 6,
  },

  version: {
    color: "#555",
    fontSize: 12,
    marginTop: 8,
  },

  /* Sections */

  sectionTitle: {
    color: "#666",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 10,
  },

  card: {
    backgroundColor: "#111",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1c1c1c",
    overflow: "hidden",
    marginBottom: 24,
  },

  description: {
    color: "#aaa",
    fontSize: 14,
    lineHeight: 21,
    padding: 17,
  },

  /* Rows */

  row: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  rowPressed: {
    backgroundColor: "#181818",
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#191919",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  rowContent: {
    flex: 1,
  },

  rowTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },

  rowSubtitle: {
    color: "#666",
    fontSize: 12,
    marginTop: 3,
  },

  divider: {
    height: 1,
    backgroundColor: "#1c1c1c",
    marginLeft: 68,
  },

  /* Footer */

  footer: {
    alignItems: "center",
    paddingTop: 25,
    paddingBottom: 15,
  },

  footerName: {
    color: "#777",
    fontSize: 13,
    fontWeight: "600",
  },

  footerVersion: {
    color: "#444",
    fontSize: 11,
    marginTop: 5,
  },

  copyright: {
    color: "#333",
    fontSize: 11,
    marginTop: 8,
  },
});