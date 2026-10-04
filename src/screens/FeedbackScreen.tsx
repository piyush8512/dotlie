import React, { useState } from "react";
import {
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
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type FeedbackType =
  | "General"
  | "Bug"
  | "Feature"
  | "Improvement";

const feedbackTypes: {
  key: FeedbackType;
  icon: React.ComponentProps<typeof Ionicons>["name"];
}[] = [
  {
    key: "General",
    icon: "chatbubble-outline",
  },
  {
    key: "Bug",
    icon: "bug-outline",
  },
  {
    key: "Feature",
    icon: "sparkles-outline",
  },
  {
    key: "Improvement",
    icon: "trending-up-outline",
  },
];

export default function FeedbackScreen() {
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] =
    useState<FeedbackType>("General");

  const [message, setMessage] = useState("");

  const openFeedbackModal = () => {
    setModalVisible(true);
  };

  const closeFeedbackModal = () => {
    setModalVisible(false);
  };

  const submitFeedback = () => {
    if (!message.trim()) return;

    // TODO:
    // Send feedback to your backend here.

    setModalVisible(false);
    setMessage("");
    setSelectedType("General");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>

        <Text style={styles.headerTitle}>Feedback</Text>

        <View style={styles.headerSpace} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={30}
              color="#fff"
            />
          </View>

          <Text style={styles.heroTitle}>
            Help us improve Dotly
          </Text>

          <Text style={styles.heroDescription}>
            Your feedback helps us understand what is working,
            what isn't, and what we should build next.
          </Text>
        </View>

        {/* Send feedback */}
        <Pressable
          style={({ pressed }) => [
            styles.feedbackButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={openFeedbackModal}
        >
          <View style={styles.feedbackButtonIcon}>
            <Ionicons
              name="create-outline"
              size={22}
              color="#000"
            />
          </View>

          <View style={styles.feedbackButtonContent}>
            <Text style={styles.feedbackButtonTitle}>
              Send Feedback
            </Text>

            <Text style={styles.feedbackButtonSubtitle}>
              Share an idea, report a bug, or suggest an improvement
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#666"
          />
        </Pressable>

        {/* Categories */}
        <Text style={styles.sectionTitle}>WHAT YOU CAN SEND</Text>

        <View style={styles.card}>
          <InfoRow
            icon="bug-outline"
            title="Report a Bug"
            description="Something isn't working as expected."
          />

          <Divider />

          <InfoRow
            icon="bulb-outline"
            title="Suggest a Feature"
            description="Tell us what you'd like to see in Dotly."
          />

          <Divider />

          <InfoRow
            icon="trending-up-outline"
            title="Suggest an Improvement"
            description="Help us improve an existing feature."
          />

          <Divider />

          <InfoRow
            icon="chatbubble-outline"
            title="General Feedback"
            description="Anything else you'd like to tell us."
          />
        </View>

        {/* Contact */}
        <Text style={styles.sectionTitle}>OTHER</Text>

        <View style={styles.card}>
          <Pressable
            style={styles.contactRow}
            onPress={() => router.push("/about")}
          >
            <View style={styles.contactIcon}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#aaa"
              />
            </View>

            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>
                Need direct support?
              </Text>

              <Text style={styles.contactSubtitle}>
                Contact us by email
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color="#555"
            />
          </Pressable>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerName}>Piyush</Text>

          <Text style={styles.footerVersion}>
            Dotly • Version 1.0.0
          </Text>
        </View>
      </ScrollView>

      {/* Feedback Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeFeedbackModal}
      >
        <KeyboardAvoidingView
          style={styles.modalWrapper}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={closeFeedbackModal}
          />

          <View style={styles.modal}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  Send Feedback
                </Text>

                <Text style={styles.modalSubtitle}>
                  Help us make Dotly better
                </Text>
              </View>

              <Pressable
                style={styles.closeButton}
                onPress={closeFeedbackModal}
              >
                <Ionicons
                  name="close"
                  size={21}
                  color="#aaa"
                />
              </Pressable>
            </View>

            {/* Type */}
            <Text style={styles.inputLabel}>
              FEEDBACK TYPE
            </Text>

            <View style={styles.typeGrid}>
              {feedbackTypes.map((type) => {
                const selected = selectedType === type.key;

                return (
                  <Pressable
                    key={type.key}
                    style={[
                      styles.typeButton,
                      selected && styles.typeButtonSelected,
                    ]}
                    onPress={() => setSelectedType(type.key)}
                  >
                    <Ionicons
                      name={type.icon}
                      size={17}
                      color={selected ? "#000" : "#888"}
                    />

                    <Text
                      style={[
                        styles.typeText,
                        selected && styles.typeTextSelected,
                      ]}
                    >
                      {type.key}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Message */}
            <Text style={styles.inputLabel}>
              MESSAGE
            </Text>

            <View style={styles.textInputContainer}>
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Tell us what you think..."
                placeholderTextColor="#555"
                multiline
                maxLength={500}
                textAlignVertical="top"
                style={styles.textInput}
              />

              <Text style={styles.characterCount}>
                {message.length}/500
              </Text>
            </View>

            {/* Submit */}
            <Pressable
              disabled={!message.trim()}
              onPress={submitFeedback}
              style={[
                styles.submitButton,
                !message.trim() && styles.submitButtonDisabled,
              ]}
            >
              <Ionicons
                name="paper-plane-outline"
                size={18}
                color={message.trim() ? "#000" : "#555"}
              />

              <Text
                style={[
                  styles.submitText,
                  !message.trim() && styles.submitTextDisabled,
                ]}
              >
                Submit Feedback
              </Text>
            </Pressable>

            <Pressable
              style={styles.cancelButton}
              onPress={closeFeedbackModal}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

/* ---------------------------------- */
/* Components */
/* ---------------------------------- */

type InfoRowProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  description: string;
};

function InfoRow({
  icon,
  title,
  description,
}: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={20} color="#aaa" />
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.infoTitle}>{title}</Text>

        <Text style={styles.infoDescription}>
          {description}
        </Text>
      </View>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

/* ---------------------------------- */
/* Styles */
/* ---------------------------------- */

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
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#151515",
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  headerSpace: {
    width: 40,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  /* Hero */

  hero: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 30,
  },

  heroIcon: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: "#191919",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 23,
    fontWeight: "700",
    marginBottom: 8,
  },

  heroDescription: {
    color: "#777",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    maxWidth: 340,
  },

  /* Feedback button */

  feedbackButton: {
    minHeight: 82,
    backgroundColor: "#fff",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 30,
  },

  buttonPressed: {
    opacity: 0.8,
  },

  feedbackButtonIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  feedbackButtonContent: {
    flex: 1,
  },

  feedbackButtonTitle: {
    color: "#000",
    fontSize: 15,
    fontWeight: "700",
  },

  feedbackButtonSubtitle: {
    color: "#777",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
    paddingRight: 5,
  },

  /* Sections */

  sectionTitle: {
    color: "#666",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#111",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1c1c1c",
    overflow: "hidden",
    marginBottom: 25,
  },

  /* Info */

  infoRow: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#191919",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },

  infoDescription: {
    color: "#666",
    fontSize: 12,
    marginTop: 3,
  },

  divider: {
    height: 1,
    backgroundColor: "#1c1c1c",
    marginLeft: 68,
  },

  /* Contact */

  contactRow: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#191919",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  contactContent: {
    flex: 1,
  },

  contactTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },

  contactSubtitle: {
    color: "#666",
    fontSize: 12,
    marginTop: 3,
  },

  /* Footer */

  footer: {
    alignItems: "center",
    paddingTop: 15,
  },

  footerName: {
    color: "#777",
    fontSize: 13,
    fontWeight: "600",
  },

  footerVersion: {
    color: "#444",
    fontSize: 11,
    marginTop: 5,
  },

  /* Modal */

  modalWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.65)",
  },

  modal: {
    backgroundColor: "#111",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 35 : 24,
    borderWidth: 1,
    borderColor: "#222",
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  modalSubtitle: {
    color: "#666",
    fontSize: 12,
    marginTop: 4,
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1b1b1b",
    alignItems: "center",
    justifyContent: "center",
  },

  inputLabel: {
    color: "#666",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 10,
  },

  /* Type buttons */

  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 23,
  },

  typeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#191919",
    borderWidth: 1,
    borderColor: "#242424",
    borderRadius: 12,
    paddingHorizontal: 13,
    height: 40,
  },

  typeButtonSelected: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },

  typeText: {
    color: "#888",
    fontSize: 12,
    fontWeight: "500",
  },

  typeTextSelected: {
    color: "#000",
    fontWeight: "600",
  },

  /* Input */

  textInputContainer: {
    height: 130,
    backgroundColor: "#191919",
    borderWidth: 1,
    borderColor: "#242424",
    borderRadius: 14,
    marginBottom: 18,
  },

  textInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    padding: 14,
    paddingBottom: 30,
  },

  characterCount: {
    position: "absolute",
    right: 12,
    bottom: 9,
    color: "#555",
    fontSize: 10,
  },

  /* Submit */

  submitButton: {
    height: 50,
    borderRadius: 14,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  submitButtonDisabled: {
    backgroundColor: "#222",
  },

  submitText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "700",
  },

  submitTextDisabled: {
    color: "#555",
  },

  cancelButton: {
    alignItems: "center",
    paddingVertical: 13,
  },

  cancelText: {
    color: "#777",
    fontSize: 13,
  },
});