// src/screens/ProfileScreen.tsx
import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AuthContext } from "../auth/AuthContext";

const ProfileScreen = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-2xl font-bold mb-4">Mi Perfil</Text>
      {user ? (
        <>
          <Text className="text-lg mb-2">Nombre: {user.nombre}</Text>
          <Text className="text-lg mb-2">Email: {user.email}</Text>
        </>
      ) : (
        <Text className="text-lg mb-6">Usuario no disponible</Text>
      )}

      <TouchableOpacity
        className="bg-red-500 w-full p-3 rounded mt-6"
        onPress={logout}
      >
        <Text className="text-white text-center font-semibold">
          Cerrar sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
