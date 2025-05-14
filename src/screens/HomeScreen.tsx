import React, { useContext } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import { AuthContext } from "../auth/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const HomeScreen = () => {
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handleLogout = async () => {
    await logout();
  };

  return (
    // SafeAreaView envuelve toda la pantalla para evitar que el contenido se sobreponga a la barra de estado.
    <SafeAreaView style={{ flex: 1 }}>
      {/* Controlamos el estilo de la barra de estado para mejorar la visibilidad */}
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>Bienvenido 👋</Text>
        <Text style={{ fontSize: 18, marginBottom: 24 }}>
          {user ? `Hola, ${user.nombre ?? "usuario"}!` : "Usuario no disponible"}
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: "#3B82F6",
            width: "100%",
            paddingVertical: 14,
            borderRadius: 8,
            marginBottom: 16,
            alignItems: "center",
          }}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>
            Ir a Perfil
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "#EF4444",
            width: "100%",
            paddingVertical: 14,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={handleLogout}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>
            Cerrar sesión
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
