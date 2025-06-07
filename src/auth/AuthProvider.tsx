// src/auth/AuthProvider.ts
import React, { useState, useEffect, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "./AuthContext";
import {
  login as loginService,
  register as registerService,
  getCurrentUser,
} from "../services/AuthService";

// ❌ Notificaciones desactivadas
// import * as Notifications from "expo-notifications";
// import Constants from "expo-constants";
import { Alert, Platform } from "react-native";

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // async function registerForPushNotificationsAsync() {
  //   if (!Constants.isDevice) {
  //     Alert.alert(
  //       "Error",
  //       "Debes usar un dispositivo físico para recibir notificaciones"
  //     );
  //     return null;
  //   }

  //   const { status: existingStatus } = await Notifications.getPermissionsAsync();
  //   let finalStatus = existingStatus;

  //   if (existingStatus !== "granted") {
  //     const { status } = await Notifications.requestPermissionsAsync();
  //     finalStatus = status;
  //   }

  //   if (finalStatus !== "granted") {
  //     Alert.alert("Permiso denegado", "No podrás recibir notificaciones");
  //     return null;
  //   }

  //   const expoPushToken = (await Notifications.getExpoPushTokenAsync()).data;

  //   if (Platform.OS === "android") {
  //     Notifications.setNotificationChannelAsync("default", {
  //       name: "default",
  //       importance: Notifications.AndroidImportance.MAX,
  //     });
  //   }

  //   return expoPushToken;
  // }

  // async function enviarTokenAlBackend(expoPushToken: string, authToken: string) {
  //   try {
  //     const response = await fetch("http://192.168.1.130:8080/usuarios/token", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + authToken,
  //       },
  //       body: JSON.stringify({ expoPushToken }),
  //     });

  //     if (!response.ok) {
  //       console.warn("Error al enviar el token al backend");
  //     }
  //   } catch (error) {
  //     console.warn("Error enviando token:", error);
  //   }
  // }

  useEffect(() => {
    const loadSession = async () => {
      const savedToken = await AsyncStorage.getItem("token");

      if (savedToken) {
        setToken(savedToken);

        try {
          const currentUser = await getCurrentUser(savedToken);
          setUser(currentUser);

          // 🔇 Notificaciones desactivadas
          // const expoToken = await registerForPushNotificationsAsync();
          // if (expoToken) {
          //   await enviarTokenAlBackend(expoToken, savedToken);
          // }
        } catch (error) {
          console.log("Token inválido o error al obtener el usuario", error);
          await AsyncStorage.removeItem("token");
          setToken(null);
        }
      }

      setLoading(false);
    };

    loadSession();
  }, []);

  const login = async (email: string, password: string) => {
    const token = await loginService(email, password);
    setToken(token);
    await AsyncStorage.setItem("token", token);

    try {
      const currentUser = await getCurrentUser(token);
      setUser(currentUser);

      // 🔇 Notificaciones desactivadas
      // const expoToken = await registerForPushNotificationsAsync();
      // if (expoToken) {
      //   await enviarTokenAlBackend(expoToken, token);
      // }
    } catch (error) {
      console.error("Error al obtener usuario en login:", error);
    }
  };

  const logout = async (navigation?: any) => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem("token");
  };

  const register = async (nombre: string, email: string, password: string) => {
    const token = await registerService(nombre, email, password);
    setToken(token);
    await AsyncStorage.setItem("token", token);

    try {
      const currentUser = await getCurrentUser(token);
      setUser(currentUser);

      // 🔇 Notificaciones desactivadas
      // const expoToken = await registerForPushNotificationsAsync();
      // if (expoToken) {
      //   await enviarTokenAlBackend(expoToken, token);
      // }
    } catch (error) {
      console.error("Error al obtener usuario después del registro:", error);
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      register,
      loading,
      setUser,
    }),
    [user, token, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
