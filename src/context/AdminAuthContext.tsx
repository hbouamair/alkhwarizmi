"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase, DbAdmin } from "@/lib/supabase";

interface AdminAuthContextType {
  admin: DbAdmin | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<DbAdmin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("alkhwarizmi_admin");
    if (saved) {
      try {
        setAdmin(JSON.parse(saved));
      } catch {
        localStorage.removeItem("alkhwarizmi_admin");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .single();

    if (error || !data) return false;

    setAdmin(data as DbAdmin);
    localStorage.setItem("alkhwarizmi_admin", JSON.stringify(data));
    return true;
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("alkhwarizmi_admin");
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, isLoading }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
