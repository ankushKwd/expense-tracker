import { View, ActivityIndicator, StyleSheet } from "react-native";

export const NativeLoadingSpinner = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
);

const styles = StyleSheet.create({
  errorMessageContainer: {
    backgroundColor: "#fee2e2", // red-100
    borderWidth: 1,
    borderColor: "#ef4444", // red-400
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  errorMessageText: {
    color: "#b91c1c", // red-700
    fontSize: 14,
    fontWeight: "bold",
  },
  successMessageContainer: {
    backgroundColor: "#d1fae5", // green-100
    borderWidth: 1,
    borderColor: "#34d399", // green-400
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  successMessageText: {
    color: "#065f46", // green-700
    fontSize: 14,
    fontWeight: "bold",
  },
  loadingContainer: {
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
