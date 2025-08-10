import { TouchableOpacity, Text, StyleSheet } from "react-native";

export const NativeButton = ({
  children,
  onPress,
  style,
  textStyle,
  disabled = false,
}) => (
  <TouchableOpacity
    style={[styles.button, style, disabled && styles.buttonDisabled]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={[styles.buttonText, textStyle]}>{children}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#3b82f6", // blue-500
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#6b7280", // gray-500
    marginTop: 10,
  },
  authButton: {
    marginTop: 15,
  },
  addButton: {
    marginTop: 15,
  },
  formButtonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  formSubmitButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: "#f59e0b", // yellow-500
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    minWidth: 60,
  },
  deleteButton: {
    backgroundColor: "#ef4444", // red-500
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    minWidth: 60,
  },
  saveButton: {
    backgroundColor: "#22c55e", // green-500
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    minWidth: 60,
  },
  actionButtonText: {
    fontSize: 12,
  },
  buttonGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
