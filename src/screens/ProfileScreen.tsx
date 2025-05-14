// src/screens/ProfileScreen.tsx
import React, { useContext } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import { AuthContext } from "../auth/AuthContext";

const ProfileScreen = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 24 }}>Mi Perfil</Text>

        {user ? (
          <>
            <Text style={{ fontSize: 18, marginBottom: 8 }}>Nombre: {user.nombre}</Text>
            <Text style={{ fontSize: 18, marginBottom: 24 }}>Email: {user.email}</Text>
          </>
        ) : (
          <Text style={{ fontSize: 18, marginBottom: 24 }}>Usuario no disponible</Text>
        )}

        <TouchableOpacity
          style={{
            backgroundColor: "#EF4444", 
            width: "100%", 
            paddingVertical: 14, 
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={logout}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>
            Cerrar sesión
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
