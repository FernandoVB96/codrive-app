// App.tsx
import React from "react";
import { AuthProvider } from "./src/auth/AuthProvider";
import Navigation from "./src/navigation/Navigation";

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}
