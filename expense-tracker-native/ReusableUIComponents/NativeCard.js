import { View, Text, StyleSheet } from "react-native";

export const NativeCard = ({ children, title, style }) => (
  <View style={[styles.card, style]}>
    {title && <Text style={styles.cardTitle}>{title}</Text>}
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5, // Android shadow
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937", // gray-800
    marginBottom: 15,
  },
});
