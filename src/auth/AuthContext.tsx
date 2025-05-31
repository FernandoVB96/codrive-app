// src/auth/AuthContext.ts
import { createContext } from "react";

interface AuthContextType {
  user: any;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (nombre: string, email: string, password: string) => Promise<void>;
  loading: boolean;
  setUser: (user: any) => void;  // <-- Agregado
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  loading: true,
  setUser: () => {},  // <-- Agregado
});
