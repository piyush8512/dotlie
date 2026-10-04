import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useDotly } from "../context/DotlyProvider";
import { isDone, streakFor, todayStr } from "../lib/lib";

import Grid from "../components/Grid";
import TrackerModal from "../components/TrackerModal";
import TrackerActionModal from "../components/TrackerActionModal";

export default function HomeScreen() {
  const { state, addTracker, removeTracker, setEntry } = useDotly();

  const [adding, setAdding] = useState(false);
  const [selectedTracker, setSelectedTracker] = useState<any>(null);
  const [actionVisible, setActionVisible] = useState(false);

  const router = useRouter();

  const today = todayStr();
  const streak = streakFor(state);

  const hour = new Date().getHours();

  let greeting = "Good evening";

  if (hour < 12) {
    greeting = "Good morning";
  } else if (hour < 17) {
    greeting = "Good afternoon";
  }

  const handleTrackerPress = (tracker: any) => {
    router.push({
      pathname: "/tracker/[id]",
      params: {
        id: tracker.id,
      },
    });
  };

  const handleTrackerLongPress = (tracker: any) => {
    setSelectedTracker(tracker);
    setActionVisible(true);
  };

  const closeActionModal = () => {
    setActionVisible(false);
    setSelectedTracker(null);
  };

  const handleEdit = () => {
    setActionVisible(false);

    if (!selectedTracker) {
      return;
    }

    Alert.alert(
      "Edit tracker",
      `Editing "${selectedTracker.name}" will be connected next.`,
      [
        {
          text: "OK",
          onPress: () => {
            setSelectedTracker(null);
          },
        },
      ],
    );
  };

  const handleDelete = () => {
    if (!selectedTracker) {
      return;
    }

    removeTracker(selectedTracker);
    closeActionModal();
  };

  return (
    <SafeAreaView style={styles.root} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>{greeting}, Piyush</Text>

          <Text style={styles.subtitle}>Small steps every day add up.</Text>
        </View>

        <View style={styles.streakContainer}>
          <Text style={styles.streak}>{streak}</Text>

          <Text style={styles.streakLabel}>day streak</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {state.trackers.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Build your daily rhythm</Text>

            <Text style={styles.emptyDescription}>
              Track the little things that matter to you. Start with something
              simple and build from there.
            </Text>

            <Text style={styles.suggestionTitle}>YOU COULD TRACK</Text>

            <View style={styles.suggestions}>
              <Suggestion icon="water-outline" title="Drink water" />

              <Suggestion icon="book-outline" title="Read" />

              <Suggestion icon="barbell-outline" title="Exercise" />

              <Suggestion icon="leaf-outline" title="Meditate" />

              <Suggestion icon="logo-github" title="GitHub" />

              <Suggestion icon="code-slash-outline" title="Keep coding" />

              <Suggestion icon="walk-outline" title="Go for a walk" />

              <Suggestion icon="moon-outline" title="Sleep on time" />
            </View>

            <Text style={styles.emptyHint}>
              Tap + to create your first tracker
            </Text>
          </View>
        )}

        {state.trackers.map((tracker) => {
          const value = state.entries[tracker.id]?.[today];

          const done = value !== undefined && isDone(tracker, value);

          return (
            <Pressable
              key={tracker.id}
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
              ]}
              onPress={() => handleTrackerPress(tracker)}
              onLongPress={() => handleTrackerLongPress(tracker)}
              delayLongPress={450}
            >
              <View
                style={[
                  styles.trackerIcon,
                  {
                    backgroundColor: `${tracker.color}18`,
                    borderColor: `${tracker.color}35`,
                  },
                ]}
              >
                <Ionicons
                  name={tracker.icon || "sparkles-outline"}
                  size={21}
                  color={tracker.color}
                />
              </View>

              <View style={styles.trackerContent}>
                <View style={styles.titleRow}>
                  <Text style={styles.title} numberOfLines={1}>
                    {tracker.name}
                  </Text>

                  {tracker.category && (
                    <Text style={styles.category}>{tracker.category}</Text>
                  )}
                </View>

                <Text style={styles.status}>
                  {tracker.type === "yesno"
                    ? done
                      ? "Done today"
                      : "Not yet"
                    : tracker.type === "count"
                      ? `${value || 0} / ${tracker.goal}`
                      : value === undefined
                        ? "No P&L today"
                        : `${value > 0 ? "+" : ""}${value}`}
                </Text>

                <View style={styles.gridContainer}>
                  <Grid
                    groups={[
                      Array.from({ length: 7 }, (_, index) => ({
                        fill: index === 6 && done ? tracker.color : "#242428",
                      })),
                    ]}
                    direction="rows"
                    size={11}
                    gap={5}
                  />
                </View>
              </View>

              <Pressable
                style={[
                  styles.actionButton,
                  done && {
                    backgroundColor: tracker.color,
                  },
                ]}
                onPress={(event) => {
                  event.stopPropagation();

                  if (tracker.type === "yesno") {
                    setEntry(tracker.id, today, done ? undefined : 1);
                  } else if (tracker.type === "count") {
                    setEntry(tracker.id, today, (value || 0) + 1);
                  } else {
                    Alert.alert(
                      "P&L Tracker",
                      "Use the Wallpaper tab to review P&L import.",
                    );
                  }
                }}
              >
                <Ionicons
                  name={
                    tracker.type === "count"
                      ? "add"
                      : done
                        ? "checkmark"
                        : "ellipse-outline"
                  }
                  size={22}
                  color={done ? "#000" : "#777"}
                />
              </Pressable>
            </Pressable>
          );
        })}
      </ScrollView>

      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => setAdding(true)}
      >
        <Ionicons name="add" size={28} color="#000" />
      </Pressable>

      <TrackerModal
        visible={adding}
        onClose={() => setAdding(false)}
        onSave={(tracker: any) => {
          addTracker(tracker);
          setAdding(false);
        }}
      />

      <TrackerActionModal
        visible={actionVisible}
        trackerName={selectedTracker?.name || ""}
        onClose={closeActionModal}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </SafeAreaView>
  );
}

type SuggestionProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
};

function Suggestion({ icon, title }: SuggestionProps) {
  return (
    <View style={styles.suggestion}>
      <View style={styles.suggestionIcon}>
        <Ionicons name={icon} size={16} color="#999" />
      </View>

      <Text style={styles.suggestionText}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
  },

  greetingContainer: {
    flex: 1,
    paddingRight: 15,
  },

  greeting: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  subtitle: {
    color: "#777",
    fontSize: 13,
    marginTop: 5,
  },

  streakContainer: {
    alignItems: "flex-end",
  },

  streak: {
    color: "#FFB020",
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 38,
  },

  streakLabel: {
    color: "#777",
    fontSize: 11,
    marginTop: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 180,
    flexGrow: 1,
  },

  emptyContainer: {
    alignItems: "center",
    paddingTop: 200,
    paddingBottom: 30,
  },

  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#17140D",
    borderWidth: 1,
    borderColor: "#2A2414",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  emptyTitle: {
    color: "#fff",
    fontSize: 21,
    fontWeight: "700",
    textAlign: "center",
  },

  emptyDescription: {
    color: "#777",
    fontSize: 13,
    lineHeight: 20,

    maxWidth: 330,
    marginTop: 8,
  },

  suggestionTitle: {
    textAlign: "center",
    color: "#555",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    marginTop: 32,
    marginBottom: 12,
  },

  suggestions: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },

  suggestion: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0B0B0D",
    borderWidth: 1,
    borderColor: "#1C1C20",
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 11,
  },

  suggestionIcon: {
    marginRight: 7,
  },

  suggestionText: {
    color: "#888",
    fontSize: 12,
  },

  emptyHint: {
    color: "#444",
    fontSize: 12,
    marginTop: 25,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0B0B0D",
    borderWidth: 1,
    borderColor: "#1C1C20",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  cardPressed: {
    backgroundColor: "#101012",
    transform: [{ scale: 0.99 }],
  },

  trackerIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  trackerContent: {
    flex: 1,
    minWidth: 0,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    flexShrink: 1,
  },

  category: {
    color: "#555",
    fontSize: 9,
    marginLeft: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  status: {
    color: "#777",
    fontSize: 12,
    marginTop: 3,
  },

  gridContainer: {
    marginTop: 9,
  },

  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1C1C20",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 105,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },

  fabPressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.85,
  },
});
