import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type DailyValueModalProps = {
  visible: boolean;
  trackerName: string;
  initialValue?: number;
  onClose: () => void;
  onSave: (value?: number) => void;
};

export default function DailyValueModal({
  visible,
  trackerName,
  initialValue,
  onClose,
  onSave,
}: DailyValueModalProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (visible) {
      setValue(initialValue === undefined ? "" : String(initialValue));
    }
  }, [initialValue, visible]);

  const save = () => {
    const trimmed = value.trim();

    if (!trimmed) {
      onSave(undefined);
      return;
    }

    const parsed = Number(trimmed);

    if (!Number.isFinite(parsed)) {
      Alert.alert("Invalid value", "Enter a number such as +25, -10, or 0.");
      return;
    }

    onSave(parsed);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.wrap}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Add today&apos;s value</Text>
              <Text style={styles.subtitle}>{trackerName}</Text>
            </View>

            <Pressable style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={20} color="#888" />
            </Pressable>
          </View>

          <Text style={styles.label}>VALUE</Text>

          <TextInput
            style={styles.input}
            value={value}
            onChangeText={setValue}
            placeholder="e.g. +25 or -10"
            placeholderTextColor="#555"
            keyboardType="numbers-and-punctuation"
            autoFocus
          />

          <View style={styles.actions}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

            <Pressable style={styles.saveButton} onPress={save}>
              <Text style={styles.saveText}>Save value</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: "flex-end",
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.72)",
  },

  sheet: {
    backgroundColor: "#0B0B0D",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1,
    borderColor: "#202024",
    padding: 22,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  title: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "700",
  },

  subtitle: {
    color: "#666",
    fontSize: 12,
    marginTop: 4,
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#18181B",
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    color: "#666",
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: "700",
    marginBottom: 9,
  },

  input: {
    backgroundColor: "#151518",
    color: "#fff",
    borderWidth: 1,
    borderColor: "#29292D",
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 18,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },

  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#1A1A1D",
    alignItems: "center",
    justifyContent: "center",
  },

  cancelText: {
    color: "#aaa",
    fontSize: 14,
    fontWeight: "600",
  },

  saveButton: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#FFB020",
    alignItems: "center",
    justifyContent: "center",
  },

  saveText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "700",
  },
});
