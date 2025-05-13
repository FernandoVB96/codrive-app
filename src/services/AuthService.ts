// src/services/AuthService.ts
import axios from "../api/axiosInstance";

export const login = async (email: string, password: string) => {
  const response = await axios.post("/auth/login", { email, password });
  return response.data;
};

export const register = async (nombre: string, email: string, password: string) => {
  const response = await axios.post("/auth/register", {
    nombre,
    email,
    password,
  });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axios.get("/auth/me"); // o el endpoint que tengas
  return response.data;
};
