// src/screens/SplashScreen.tsx
import React from "react";
import { View, ActivityIndicator, Text } from "react-native";

const SplashScreen = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#0000ff" />
      <Text className="mt-4">Cargando...</Text>
    </View>
  );
};

export default SplashScreen;
