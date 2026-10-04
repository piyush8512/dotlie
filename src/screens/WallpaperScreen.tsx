import { useRef, useState } from "react";

import {
  Alert,
  Dimensions,
  PixelRatio,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { captureRef } from "react-native-view-shot";

import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

import WallpaperView from "../../src/components/WallpaperView";
import TimeWallpaperView from "../../src/components/TimeWallpaperView";

import { useDotly } from "../../src/context/DotlyProvider";

import { buildGroups, parseCsv, streakFor } from "../../src/lib/lib";

import {
  setLockWallpaper as applyNativeWallpaper,
  wallpaperAvailable,
} from "../../src/services/wallpaper";

type WallpaperMode = "tracker" | "time";

type Period = "month" | "year";

type YearLayout = "grid" | "vertical" | "horizontal";

type YearInfo = "none" | "days" | "daysPercent" | "full";

type NumberSize = "small" | "medium" | "large";

type DotSize = "small" | "medium" | "large";

const DOT_COLORS = [
  "#FFB020",
  "#2BFF88",
  "#4DA3FF",
  "#FF6B9A",
  "#B28CFF",
  "#FFFFFF",
];

export default function WallpaperScreen() {
  const { state, setSetting, setEntry } = useDotly();

  const ref = useRef<View>(null);

  const [busy, setBusy] = useState(false);

  const screen = Dimensions.get("screen");

  const wallpaperMode: WallpaperMode =
    state.settings.wallpaperMode === "time" ? "time" : "tracker";

  const trackerPeriod: Period =
    state.settings.view === "year" ? "year" : "month";

  const timePeriod: Period =
    state.settings.timePeriod === "year" ? "year" : "month";

  /*
   * ============================================
   * TRACKER WALLPAPER COLOR
   * ============================================
   */

  const trackerDotColor =
    typeof state.settings.trackerDotColor === "string"
      ? state.settings.trackerDotColor
      : "#FFB020";

  /*
   * ============================================
   * TIME WALLPAPER COLOR
   * ============================================
   */

  const timeDotColor =
    typeof state.settings.timeDotColor === "string"
      ? state.settings.timeDotColor
      : "#FFB020";

  /*
   * ============================================
   * YEAR CUSTOMIZATION
   * ============================================
   */

  const yearLayout: YearLayout =
    state.settings.yearLayout === "vertical"
      ? "vertical"
      : state.settings.yearLayout === "horizontal"
        ? "horizontal"
        : "grid";

  const yearInfo: YearInfo =
    state.settings.yearInfo === "days"
      ? "days"
      : state.settings.yearInfo === "daysPercent"
        ? "daysPercent"
        : state.settings.yearInfo === "none"
          ? "none"
          : "full";

  const yearNumberSize: NumberSize =
    state.settings.yearNumberSize === "small"
      ? "small"
      : state.settings.yearNumberSize === "medium"
        ? "medium"
        : "large";

  const yearDotSize: DotSize =
    state.settings.yearDotSize === "small"
      ? "small"
      : state.settings.yearDotSize === "large"
        ? "large"
        : "medium";

  /*
   * ============================================
   * TRACKER DATA
   * ============================================
   */

  const { groups, direction } = buildGroups(state, trackerPeriod);

  const target =
    state.settings.target === "combined"
      ? "All"
      : state.trackers.find((item) => item.id === state.settings.target)
          ?.name || "";

  /*
   * ============================================
   * WALLPAPER RENDERER
   * ============================================
   */

  const renderWallpaper = (width: number, height: number) => {
    if (wallpaperMode === "time") {
      return (
        <TimeWallpaperView
          W={width}
          H={height}
          period={timePeriod}
          dotColor={timeDotColor}
          // yearLayout={yearLayout}
          yearInfo={yearInfo}
          yearNumberSize={yearNumberSize}
          yearDotSize={yearDotSize}
        />
      );
    }

    return (
      <WallpaperView
        W={width}
        H={height}
        groups={groups}
        direction={direction}
        view={trackerPeriod}
        streak={streakFor(state)}
        label={target}
        privacy={state.settings.privacy}
        dotColor={trackerDotColor}
      />
    );
  };

  /*
   * ============================================
   * APPLY WALLPAPER
   * ============================================
   */

  const apply = async () => {
    if (!wallpaperAvailable) {
      Alert.alert(
        "Not available",
        "Install the Android development build to set wallpapers.",
      );

      return;
    }

    try {
      setBusy(true);

      const base64 = await captureRef(ref, {
        format: "png",
        result: "base64",

        width: Math.round(screen.width * PixelRatio.get()),

        height: Math.round(screen.height * PixelRatio.get()),
      });

      await applyNativeWallpaper(base64);

      Alert.alert("Done", "Lock screen updated.");
    } catch (error: any) {
      Alert.alert("Failed", error?.message || String(error));
    } finally {
      setBusy(false);
    }
  };

  /*
   * ============================================
   * CSV IMPORT
   * ============================================
   */

  const importCsv = async (tracker: any) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const text = await FileSystem.readAsStringAsync(result.assets[0].uri);

      const days = parseCsv(text);

      Object.entries(days).forEach(([date, value]) => {
        setEntry(tracker.id, date, value as number);
      });

      Alert.alert(
        "Imported",
        `${Object.keys(days).length} trading days added.`,
      );
    } catch (error: any) {
      Alert.alert("Import failed", error?.message || String(error));
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={["top", "left", "right"]}>
      {/* ================================= */}
      {/* HIDDEN CAPTURE                     */}
      {/* ================================= */}

      <View
        ref={ref}
        collapsable={false}
        style={[
          styles.capture,
          {
            width: screen.width,
            height: screen.height,
          },
        ]}
      >
        {renderWallpaper(screen.width, screen.height)}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Wallpaper</Text>



        {/* ================================= */}
        {/* MODE                               */}
        {/* ================================= */}

        <Text style={styles.sectionLabel}>MODE</Text>

        <View style={styles.modeRow}>
          <Pressable
            onPress={() => setSetting("wallpaperMode", "tracker")}
            style={[
              styles.modeCard,
              wallpaperMode === "tracker" && styles.modeCardSelected,
            ]}
          >
            <Text
              style={[
                styles.modeTitle,
                wallpaperMode === "tracker" && styles.modeTitleSelected,
              ]}
            >
              Tracker
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setSetting("wallpaperMode", "time")}
            style={[
              styles.modeCard,
              wallpaperMode === "time" && styles.modeCardSelected,
            ]}
          >
            <Text
              style={[
                styles.modeTitle,
                wallpaperMode === "time" && styles.modeTitleSelected,
              ]}
            >
              Time passed
            </Text>
          </Pressable>
        </View>

        {/* ================================= */}
        {/* TRACKER MODE                       */}
        {/* ================================= */}

        {wallpaperMode === "tracker" && (
          <>
            <Text style={styles.sectionLabel}>SHOW</Text>

            <View style={styles.chipRow}>
              {[
                ["combined", "Combined"],
                ...state.trackers.map((item) => [item.id, item.name]),
              ].map(([key, label]) => {
                const selected = state.settings.target === key;

                return (
                  <Pressable
                    key={key}
                    onPress={() => setSetting("target", key)}
                    style={[styles.chip, selected && styles.chipSelected]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected && styles.chipTextSelected,
                      ]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.sectionLabel}>RANGE</Text>

            <Segmented
              value={trackerPeriod}
              options={[
                ["month", "Month"],
                ["year", "Year"],
              ]}
              onChange={(value) => setSetting("view", value)}
            />

            <Text style={styles.sectionLabel}>DOT COLOR</Text>

            <ColorPicker
              value={trackerDotColor}
              onChange={(color) => setSetting("trackerDotColor", color)}
            />

            <View style={styles.setting}>
              <View>
                <Text style={styles.settingText}>Privacy mode</Text>

                <Text style={styles.settingDescription}>Hide tracker name</Text>
              </View>

              <Switch
                value={state.settings.privacy}
                onValueChange={(value) => setSetting("privacy", value)}
              />
            </View>
          </>
        )}

        {/* ================================= */}
        {/* TIME MODE                          */}
        {/* ================================= */}

        {wallpaperMode === "time" && (
          <>
            <Text style={styles.sectionLabel}>PERIOD</Text>

            <Segmented
              value={timePeriod}
              options={[
                ["month", "Month"],
                ["year", "Year"],
              ]}
              onChange={(value) => setSetting("timePeriod", value)}
            />

            {/* ============================= */}
            {/* YEAR CUSTOMIZATION             */}
            {/* ============================= */}

            {timePeriod === "year" && (
              <>
                <Text style={styles.sectionLabel}>INFORMATION</Text>

                <Segmented
                  value={yearInfo}
                  options={[
                    ["none", "Dots only"],
                    ["days", "Days"],
                    ["daysPercent", "Days + %"],
                    ["full", "Full"],
                  ]}
                  onChange={(value) => setSetting("yearInfo", value)}
                />

                {yearInfo !== "none" && (
                  <>
                    <Text style={styles.sectionLabel}>NUMBER SIZE</Text>

                    <Segmented
                      value={yearNumberSize}
                      options={[
                        ["small", "Small"],
                        ["medium", "Medium"],
                        ["large", "Large"],
                      ]}
                      onChange={(value) => setSetting("yearNumberSize", value)}
                    />
                  </>
                )}

                <Text style={styles.sectionLabel}>DOT SIZE</Text>

                <Segmented
                  value={yearDotSize}
                  options={[
                    ["small", "Small"],
                    ["medium", "Medium"],
                    ["large", "Large"],
                  ]}
                  onChange={(value) => setSetting("yearDotSize", value)}
                />
              </>
            )}

            <Text style={styles.sectionLabel}>DOT COLOR</Text>

            <ColorPicker
              value={timeDotColor}
              onChange={(color) => setSetting("timeDotColor", color)}
            />
          </>
        )}

        {/* ================================= */}
        {/* PREVIEW                            */}
        {/* ================================= */}

        <Text style={styles.sectionLabel}>PREVIEW</Text>

        <View style={styles.preview}>
          {renderWallpaper(screen.width * 0.55, screen.height * 0.55)}
        </View>

        {/* ================================= */}
        {/* APPLY                              */}
        {/* ================================= */}

        <Pressable
          style={[styles.button, busy && styles.buttonDisabled]}
          disabled={busy}
          onPress={apply}
        >
          <Text style={styles.buttonText}>
            {busy ? "Applying..." : "Apply to lock screen"}
          </Text>
        </Pressable>

        {/* ================================= */}
        {/* CSV                                */}
        {/* ================================= */}

        {wallpaperMode === "tracker" &&
          state.trackers
            .filter((item) => item.type === "money")
            .map((tracker) => (
              <Pressable key={tracker.id} onPress={() => importCsv(tracker)}>
                <Text style={styles.link}>
                  Import broker CSV for {tracker.name}
                </Text>
              </Pressable>
            ))}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================================================= */
/* SEGMENTED CONTROL                                  */
/* ================================================= */

function Segmented({
  value,
  options,
  onChange,
}: {
  value: string;
  options: [string, string][];
  onChange: (value: any) => void;
}) {
  return (
    <View style={styles.segmentRow}>
      {options.map(([key, label]) => {
        const selected = value === key;

        return (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            style={[styles.segment, selected && styles.segmentSelected]}
          >
            <Text
              style={[
                styles.segmentText,
                selected && styles.segmentTextSelected,
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ================================================= */
/* COLOR PICKER                                       */
/* ================================================= */

function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <View style={styles.colorRow}>
      {DOT_COLORS.map((color) => {
        const selected = value === color;

        return (
          <Pressable
            key={color}
            onPress={() => onChange(color)}
            style={[
              styles.colorButton,
              {
                backgroundColor: color,
              },
              selected && styles.colorButtonSelected,
            ]}
          >
            {selected && <View style={styles.colorInner} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
  },

  content: {
    padding: 20,
    paddingBottom: 130,
  },

  capture: {
    position: "absolute",
    left: -10000,
    top: 0,
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },

  dim: {
    color: "#777",
    fontSize: 14,
    marginTop: 5,
    lineHeight: 20,
  },

  sectionLabel: {
    color: "#666",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    marginTop: 28,
    marginBottom: 10,
  },

  /* MODE */

  modeRow: {
    flexDirection: "row",
    gap: 10,
  },

  modeCard: {
    flex: 1,
    minHeight: 50,
    padding: 15,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#252525",
    backgroundColor: "#080808",
  },

  modeCardSelected: {
    borderColor: "#FFB020",
    backgroundColor: "#12100A",
  },

  modeTitle: {
    color: "#ddd",
    fontSize: 15,
    
    fontWeight: "700",
  },

  modeTitleSelected: {
    color: "#FFB020",
  },

  modeDescription: {
    color: "#666",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 8,
  },

  modeDescriptionSelected: {
    color: "#999",
  },

  /* SEGMENT */

  segmentRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  segment: {
    borderWidth: 1,
    borderColor: "#292929",
    backgroundColor: "#080808",
    borderRadius: 15,
    paddingVertical: 11,
    paddingHorizontal: 15,
  },

  segmentSelected: {
    backgroundColor: "#FFB020",
    borderColor: "#FFB020",
  },

  segmentText: {
    color: "#999",
    fontSize: 13,
    fontWeight: "600",
  },

  segmentTextSelected: {
    color: "#000",
  },

  /* CHIPS */

  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  chip: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 18,
    paddingVertical: 9,
    paddingHorizontal: 13,
  },

  chipSelected: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },

  chipText: {
    color: "#aaa",
  },

  chipTextSelected: {
    color: "#000",
  },

  /* COLOR */

  colorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  colorButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },

  colorButtonSelected: {
    borderColor: "#fff",
  },

  colorInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#000",
  },

  /* SETTING */

  setting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
  },

  settingText: {
    color: "#ddd",
    fontSize: 14,
  },

  settingDescription: {
    color: "#555",
    fontSize: 11,
    marginTop: 3,
  },

  /* PREVIEW */

  preview: {
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#252525",
    overflow: "hidden",
    marginTop: 4,
  },

  /* BUTTON */

  button: {
    backgroundColor: "#FFB020",
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: "#000",
    fontWeight: "800",
    fontSize: 14,
  },

  link: {
    color: "#4DA3FF",
    marginTop: 18,
    fontSize: 13,
  },
});
