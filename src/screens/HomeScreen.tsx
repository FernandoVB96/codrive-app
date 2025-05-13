// src/screens/HomeScreen.tsx
import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AuthContext } from "../auth/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const HomeScreen = () => {
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handleLogout = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-2xl font-bold mb-4">Bienvenido 👋</Text>
      <Text className="text-lg mb-6">
        {user ? `Hola, ${user.nombre || "usuario"}!` : "Usuario no disponible"}
      </Text>

      <TouchableOpacity
        className="bg-blue-500 w-full p-3 rounded mb-4"
        onPress={() => navigation.navigate("Profile")}
      >
        <Text className="text-white text-center font-semibold">
          Ir a Perfil
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-red-500 w-full p-3 rounded"
        onPress={handleLogout}
      >
        <Text className="text-white text-center font-semibold">
          Cerrar sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
