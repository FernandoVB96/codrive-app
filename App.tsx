import React from "react";
import { AuthProvider } from "./src/auth/AuthProvider";
import { View, Text } from "react-native";

export default function App() {
  return (
    <AuthProvider>
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg font-bold">¡Bienvenido a CoDrive!</Text>
      </View>
    </AuthProvider>
  );
}
