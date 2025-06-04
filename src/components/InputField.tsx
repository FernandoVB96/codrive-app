import React from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";

const InputField = (props: TextInputProps) => {
  return (
    <TextInput
      placeholderTextColor="#9c9c96"
      style={styles.input}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#9c9c96",
    backgroundColor: "#151920",
    color: "#ffffff",
    width: "100%",
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
});

export default InputField;
