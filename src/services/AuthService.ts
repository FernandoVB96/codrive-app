// src/services/AuthService.ts
import axios from "../api/axiosInstance";

// Función para el login
export const login = async (email: string, password: string) => {
  const response = await axios.post("/auth/login", { email, password });
  return response.data;
};

// Función para el registro
export const register = async (nombre: string, email: string, password: string) => {
  const response = await axios.post("/auth/register", { nombre, email, password });
  return response.data;
};
