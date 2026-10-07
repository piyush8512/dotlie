import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AMBER } from "../lib/lib";

const colors = [
  "#2BFF88",
  "#4DA3FF",
  "#FFB020",
  "#FF6B9A",
  "#B28CFF",
  "#FFFFFF",
];

type TrackerType = "yesno" | "count" | "money";

type TrackerIcon = React.ComponentProps<typeof Ionicons>["name"];

type TrackerCategory =
  | "Fitness"
  | "Health"
  | "Sleep"
  | "Work"
  | "Productivity"
  | "Digital"
  | "Creative"
  | "Learning"
  | "Coding"
  | "Food"
  | "Home"
  | "Travel"
  | "General";

type Tracker = {
  id: string;
  name: string;
  type: TrackerType;
  goal: number;
  color: string;
  icon: TrackerIcon;
  category: TrackerCategory;
};

type TrackerModalProps = {
  visible: boolean;
  tracker?: Tracker | null; // <-- Added tracker prop
  onClose: () => void;
  onSave: (tracker: Tracker) => void;
};

/* ================================================= */
/* ICONS */
/* ================================================= */

const iconOptions: {
  icon: TrackerIcon;
  label: string;
  category: TrackerCategory;
}[] = [
  // Fitness
  { icon: "barbell-outline", label: "Workout", category: "Fitness" },
  { icon: "fitness-outline", label: "Fitness", category: "Fitness" },
  { icon: "walk-outline", label: "Walking", category: "Fitness" },
  { icon: "bicycle-outline", label: "Cycling", category: "Fitness" },
  { icon: "flame-outline", label: "Streak", category: "Fitness" },

  // Health
  { icon: "heart-outline", label: "Health", category: "Health" },
  { icon: "medkit-outline", label: "Medicine", category: "Health" },
  { icon: "pulse-outline", label: "Health", category: "Health" },

  // Sleep
  { icon: "moon-outline", label: "Sleep", category: "Sleep" },
  { icon: "bed-outline", label: "Bedtime", category: "Sleep" },
  { icon: "cloudy-night-outline", label: "Rest", category: "Sleep" },

  // Work
  { icon: "briefcase-outline", label: "Work", category: "Work" },
  { icon: "business-outline", label: "Office", category: "Work" },
  { icon: "calendar-outline", label: "Meeting", category: "Work" },

  // Productivity
  { icon: "checkmark-done-outline", label: "Tasks", category: "Productivity" },
  { icon: "list-outline", label: "To-do", category: "Productivity" },
  { icon: "timer-outline", label: "Focus", category: "Productivity" },
  { icon: "alarm-outline", label: "Routine", category: "Productivity" },

  // Digital
  { icon: "phone-portrait-outline", label: "Phone", category: "Digital" },
  { icon: "desktop-outline", label: "Computer", category: "Digital" },
  { icon: "game-controller-outline", label: "Gaming", category: "Digital" },
  { icon: "wifi-outline", label: "Internet", category: "Digital" },

  // Creative
  { icon: "color-palette-outline", label: "Design", category: "Creative" },
  { icon: "brush-outline", label: "Drawing", category: "Creative" },
  { icon: "musical-notes-outline", label: "Music", category: "Creative" },
  { icon: "camera-outline", label: "Photography", category: "Creative" },
  { icon: "videocam-outline", label: "Video", category: "Creative" },

  // Learning
  { icon: "book-outline", label: "Reading", category: "Learning" },
  { icon: "school-outline", label: "Study", category: "Learning" },
  { icon: "language-outline", label: "Language", category: "Learning" },
  { icon: "library-outline", label: "Learning", category: "Learning" },

  // Coding
  { icon: "code-slash-outline", label: "Coding", category: "Coding" },
  { icon: "logo-github", label: "GitHub", category: "Coding" },
  { icon: "git-branch-outline", label: "Git", category: "Coding" },
  { icon: "terminal-outline", label: "Terminal", category: "Coding" },

  // Food & Drink
  { icon: "water-outline", label: "Water", category: "Food" },
  { icon: "cafe-outline", label: "Coffee", category: "Food" },
  { icon: "restaurant-outline", label: "Food", category: "Food" },
  { icon: "nutrition-outline", label: "Nutrition", category: "Food" },

  // Home
  { icon: "home-outline", label: "Home", category: "Home" },
  { icon: "construct-outline", label: "Maintenance", category: "Home" },
  { icon: "cart-outline", label: "Shopping", category: "Home" },

  // Travel
  { icon: "airplane-outline", label: "Travel", category: "Travel" },
  { icon: "car-outline", label: "Driving", category: "Travel" },
  { icon: "map-outline", label: "Places", category: "Travel" },

  // General
  { icon: "star-outline", label: "Important", category: "General" },
  { icon: "sparkles-outline", label: "Habit", category: "General" },
  { icon: "flag-outline", label: "Goal", category: "General" },
];

