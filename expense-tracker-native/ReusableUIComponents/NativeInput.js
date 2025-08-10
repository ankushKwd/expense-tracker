import { View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native";

export const NativeInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  secureTextEntry = false,
  editable = true,
}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, !editable && styles.inputDisabled]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      editable={editable}
    />
  </View>
);

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#374151", // gray-700
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db", // gray-300
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#1f2937", // gray-800
    backgroundColor: "#fff",
  },
  inputDisabled: {
    backgroundColor: "#e5e7eb", // gray-200
    color: "#6b7280", // gray-500
  },
  selectContainer: {
    marginBottom: 15,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    overflow: "hidden", // Ensures picker stays within bounds
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#1f2937",
  },
});
