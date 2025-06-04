import React, { useState, useContext } from "react";
import {
  View,
  Text,
  Alert,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { AuthContext } from "../auth/AuthContext";

// Componentes reutilizables
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";

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

        <InputField
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <InputField
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <PrimaryButton label="Entrar" onPress={handleLogin} />

        <SecondaryButton
          label="¿No tienes cuenta? Regístrate"
          onPress={() => navigation.navigate("Register")}
        />
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
