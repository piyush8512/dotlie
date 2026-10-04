import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { useDotly } from "../../src/context/DotlyProvider";

type DayStatus = "done" | "missed" | "future" | "today";

type CalendarDay = {
  date: string;
  day: number;
  status: DayStatus;
};

export default function TrackerDetailScreen() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const { state } = useDotly();

  const tracker = state.trackers.find((item) => item.id === id);

  const [monthOffset, setMonthOffset] = useState(0);

  const today = new Date();

  const selectedMonth = new Date(
    today.getFullYear(),
    today.getMonth() + monthOffset,
    1,
  );

  const monthName = selectedMonth.toLocaleString("en-US", {
    month: "long",
  });

  const year = selectedMonth.getFullYear();

  const trackerColor = tracker?.color || "#FFB020";

  const activity = useMemo(() => {
    return getTrackerActivity(state, tracker?.id);
  }, [state, tracker?.id]);

  const calendarDays = useMemo(() => {
    return buildCalendar(selectedMonth, activity, today);
  }, [selectedMonth, activity]);

  const monthStats = useMemo(() => {
    return calculateMonthStats(selectedMonth, activity, today);
  }, [selectedMonth, activity]);

  const overallStats = useMemo(() => {
    return calculateOverallStats(activity, today);
  }, [activity]);

  const weeklyProgress = useMemo(() => {
    return getWeeklyProgress(activity, today);
  }, [activity]);

  if (!tracker) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.headerButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={21} color="#fff" />
          </Pressable>

          <Text style={styles.headerTitle}>Tracker</Text>

          <View style={styles.headerButton} />
        </View>

        <View style={styles.notFound}>
          <Ionicons name="alert-circle-outline" size={42} color="#555" />

          <Text style={styles.notFoundTitle}>Tracker not found</Text>

          <Text style={styles.notFoundText}>
            This tracker may have been deleted.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.headerButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={21} color="#fff" />
        </Pressable>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {tracker.name}
        </Text>

        <Pressable style={styles.headerButton} onPress={() => {}}>
          <Ionicons name="ellipsis-horizontal" size={21} color="#aaa" />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.hero}>
          <View
            style={[
              styles.trackerIcon,
              {
                backgroundColor: `${trackerColor}18`,
                borderColor: `${trackerColor}35`,
              },
            ]}
          >
            <Ionicons
              name={tracker.icon || "sparkles-outline"}
              size={34}
              color={trackerColor}
            />
          </View>

          <Text style={styles.heroName}>{tracker.name}</Text>

          <Text style={styles.heroCategory}>
            {tracker.category || "General"}
          </Text>
        </View>

        <View style={styles.statsCard}>
          <Stat value={String(overallStats.totalCompleted)} label="Completed" />

          <View style={styles.statDivider} />

          <Stat value={String(overallStats.currentStreak)} label="Streak" />

          <View style={styles.statDivider} />

          <Stat value={`${overallStats.completionRate}%`} label="Completion" />
        </View>

        <SectionTitle title="MONTHLY PROGRESS" />

        <View style={styles.calendarCard}>
          <View style={styles.monthHeader}>
            <View>
              <Text style={styles.monthName}>{monthName}</Text>

              <Text style={styles.monthYear}>{year}</Text>
            </View>

            <View style={styles.monthControls}>
              <Pressable
                style={styles.monthButton}
                onPress={() => setMonthOffset((value) => value - 1)}
              >
                <Ionicons name="chevron-back" size={17} color="#aaa" />
              </Pressable>

              <Pressable
                style={styles.monthButton}
                onPress={() =>
                  setMonthOffset((value) => Math.min(value + 1, 0))
                }
              >
                <Ionicons
                  name="chevron-forward"
                  size={17}
                  color={monthOffset === 0 ? "#333" : "#aaa"}
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.weekHeader}>
            {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
              <Text key={index} style={styles.weekDay}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {calendarDays.map((item, index) => {
              if (!item.date) {
                return <View key={index} style={styles.calendarCell} />;
              }

              const completed = item.status === "done";

              const isToday = item.status === "today";

              return (
                <View key={item.date} style={styles.calendarCell}>
                  <View
                    style={[
                      styles.dayCircle,
                      completed && {
                        backgroundColor: trackerColor,
                      },
                      isToday &&
                        !completed && {
                          borderColor: trackerColor,
                          borderWidth: 1,
                        },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        completed && styles.completedDayText,
                      ]}
                    >
                      {item.day}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.calendarLegend}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  {
                    backgroundColor: trackerColor,
                  },
                ]}
              />

              <Text style={styles.legendText}>Completed</Text>
            </View>

            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.legendToday]} />

              <Text style={styles.legendText}>Today</Text>
            </View>
          </View>
        </View>

        <View style={styles.monthSummary}>
          <View>
            <Text style={styles.summaryValue}>
              {monthStats.completionRate}%
            </Text>

            <Text style={styles.summaryLabel}>{monthName} completion</Text>
          </View>

          <View style={styles.summaryRight}>
            <Text style={styles.summarySmallValue}>{monthStats.completed}</Text>

            <Text style={styles.summaryLabel}>completed</Text>
          </View>
        </View>

        <SectionTitle title="WEEKLY PROGRESS" />

        <View style={styles.weekCard}>
          <View style={styles.weekBars}>
            {weeklyProgress.map((item, index) => (
              <View key={index} style={styles.weekBarItem}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${Math.max(item.progress, 4)}%`,
                        backgroundColor: trackerColor,
                      },
                    ]}
                  />
                </View>

                <Text style={styles.barDay}>{item.day}</Text>
              </View>
            ))}
          </View>

          <View style={styles.weekBottom}>
            <View>
              <Text style={styles.weekTotal}>
                {weeklyProgress.reduce((sum, item) => sum + item.value, 0)}
              </Text>

              <Text style={styles.weekLabel}>This week</Text>
            </View>

            <View style={styles.weekAverage}>
              <Text style={styles.weekTotal}>
                {calculateAverage(weeklyProgress)}
              </Text>

              <Text style={styles.weekLabel}>Daily average</Text>
            </View>
          </View>
        </View>

        {tracker.type === "count" && (
          <>
            <SectionTitle title="GOAL PROGRESS" />

            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View>
                  <Text style={styles.goalTitle}>Today's goal</Text>

                  <Text style={styles.goalSubtitle}>
                    Keep building your streak
                  </Text>
                </View>

                <Text style={[styles.goalValue, { color: trackerColor }]}>
                  0 / {tracker.goal}
                </Text>
              </View>

              <View style={styles.goalTrack}>
                <View
                  style={[
                    styles.goalFill,
                    {
                      width: "0%",
                      backgroundColor: trackerColor,
                    },
                  ]}
                />
              </View>
            </View>
          </>
        )}

        <SectionTitle title="ALL TIME" />

        <View style={styles.allTimeCard}>
          <AllTimeRow
            icon="checkmark-circle-outline"
            label="Total completions"
            value={String(overallStats.totalCompleted)}
            color={trackerColor}
          />

          <Divider />

          <AllTimeRow
            icon="flame-outline"
            label="Best streak"
            value={`${overallStats.bestStreak} days`}
            color={trackerColor}
          />

          <Divider />

          <AllTimeRow
            icon="calendar-outline"
            label="Active days"
            value={String(overallStats.activeDays)}
            color={trackerColor}
          />

          <Divider />

          <AllTimeRow
            icon="trending-up-outline"
            label="Overall completion"
            value={`${overallStats.completionRate}%`}
            color={trackerColor}
          />
        </View>

        <SectionTitle title="TRACKER DETAILS" />

        <View style={styles.detailsCard}>
          <DetailRow
            icon="repeat-outline"
            title="Type"
            value={
              tracker.type === "yesno"
                ? "Yes / No"
                : tracker.type === "count"
                  ? "Count"
                  : "P&L"
            }
          />

          {tracker.type === "count" && (
            <>
              <Divider />

              <DetailRow
                icon="flag-outline"
                title="Daily goal"
                value={String(tracker.goal)}
              />
            </>
          )}

          <Divider />

          <DetailRow
            icon="pricetag-outline"
            title="Category"
            value={tracker.category || "General"}
          />

          <Divider />

          <DetailRow
            icon="color-palette-outline"
            title="Color"
            value={tracker.color}
          />
        </View>

        <SectionTitle title="RECENT ACTIVITY" />

        {activity.length === 0 ? (
          <View style={styles.emptyActivity}>
            <Ionicons name="calendar-outline" size={28} color="#444" />

            <Text style={styles.emptyTitle}>No activity yet</Text>

            <Text style={styles.emptyText}>
              Start completing this tracker and your activity will appear here.
            </Text>
          </View>
        ) : (
          <View style={styles.activityCard}>
            {activity
              .slice(-7)
              .reverse()
              .map((item, index) => (
                <View key={`${item.date}-${index}`}>
                  <View style={styles.activityRow}>
                    <View
                      style={[
                        styles.activityIcon,
                        {
                          backgroundColor: `${trackerColor}16`,
                        },
                      ]}
                    >
                      <Ionicons
                        name="checkmark"
                        size={17}
                        color={trackerColor}
                      />
                    </View>

                    <View style={styles.activityInfo}>
                      <Text style={styles.activityDate}>
                        {formatActivityDate(item.date)}
                      </Text>

                      <Text style={styles.activityStatus}>Completed</Text>
                    </View>
                  </View>

                  {index < 6 && <Divider />}
                </View>
              ))}
          </View>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>

      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function AllTimeRow({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View style={styles.allTimeRow}>
      <View
        style={[
          styles.allTimeIcon,
          {
            backgroundColor: `${color}14`,
          },
        ]}
      >
        <Ionicons name={icon} size={18} color={color} />
      </View>

      <Text style={styles.allTimeLabel}>{label}</Text>

      <Text style={styles.allTimeValue}>{value}</Text>
    </View>
  );
}

function DetailRow({
  icon,
  title,
  value,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  value: string;
}) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>
        <Ionicons name={icon} size={18} color="#888" />
      </View>

      <Text style={styles.detailTitle}>{title}</Text>

      <Text style={styles.detailValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function getTrackerActivity(
  state: any,
  trackerId?: string,
): { date: string; value: number }[] {
  if (!trackerId) return [];

  const logs = state?.logs || state?.entries || state?.history || [];

  if (!Array.isArray(logs)) {
    return [];
  }

  return logs
    .filter(
      (item: any) =>
        item.trackerId === trackerId || item.tracker_id === trackerId,
    )
    .map((item: any) => ({
      date: item.date || item.day || item.createdAt?.slice(0, 10),
      value: typeof item.value === "number" ? item.value : item.done ? 1 : 0,
    }))
    .filter((item: any) => item.date);
}

function buildCalendar(
  month: Date,
  activity: {
    date: string;
    value: number;
  }[],
  today: Date,
): CalendarDay[] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  const firstDay = new Date(year, monthIndex, 1);

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  let mondayIndex = firstDay.getDay() - 1;

  if (mondayIndex < 0) {
    mondayIndex = 6;
  }

  const result: CalendarDay[] = [];

  for (let i = 0; i < mondayIndex; i++) {
    result.push({
      date: "",
      day: 0,
      status: "future",
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = formatDate(new Date(year, monthIndex, day));

    const completed = activity.some(
      (item) => item.date === date && item.value > 0,
    );

    const todayDate = formatDate(today);

    let status: DayStatus;

    if (completed) {
      status = "done";
    } else if (date === todayDate) {
      status = "today";
    } else if (new Date(year, monthIndex, day) > today) {
      status = "future";
    } else {
      status = "missed";
    }

    result.push({
      date,
      day,
      status,
    });
  }

  while (result.length % 7 !== 0) {
    result.push({
      date: "",
      day: 0,
      status: "future",
    });
  }

  return result;
}

function calculateMonthStats(
  month: Date,
  activity: {
    date: string;
    value: number;
  }[],
  today: Date,
) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const lastDay =
    monthIndex === today.getMonth() && year === today.getFullYear()
      ? today.getDate()
      : daysInMonth;

  const completed = activity.filter((item) => {
    const date = new Date(`${item.date}T00:00:00`);

    return (
      date.getFullYear() === year &&
      date.getMonth() === monthIndex &&
      date.getDate() <= lastDay &&
      item.value > 0
    );
  }).length;

  const completionRate =
    lastDay > 0 ? Math.round((completed / lastDay) * 100) : 0;

  return {
    completed,
    completionRate,
  };
}

function calculateOverallStats(
  activity: {
    date: string;
    value: number;
  }[],
  today: Date,
) {
  const completedDates = activity
    .filter((item) => item.value > 0)
    .map((item) => item.date)
    .sort();

  const uniqueDates = [...new Set(completedDates)];

  const totalCompleted = uniqueDates.length;

  let currentStreak = 0;
  let bestStreak = 0;

  if (uniqueDates.length > 0) {
    let streak = 1;

    for (let i = uniqueDates.length - 1; i > 0; i--) {
      const current = new Date(`${uniqueDates[i]}T00:00:00`);

      const previous = new Date(`${uniqueDates[i - 1]}T00:00:00`);

      const diff = Math.round(
        (current.getTime() - previous.getTime()) / 86400000,
      );

      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }

    const lastDate = new Date(
      `${uniqueDates[uniqueDates.length - 1]}T00:00:00`,
    );

    const todayDate = new Date(formatDate(today) + "T00:00:00");

    const difference = Math.round(
      (todayDate.getTime() - lastDate.getTime()) / 86400000,
    );

    currentStreak = difference <= 1 ? streak : 0;

    let temp = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
      const current = new Date(`${uniqueDates[i]}T00:00:00`);

      const previous = new Date(`${uniqueDates[i - 1]}T00:00:00`);

      const diff = Math.round(
        (current.getTime() - previous.getTime()) / 86400000,
      );

      if (diff === 1) {
        temp++;
      } else {
        bestStreak = Math.max(bestStreak, temp);

        temp = 1;
      }
    }

    bestStreak = Math.max(bestStreak, temp);
  }

  const firstDate =
    uniqueDates.length > 0 ? new Date(`${uniqueDates[0]}T00:00:00`) : today;

  const daysSinceStart = Math.max(
    1,
    Math.floor((today.getTime() - firstDate.getTime()) / 86400000) + 1,
  );

  const completionRate = Math.min(
    100,
    Math.round((totalCompleted / daysSinceStart) * 100),
  );

  return {
    totalCompleted,
    currentStreak,
    bestStreak,
    activeDays: totalCompleted,
    completionRate,
  };
}

function getWeeklyProgress(
  activity: {
    date: string;
    value: number;
  }[],
  today: Date,
) {
  const monday = new Date(today);

  const day = monday.getDay() || 7;

  monday.setDate(monday.getDate() - day + 1);

  const labels = ["M", "T", "W", "T", "F", "S", "S"];

  return labels.map((label, index) => {
    const date = new Date(monday);

    date.setDate(monday.getDate() + index);

    const dateString = formatDate(date);

    const value = activity
      .filter((item) => item.date === dateString)
      .reduce((sum, item) => sum + item.value, 0);

    return {
      day: label,
      value,
      progress: value > 0 ? 100 : 0,
    };
  });
}

function calculateAverage(data: { value: number }[]) {
  if (!data.length) return "0";

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (total / data.length).toFixed(1);
}

function formatDate(date: Date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatActivityDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

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
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#151515",
  },

  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    maxWidth: "65%",
  },

  content: {
    padding: 20,
    paddingBottom: 50,
  },

  hero: {
    alignItems: "center",
    paddingTop: 18,
    paddingBottom: 26,
  },

  trackerIcon: {
    width: 76,
    height: 76,
    borderRadius: 25,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  heroName: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "700",
  },

  heroCategory: {
    color: "#666",
    fontSize: 11,
    marginTop: 5,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0B0B0D",
    borderWidth: 1,
    borderColor: "#1C1C20",
    borderRadius: 18,
    paddingVertical: 19,
    marginBottom: 28,
  },

  stat: {
    flex: 1,
    alignItems: "center",
  },

  statValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  statLabel: {
    color: "#666",
    fontSize: 10,
    marginTop: 5,
  },

  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#222",
  },

  sectionTitle: {
    color: "#555",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 10,
  },

  calendarCard: {
    backgroundColor: "#0B0B0D",
    borderWidth: 1,
    borderColor: "#1C1C20",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },

  monthHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  monthName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  monthYear: {
    color: "#555",
    fontSize: 11,
    marginTop: 2,
  },

  monthControls: {
    flexDirection: "row",
    gap: 6,
  },

  monthButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "#151517",
    alignItems: "center",
    justifyContent: "center",
  },

  weekHeader: {
    flexDirection: "row",
    marginBottom: 8,
  },

  weekDay: {
    flex: 1,
    textAlign: "center",
    color: "#555",
    fontSize: 10,
    fontWeight: "600",
  },

  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  calendarCell: {
    width: "14.2857%",
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  dayCircle: {
    width: 31,
    height: 31,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  dayText: {
    color: "#777",
    fontSize: 11,
    fontWeight: "500",
  },

  completedDayText: {
    color: "#000",
    fontWeight: "700",
  },

  calendarLegend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    marginTop: 14,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: "#18181B",
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  legendToday: {
    backgroundColor: "#222",
    borderWidth: 1,
    borderColor: "#777",
  },

  legendText: {
    color: "#555",
    fontSize: 10,
  },

  monthSummary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0B0B0D",
    borderWidth: 1,
    borderColor: "#1C1C20",
    borderRadius: 18,
    padding: 18,
    marginBottom: 28,
  },

  summaryValue: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "700",
  },

  summarySmallValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "right",
  },

  summaryLabel: {
    color: "#555",
    fontSize: 10,
    marginTop: 4,
  },

  summaryRight: {
    alignItems: "flex-end",
  },

  weekCard: {
    backgroundColor: "#0B0B0D",
    borderWidth: 1,
    borderColor: "#1C1C20",
    borderRadius: 20,
    padding: 18,
    marginBottom: 28,
  },

  weekBars: {
    height: 130,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  weekBarItem: {
    width: 28,
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  barTrack: {
    width: 7,
    height: 95,
    borderRadius: 5,
    backgroundColor: "#171719",
    justifyContent: "flex-end",
    overflow: "hidden",
  },

  barFill: {
    width: "100%",
    borderRadius: 5,
  },

  barDay: {
    color: "#555",
    fontSize: 10,
    marginTop: 8,
  },

  weekBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#18181B",
    marginTop: 16,
    paddingTop: 14,
  },

  weekAverage: {
    alignItems: "flex-end",
  },

  weekTotal: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  weekLabel: {
    color: "#555",
    fontSize: 10,
    marginTop: 3,
  },

  goalCard: {
    backgroundColor: "#0B0B0D",
    borderWidth: 1,
    borderColor: "#1C1C20",
    borderRadius: 20,
    padding: 18,
    marginBottom: 28,
  },

  goalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  goalTitle: {
    color: "#ddd",
    fontSize: 14,
    fontWeight: "600",
  },

  goalSubtitle: {
    color: "#555",
    fontSize: 10,
    marginTop: 4,
  },

  goalValue: {
    fontSize: 18,
    fontWeight: "700",
  },

  goalTrack: {
    height: 7,
    borderRadius: 5,
    backgroundColor: "#18181A",
    marginTop: 18,
    overflow: "hidden",
  },

  goalFill: {
    height: "100%",
    borderRadius: 5,
  },

  allTimeCard: {
    backgroundColor: "#0B0B0D",
    borderWidth: 1,
    borderColor: "#1C1C20",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 28,
  },

  allTimeRow: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  allTimeIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  allTimeLabel: {
    color: "#aaa",
    fontSize: 13,
    flex: 1,
  },

  allTimeValue: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },

  detailsCard: {
    backgroundColor: "#0B0B0D",
    borderWidth: 1,
    borderColor: "#1C1C20",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 28,
  },

  detailRow: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  detailIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#171719",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  detailTitle: {
    color: "#aaa",
    fontSize: 13,
    flex: 1,
  },

  detailValue: {
    color: "#fff",
    fontSize: 13,
    maxWidth: 150,
  },

  divider: {
    height: 1,
    backgroundColor: "#1C1C20",
    marginLeft: 65,
  },

  activityCard: {
    backgroundColor: "#0B0B0D",
    borderWidth: 1,
    borderColor: "#1C1C20",
    borderRadius: 20,
    overflow: "hidden",
  },

  activityRow: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  activityIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  activityInfo: {
    flex: 1,
  },

  activityDate: {
    color: "#ddd",
    fontSize: 13,
    fontWeight: "600",
  },

  activityStatus: {
    color: "#555",
    fontSize: 10,
    marginTop: 3,
  },

  emptyActivity: {
    alignItems: "center",
    backgroundColor: "#0B0B0D",
    borderWidth: 1,
    borderColor: "#1C1C20",
    borderRadius: 20,
    paddingVertical: 36,
    paddingHorizontal: 25,
  },

  emptyTitle: {
    color: "#aaa",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
  },

  emptyText: {
    color: "#555",
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
    marginTop: 6,
    maxWidth: 260,
  },

  bottomSpace: {
    height: 20,
  },

  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },

  notFoundTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 15,
  },

  notFoundText: {
    color: "#666",
    fontSize: 13,
    marginTop: 6,
    textAlign: "center",
  },
});
