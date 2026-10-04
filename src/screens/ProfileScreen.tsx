import React from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const AVATAR_URI = "https://i.pravatar.cc/300?img=12";

export default function ProfileScreen() {
  const router = useRouter();

  const handlePress = (name: string) => {
    Alert.alert(name, `${name} screen will be added here.`);
  };

  const handleSignOut = () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign out",
        style: "destructive",
        onPress: () => {
          console.log("Sign out");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>

          <Pressable
            style={styles.headerButton}
            onPress={() => handlePress("Settings")}
          >
            <Ionicons name="settings-outline" size={21} color="#aaa" />
          </Pressable>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <Image source={{ uri: AVATAR_URI }} style={styles.avatar} />

            <View style={styles.profileInfo}>
              <Text style={styles.username}>Piyush</Text>

              <Text style={styles.email}>piyush@example.com</Text>

              <Text style={styles.joined}>Joined October 2026</Text>
            </View>

            <Pressable
              style={styles.editButton}
              onPress={() => handlePress("Edit profile")}
            >
              <Ionicons name="create-outline" size={17} color="#fff" />
            </Pressable>
          </View>
        </View>

        {/* Sync Warning */}
        <View style={styles.syncCard}>
          <View style={styles.syncIcon}>
            <Ionicons name="cloud-outline" size={22} color="#FFB020" />
          </View>

          <View style={styles.syncContent}>
            <Text style={styles.syncTitle}>Sync your data</Text>

            <Text style={styles.syncDescription}>
              Connect to Dotly backend to keep your data synced across devices.
              Without sync, your data stays on this device and may be lost if
              app data is removed.
            </Text>

            <Pressable
              style={styles.syncButton}
              onPress={() => handlePress("Connect & Sync")}
            >
              <Text style={styles.syncButtonText}>Connect & Sync</Text>

              <Ionicons name="arrow-forward" size={16} color="#000" />
            </Pressable>
          </View>
        </View>

        {/* Account */}
        <SectionTitle title="ACCOUNT" />

        <View style={styles.section}>
          <SettingRow
            icon="person-outline"
            title="Edit profile"
            subtitle="Username, profile image and email"
            onPress={() => handlePress("Edit profile")}
          />

          <Divider />

          <SettingRow
            icon="link-outline"
            title="Connected accounts"
            subtitle="Manage external accounts"
            onPress={() => handlePress("Connected accounts")}
          />
        </View>

        {/* Connected Accounts */}
        <SectionTitle title="CONNECTED ACCOUNTS" />

        <View style={styles.section}>
          <AccountRow
            icon="logo-github"
            title="GitHub"
            username="Not connected"
            onPress={() => handlePress("GitHub")}
          />

          <Divider />

          <AccountRow
            icon="code-slash-outline"
            title="LeetCode"
            username="Not connected"
            onPress={() => handlePress("LeetCode")}
          />

          <Divider />

          <AccountRow
            icon="trending-up-outline"
            title="Trading account"
            username="Not connected"
            onPress={() => handlePress("Trading account")}
          />
        </View>

        {/* Preferences */}
        <SectionTitle title="PREFERENCES" />

        <View style={styles.section}>
          <SettingRow
            icon="settings-outline"
            title="Settings"
            subtitle="Appearance, notifications and app preferences"
            onPress={() => router.push("/settings")}
          />

          <Divider />

          <SettingRow
            icon="chatbubble-ellipses-outline"
            title="My feedback"
            subtitle="Share feedback or report a problem"
            onPress={() => router.push("/feedback")}
          />

          <Divider />

          <SettingRow
            icon="information-circle-outline"
            title="About Dotly"
            subtitle="Version 1.0.0"
            onPress={() => router.push("/about")}
          />
        </View>

        {/* Privacy */}
        <SectionTitle title="PRIVACY & DATA" />

        <View style={styles.section}>
          <SettingRow
            icon="shield-checkmark-outline"
            title="Privacy & data"
            subtitle="Manage your local data and sync preferences"
            onPress={() => handlePress("Privacy & data")}
          />

          <Divider />

          <SettingRow
            icon="cloud-upload-outline"
            title="Backup & sync"
            subtitle="Manage your Dotly cloud data"
            onPress={() => handlePress("Backup & sync")}
          />
        </View>

        {/* Sign Out */}
        <Pressable style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color="#FF5C5C" />

          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>

        <Text style={styles.footer}>Dotly • Your data, your control</Text>
      </ScrollView>
    </View>
  );
}

