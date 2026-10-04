import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

/* ------------------------------------------------------------------ */
/* Theme: swap these for your own (e.g. import GREEN/AMBER/RED from lib) */
/* ------------------------------------------------------------------ */
const GREEN = "#34C77B";
const AMBER = "#F5A524";
const RED = "#F04F5A";
const C = {
  bg: "#0F1115",
  surface: "#0B0B0D",
  surface2: "#151518",
  border: "#222226",
  text: "#F2F4F8",
  muted: "#77777D",
  accent: "#6C8CFF",
};

/* ------------------------------------------------------------------ */
/* Types + helpers                                                    */
/* ------------------------------------------------------------------ */
type Priority = "low" | "medium" | "high";

type Task = {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  /** Epoch ms. null = no due date. Single field a future Google Calendar sync would read/write. */
  dueAt: number | null;
  done: boolean;
  createdAt: number;
};

type Filter = "active" | "all" | "done";

const STORAGE_KEY = "tasks:v1";
const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
const PRIORITY_COLOR: Record<Priority, string> = {
  low: GREEN,
  medium: AMBER,
  high: RED,
};
const PRIORITY_LABEL: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const pad = (n: number) => String(n).padStart(2, "0");
const isOverdue = (t: Task) =>
  !t.done && t.dueAt !== null && t.dueAt < Date.now();

function sortTasks(list: Task[]): Task[] {
  return [...list].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    const ao = isOverdue(a) ? 0 : 1;
    const bo = isOverdue(b) ? 0 : 1;
    if (ao !== bo) return ao - bo;
    if (a.priority !== b.priority)
      return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    const ad = a.dueAt ?? Infinity;
    const bd = b.dueAt ?? Infinity;
    if (ad !== bd) return ad - bd;
    return b.createdAt - a.createdAt;
  });
}

function formatDue(ms: number | null): string {
  if (ms === null) return "No due date";
  const d = new Date(ms);
  const now = new Date();
  const startOf = (x: Date) =>
    new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round((startOf(d) - startOf(now)) / 86400000);
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  if (diffDays === 0) return `Today, ${time}`;
  if (diffDays === 1) return `Tomorrow, ${time}`;
  if (diffDays === -1) return `Yesterday, ${time}`;
  const date = d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  return `${date}, ${time}`;
}

type DueChoice = "none" | "today" | "tomorrow" | "3d" | "1w" | "custom";
const DUE_CHOICES: { key: DueChoice; label: string; days?: number }[] = [
  { key: "none", label: "No date" },
  { key: "today", label: "Today", days: 0 },
  { key: "tomorrow", label: "Tomorrow", days: 1 },
  { key: "3d", label: "In 3 days", days: 3 },
  { key: "1w", label: "In 1 week", days: 7 },
  { key: "custom", label: "Custom" },
];

/** Returns epoch ms, null (no date), or undefined (invalid input). */
function buildDueAt(
  choice: DueChoice,
  customDate: string,
  time: string,
): number | null | undefined {
  if (choice === "none") return null;
  const tm = time.trim() === "" ? "23:59" : time.trim();
  const tmatch = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(tm);
  if (!tmatch) return undefined;
  const d = new Date();
  if (choice === "custom") {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(customDate.trim());
    if (!m) return undefined;
    d.setFullYear(+m[1], +m[2] - 1, +m[3]);
    if (d.getMonth() !== +m[2] - 1) return undefined; // e.g. 2026-02-31
  } else {
    d.setDate(
      d.getDate() + (DUE_CHOICES.find((c) => c.key === choice)?.days ?? 0),
    );
  }
  d.setHours(+tmatch[1], +tmatch[2], 0, 0);
  return d.getTime();
}

/* ------------------------------------------------------------------ */
/* Task card                                                          */
/* ------------------------------------------------------------------ */
function TaskCard({
  task,
  onToggle,
  onOpen,
}: {
  task: Task;
  onToggle: () => void;
  onOpen: () => void;
}) {
  const overdue = isOverdue(task);
  const color = PRIORITY_COLOR[task.priority];
  return (
    <Pressable
      onPress={onOpen}
      style={({ pressed }) => [
        styles.card,
        pressed && { backgroundColor: C.surface2 },
      ]}
    >
      <View style={[styles.priorityBar, { backgroundColor: color }]} />
      <Pressable
        onPress={onToggle}
        hitSlop={10}
        style={[
          styles.checkWrap,
          { backgroundColor: `${color}18`, borderColor: `${color}35` },
        ]}
      >
        <View
          style={[
            styles.check,
            task.done && { backgroundColor: GREEN, borderColor: GREEN },
          ]}
        >
          {task.done && <Ionicons name="checkmark" size={16} color="#0F1115" />}
        </View>
      </Pressable>
      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={1}
          style={[styles.cardTitle, task.done && styles.doneText]}
        >
          {task.title}
        </Text>

        <View style={styles.metaRow}>
          <Ionicons
            name={overdue ? "alert-circle" : "time-outline"}
            size={14}
            color={overdue ? RED : C.muted}
          />
          <Text style={[styles.metaText, overdue && { color: RED }]}>
            {overdue ? "Overdue, " : ""}
            {formatDue(task.dueAt)}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={C.muted} />
    </Pressable>
  );
}

