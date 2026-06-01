
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { authService } from "./auth.service";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Проверяем токен при монтировании
  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  const login = (token: string) => {
    authService.setToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    authService.clearToken();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}