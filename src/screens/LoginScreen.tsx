// src/screens/LoginScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";  // Importamos los tipos
import { login } from "../services/AuthService";  // Importamos el servicio de login
import AsyncStorage from "@react-native-async-storage/async-storage";  // Asegúrate de importar AsyncStorage

const LoginScreen = () => {
  const [email, setEmail] = useState("demo@email.com");
  const [password, setPassword] = useState("123456");

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogin = async () => {
    try {
      // Aquí manejamos la lógica de login
      const { token, user } = await login(email, password);  // Llamamos al servicio de login

      // Si el login es exitoso
      console.log("Login exitoso con", email);
      // Guardamos el token y usuario en AsyncStorage
      await AsyncStorage.setItem("token", token);  // Aquí guardamos el token
      
      // Redirigimos a la pantalla de Home
      navigation.navigate("Home");
      
      Alert.alert("Éxito", "Sesión iniciada correctamente");
    } catch (err) {
      // Si el login falla
      console.error("Error en el login:", err);
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
        onPress={handleLogin}  // Llamamos a handleLogin cuando el usuario hace click en el botón
        className="bg-blue-500 w-full p-3 rounded mb-4"
      >
        <Text className="text-white text-center font-semibold">Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}  // Navegar a la pantalla de registro
        className="bg-gray-300 w-full p-3 rounded"
      >
        <Text className="text-center">¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