/* ------------------------------------------------------------------ */
/* Add / edit modal                                                   */
/* ------------------------------------------------------------------ */
function TaskModal({
  visible,
  task,
  onClose,
  onSave,
}: {
  visible: boolean;
  task: Task | null; // null = creating
  onClose: () => void;
  onSave: (t: Task) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [choice, setChoice] = useState<DueChoice>("none");
  const [customDate, setCustomDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");

  // Reset the form each time the modal opens
  useEffect(() => {
    if (!visible) return;
    setError("");
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      if (task.dueAt === null) {
        setChoice("none");
        setCustomDate("");
        setTime("");
      } else {
        const d = new Date(task.dueAt);
        setChoice("custom");
        setCustomDate(
          `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
        );
        setTime(`${pad(d.getHours())}:${pad(d.getMinutes())}`);
      }
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setChoice("none");
      setCustomDate("");
      setTime("");
    }
  }, [visible, task]);

  const save = () => {
    if (!title.trim()) {
      setError("Add a title for this task.");
      return;
    }
    const dueAt = buildDueAt(choice, customDate, time);
    if (dueAt === undefined) {
      setError(
        choice === "custom"
          ? "Use date format YYYY-MM-DD and time format HH:MM (24h)."
          : "Use time format HH:MM (24h), for example 18:30.",
      );
      return;
    }
    // GOOGLE CALENDAR SYNC HOOK: when sync is added, create/update the
    // calendar event from `dueAt` here, then store the returned event id on the task.
    onSave({
      id: task?.id ?? uid(),
      title: title.trim(),
      description: description.trim(),
      priority,
      dueAt,
      done: task?.done ?? false,
      createdAt: task?.createdAt ?? Date.now(),
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.backdrop}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>
                {task ? "Edit task" : "New task"}
              </Text>
              <Text style={styles.sheetSubtitle}>
                {task
                  ? "Keep the next step clear"
                  : "Turn an intention into a next step"}
              </Text>
            </View>
            <Pressable onPress={onClose} hitSlop={10}>
              <View style={styles.closeButton}>
                <Ionicons name="close" size={20} color={C.muted} />
              </View>
            </Pressable>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.label}>TITLE</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="What needs doing?"
              placeholderTextColor={C.muted}
              style={styles.input}
              maxLength={80}
            />

            <Text style={styles.label}>DESCRIPTION</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Add details (optional)"
              placeholderTextColor={C.muted}
              style={[styles.input, { height: 90, textAlignVertical: "top" }]}
              multiline
            />

            <Text style={styles.label}>PRIORITY</Text>
            <View style={styles.chipRow}>
              {(["low", "medium", "high"] as Priority[]).map((p) => {
                const active = priority === p;
                return (
                  <Pressable
                    key={p}
                    onPress={() => setPriority(p)}
                    style={[
                      styles.chip,
                      active && {
                        backgroundColor: PRIORITY_COLOR[p] + "33",
                        borderColor: PRIORITY_COLOR[p],
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.dot,
                        { backgroundColor: PRIORITY_COLOR[p] },
                      ]}
                    />
                    <Text
                      style={[styles.chipText, active && { color: C.text }]}
                    >
                      {PRIORITY_LABEL[p]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.label}>DUE DATE</Text>
            <View style={styles.chipRow}>
              {DUE_CHOICES.map((o) => {
                const active = choice === o.key;
                return (
                  <Pressable
                    key={o.key}
                    onPress={() => setChoice(o.key)}
                    style={[
                      styles.chip,
                      active && {
                        backgroundColor: C.accent + "33",
                        borderColor: C.accent,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.chipText, active && { color: C.text }]}
                    >
                      {o.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {choice === "custom" && (
              <TextInput
                value={customDate}
                onChangeText={setCustomDate}
                placeholder="Date, YYYY-MM-DD"
                placeholderTextColor={C.muted}
                style={[styles.input, { marginTop: 10 }]}
                keyboardType="numbers-and-punctuation"
                maxLength={10}
              />
            )}

            {choice !== "none" && (
              <TextInput
                value={time}
                onChangeText={setTime}
                placeholder="Time, HH:MM (optional, default 23:59)"
                placeholderTextColor={C.muted}
                style={[styles.input, { marginTop: 10 }]}
                keyboardType="numbers-and-punctuation"
                maxLength={5}
              />
            )}

            {!!error && <Text style={styles.error}>{error}</Text>}
          </ScrollView>

          <View style={styles.actionRow}>
            <Pressable onPress={onClose} style={[styles.btn, styles.btnGhost]}>
              <Text style={styles.btnGhostText}>Cancel</Text>
            </Pressable>
            <Pressable onPress={save} style={[styles.btn, styles.btnPrimary]}>
              <Text style={styles.btnPrimaryText}>
                {task ? "Save changes" : "Add task"}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Detail modal                                                       */
/* ------------------------------------------------------------------ */
function TaskDetailModal({
  task,
  onClose,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task | null;
  onClose: () => void;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  if (!task) return null;
  const overdue = isOverdue(task);
  const color = PRIORITY_COLOR[task.priority];
  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.sheetHeader}>
            <View style={[styles.pill, { borderColor: color }]}>
              <Text style={[styles.pillText, { color }]}>
                {PRIORITY_LABEL[task.priority]} priority
              </Text>
            </View>
            <Pressable onPress={onClose} hitSlop={10}>
              <View style={styles.closeButton}>
                <Ionicons name="close" size={20} color={C.muted} />
              </View>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={[styles.detailTitle, task.done && styles.doneText]}>
              {task.title}
            </Text>

            <View style={styles.detailRow}>
              <Ionicons
                name={overdue ? "alert-circle" : "calendar-outline"}
                size={18}
                color={overdue ? RED : C.muted}
              />
              <Text style={[styles.detailMeta, overdue && { color: RED }]}>
                {overdue ? "Overdue, " : ""}
                {formatDue(task.dueAt)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons
                name={task.done ? "checkmark-circle" : "ellipse-outline"}
                size={18}
                color={task.done ? GREEN : C.muted}
              />
              <Text style={styles.detailMeta}>
                {task.done ? "Completed" : "Not completed"}
              </Text>
            </View>

            <Text style={styles.label}>Description</Text>
            <Text style={styles.detailDesc}>
              {task.description || "No description added."}
            </Text>
          </ScrollView>

          <Pressable
            onPress={onToggle}
            style={[styles.btn, styles.btnPrimary, { marginTop: 16, flex: 0 }]}
          >
            <Text style={styles.btnPrimaryText}>
              {task.done ? "Mark as not done" : "Mark as done"}
            </Text>
          </Pressable>
          <View style={styles.actionRow}>
            <Pressable onPress={onEdit} style={[styles.btn, styles.btnGhost]}>
              <Ionicons name="create-outline" size={18} color={C.text} />
              <Text style={styles.btnGhostText}>Edit</Text>
            </Pressable>
            <Pressable
              onPress={onDelete}
              style={[styles.btn, styles.btnDanger]}
            >
              <Ionicons name="trash-outline" size={18} color={RED} />
              <Text style={[styles.btnGhostText, { color: RED }]}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Screen                                                             */
/* ------------------------------------------------------------------ */
export default function TaskScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState<Filter>("active");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);

  // Load once
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setTasks(JSON.parse(raw));
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  // Save on change, only after the initial load so we never overwrite with []
  useEffect(() => {
    if (loaded)
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)).catch(() => {});
  }, [tasks, loaded]);

  // Re-render every minute so "Overdue" updates without interaction
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 60000);
    return () => clearInterval(id);
  }, []);

  const toggle = useCallback(
    (id: string) =>
      setTasks((p) =>
        p.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
      ),
    [],
  );

  const save = (t: Task) => {
    setTasks((p) =>
      p.some((x) => x.id === t.id)
        ? p.map((x) => (x.id === t.id ? t : x))
        : [...p, t],
    );
    setFormOpen(false);
    setEditing(null);
  };

  const remove = (id: string) => {
    Alert.alert("Delete this task?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setTasks((p) => p.filter((t) => t.id !== id));
          setDetailId(null);
        },
      },
    ]);
  };

  const visible = useMemo(() => {
    const filtered = tasks.filter((t) =>
      filter === "active" ? !t.done : filter === "done" ? t.done : true,
    );
    return sortTasks(filtered);
  }, [tasks, filter]);

  const activeCount = tasks.filter((t) => !t.done).length;
  const overdueCount = tasks.filter(isOverdue).length;
  const detailTask = tasks.find((t) => t.id === detailId) ?? null;

  const emptyCopy =
    filter === "done"
      ? {
          icon: "checkmark-done-outline",
          title: "Nothing completed yet",
          sub: "Finished tasks show up here.",
        }
      : filter === "active"
        ? {
            icon: "",
            title: "All clear",
            sub: "Tap New task to add something to do.",
          }
        : {
            icon: "list-outline",
            title: "No tasks yet",
            sub: "Tap New task to add your first one.",
          };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>Tasks</Text>
          <Text style={styles.subheading}>
            {activeCount} to do
            {overdueCount > 0 ? `, ${overdueCount} overdue` : ""}
          </Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {(["active", "all", "done"] as Filter[]).map((f) => {
          const active = filter === f;
          return (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.filterChip, active && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, active && { color: C.text }]}>
                {f === "active" ? "Active" : f === "all" ? "All" : "Done"}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* List */}
      <FlatList
        data={visible}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 110,
          flexGrow: 1,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onToggle={() => toggle(item.id)}
            onOpen={() => setDetailId(item.id)}
          />
        )}
        ListEmptyComponent={
          loaded ? (
            <View style={styles.empty}>
              <Ionicons
                name={emptyCopy.icon as any}
                size={44}
                color={C.muted}
              />
              <Text style={styles.emptyTitle}>{emptyCopy.title}</Text>
              <Text style={styles.emptySub}>{emptyCopy.sub}</Text>
            </View>
          ) : null
        }
      />

      <Pressable
        onPress={() => {
          setEditing(null);
          setFormOpen(true);
        }}
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
      >
        <Ionicons name="add" size={28} color="#000" />
      </Pressable>

      {/* Modals */}
      <TaskModal
        visible={formOpen}
        task={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSave={save}
      />
      <TaskDetailModal
        task={formOpen ? null : detailTask}
        onClose={() => setDetailId(null)}
        onToggle={() => detailTask && toggle(detailTask.id)}
        onEdit={() => {
          setEditing(detailTask);
          setFormOpen(true);
        }}
        onDelete={() => detailTask && remove(detailTask.id)}
      />
    </SafeAreaView>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                             */
/* ------------------------------------------------------------------ */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor:  "#000"},

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  heading: {
    color: C.text,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subheading: { color: C.muted, fontSize: 14, marginTop: 2 },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 105,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  fabPressed: { opacity: 0.8, transform: [{ scale: 0.96 }] },

  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  filterChip: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
  },
  filterChipActive: { backgroundColor: C.surface2, borderColor: "#fff" },
  filterText: { color: C.muted, fontWeight: "600", fontSize: 14 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#151518",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: C.border,
    paddingVertical: 15,
    paddingRight: 12,
    paddingLeft: 16,
    overflow: "hidden",
  },
  priorityBar: { position: "absolute", left: 0, top: 0, bottom: 0, width: 4 },
  checkWrap: {
    width: 42,
    height: 42,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#55555C",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { color: C.text, fontSize: 16, fontWeight: "600" },
  doneText: { textDecorationLine: "line-through", color: C.muted },
  cardDesc: { color: C.muted, fontSize: 13, marginTop: 2 },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 8,
    flexWrap: "wrap",
  },
  metaText: { color: C.muted, fontSize: 12.5 },
  pill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 4,
  },
  pillText: { fontSize: 11.5, fontWeight: "700" },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 8,
  },
  emptyTitle: { color: C.text, fontSize: 18, fontWeight: "700", marginTop: 6 },
  emptySub: {
    color: C.muted,
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 40,
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.72)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: C.surface,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 22,
    paddingBottom: 30,
    maxHeight: "92%",
    borderWidth: 1,
    borderColor: "#1C1C20",
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#333338",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sheetTitle: { color: C.text, fontSize: 20, fontWeight: "700" },
  sheetSubtitle: { color: "#66666D", fontSize: 12, marginTop: 4 },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#18181B",
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    color: "#66666D",
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: "700",
    marginTop: 18,
    marginBottom: 9,
  },
  input: {
    backgroundColor: "#151518",
    borderWidth: 1,
    borderColor: "#222226",
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: C.text,
    fontSize: 15,
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: "#111114",
    borderWidth: 1,
    borderColor: C.border,
  },
  chipText: { color: C.muted, fontWeight: "600", fontSize: 14 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  error: { color: RED, fontSize: 13, marginTop: 14 },

  actionRow: { flexDirection: "row", gap: 10, marginTop: 20 },
  btn: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
  },
  btnPrimary: { backgroundColor: "#fff" },
  btnPrimaryText: { color: "#0F1115", fontWeight: "700", fontSize: 15 },
  btnGhost: { backgroundColor: C.surface2 },
  btnGhostText: { color: C.text, fontWeight: "700", fontSize: 15 },
  btnDanger: { backgroundColor: RED + "1F" },

  detailTitle: {
    color: C.text,
    fontSize: 24,
    fontWeight: "800",
    marginTop: 8,
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  detailMeta: { color: C.text, fontSize: 15 },
  detailDesc: { color: C.text, fontSize: 15, lineHeight: 22 },
});
