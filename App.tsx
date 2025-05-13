import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/auth/AuthProvider";
import AppStack from "./src/navigation/AppStack";

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppStack />
      </NavigationContainer>
    </AuthProvider>
  );
}
