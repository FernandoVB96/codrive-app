// src/screens/SplashScreen.tsx
import React from "react";
import {
  View,
  ActivityIndicator,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from "react-native";

const SplashScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.text}>Cargando...</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 24,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
  },
});

export default SplashScreen;
