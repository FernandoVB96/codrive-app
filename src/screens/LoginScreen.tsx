import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { AuthContext } from "../auth/AuthContext";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      await login(email, password);
      Alert.alert("Éxito", "Sesión iniciada correctamente");
    } catch (err) {
      console.error("Error en el login:", err);
      Alert.alert("Error", "Credenciales inválidas");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 24 }}>Iniciar Sesión</Text>

        <TextInput
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={{
            borderWidth: 1,
            borderColor: "#D1D5DB",
            width: "100%",
            padding: 12,
            marginBottom: 16,
            borderRadius: 8,
          }}
        />

        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{
            borderWidth: 1,
            borderColor: "#D1D5DB",
            width: "100%",
            padding: 12,
            marginBottom: 24,
            borderRadius: 8,
          }}
        />

        <TouchableOpacity
          style={{
            backgroundColor: "#3B82F6",
            width: "100%",
            paddingVertical: 14,
            borderRadius: 8,
            alignItems: "center",
            marginBottom: 16,
          }}
          onPress={handleLogin}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "#E5E7EB",
            width: "100%",
            paddingVertical: 14,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={{ fontWeight: "500" }}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
