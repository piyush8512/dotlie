import { StyleSheet, Text, View } from "react-native";

type Period = "month" | "year";

type YearInfo = "none" | "days" | "daysPercent" | "full";

type NumberSize = "small" | "medium" | "large";

type DotSize = "small" | "medium" | "large";

type Props = {
  W: number;
  H: number;
  period: Period;
  dotColor?: string;
  yearInfo?: YearInfo;
  yearNumberSize?: NumberSize;
  yearDotSize?: DotSize;
};

function getDaysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function getDaysInYear(date: Date) {
  const year = date.getFullYear();

  const start = new Date(year, 0, 1);

  const nextYear = new Date(year + 1, 0, 1);

  return Math.round(
    (nextYear.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );
}

function getDayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 1);

  return (
    Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  );
}

function getMonthName(date: Date) {
  return date.toLocaleString("en-US", {
    month: "long",
  });
}

export default function TimeWallpaperView({
  W,
  H,
  period,
  dotColor = "#FFB020",
  yearInfo = "full",
  yearNumberSize = "large",
  yearDotSize = "medium",
}: Props) {
  const now = new Date();

  const isMonth = period === "month";

  const totalDays = isMonth ? getDaysInMonth(now) : getDaysInYear(now);

  const elapsedDays = isMonth ? now.getDate() : getDayOfYear(now);

  const percentage = Math.round((elapsedDays / totalDays) * 100);

  if (isMonth) {
    return (
      <MonthWallpaper
        W={W}
        H={H}
        totalDays={totalDays}
        elapsedDays={elapsedDays}
        dotColor={dotColor}
        label={`${getMonthName(now)} ${now.getFullYear()}`}
        percentage={percentage}
      />
    );
  }

  return (
    <YearWallpaper
      W={W}
      H={H}
      totalDays={totalDays}
      elapsedDays={elapsedDays}
      percentage={percentage}
      dotColor={dotColor}
      info={yearInfo}
      numberSize={yearNumberSize}
      dotSize={yearDotSize}
      year={now.getFullYear()}
    />
  );
}

