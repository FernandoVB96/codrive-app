// src/navigation/Navigation.tsx
import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContext } from "../auth/AuthContext";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";
import { ActivityIndicator, View } from "react-native";

const Navigation = () => {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {token ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Navigation;
