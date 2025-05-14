// src/services/AuthService.ts
import axios from "axios";
import { API_URL } from "@env";

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });

  const { token } = response.data;
  return token;
};

export const register = async (nombre: string, email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/registro`, {
    nombre,
    email,
    password,
  });

  const { token } = response.data;
  return token;
};

export const getCurrentUser = async (token: string) => {
  const response = await axios.get(`${API_URL}/usuarios/mi-perfil`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
