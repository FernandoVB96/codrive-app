import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { AuthContext } from "../auth/AuthContext";

const RegisterScreen = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useContext(AuthContext);

  const handleRegister = async () => {
    try {
      await register(nombre, email, password);
      Alert.alert("Registro exitoso", "Has sido registrado correctamente.");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo registrar el usuario.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#344356" }}>
      <StatusBar barStyle="light-content" backgroundColor="#344356" />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        }}
      >
        {/* Logo */}
        <View
          style={{
            backgroundColor: "#e2ae9c",
            borderRadius: 100,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <Image
            source={require("../../assets/logo.png")}
            style={{
              width: 120,
              height: 120,
              resizeMode: "contain",
            }}
          />
        </View>

        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#e2ae9c",
            marginBottom: 32,
          }}
        >
          Registrarse
        </Text>

        <TextInput
          placeholder="Nombre"
          placeholderTextColor="#9c9c96"
          style={{
            borderWidth: 1,
            borderColor: "#9c9c96",
            backgroundColor: "#151920",
            color: "#ffffff",
            width: "100%",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
          }}
          onChangeText={setNombre}
          value={nombre}
        />

        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor="#9c9c96"
          style={{
            borderWidth: 1,
            borderColor: "#9c9c96",
            backgroundColor: "#151920",
            color: "#ffffff",
            width: "100%",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
          }}
          onChangeText={setEmail}
          value={email}
        />

        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#9c9c96"
          secureTextEntry
          style={{
            borderWidth: 1,
            borderColor: "#9c9c96",
            backgroundColor: "#151920",
            color: "#ffffff",
            width: "100%",
            padding: 12,
            borderRadius: 8,
            marginBottom: 24,
          }}
          onChangeText={setPassword}
          value={password}
        />

        <TouchableOpacity
          onPress={handleRegister}
          style={{
            backgroundColor: "#d6765e",
            width: "100%",
            paddingVertical: 14,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;
