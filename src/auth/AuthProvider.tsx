// src/auth/AuthProvider.ts
import React, { useState, useEffect, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "./AuthContext";
import {
  login as loginService,
  register as registerService,
  getCurrentUser,
} from "../services/AuthService";

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const savedToken = await AsyncStorage.getItem("token");

      if (savedToken) {
        setToken(savedToken);

        try {
          const currentUser = await getCurrentUser(savedToken);
          setUser(currentUser);
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
