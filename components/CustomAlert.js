import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

const createStyles = (theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo escurecido
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    alertContainer: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.spacing.m,
      padding: theme.spacing.l,
      width: "100%",
      maxWidth: 340,
      // Sombra estilo Shadcn
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.foreground,
      marginBottom: 8,
    },
    message: {
      fontSize: 16,
      color: theme.colors.mutedForeground,
      marginBottom: 24,
      lineHeight: 22,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 12,
    },
    button: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: theme.spacing.s,
      alignItems: "center",
      justifyContent: "center",
    },
    primaryButton: {
      backgroundColor: theme.colors.primary,
    },
    cancelButton: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    buttonTextPrimary: {
      color: theme.colors.primaryForeground,
      fontWeight: "600",
      fontSize: 14,
    },
    buttonTextCancel: {
      color: theme.colors.foreground,
      fontWeight: "600",
      fontSize: 14,
    },
  });

export default function CustomAlert({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText,
  type = "default",
}) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel || onConfirm}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonContainer}>
            {cancelText && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onCancel}
              >
                <Text style={styles.buttonTextCancel}>{cancelText}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                styles.primaryButton,
                type === "error" && {
                  backgroundColor: theme.colors.destructive,
                },
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.buttonTextPrimary}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
