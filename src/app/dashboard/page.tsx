"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase, DbDocumentRequest, DbAbsence, DbAnnouncement } from "@/lib/supabase";
import {
  FileText,
  CalendarCheck,
  Bell,
  Megaphone,
  Pin,
  Clock,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const catBadgeStyles: Record<string, { bg: string; color: string }> = {
  general: { bg: "#dbeafe", color: "#1d4ed8" },
  examen: { bg: "#fef3c7", color: "#b45309" },
  orientation: { bg: "#f3e8ff", color: "#7c3aed" },
  activite: { bg: "#d1fae5", color: "#047857" },
  urgent: { bg: "#fee2e2", color: "#dc2626" },
};

const catLabels: Record<string, string> = {
  general: "Général",
  examen: "Examens",
  orientation: "Orientation",
  activite: "Activités",
  urgent: "Urgent",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DbDocumentRequest[]>([]);
  const [absences, setAbsences] = useState<DbAbsence[]>([]);
  const [announcements, setAnnouncements] = useState<DbAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function fetchData() {
      const [docsRes, absRes, annRes] = await Promise.all([
        supabase.from("document_requests").select("*").eq("student_id", user!.id),
        supabase.from("absences").select("*").eq("student_id", user!.id),
        supabase.from("announcements").select("*").order("pinned", { ascending: false }).order("date", { ascending: false }),
      ]);
      setDocuments((docsRes.data || []) as DbDocumentRequest[]);
      setAbsences((absRes.data || []) as DbAbsence[]);
      setAnnouncements((annRes.data || []) as DbAnnouncement[]);
      setLoading(false);
    }
    fetchData();
  }, [user]);

  if (!user) return null;

  const pendingDocs = documents.filter((d) => d.status === "en_cours").length;
  const readyDocs = documents.filter((d) => d.status === "pret").length;
  const totalAbsences = absences.reduce((sum, a) => sum + a.count, 0);

  const formatDate = (dateStr: string) =>
    new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(dateStr));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: "#0e7c47", borderTopColor: "transparent" }} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0e7c47 0%, #065f35 50%, #0f2419 100%)" }}>
        <div className="relative z-10">
          <p className="text-sm font-medium mb-1" style={{ color: "rgba(255,255,255,0.7)" }}>Bienvenue,</p>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "#ffffff" }}>{(user as Record<string,string>).first_name || (user as Record<string,string>).firstName} {(user as Record<string,string>).last_name || (user as Record<string,string>).lastName}</h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{user.niveau} — {user.classe}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/dashboard/documents" className="stat-card rounded-2xl p-5 group" style={{ backgroundColor: "#ffffff", border: "1px solid #f1f5f9" }}>
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#fffbeb" }}><Clock className="w-5 h-5" style={{ color: "#d97706" }} /></div>
            <ArrowRight className="w-4 h-4" style={{ color: "#cbd5e1" }} />
          </div>
          <p className="text-2xl font-bold" style={{ color: "#0f172a" }}>{pendingDocs}</p>
          <p className="text-sm mt-0.5" style={{ color: "#94a3b8" }}>Demandes en cours</p>
        </Link>

        <Link href="/dashboard/documents" className="stat-card rounded-2xl p-5 group" style={{ backgroundColor: "#ffffff", border: "1px solid #f1f5f9" }}>
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#ecfdf5" }}><FileText className="w-5 h-5" style={{ color: "#059669" }} /></div>
            <ArrowRight className="w-4 h-4" style={{ color: "#cbd5e1" }} />
          </div>
          <p className="text-2xl font-bold" style={{ color: "#0f172a" }}>{readyDocs}</p>
          <p className="text-sm mt-0.5" style={{ color: "#94a3b8" }}>Documents prêts</p>
        </Link>

        <Link href="/dashboard/presence" className="stat-card rounded-2xl p-5 group" style={{ backgroundColor: "#ffffff", border: "1px solid #f1f5f9" }}>
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#fef2f2" }}><CalendarCheck className="w-5 h-5" style={{ color: "#ef4444" }} /></div>
            <ArrowRight className="w-4 h-4" style={{ color: "#cbd5e1" }} />
          </div>
          <p className="text-2xl font-bold" style={{ color: "#0f172a" }}>{totalAbsences}</p>
          <p className="text-sm mt-0.5" style={{ color: "#94a3b8" }}>Absences totales</p>
        </Link>

        <div className="stat-card rounded-2xl p-5" style={{ backgroundColor: "#ffffff", border: "1px solid #f1f5f9" }}>
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#eff6ff" }}><TrendingUp className="w-5 h-5" style={{ color: "#2563eb" }} /></div>
          </div>
          <p className="text-2xl font-bold" style={{ color: "#0f172a" }}>{documents.length}</p>
          <p className="text-sm mt-0.5" style={{ color: "#94a3b8" }}>Total demandes</p>
        </div>
      </div>

      {/* Announcements */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5" style={{ color: "#0e7c47" }} />
            <h2 className="text-lg font-bold" style={{ color: "#0f172a" }}>Actualités & Annonces</h2>
          </div>
        </div>
        <div className="space-y-4">
          {announcements.map((ann) => (
            <article key={ann.id} className="rounded-2xl p-5 sm:p-6 transition-all hover:shadow-md" style={{ backgroundColor: "#ffffff", border: ann.pinned ? "1px solid rgba(14,124,71,0.2)" : "1px solid #f1f5f9" }}>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {ann.pinned && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full" style={{ backgroundColor: "rgba(14,124,71,0.1)", color: "#0e7c47" }}><Pin className="w-3 h-3" />Épinglé</span>
                )}
                <span className="inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-full" style={{ backgroundColor: catBadgeStyles[ann.category]?.bg, color: catBadgeStyles[ann.category]?.color }}>{catLabels[ann.category]}</span>
                <span className="text-xs flex items-center gap-1" style={{ color: "#94a3b8" }}><Bell className="w-3 h-3" />{formatDate(ann.date)}</span>
              </div>
              <h3 className="text-base font-bold mb-1.5" style={{ color: "#0f172a" }}>{ann.title}</h3>
              {ann.title_ar && <p className="text-sm mb-2 font-medium" dir="rtl" style={{ color: "#64748b" }}>{ann.title_ar}</p>}
              <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>{ann.content}</p>
              {ann.content_ar && <p className="text-sm leading-relaxed mt-2" dir="rtl" style={{ color: "#94a3b8" }}>{ann.content_ar}</p>}
            </article>
          ))}
          {announcements.length === 0 && <p className="text-center py-8 text-sm" style={{ color: "#94a3b8" }}>Aucune annonce pour le moment.</p>}
        </div>
      </div>
    </div>
  );
}
