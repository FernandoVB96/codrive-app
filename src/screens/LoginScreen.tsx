import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { AuthContext } from "../auth/AuthContext";

const LoginScreen = () => {
  const [email, setEmail] = useState("demo@email.com");
  const [password, setPassword] = useState("123456");
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      await login(email, password);
      Alert.alert("Éxito", "Sesión iniciada correctamente");
    } catch (err) {
      Alert.alert("Error", "Credenciales inválidas");
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-2xl font-bold mb-6">Iniciar Sesión</Text>

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
        onPress={handleLogin}
        className="bg-blue-500 w-full p-3 rounded"
      >
        <Text className="text-white text-center font-semibold">Entrar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
