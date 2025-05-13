// src/auth/AuthProvider.tsx
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "./AuthContext";
import { login as loginService, register as registerService } from "../services/AuthService";

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        // Aquí podrías hacer una llamada al backend para obtener el usuario
      }
    };
    loadToken();
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user } = await loginService(email, password);
    setToken(token);
    setUser(user);
    await AsyncStorage.setItem("token", token);
  };

  const register = async (nombre: string, email: string, password: string) => {
    const { token, user } = await registerService(nombre, email, password);
    setToken(token);
    setUser(user);
    await AsyncStorage.setItem("token", token);
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
