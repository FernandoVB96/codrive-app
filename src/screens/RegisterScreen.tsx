// src/screens/RegisterScreen.tsx
import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
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
      navigation.replace("Home"); // ✅ Redirigir tras registro
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo registrar el usuario.");
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-2xl font-bold mb-6">Registrarse</Text>

      <TextInput
        placeholder="Nombre"
        className="border border-gray-300 w-full mb-4 p-3 rounded"
        onChangeText={setNombre}
        value={nombre}
      />

      <TextInput
        placeholder="Correo electrónico"
        className="border border-gray-300 w-full mb-4 p-3 rounded"
        onChangeText={setEmail}
        value={email}
      />

      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        className="border border-gray-300 w-full mb-4 p-3 rounded"
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity
        onPress={handleRegister}
        className="bg-green-500 w-full p-3 rounded"
      >
        <Text className="text-white text-center font-semibold">Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;
