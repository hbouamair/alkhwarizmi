"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Users, FileText, CalendarCheck, Megaphone, Clock, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({ students: 0, pendingDocs: 0, readyDocs: 0, refusedDocs: 0, totalAbsences: 0, announcements: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [studentsRes, docsRes, absRes, annRes] = await Promise.all([
        supabase.from("students").select("id", { count: "exact", head: true }),
        supabase.from("document_requests").select("*"),
        supabase.from("absences").select("count"),
        supabase.from("announcements").select("id", { count: "exact", head: true }),
      ]);
      const docs = docsRes.data || [];
      const absTotal = (absRes.data || []).reduce((s: number, a: { count: number }) => s + (a.count || 0), 0);
      setStats({
        students: studentsRes.count || 0,
        pendingDocs: docs.filter((d: { status: string }) => d.status === "en_cours").length,
        readyDocs: docs.filter((d: { status: string }) => d.status === "pret").length,
        refusedDocs: docs.filter((d: { status: string }) => d.status === "refuse").length,
        totalAbsences: absTotal,
        announcements: annRes.count || 0,
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: "#d4a843", borderTopColor: "transparent" }} /></div>;

  const cards = [
    { icon: Users, label: "Élèves inscrits", value: stats.students, bg: "#eff6ff", ic: "#2563eb" },
    { icon: Clock, label: "Demandes en attente", value: stats.pendingDocs, bg: "#fffbeb", ic: "#d97706", href: "/admin/dashboard/documents" },
    { icon: CheckCircle2, label: "Documents prêts", value: stats.readyDocs, bg: "#ecfdf5", ic: "#059669" },
    { icon: XCircle, label: "Demandes refusées", value: stats.refusedDocs, bg: "#fef2f2", ic: "#dc2626" },
    { icon: CalendarCheck, label: "Total absences", value: stats.totalAbsences, bg: "#fef2f2", ic: "#ef4444", href: "/admin/dashboard/absences" },
    { icon: Megaphone, label: "Annonces", value: stats.announcements, bg: "#f3e8ff", ic: "#7c3aed" },
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}>
        <div className="relative z-10">
          <p className="text-sm font-medium mb-1" style={{ color: "rgba(240,208,128,0.7)" }}>Tableau de bord</p>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "#ffffff" }}>Espace Administration</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>Gérez les documents, absences et annonces du lycée.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const inner = (
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: card.bg }}>
                <card.icon className="w-5 h-5" style={{ color: card.ic }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: "#0f172a" }}>{card.value}</p>
                <p className="text-xs" style={{ color: "#94a3b8" }}>{card.label}</p>
              </div>
            </div>
          );
          return card.href ? (
            <Link key={card.label} href={card.href} className="stat-card rounded-2xl p-5" style={{ backgroundColor: "#ffffff", border: "1px solid #f1f5f9" }}>
              {inner}
            </Link>
          ) : (
            <div key={card.label} className="stat-card rounded-2xl p-5" style={{ backgroundColor: "#ffffff", border: "1px solid #f1f5f9" }}>
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}
