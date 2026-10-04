import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

export const GREEN = '#2BFF88';
export const RED = '#FF5577';
export const AMBER = '#FFB020';

export type TrackerType = 'yesno' | 'count' | 'money';
export type Tracker = {
  id: string;
  name: string;
  type: TrackerType;
  goal: number;
  color: string;
  icon?: ComponentProps<typeof Ionicons>['name'];
  category?: string;
};
export type DotlySettings = {
  target: string;
  view: 'month' | 'year';
  privacy: boolean;
  autoApply: boolean;
  wallpaperMode: 'tracker' | 'time';
  timePeriod: 'month' | 'year';
  trackerDotColor: string;
  timeDotColor: string;
  yearLayout: 'grid' | 'vertical' | 'horizontal';
  yearInfo: 'none' | 'days' | 'daysPercent' | 'full';
  yearNumberSize: 'small' | 'medium' | 'large';
  yearDotSize: 'small' | 'medium' | 'large';
};
export type DotlyState = {
  trackers: Tracker[];
  entries: Record<string, Record<string, number>>;
  settings: DotlySettings;
};

export const DEFAULT: DotlyState = {
  trackers: [], entries: {},
  settings: {
    target: 'combined',
    view: 'month',
    privacy: false,
    autoApply: false,
    wallpaperMode: 'tracker',
    timePeriod: 'month',
    trackerDotColor: '#FFB020',
    timeDotColor: '#FFB020',
    yearLayout: 'grid',
    yearInfo: 'full',
    yearNumberSize: 'large',
    yearDotSize: 'medium',
  },
};

export function todayStr(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function isDone(tracker: Tracker, value: number) {
  return tracker.type === 'money' ? value !== 0 : tracker.type === 'count' ? value >= tracker.goal : value > 0;
}

export function buildGroups(state: DotlyState, view: 'month' | 'year') {
  const days = view === 'month' ? 30 : 365;
  const groups = state.trackers.map((tracker) => Array.from({ length: days }, (_, index) => {
    const date = new Date(); date.setDate(date.getDate() - (days - index - 1));
    const value = state.entries[tracker.id]?.[todayStr(date)];
    return { fill: value === undefined ? '#1C1C20' : tracker.type === 'money' ? (value >= 0 ? GREEN : RED) : tracker.color, alpha: value === undefined ? 1 : isDone(tracker, value) ? 1 : 0.35 };
  }));
  return { groups, direction: 'rows' as const };
}

export function streakFor(state: DotlyState) {
  let streak = 0;
  const date = new Date();
  while (state.trackers.length && state.trackers.some((tracker) => isDone(tracker, state.entries[tracker.id]?.[todayStr(date)] || 0))) {
    streak += 1; date.setDate(date.getDate() - 1);
  }
  return streak;
}

export function parseCsv(text: string) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return {};
  const headers = lines[0].split(',').map((header) => header.trim().toLowerCase());
  const dateIndex = headers.indexOf('date');
  const valueIndex = headers.findIndex((header) => ['pnl', 'profit', 'realized', 'net'].includes(header));
  if (dateIndex < 0 || valueIndex < 0) return {};
  return Object.fromEntries(lines.slice(1).map((line) => line.split(',')).filter((columns) => columns[dateIndex] && !Number.isNaN(Number(columns[valueIndex]))).map((columns) => [columns[dateIndex], Number(columns[valueIndex])]));
}