const categories: TrackerCategory[] = [
  "Fitness",
  "Health",
  "Sleep",
  "Work",
  "Productivity",
  "Digital",
  "Creative",
  "Learning",
  "Coding",
  "Food",
  "Home",
  "Travel",
  "General",
];

/* ================================================= */
/* COMPONENT */
/* ================================================= */

export default function TrackerModal({
  visible,
  tracker,
  onClose,
  onSave,
}: TrackerModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<TrackerType>("yesno");
  const [goal, setGoal] = useState("3");
  const [color, setColor] = useState(colors[0]);
  const [selectedIcon, setSelectedIcon] = useState<TrackerIcon>("sparkles-outline");
  const [selectedCategory, setSelectedCategory] = useState<TrackerCategory>("General");
  const [showAllIcons, setShowAllIcons] = useState(false);

  // Sync state when editing a tracker or opening the modal
  useEffect(() => {
    if (visible) {
      if (tracker) {
        setName(tracker.name || "");
        setType(tracker.type || "yesno");
        setGoal(tracker.goal ? String(tracker.goal) : "3");
        setColor(tracker.color || colors[0]);
        setSelectedIcon(tracker.icon || "sparkles-outline");
        setSelectedCategory(tracker.category || "General");
      } else {
        resetForm();
      }
    }
  }, [tracker, visible]);

  const save = () => {
    if (!name.trim()) {
      Alert.alert("Name needed", "Give your tracker a name.");
      return;
    }

    onSave({
      id: tracker ? tracker.id : String(Date.now()), // Maintain existing ID if editing
      name: name.trim(),
      type,
      goal: Math.max(1, Number.parseInt(goal, 10) || 1),
      color,
      icon: selectedIcon,
      category: selectedCategory,
    });

    resetForm();
  };

  const resetForm = () => {
    setName("");
    setType("yesno");
    setGoal("3");
    setColor(colors[0]);
    setSelectedIcon("sparkles-outline");
    setSelectedCategory("General");
    setShowAllIcons(false);
  };

  const close = () => {
    resetForm();
    onClose();
  };

  const visibleIcons = showAllIcons
    ? iconOptions
    : iconOptions.filter((item) => item.category === selectedCategory);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={close}
    >
      <View style={styles.wrap}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>
                {tracker ? "Edit tracker" : "New tracker"}
              </Text>

              <Text style={styles.subtitle}>
                {tracker ? "Update tracker details" : "Create something worth tracking"}
              </Text>
            </View>

            <Pressable style={styles.closeButton} onPress={close}>
              <Ionicons name="close" size={20} color="#888" />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Name */}
            <Text style={styles.label}>NAME</Text>

            <TextInput
              style={styles.input}
              placeholder="e.g. Run, Read, Drink water"
              placeholderTextColor="#555"
              value={name}
              onChangeText={setName}
              autoCapitalize="sentences"
            />

            {/* Category */}
            <Text style={styles.label}>CATEGORY</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryRow}
            >
              {categories.map((category) => {
                const selected = selectedCategory === category;

                return (
                  <Pressable
                    key={category}
                    onPress={() => {
                      setSelectedCategory(category);

                      const firstIcon = iconOptions.find(
                        (item) => item.category === category,
                      );

                      if (firstIcon) {
                        setSelectedIcon(firstIcon.icon);
                      }

                      setShowAllIcons(false);
                    }}
                    style={[
                      styles.categoryChip,
                      selected && styles.categorySelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        selected && styles.categoryTextSelected,
                      ]}
                    >
                      {category}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Icon */}
            <View style={styles.iconHeader}>
              <Text style={styles.label}>ICON</Text>

              <Pressable onPress={() => setShowAllIcons(!showAllIcons)}>
                <Text style={styles.showAll}>
                  {showAllIcons ? "Show category" : "View all"}
                </Text>
              </Pressable>
            </View>

            <View style={styles.iconGrid}>
              {visibleIcons.map((item) => {
                const selected = selectedIcon === item.icon;

                return (
                  <Pressable
                    key={`${item.category}-${item.icon}`}
                    onPress={() => setSelectedIcon(item.icon)}
                    style={[styles.iconButton, selected && styles.iconSelected]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={22}
                      color={selected ? "#000" : "#888"}
                    />

                    <Text
                      numberOfLines={1}
                      style={[
                        styles.iconLabel,
                        selected && styles.iconLabelSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Type */}
            <Text style={styles.label}>TYPE</Text>

            <View style={styles.row}>
              {[
                ["yesno", "Yes / No"],
                ["count", "Count"],
                ["money", "VALUE"],
              ].map(([key, label]) => {
                const selected = type === key;

                return (
                  <Pressable
                    key={key}
                    onPress={() => setType(key as TrackerType)}
                    style={[styles.chip, selected && styles.selected]}
                  >
                    <Text
                      style={{
                        color: selected ? "#000" : "#bbb",
                      }}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Goal */}
            {type === "count" && (
              <>
                <Text style={styles.label}>DAILY GOAL</Text>

                <TextInput
                  style={styles.input}
                  keyboardType="number-pad"
                  value={goal}
                  onChangeText={setGoal}
                  placeholder="e.g. 3"
                  placeholderTextColor="#555"
                />
              </>
            )}

            {/* Color */}
            {type !== "money" && (
              <>
                <Text style={styles.label}>COLOR</Text>

                <View style={styles.colorRow}>
                  {colors.map((item) => {
                    const selected = color === item;

                    return (
                      <Pressable
                        key={item}
                        onPress={() => setColor(item)}
                        style={[
                          styles.colorButton,
                          {
                            backgroundColor: item,
                          },
                          selected && styles.colorSelected,
                        ]}
                      >
                        {selected && (
                          <Ionicons
                            name="checkmark"
                            size={16}
                            color={item === "#FFFFFF" ? "#000" : "#000"}
                          />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              </>
            )}

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <Pressable style={styles.button} onPress={close}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.createButton]}
                onPress={save}
              >
                <Ionicons name={tracker ? "checkmark" : "add"} size={18} color="#000" />

                <Text style={[styles.buttonText, styles.createButtonText]}>
                  {tracker ? "Save" : "Create"}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/* ================================================= */
/* STYLES */
/* ================================================= */

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,.72)",
    justifyContent: "flex-end",
  },
  sheet: {
    maxHeight: "92%",
    backgroundColor: "#0B0B0D",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1,
    borderColor: "#1C1C20",
    overflow: "hidden",
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    color: "#666",
    fontSize: 12,
    marginTop: 4,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#18181B",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: "#666",
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 9,
  },
  input: {
    backgroundColor: "#151518",
    color: "#fff",
    borderWidth: 1,
    borderColor: "#222",
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
  },
  categoryRow: {
    gap: 8,
    paddingBottom: 2,
  },
  categoryChip: {
    borderWidth: 1,
    borderColor: "#29292D",
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#111114",
  },
  categorySelected: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },
  categoryText: {
    color: "#888",
    fontSize: 12,
  },
  categoryTextSelected: {
    color: "#000",
    fontWeight: "600",
  },
  iconHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  showAll: {
    color: AMBER,
    fontSize: 11,
    fontWeight: "600",
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  iconButton: {
    width: "23%",
    minHeight: 64,
    borderRadius: 13,
    backgroundColor: "#151518",
    borderWidth: 1,
    borderColor: "#222",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  iconSelected: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },
  iconLabel: {
    color: "#666",
    fontSize: 9,
    marginTop: 5,
    textAlign: "center",
  },
  iconLabelSelected: {
    color: "#000",
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center",
  },
  chip: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  selected: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },
  colorRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  colorButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: "#777",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 24,
  },
  button: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  createButton: {
    backgroundColor: AMBER,
    borderColor: AMBER,
  },
  createButtonText: {
    color: "#000",
  },
});