import { StyleSheet, Text, View } from "react-native";

type Info = "none" | "streak" | "full";

type DotSize = "small" | "medium" | "large";

type Props = {
  W: number;
  H: number;
  groups: any[];
  direction: "rows" | "columns" | undefined;
  view: "month" | "year" | string;
  streak: number;
  label: string;
  privacy: boolean;
  dotColor?: string;
  info?: Info;
  dotSize?: DotSize;
};

const EMPTY_COLORS = ["#242428", "#1C1C20", "#000", "#111"];

function isFilled(dot: any) {
  if (!dot) return false;

  if (dot.alpha !== undefined && dot.alpha === 0) {
    return false;
  }

  const fill = String(dot.fill || "").toLowerCase();

  if (!fill) return false;

  return !EMPTY_COLORS.includes(fill);
}

export default function WallpaperView({
  W,
  H,
  groups,
  view,
  streak,
  label,
  privacy,
  dotColor = "#FFB020",
  info = "full",
  dotSize = "medium",
}: Props) {
  const dots = Array.isArray(groups) ? groups.flat() : [];
  const safeW = Number.isFinite(W) && W > 0 ? W : 0;
  const safeH = Number.isFinite(H) && H > 0 ? H : 0;

  if (dots.length === 0) {
    return (
      <View style={[styles.canvas, { width: safeW, height: safeH }]}>
        <Text style={styles.emptyLabel}>No data yet</Text>
      </View>
    );
  }

  const sizes = {
    small: 6,
    medium: 9,
    large: 13,
  };

  const gaps = {
    small: 3,
    medium: 4,
    large: 6,
  };

  const size = sizes[dotSize];
  const gap = gaps[dotSize];

  let actualSize = size;
  let actualGap = gap;

  let columns = Math.max(
    1,
    Math.max(10, Math.floor((safeW - 30) / (actualSize + actualGap))),
  );

  if (view === "year") {
    const maxHeight = info === "none" ? safeH * 0.72 : safeH * 0.95;

    for (let i = 0; i < 4; i++) {
      const rows = Math.ceil(dots.length / columns);

      const rawHeight = rows * actualSize + (rows - 1) * actualGap;

      if (rawHeight > maxHeight) {
        const scale = maxHeight / rawHeight;

        actualSize = Math.max(3, Math.floor(size * scale));

        actualGap = Math.max(2, Math.floor(gap * scale));
      }

      columns = Math.max(
        1,
        Math.max(10, Math.floor((safeW - 32) / (actualSize + actualGap))),
      );
    }
  }

  const actualColumns = Math.min(columns, dots.length);

  const rows = Math.ceil(dots.length / actualColumns);

  const gridWidth =
    actualColumns * actualSize + (actualColumns - 1) * actualGap;

  const gridHeight = rows * actualSize + (rows - 1) * actualGap;

  const showStreak = info === "streak" || info === "full";

  const showLabel = info === "full" && !privacy;

  return (
    <View
      style={[
        styles.canvas,
        {
          width: safeW,
          height: safeH,
        },
      ]}
    >
      <View style={styles.content}>
        {showStreak && (
          <Text
            style={[
              styles.streak,
              {
                fontSize: info === "streak" ? 48 : 56,
              },
            ]}
          >
            {streak}
          </Text>
        )}

        {showLabel && (
          <Text style={styles.label}>
            {label} · {view}
          </Text>
        )}

        <View
          style={[
            styles.grid,
            {
              width: gridWidth,
              height: gridHeight,
            },
          ]}
        >
          {dots.map((dot, index) => {
            const filled = isFilled(dot);

            const column = index % actualColumns;

            const row = Math.floor(index / actualColumns);

            return (
              <View
                key={index}
                style={{
                  width: actualSize,
                  height: actualSize,
                  borderRadius: actualSize / 2,
                  marginRight: column === actualColumns - 1 ? 0 : actualGap,
                  marginBottom: row === rows - 1 ? 0 : actualGap,
                  backgroundColor: filled ? dotColor : "#151515",
                  borderWidth: 1,
                  borderColor: filled ? dotColor : "#292929",
                }}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "flex-start",
    justifyContent: "flex-start",
  },

  streak: {
    color: "#FFB020",
    fontWeight: "800",
    letterSpacing: -2,
    marginBottom: 6,
  },

  label: {
    color: "#666",
    fontSize: 12,
    marginBottom: 18,
  },

  emptyLabel: {
    color: "#666",
    fontSize: 14,
  },
});
