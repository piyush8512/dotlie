import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "dotly-onboarding-complete";

type OnboardingStep = {
  title: string;
  description: string;
};

const steps: OnboardingStep[] = [
  {
    title: "Build habits,\none dot at a time.",
    description:
      "Every day you complete your rituals, a dot turns amber. Keep your momentum alive.",
  },
  {
    title: "See your progress at a\nglance.",
    description:
      "A whole year of consistency captured in quiet visual harmony. No loud alarms or complex charts.",
  },
  {
    title: "Your streak, on your\nlock screen.",
    description:
      "Turn your live habit progress into an ambient lock screen wallpaper. Glanceable motivation every time you pick up your phone.",
  },
];

export async function completeOnboarding() {
  await AsyncStorage.setItem(ONBOARDING_KEY, "true");
}

export async function hasCompletedOnboarding() {
  return (await AsyncStorage.getItem(ONBOARDING_KEY)) === "true";
}

/* ========================================================================== */
/* SCREEN 1 - MONTHLY CALENDAR                                                */
/* ========================================================================== */

function CalendarPreview() {
  const days = [
    true,
    true,
    true,
    false,
    false,

    true,
    true,
    true,
    false,
    false,

    true,
    true,
    true,
    false,
    false,

    true,
    true,
    true,
    false,
    false,

    true,
    true,
    true,
    false,
    false,

    true,
    true,
    false,
    false,
    false,

    true,
    true,
    false,
    false,
    false,
  ];

  return (
    <View style={styles.calendarCard}>
      {/* Header */}

      <View style={styles.calendarHeader}>
        <Text style={styles.month}>OCTOBER</Text>

        <View style={styles.streakContainer}>
          <View style={styles.streakDot} />

          <Text style={styles.streakText}>19 DAY STREAK</Text>
        </View>
      </View>

      {/* Week names */}

      <View style={styles.weekRow}>
        {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
          <Text key={index} style={styles.weekDay}>
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar */}

      <View style={styles.calendarGrid}>
        {days.map((active, index) => {
          const isToday = index === 16;

          return (
            <View key={index} style={styles.calendarCell}>
              <View
                style={[
                  styles.calendarDot,
                  active && styles.activeDot,
                  isToday && styles.todayDot,
                ]}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

/* ========================================================================== */
/* SCREEN 2 - ANNUAL RITUAL MAP                                               */
/* ========================================================================== */

function AnnualRitualMap() {
  const columns = 26;
  const rows = 7;

  return (
    <View style={styles.annualCard}>
      {/* Header */}

      <View style={styles.annualHeader}>
        <Text style={styles.annualTitle}>ANNUAL RITUAL MAP</Text>

        <View style={styles.cadenceContainer}>
          <View style={styles.cadenceDot} />

          <Text style={styles.cadenceText}>Active cadence</Text>
        </View>
      </View>

      {/* Matrix */}

      <View style={styles.annualGrid}>
        {Array.from({ length: columns * rows }).map((_, index) => {
          const row = Math.floor(index / columns);
          const column = index % columns;

          /*
           * Creates the visual pattern from the reference design.
           */

          const active =
            (column >= 2 && column <= 4) ||
            (column >= 6 && column <= 12) ||
            (column >= 14 && column <= 17);

          const partial =
            column === 1 || column === 5 || column === 13 || column === 18;

          const shouldActivate =
            active &&
            (row === 0 ||
              row === 1 ||
              row === 2 ||
              row === 3 ||
              row === 4 ||
              row === 5);

          const finalActive = shouldActivate || (partial && row >= 2);

          return (
            <View
              key={index}
              style={[styles.annualDot, finalActive && styles.annualActiveDot]}
            />
          );
        })}
      </View>

      {/* Labels */}

      <View style={styles.annualLabels}>
        <Text style={styles.annualLabel}>Week 1</Text>

        <Text style={styles.annualLabel}>Week 24</Text>

        <Text style={styles.annualLabel}>Today</Text>
      </View>
    </View>
  );
}

/* ========================================================================== */
/* SCREEN 3 - LOCK SCREEN                                                     */
/* ========================================================================== */

function LockScreenPreview() {
  const dots = [
    true,
    true,
    true,
    true,
    true,
    true,
    true,

    true,
    true,
    true,
    true,
    true,
    false,
    true,

    true,
    true,
    true,
    true,
    true,
    false,
    false,

    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];

  return (
    <View style={styles.phone}>
      {/* Dynamic Island */}

      <View style={styles.phoneTop}>
        <View style={styles.dynamicIsland}>
          <View style={styles.cameraDot} />
        </View>
      </View>

      {/* Date */}

      <Text style={styles.lockDate}>TUESDAY, OCTOBER 24</Text>

      {/* Time */}

      <Text style={styles.lockTime}>09:41</Text>

      {/* Focus Matrix */}

      <View style={styles.focusCard}>
        <View style={styles.focusHeader}>
          <View style={styles.focusTitleRow}>
            <View style={styles.focusDot} />

            <Text style={styles.focusTitle}>FOCUS MATRIX</Text>
          </View>

          <Text style={styles.focusStreak}>18d Streak</Text>
        </View>

        {/* Matrix */}

        <View style={styles.focusGrid}>
          {dots.map((active, index) => (
            <View
              key={index}
              style={[styles.focusGridDot, active && styles.focusGridActive]}
            />
          ))}
        </View>
      </View>

      {/* Bottom buttons */}

      <View style={styles.phoneBottom}>
        <View style={styles.phoneButton}>
          <Text style={styles.phoneButtonIcon}>⌛</Text>
        </View>

        <View style={styles.phoneButton}>
          <Text style={styles.phoneButtonIcon}>▣</Text>
        </View>
      </View>

      {/* Home indicator */}

      <View style={styles.homeIndicator} />
    </View>
  );
}

/* ========================================================================== */
/* MAIN ONBOARDING SCREEN                                                     */
/* ========================================================================== */

export default function OnboardingScreen({ step }: { step: number }) {
  const router = useRouter();

  const [isFinishing, setIsFinishing] = useState(false);

  const currentStep = steps[step] ?? steps[0];

  const isLastStep = step === steps.length - 1;

  /* ------------------------------------------------------------------------ */
  /* FINISH                                                                   */
  /* ------------------------------------------------------------------------ */

  const finish = async () => {
    if (isFinishing) {
      return;
    }

    setIsFinishing(true);

    try {
      await completeOnboarding();

      router.replace("/login");
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      setIsFinishing(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* NEXT                                                                      */
  /* ------------------------------------------------------------------------ */

  const next = () => {
    if (isLastStep) {
      void finish();
      return;
    }

    router.push(`/onboarding/${step + 2}`);
  };

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                    */
  /* ------------------------------------------------------------------------ */

  return (
    <SafeAreaView style={styles.container}>
      {/* ================================================================== */}
      {/* SCREEN 1                                                           */}
      {/* ================================================================== */}

      {step === 0 && (
        <View style={styles.screenOne}>
          <CalendarPreview />
        </View>
      )}

      {/* ================================================================== */}
      {/* SCREEN 2                                                           */}
      {/* ================================================================== */}

      {step === 1 && (
        <View style={styles.screenTwo}>
          {/* 42 */}

          <View style={styles.streakNumberContainer}>
            <Text style={styles.streakNumber}>42</Text>

            <Text style={styles.streakLabel}>DAY STREAK</Text>
          </View>

          {/* Annual map */}

          <AnnualRitualMap />
        </View>
      )}

      {/* ================================================================== */}
      {/* SCREEN 3                                                           */}
      {/* ================================================================== */}

      {step === 2 && (
        <View style={styles.screenThree}>
          <LockScreenPreview />
        </View>
      )}

      {/* ================================================================== */}
      {/* TEXT                                                                */}
      {/* ================================================================== */}

      <View
        style={[
          styles.content,

          step === 0 && styles.contentOne,

          step === 1 && styles.contentTwo,

          step === 2 && styles.contentThree,
        ]}
      >
        <Text style={styles.title}>{currentStep.title}</Text>

        <Text style={styles.description}>{currentStep.description}</Text>
      </View>

      {/* ================================================================== */}
      {/* FOOTER                                                              */}
      {/* ================================================================== */}

      <View style={styles.footer}>
        {/* Pagination */}

        <View style={styles.pagination}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[styles.pageDot, index === step && styles.activePageDot]}
            />
          ))}
        </View>

        {/* Buttons */}

        <View style={styles.actions}>
          {!isLastStep ? (
            <Pressable onPress={finish} hitSlop={12} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          ) : (
            <View style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </View>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.continueButton,

              pressed && styles.pressed,
            ]}
            onPress={next}
            disabled={isFinishing}
          >
            <Text style={styles.continueText}>
              {isLastStep ? "Get started" : "Continue"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ========================================================================== */
/* STYLES                                                                     */
/* ========================================================================== */

const styles = StyleSheet.create({
  /* ======================================================================== */
  /* GLOBAL                                                                   */
  /* ======================================================================== */

  container: {
    flex: 1,
    backgroundColor: "#101114",
    paddingHorizontal: 20,
  },

  /* ======================================================================== */
  /* SCREEN 1                                                                 */
  /* ======================================================================== */

  screenOne: {
    paddingTop: 25,
    paddingHorizontal: 17,
  },

  calendarCard: {
    width: "100%",
    height: 258,
    backgroundColor: "#1A1B1F",
    borderRadius: 31,
    paddingHorizontal: 19,
    paddingTop: 25,
  },

  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  month: {
    color: "#F1EBDD",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.7,
  },

  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#202126",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  streakDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFAD1F",
    marginRight: 6,
  },

  streakText: {
    color: "#FFB020",
    fontSize: 10,
    fontWeight: "800",
  },

  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 26,
  },

  weekDay: {
    width: 23,
    textAlign: "center",
    color: "#8A8A8C",
    fontSize: 10,
  },

  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 9,
  },

  calendarCell: {
    width: "14.2857%",
    height: 31,
    alignItems: "center",
    justifyContent: "center",
  },

  calendarDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#27282C",
  },

  activeDot: {
    backgroundColor: "#FFAE1B",
  },

  todayDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#FFAE1B",
  },

  /* ======================================================================== */
  /* SCREEN 2                                                                 */
  /* ======================================================================== */

  screenTwo: {
    paddingTop: 7,
  },

  streakNumberContainer: {
    alignItems: "center",
    marginBottom: 23,
  },

  streakNumber: {
    color: "#FFAE1B",
    fontSize: 40,
    lineHeight: 45,
    fontWeight: "800",
  },

  streakLabel: {
    color: "#E6DCCB",
    fontSize: 13,
    marginTop: 2,
    fontWeight: "500",
  },

  annualCard: {
    width: "100%",
    height: 212,
    backgroundColor: "#1A1B1F",
    borderRadius: 31,
    paddingHorizontal: 19,
    paddingTop: 19,
    paddingBottom: 17,
  },

  annualHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  annualTitle: {
    color: "#EDE7DA",
    fontSize: 11,
    fontWeight: "600",
  },

  cadenceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  cadenceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFAE1B",
    marginRight: 6,
  },

  cadenceText: {
    color: "#EDE7DA",
    fontSize: 11,
  },

  annualGrid: {
    marginTop: 15,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },

  annualDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#343539",
  },

  annualActiveDot: {
    backgroundColor: "#FFAE1B",
  },

  annualLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 17,
  },

  annualLabel: {
    color: "#EDE7DA",
    fontSize: 10,
    fontWeight: "500",
  },

  /* ======================================================================== */
  /* SCREEN 3                                                                 */
  /* ======================================================================== */

  screenThree: {
    alignItems: "center",
    paddingTop: 8,
  },

  phone: {
    width: 286,
    height: 520,
    borderRadius: 39,
    backgroundColor: "#111215",
    borderWidth: 9,
    borderColor: "#08090B",
    alignItems: "center",
    position: "relative",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.4,
    shadowRadius: 20,

    elevation: 10,
  },

  phoneTop: {
    width: "100%",
    height: 43,
    alignItems: "center",
  },

  dynamicIsland: {
    width: 68,
    height: 21,
    backgroundColor: "#08090A",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: 8,
  },

  cameraDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#37383B",
  },

  lockDate: {
    color: "#F2E6D3",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
    letterSpacing: 0.4,
  },

  lockTime: {
    color: "#F4F4F4",
    fontSize: 39,
    lineHeight: 43,
    fontWeight: "300",
    letterSpacing: -1.5,
    marginTop: 2,
  },

  /* Focus matrix */

  focusCard: {
    position: "absolute",
    top: 204,
    left: 0,
    right: 0,
    marginHorizontal: 1,
    height: 129,
    borderRadius: 17,
    backgroundColor: "#1A1B1E",
    paddingHorizontal: 15,
    paddingTop: 13,
  },

  focusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  focusTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  focusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFAE1B",
    marginRight: 6,
  },

  focusTitle: {
    color: "#EAE3D7",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  focusStreak: {
    color: "#FFAE1B",
    fontSize: 10,
    fontWeight: "700",
  },

  focusGrid: {
    marginTop: 13,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },

  focusGridDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#35363A",
  },

  focusGridActive: {
    backgroundColor: "#FFAE1B",
  },

  /* Phone bottom */

  phoneBottom: {
    position: "absolute",
    bottom: 15,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  phoneButton: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: "#292A2E",
    alignItems: "center",
    justifyContent: "center",
  },

  phoneButtonIcon: {
    color: "#E8E8E8",
    fontSize: 16,
  },

  homeIndicator: {
    position: "absolute",
    bottom: 5,
    width: 108,
    height: 4,
    borderRadius: 3,
    backgroundColor: "#3C3D40",
  },

  /* ======================================================================== */
  /* CONTENT                                                                  */
  /* ======================================================================== */

  content: {
    flex: 1,
    justifyContent: "flex-end",
  },

  contentOne: {
    paddingBottom: 82,
  },

  contentTwo: {
    paddingBottom: 25,
  },

  contentThree: {
    paddingBottom: 20,
  },

  title: {
    color: "#F4F4F4",
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800",
    letterSpacing: -0.7,
  },

  description: {
    color: "#F0B23B",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 13,
    maxWidth: 350,
  },

  /* ======================================================================== */
  /* FOOTER                                                                   */
  /* ======================================================================== */

  footer: {
    paddingBottom: 18,
  },

  pagination: {
    height: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
    marginBottom: 21,
  },

  pageDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#38393D",
  },

  activePageDot: {
    width: 23,
    backgroundColor: "#FFAE1B",
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  skipButton: {
    width: 62,
    height: 55,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  skipText: {
    color: "#66552D",
    fontSize: 15,
    fontWeight: "500",
  },

  continueButton: {
    flex: 1,
    height: 55,
    borderRadius: 30,
    backgroundColor: "#FFAE1B",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 14,
  },

  continueText: {
    color: "#181818",
    fontSize: 15,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.75,
  },
});
