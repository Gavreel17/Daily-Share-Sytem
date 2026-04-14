import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type UserRole = "admin" | "user";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

const SEED_USERS: Array<User & { password: string }> = [
  { id: "1", username: "admin", password: "admin123", role: "admin", name: "Administrator" },
  { id: "2", username: "user1", password: "user123", role: "user", name: "John Doe" },
  { id: "3", username: "user2", password: "user123", role: "user", name: "Jane Smith" },
];

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  logout: () => {},
  isAdmin: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      try {
        const stored = await AsyncStorage.getItem("@auth_user");
        if (stored) setUser(JSON.parse(stored));
      } catch {}
      setIsLoading(false);
    };
    restore();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const found = SEED_USERS.find(
      (u) => u.username === username && u.password === password
    );
    if (!found) return false;
    const { password: _, ...userData } = found;
    setUser(userData);
    await AsyncStorage.setItem("@auth_user", JSON.stringify(userData));
    return true;
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("@auth_user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