/* ---------------- Components ---------------- */

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

type SettingRowProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  subtitle?: string;
  onPress: () => void;
};

function SettingRow({ icon, title, subtitle, onPress }: SettingRowProps) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={20} color="#aaa" />
      </View>

      <View style={styles.rowContent}>
        <Text style={styles.rowTitle}>{title}</Text>

        {subtitle && <Text style={styles.rowSubtitle}>{subtitle}</Text>}
      </View>

      <Ionicons name="chevron-forward" size={18} color="#555" />
    </Pressable>
  );
}

type AccountRowProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  username: string;
  onPress: () => void;
};

function AccountRow({ icon, title, username, onPress }: AccountRowProps) {
  const connected = username !== "Not connected";

  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.accountIcon}>
        <Ionicons name={icon} size={21} color="#fff" />
      </View>

      <View style={styles.rowContent}>
        <Text style={styles.rowTitle}>{title}</Text>

        <Text style={[styles.rowSubtitle, connected && styles.connectedText]}>
          {username}
        </Text>
      </View>

      <View style={styles.accountAction}>
        <Text style={connected ? styles.connected : styles.connect}>
          {connected ? "Connected" : "Connect"}
        </Text>
      </View>
    </Pressable>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 55,
    paddingBottom: 130,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },

  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },

  profileCard: {
    backgroundColor: "#101012",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#222",
    padding: 16,
    marginBottom: 16,
  },

  profileTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#222",
  },

  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },

  username: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  email: {
    color: "#888",
    fontSize: 13,
    marginTop: 3,
  },

  joined: {
    color: "#555",
    fontSize: 12,
    marginTop: 6,
  },

  editButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#1b1b1e",
    alignItems: "center",
    justifyContent: "center",
  },

  syncCard: {
    flexDirection: "row",
    backgroundColor: "#17130A",
    borderWidth: 1,
    borderColor: "#3A2D12",
    borderRadius: 18,
    padding: 15,
    marginBottom: 26,
  },

  syncIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2A210E",
    alignItems: "center",
    justifyContent: "center",
  },

  syncContent: {
    flex: 1,
    marginLeft: 12,
  },

  syncTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  syncDescription: {
    color: "#8E8776",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  syncButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#FFB020",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginTop: 12,
  },

  syncButtonText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "700",
  },

  sectionTitle: {
    color: "#666",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.8,
    marginBottom: 9,
    marginLeft: 4,
  },

  section: {
    backgroundColor: "#101012",
    borderWidth: 1,
    borderColor: "#202023",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 24,
  },

  row: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#19191C",
    alignItems: "center",
    justifyContent: "center",
  },

  accountIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#19191C",
    alignItems: "center",
    justifyContent: "center",
  },

  rowContent: {
    flex: 1,
    marginLeft: 12,
  },

  rowTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  rowSubtitle: {
    color: "#666",
    fontSize: 11,
    marginTop: 3,
  },

  connectedText: {
    color: "#55C878",
  },

  divider: {
    height: 1,
    backgroundColor: "#202023",
    marginLeft: 64,
  },

  accountAction: {
    marginLeft: 8,
  },

  connect: {
    color: "#FFB020",
    fontSize: 11,
    fontWeight: "600",
  },

  connected: {
    color: "#55C878",
    fontSize: 11,
    fontWeight: "600",
  },

  signOutButton: {
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#321A1A",
    backgroundColor: "#120B0B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 2,
  },

  signOutText: {
    color: "#FF5C5C",
    fontSize: 14,
    fontWeight: "600",
  },

  footer: {
    color: "#444",
    fontSize: 11,
    textAlign: "center",
    marginTop: 22,
  },
});
