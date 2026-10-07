import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type TrackerActionModalProps = {
  visible: boolean;
  trackerName: string;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function TrackerActionModal({
  visible,
  trackerName,
  onClose,
  onEdit,
  onDelete,
}: TrackerActionModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
        />

        <View style={styles.sheet}>
          <View style={styles.handle} />


          <View style={styles.options}>
            <Pressable
              style={({ pressed }) => [
                styles.option,
                pressed && styles.optionPressed,
              ]}
              onPress={onEdit}
            >
              <View style={styles.optionIcon}>
                <Ionicons
                  name="create-outline"
                  size={21}
                  color="#fff"
                />
              </View>

              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>
                  Edit
                </Text>

          
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color="#555"
              />
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.option,
                pressed && styles.optionPressed,
              ]}
              onPress={onDelete}
            >
              <View
                style={[
                  styles.optionIcon,
                  styles.deleteIcon,
                ]}
              >
                <Ionicons
                  name="trash-outline"
                  size={21}
                  color="#FF5C5C"
                />
              </View>

              <View style={styles.optionContent}>
                <Text
                  style={[
                    styles.optionTitle,
                    styles.deleteText,
                  ]}
                >
                  Delete tracker
                </Text>

          
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color="#555"
              />
            </Pressable>
          </View>

          <Pressable
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelText}>
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
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
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 30,
  },

  handle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#333",
    alignSelf: "center",
    marginBottom: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    marginBottom: 20,
  },

  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "#17140D",
    borderWidth: 1,
    borderColor: "#2A2414",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  headerText: {
    flex: 1,
  },

  title: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },

  subtitle: {
    color: "#666",
    fontSize: 12,
    marginTop: 3,
  },

  options: {
    gap: 8,
  },

  option: {
    minHeight: 70,
    backgroundColor: "#151518",
    borderWidth: 1,
    borderColor: "#222226",
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
  },

  optionPressed: {
    backgroundColor: "#1B1B1F",
  },

  optionIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#222225",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  deleteIcon: {
    backgroundColor: "#251416",
  },

  optionContent: {
    flex: 1,
  },

  optionTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  optionDescription: {
    color: "#666",
    fontSize: 11,
    marginTop: 4,
  },

  deleteText: {
    color: "#FF5C5C",
  },

  cancelButton: {
    height: 52,
    borderRadius: 17,
    backgroundColor: "#1A1A1D",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  cancelText: {
    color: "#aaa",
    fontSize: 14,
    fontWeight: "600",
  },
});