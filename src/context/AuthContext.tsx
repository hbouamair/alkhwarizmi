"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase, DbStudent } from "@/lib/supabase";

interface AuthContextType {
  user: DbStudent | null;
  login: (identifier: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DbStudent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("alkhwarizmi_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("alkhwarizmi_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, password: string): Promise<boolean> => {
    // Try by massar
    let { data, error } = await supabase
      .from("students")
      .select("*")
      .ilike("massar", identifier)
      .eq("password", password)
      .single();

    // If not found, try by email
    if (error || !data) {
      const res = await supabase
        .from("students")
        .select("*")
        .ilike("email", identifier)
        .eq("password", password)
        .single();
      data = res.data;
      error = res.error;
    }

    if (error || !data) return false;

    setUser(data as DbStudent);
    localStorage.setItem("alkhwarizmi_user", JSON.stringify(data));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("alkhwarizmi_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
