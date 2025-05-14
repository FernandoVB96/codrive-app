// src/screens/ViajeScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

const ViajeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.container}>
        <Text style={styles.title}>Pantalla de Viaje</Text>
        <Text style={styles.description}>Aquí puedes gestionar tus viajes, ver detalles y mucho más.</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.buttonText}>Ir a Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: "80%",
    marginBottom: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default ViajeScreen;
