// src/auth/AuthContext.tsx
import { createContext } from "react";

// Define el tipo del contexto para autenticación
interface AuthContextType {
  user: any;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (nombre: string, email: string, password: string) => Promise<void>;  // Agregamos la función de registro
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => {},
  logout: async () => {},
  register: async () => {},  // Inicializamos la función de registro
});

