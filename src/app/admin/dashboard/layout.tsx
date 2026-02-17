"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { ShieldCheck, LayoutDashboard, FileText, CalendarCheck, LogOut, Menu, X, ChevronRight, Users } from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/admin/dashboard/documents", label: "Documents", icon: FileText },
  { href: "/admin/dashboard/absences", label: "Absences", icon: CalendarCheck },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { admin, logout, isLoading } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { if (!isLoading && !admin) router.replace("/admin"); }, [admin, isLoading, router]);
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  if (isLoading || !admin) {
    return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f8fafc" }}><div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: "#0e7c47", borderTopColor: "transparent" }} /></div>;
  }

  const isActive = (href: string) => href === "/admin/dashboard" ? pathname === "/admin/dashboard" : pathname.startsWith(href);

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#f8fafc" }}>
      {sidebarOpen && <div className="fixed inset-0 z-40 lg:hidden" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-72 z-50 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`} style={{ backgroundColor: "#1a1a2e" }}>
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(212,168,67,0.2)" }}>
                <ShieldCheck className="w-5 h-5" style={{ color: "#f0d080" }} />
              </div>
              <div>
                <h1 className="text-base font-bold leading-tight" style={{ color: "#ffffff" }}>Administration</h1>
                <p className="text-xs" style={{ color: "rgba(148,163,184,0.6)" }}>Lycée Alkhwarizmi</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden" style={{ color: "#e2e8f0" }}><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="mx-4 mb-4 p-3 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(212,168,67,0.2)" }}>
              <Users className="w-4 h-4" style={{ color: "#f0d080" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "#ffffff" }}>{admin.full_name}</p>
              <p className="text-xs truncate" style={{ color: "rgba(148,163,184,0.5)" }}>{admin.role}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(148,163,184,0.4)" }}>Gestion</p>
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all" style={{ backgroundColor: active ? "rgba(212,168,67,0.15)" : "transparent", color: active ? "#ffffff" : "rgba(226,232,240,0.7)" }}>
                <item.icon className="w-[18px] h-[18px]" style={{ color: active ? "#f0d080" : "rgba(226,232,240,0.5)" }} />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight className="w-4 h-4" style={{ color: "rgba(212,168,67,0.6)" }} />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <button onClick={() => { logout(); router.push("/admin"); }} className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium transition-all" style={{ color: "rgba(252,165,165,0.7)" }}>
            <LogOut className="w-[18px] h-[18px]" />Déconnexion
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30" style={{ backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(226,232,240,0.5)" }}>
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 rounded-xl" style={{ color: "#0f172a" }}><Menu className="w-5 h-5" /></button>
              <div className="hidden sm:flex items-center text-sm">
                <span className="font-medium" style={{ color: "#d4a843" }}>Admin</span>
                {pathname !== "/admin/dashboard" && <><ChevronRight className="w-4 h-4 mx-1" style={{ color: "#94a3b8" }} /><span className="font-medium" style={{ color: "#0f172a" }}>{navItems.find((i) => isActive(i.href))?.label}</span></>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium hidden sm:block" style={{ color: "#0f172a" }}>{admin.full_name}</p>
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm" style={{ background: "linear-gradient(135deg, #d4a843, #b8902e)", color: "#ffffff" }}>
                {admin.full_name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        <footer className="px-4 sm:px-6 lg:px-8 py-4" style={{ borderTop: "1px solid rgba(226,232,240,0.5)" }}>
          <p className="text-xs text-center" style={{ color: "#94a3b8" }}>© 2026 Lycée Alkhwarizmi — Espace Administration</p>
        </footer>
      </div>
    </div>
  );
}
