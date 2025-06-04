import React from "react";
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from "react-native";

interface Props {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
}

const SecondaryButton = ({ label, onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderColor: "#9c9c96",
    borderWidth: 1,
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  text: {
    color: "#e2ae9c",
    fontWeight: "500",
  },
});

export default SecondaryButton;
