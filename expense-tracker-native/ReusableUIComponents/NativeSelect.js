import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

export const NativeSelect = ({
  label,
  selectedValue,
  onValueChange,
  options,
}) => (
  <View style={styles.selectContainer}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.pickerWrapper}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
      >
        <Picker.Item label="Select..." value="" />
        {options.map((option) => (
          <Picker.Item
            key={option.value}
            label={option.label}
            value={option.value}
          />
        ))}
      </Picker>
    </View>
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
