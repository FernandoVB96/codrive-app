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

const RegisterScreen = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useContext(AuthContext);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

const handleRegister = async () => {
  if (nombre.trim().length < 2 || nombre.trim().length > 50) {
    Alert.alert("Error", "El nombre debe tener entre 2 y 50 caracteres");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Alert.alert("Error", "Ingrese un correo electrónico válido");
    return;
  }

  if (password.length < 8) {
    Alert.alert("Error", "La contraseña debe tener al menos 8 caracteres");
    return;
  }

  try {
    await register(nombre, email, password);
    Alert.alert("Registro exitoso", "Has sido registrado correctamente.");
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "No se pudo registrar el usuario.");
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
          paddingHorizontal: 24,
        }}
      >
        {/* Logo */}
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
          Registrarse
        </Text>

        <InputField
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />

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

        <PrimaryButton label="Registrarse" onPress={handleRegister} />

        <SecondaryButton
          label="¿Ya tienes cuenta? Inicia sesión"
          onPress={() => navigation.navigate("Login")}
        />
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;
