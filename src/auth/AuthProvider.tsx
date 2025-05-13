// src/auth/AuthProvider.tsx
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "./AuthContext";
import { login as loginService, getCurrentUser } from "../services/AuthService";
import { register as registerService } from "../services/AuthService";


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
          const currentUser = await getCurrentUser(); // 🔥 Nuevo endpoint
          setUser(currentUser);
        } catch (error) {
          console.log("Token inválido, cerrando sesión");
          await AsyncStorage.removeItem("token");
          setToken(null);
        }
      }

      setLoading(false);
    };

    loadSession();
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user } = await loginService(email, password);
    setToken(token);
    setUser(user);
    await AsyncStorage.setItem("token", token);
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem("token");
  };
  const register = async (nombre: string, email: string, password: string) => {
  const { token, user } = await registerService(nombre, email, password);
  setToken(token);
  setUser(user);
  await AsyncStorage.setItem("token", token);
};


  return (
      <AuthContext.Provider value={{ user, token, login, logout, register, loading }}>
        {children}
      </AuthContext.Provider>

  );
};
