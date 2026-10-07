export type ChangeType = "new" | "improved" | "fixed";

export type Release = {
  version: string;
  date: string;
  title: string;
  changes: { type: ChangeType; text: string }[];
};

export const CHANGELOG: Release[] = [

    {
    version: "1.0.3",
    date: "2026-10-07",
    title: "Tracker & Wallpaper improvements",
    changes: [
      { type: "new", text: "Added manual value entry with relative intensity" },
      { type: "new", text: "Dynamic color intensity of task" },
      { type: "improved", text: "edit tracker modal" },
      { type: "fixed", text: "Wallpaper structure and unused code cleanup" },
    ],
  },
  {

    version: "1.0.2",
    date: "2026-10-05",
    title: "Daily reminders",
    changes: [
      { type: "new", text: "Morning and evening task reminders" },
      { type: "improved", text: "Notification permission and Settings toggle" },
      { type: "fixed", text: "Duplicate reminders when reopening the app" },
    ],
  },
  {
    version: "1.0.1",
    date: "2026-10-05",
    title: "Update history & polish",
    changes: [
      { type: "new", text: "Update history screen in Settings > About" },
      { type: "improved", text: "Faster wallpaper refresh" },
      { type: "fixed", text: "Count tracker goal not saving" },
    ],
  },
  {
    version: "1.0.0",
    date: "2026-09-20",
    title: "First release",
    changes: [{ type: "new", text: "Yes/No, Count and P&L trackers" }],
  },
];


export const LATEST_VERSION = CHANGELOG[0].version;