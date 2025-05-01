"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
  matricNumber?: string;
  role: string;
  faculty?: string;
  department?: string;
  level?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      if (isLoggedIn) {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        setUser(userData);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, you would validate credentials with a backend
        localStorage.setItem("isLoggedIn", "true");
        const userData = {
          id: "123",
          name: "John Doe",
          email: email,
          matricNumber: "20/03SEN078",
          role: "student",
        };
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setIsLoading(false);
        resolve(true);
      }, 1000);
    });
  };

  const register = async (userData: any): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, you would send this data to your backend
        localStorage.setItem("isLoggedIn", "true");
        const newUser = {
          id: "123",
          name: userData.fullName,
          email: userData.email,
          matricNumber: userData.matricNumber,
          faculty: userData.faculty,
          department: userData.department,
          level: userData.level,
          role: "student",
        };
        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
        setIsLoading(false);
        resolve(true);
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
