import React from "react";
import { Pressable, Image, StyleSheet } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MOVE = LinearTransition.duration(320).easing(Easing.out(Easing.cubic));

type Tab = {
  key: string;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
};

type BottomBarProps = {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
  avatarUri?: string;
};

export default function BottomBar({
  tabs,
  active,
  onChange,
  avatarUri,
}: BottomBarProps) {
  const insets = useSafeAreaInsets();

  function select(key: string) {
    if (key === active) return;
    onChange(key);
  }

  return (
    <Animated.View
      style={[styles.wrap, { bottom: insets.bottom + 22 }]}
      pointerEvents="box-none"
    >
      <Animated.View layout={MOVE} style={styles.bar}>
        {tabs.map((tab) => {
          const isActive = tab.key === active;

          return (
            <Animated.View key={tab.key} layout={MOVE} style={styles.itemOuter}>
              {isActive && (
                <Animated.View
                  entering={FadeIn.duration(220)}
                  exiting={FadeOut.duration(180)}
                  style={styles.pill}
                />
              )}

              <Pressable
                onPress={() => select(tab.key)}
                style={[styles.item, isActive && styles.itemActive]}
                hitSlop={6}
              >
                {tab.key === "profile" && avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={styles.profileImage} />
                ) : (
                  <Ionicons
                    name={tab.icon}
                    size={18}
                    color={isActive ? "#000" : "#8a8a8e"}
                  />
                )}

                {isActive && (
                  <Animated.Text
                    entering={FadeIn.duration(220).delay(80)}
                    exiting={FadeOut.duration(100)}
                    numberOfLines={1}
                    style={styles.label}
                  >
                    {tab.label}
                  </Animated.Text>
                )}
              </Pressable>
            </Animated.View>
          );
        })}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },

  bar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    borderColor: "#222",
    borderWidth: 1,
    borderRadius: 999,
    padding: 6,
    gap: 6,
  },

  itemOuter: {
    borderRadius: 999,
    overflow: "hidden",
  },

  pill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#fff",
    borderRadius: 999,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    minWidth: 40,
    paddingHorizontal: 10,
    gap: 6,
  },

  itemActive: {
    paddingHorizontal: 16,
  },

  label: {
    color: "#000",
    fontWeight: "600",
    fontSize: 13,
  },

  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});  