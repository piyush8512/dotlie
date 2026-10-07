import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT, DotlyState, Tracker } from "../lib/lib";

const STORAGE_KEY = "dotly-state";
type ContextValue = {
  state: DotlyState;

  loaded: boolean;
  setEntry: (id: string, date: string, value?: number) => void;
  setSetting: (key: string, value: any) => void;
  addTracker: (tracker: Tracker) => void;
  updateTracker: (tracker: Tracker) => void;
  removeTracker: (tracker: Tracker) => void;
};
const DotlyContext = createContext<ContextValue | null>(null);

export function DotlyProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DotlyState>(DEFAULT);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (value) {
          const saved = JSON.parse(value);
          setState({
            ...DEFAULT,
            ...saved,
            settings: { ...DEFAULT.settings, ...(saved.settings || {}) },
          });
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);
  useEffect(() => {
    if (loaded) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, loaded]);
  const value = useMemo<ContextValue>(
    () => ({
      state,
      loaded,
      setEntry: (id, date, entry) =>
        setState((current) => {
          const entries = { ...(current.entries[id] || {}) };
          if (entry === undefined) delete entries[date];
          else entries[date] = entry;
          return { ...current, entries: { ...current.entries, [id]: entries } };
        }),
      setSetting: (key, setting) =>
        setState((current) => ({
          ...current,
          settings: { ...current.settings, [key]: setting },
        })),
      addTracker: (tracker) =>
        setState((current) => ({
          ...current,
          trackers: [...current.trackers, tracker],
          settings:
            current.trackers.length === 0 && tracker.type === "money"
              ? { ...current.settings, target: tracker.id }
              : current.settings,
        })),
      updateTracker: (tracker) =>
        setState((current) => ({
          ...current,
          trackers: current.trackers.map((item) =>
            item.id === tracker.id ? tracker : item,
          ),
        })),
      removeTracker: (tracker) =>
        setState((current) => {
          const { [tracker.id]: removed, ...entries } = current.entries;
          return {
            ...current,
            trackers: current.trackers.filter((item) => item.id !== tracker.id),
            entries,
            settings:
              current.settings.target === tracker.id
                ? { ...current.settings, target: "combined" }
                : current.settings,
          };
        }),
    }),
    [state, loaded],
  );
  return (
    <DotlyContext.Provider value={value}>{children}</DotlyContext.Provider>
  );
}
export function useDotly() {
  const value = useContext(DotlyContext);
  if (!value) throw new Error("useDotly must be used inside DotlyProvider");
  return value;
}
