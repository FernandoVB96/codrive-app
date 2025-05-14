// src/screens/RegisterScreen.tsx
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from "react-native";
import { AuthContext } from "../auth/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const RegisterScreen = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useContext(AuthContext);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handleRegister = async () => {
    try {
      await register(nombre, email, password);
      Alert.alert("Registro exitoso", "Has sido registrado correctamente.");
      navigation.replace("Home");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo registrar el usuario.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.container}>
        <Text style={styles.title}>Registrarse</Text>

        <TextInput
          placeholder="Nombre"
          style={styles.input}
          onChangeText={setNombre}
          value={nombre}
        />

        <TextInput
          placeholder="Correo electrónico"
          style={styles.input}
          onChangeText={setEmail}
          value={email}
        />

        <TextInput
          placeholder="Contraseña"
          secureTextEntry
          style={styles.input}
          onChangeText={setPassword}
          value={password}
        />

        <TouchableOpacity onPress={handleRegister} style={styles.button}>
          <Text style={styles.buttonText}>Registrarse</Text>
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
    backgroundColor: "white",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    width: "100%",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#22C55E",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default RegisterScreen;
