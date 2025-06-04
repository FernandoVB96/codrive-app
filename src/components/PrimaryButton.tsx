import React from "react";
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from "react-native";

interface Props {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  backgroundColor?: string;  // prop opcional para el color
}

const PrimaryButton = ({ label, onPress, backgroundColor }: Props) => {
  return (
    <TouchableOpacity
      style={[styles.button, backgroundColor ? { backgroundColor } : null]}
      onPress={onPress}
    >
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#d6765e",  // color por defecto si no pasas ninguno
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  text: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default PrimaryButton;