function MonthWallpaper({
  W,
  H,
  totalDays,
  elapsedDays,
  dotColor,
  label,
  percentage,
}: {
  W: number;
  H: number;
  totalDays: number;
  elapsedDays: number;
  dotColor: string;
  label: string;
  percentage: number;
}) {
  const columns = 7;

  const dotSize = 15;
  const gap = 7;

  const rows = Math.ceil(totalDays / columns);

  const dots = Array.from(
    { length: totalDays },
    (_, index) => index < elapsedDays,
  );

  const gridWidth = columns * dotSize + (columns - 1) * gap;

  const gridHeight = rows * dotSize + (rows - 1) * gap;

  const availableWidth = W - 32;

  const scale = gridWidth > availableWidth ? availableWidth / gridWidth : 1;

  const actualDotSize = Math.max(5, Math.floor(dotSize * scale));

  const actualGap = Math.max(2, Math.floor(gap * scale));

  const actualGridWidth = columns * actualDotSize + (columns - 1) * actualGap;

  const actualGridHeight = rows * actualDotSize + (rows - 1) * actualGap;

  return (
    <View
      style={[
        styles.canvas,
        {
          width: W,
          height: H,
        },
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.number}>{elapsedDays}</Text>

        <Text style={styles.of}>OF {totalDays} DAYS</Text>

        <View
          style={[
            styles.grid,
            {
              width: actualGridWidth,
              height: actualGridHeight,
            },
          ]}
        >
          {dots.map((filled, index) => {
            const column = index % columns;

            const row = Math.floor(index / columns);

            return (
              <Dot
                key={index}
                filled={filled}
                color={dotColor}
                size={actualDotSize}
                marginRight={column === columns - 1 ? 0 : actualGap}
                marginBottom={row === rows - 1 ? 0 : actualGap}
              />
            );
          })}
        </View>

        <Text style={styles.label}>{label}</Text>

        <Text style={styles.percent}>{percentage}% elapsed</Text>
      </View>
    </View>
  );
}

function YearWallpaper({
  W,
  H,
  totalDays,
  elapsedDays,
  percentage,
  dotColor,
  info,
  numberSize,
  dotSize,
  year,
}: {
  W: number;
  H: number;
  totalDays: number;
  elapsedDays: number;
  percentage: number;
  dotColor: string;
  info: YearInfo;
  numberSize: NumberSize;
  dotSize: DotSize;
  year: number;
}) {
  const numberStyles = {
    small: {
      fontSize: 34,
      lineHeight: 40,
    },

    medium: {
      fontSize: 48,
      lineHeight: 54,
    },

    large: {
      fontSize: 64,
      lineHeight: 70,
    },
  };

  const dotSizes = {
    small: 5,
    medium: 7,
    large: 15,
  };

  const dotGaps = {
    small: 4,
    medium: 4,
    large: 22,
  };

  const size = dotSizes[dotSize];
  const gap = dotGaps[dotSize];

  const availableWidth = W - 70;
  const maxHeight = Math.max(100, H * 0.92);

  let columns = Math.max(10, Math.floor(availableWidth / (size + gap)));

  let actualSize = size;
  let actualGap = gap;

  for (let i = 0; i < 3; i++) {
    const rows = Math.ceil(totalDays / columns);

    const rawHeight = rows * actualSize + (rows - 1) * actualGap;

    if (rawHeight > maxHeight) {
      const scale = maxHeight / rawHeight;

      actualSize = Math.max(3, Math.floor(size * scale));

      actualGap = Math.max(2, Math.floor(gap * scale));
    }

    columns = Math.max(
      10,
      Math.floor(availableWidth / (actualSize + actualGap)),
    );
  }

  const rows = Math.ceil(totalDays / columns);

  const gridWidth = columns * actualSize + (columns - 1) * actualGap;

  const gridHeight = rows * actualSize + (rows - 1) * actualGap;

  const dots = Array.from(
    { length: totalDays },
    (_, index) => index < elapsedDays,
  );

  const showNumber = info !== "none";

  const showPercentage = info === "daysPercent" || info === "full";

  const showFull = info === "full";

  return (
    <View
      style={[
        styles.canvas,
        {
          width: W,
          height: H,
        },
      ]}
    >
      <View
        style={[styles.yearContent, info === "none" && styles.dotsOnlyContent]}
      >
        {showNumber && (
          <Text style={[styles.yearNumber, numberStyles[numberSize]]}>
            {elapsedDays}
          </Text>
        )}

        {showFull && <Text style={styles.of}>OF {totalDays} DAYS</Text>}

        <View
          style={[
            styles.yearGrid,
            {
              width: gridWidth,
              height: gridHeight,
            },
          ]}
        >
          {dots.map((filled, index) => {
            const column = index % columns;

            const row = Math.floor(index / columns);

            return (
              <Dot
                key={index}
                filled={filled}
                color={dotColor}
                size={actualSize}
                marginRight={column === columns - 1 ? 0 : actualGap}
                marginBottom={row === rows - 1 ? 0 : actualGap}
              />
            );
          })}
        </View>

        {showFull && <Text style={styles.yearLabel}>{year}</Text>}

        {showPercentage && (
          <Text style={styles.percent}>{percentage}% elapsed</Text>
        )}
      </View>
    </View>
  );
}

function Dot({
  filled,
  color,
  size,
  marginRight,
  marginBottom,
}: {
  filled: boolean;
  color: string;
  size: number;
  marginRight: number;
  marginBottom: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        marginRight,
        marginBottom,
        backgroundColor: filled ? color : "#151515",
        borderWidth: 1,
        borderColor: filled ? color : "#292929",
      }}
    />
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
  },

  yearContent: {
    alignItems: "center",
    justifyContent: "center",
  },

  dotsOnlyContent: {
    flex: 1,
    justifyContent: "center",
  },

  number: {
    color: "#FFB020",
    fontSize: 64,
    lineHeight: 70,
    fontWeight: "800",
    letterSpacing: -2,
  },

  yearNumber: {
    color: "#FFB020",
    fontWeight: "800",
    letterSpacing: -1,
    marginBottom: 4,
  },

  of: {
    color: "#666",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 22,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "flex-start",
  },

  yearGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "flex-start",
    justifyContent: "flex-start",
  },

  label: {
    color: "#888",
    fontSize: 14,
    marginTop: 24,
  },

  yearLabel: {
    color: "#666",
    fontSize: 13,
    marginTop: 20,
  },

  percent: {
    color: "#555",
    fontSize: 11,
    marginTop: 7,
  },
});
