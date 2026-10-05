import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { CHANGELOG, ChangeType } from "../src/lib/changelog";
import { LAST_SEEN_VERSION_KEY, markUpdateSeen } from "../src/lib/whatsNew";

const TYPE_LABELS: Record<ChangeType, string> = {
  new: "NEW",
  improved: "IMPROVED",
  fixed: "FIXED",
};

const TYPE_COLORS: Record<ChangeType, string> = {
  new: "#4ade80",
  improved: "#60a5fa",
  fixed: "#fbbf24",
};

export default function UpdateHistoryScreen() {
  const router = useRouter();
  const [seenVersion, setSeenVersion] = useState<string | null>(null);
  const seenIndex = CHANGELOG.findIndex(
    (release) => release.version === seenVersion,
  );

  useEffect(() => {
    let mounted = true;

    const markHistorySeen = async () => {
      const previousVersion = await AsyncStorage.getItem(LAST_SEEN_VERSION_KEY);

      if (mounted) setSeenVersion(previousVersion);
      await markUpdateSeen();
    };

    markHistorySeen();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Update history</Text>
        <View style={styles.headerSpace} />
      </View>

      <FlatList
        data={CHANGELOG}
        keyExtractor={(release) => release.version}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.release}>
            <View style={styles.releaseHeader}>
              <View>
                <Text style={styles.version}>v{item.version}</Text>
                <Text style={styles.date}>{item.date}</Text>
              </View>
              {seenIndex > -1 && CHANGELOG.indexOf(item) < seenIndex && (
                <Text style={styles.newRelease}>NEW</Text>
              )}
            </View>

            <Text style={styles.title}>{item.title}</Text>

            {item.changes.map((change) => (
              <View key={`${change.type}-${change.text}`} style={styles.change}>
                <Text
                  style={[styles.type, { color: TYPE_COLORS[change.type] }]}
                >
                  {TYPE_LABELS[change.type]}
                </Text>
                <Text style={styles.changeText}>{change.text}</Text>
              </View>
            ))}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
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
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  headerSpace: { width: 40 },
  content: { padding: 20, paddingBottom: 40 },
  release: {
    backgroundColor: "#111",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1c1c1c",
    padding: 17,
    marginBottom: 14,
  },
  releaseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  version: { color: "#fff", fontSize: 17, fontWeight: "700" },
  date: { color: "#666", fontSize: 12, marginTop: 4 },
  newRelease: {
    color: "#4ade80",
    borderWidth: 1,
    borderColor: "#28663e",
    borderRadius: 6,
    fontSize: 10,
    fontWeight: "700",
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  title: { color: "#aaa", fontSize: 14, marginTop: 18, marginBottom: 12 },
  change: { flexDirection: "row", alignItems: "flex-start", marginTop: 10 },
  type: { width: 72, fontSize: 10, fontWeight: "700", letterSpacing: 0.5 },
  changeText: { flex: 1, color: "#ddd", fontSize: 14, lineHeight: 19 },
});
