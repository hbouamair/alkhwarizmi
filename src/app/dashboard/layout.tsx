"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  GraduationCap,
  LayoutDashboard,
  FileText,
  CalendarCheck,
  LogOut,
  Menu,
  X,
  ChevronRight,
  User,
} from "lucide-react";

const navItems = [
  {
    href: "/dashboard",
    label: "Tableau de Bord",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/documents",
    label: "Documents",
    icon: FileText,
  },
  {
    href: "/dashboard/presence",
    label: "Présences",
    icon: CalendarCheck,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (isLoading || !user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#f8fafc" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 border-4 rounded-full animate-spin"
            style={{ borderColor: "#0e7c47", borderTopColor: "transparent" }}
          />
          <p className="text-sm" style={{ color: "#94a3b8" }}>
            Chargement...
          </p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  // Support both old (firstName/lastName) and new (first_name/last_name) field names
  const u = user as Record<string, string>;
  const firstName = u.first_name || u.firstName || "";
  const lastName = u.last_name || u.lastName || "";
  const userMassar = u.massar || "";
  const userClasse = u.classe || "";

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#f8fafc" }}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 z-50 flex flex-col transition-transform duration-300 ease-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        style={{ backgroundColor: "#0f2419" }}
      >
        {/* Logo */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(14,124,71,0.3)" }}
              >
                <GraduationCap className="w-5 h-5" style={{ color: "#f0d080" }} />
              </div>
              <div>
                <h1
                  className="text-base font-bold tracking-tight leading-tight"
                  style={{ color: "#ffffff" }}
                >
                  Lycée Alkhwarizmi
                </h1>
                <p className="text-xs" style={{ color: "rgba(74,222,128,0.6)" }}>
                  Aït Amira
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden transition-colors"
              style={{ color: "#e2e8f0" }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Student Info */}
        <div
          className="mx-4 mb-4 p-3 rounded-xl"
          style={{
            backgroundColor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(14,124,71,0.4)" }}
            >
              <User className="w-4 h-4" style={{ color: "#86efac" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "#ffffff" }}>
                {firstName} {lastName}
              </p>
              <p className="text-xs truncate" style={{ color: "rgba(74,222,128,0.5)" }}>
                {userClasse}
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          <p
            className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: "rgba(74,222,128,0.4)" }}
          >
            Navigation
          </p>
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  backgroundColor: active ? "rgba(14,124,71,0.25)" : "transparent",
                  color: active ? "#ffffff" : "rgba(226,232,240,0.7)",
                }}
              >
                <item.icon
                  className="w-[18px] h-[18px]"
                  style={{ color: active ? "#d4a843" : "rgba(226,232,240,0.5)" }}
                />
                <span className="flex-1">{item.label}</span>
                {active && (
                  <ChevronRight className="w-4 h-4" style={{ color: "rgba(212,168,67,0.6)" }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} className="p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium transition-all"
            style={{ color: "rgba(252,165,165,0.7)" }}
          >
            <LogOut className="w-[18px] h-[18px]" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header
          className="sticky top-0 z-30"
          style={{
            backgroundColor: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(226,232,240,0.5)",
          }}
        >
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-xl transition-colors"
                style={{ color: "#0f172a" }}
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Breadcrumb */}
              <div className="hidden sm:flex items-center text-sm">
                <span className="font-medium" style={{ color: "#0e7c47" }}>
                  Espace Élève
                </span>
                {pathname !== "/dashboard" && (
                  <>
                    <ChevronRight className="w-4 h-4 mx-1" style={{ color: "#94a3b8" }} />
                    <span className="font-medium" style={{ color: "#0f172a" }}>
                      {navItems.find((i) => isActive(i.href))?.label}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium" style={{ color: "#0f172a" }}>
                  {firstName} {lastName}
                </p>
                <p className="text-xs" style={{ color: "#94a3b8" }}>
                  {userMassar}
                </p>
              </div>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm shadow-md"
                style={{
                  background: "linear-gradient(135deg, #0e7c47, #065f35)",
                  color: "#ffffff",
                }}
              >
                {firstName[0] || ""}
                {lastName[0] || ""}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>

        {/* Footer */}
        <footer
          className="px-4 sm:px-6 lg:px-8 py-4"
          style={{ borderTop: "1px solid rgba(226,232,240,0.5)" }}
        >
          <p className="text-xs text-center" style={{ color: "#94a3b8" }}>
            © 2026 Lycée Qualifiant Alkhwarizmi — Aït Amira, Province Chtouka-Aït
            Baha
          </p>
        </footer>
      </div>
    </div>
  );
}
