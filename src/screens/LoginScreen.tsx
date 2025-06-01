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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#344356" }}>
      <StatusBar barStyle="light-content" backgroundColor="#344356" />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        {/* Logo con fondo claro */}
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
          Iniciar Sesión
        </Text>

        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor="#9c9c96"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={{
            borderWidth: 1,
            borderColor: "#9c9c96",
            backgroundColor: "#151920",
            color: "#ffffff",
            width: "100%",
            padding: 12,
            marginBottom: 16,
            borderRadius: 8,
          }}
        />

        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#9c9c96"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{
            borderWidth: 1,
            borderColor: "#9c9c96",
            backgroundColor: "#151920",
            color: "#ffffff",
            width: "100%",
            padding: 12,
            marginBottom: 24,
            borderRadius: 8,
          }}
        />

        <TouchableOpacity
          style={{
            backgroundColor: "#d6765e",
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
            borderColor: "#9c9c96",
            borderWidth: 1,
            width: "100%",
            paddingVertical: 14,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={{ color: "#e2ae9c", fontWeight: "500" }}>
            ¿No tienes cuenta? Regístrate
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
