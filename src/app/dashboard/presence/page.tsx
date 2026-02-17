"use client";

import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase, DbAbsence } from "@/lib/supabase";
import { CalendarCheck, ChevronDown, AlertTriangle, CheckCircle2, BarChart3, TrendingDown, Info } from "lucide-react";

const MONTHS = ["Septembre", "Octobre", "Novembre", "Décembre", "Janvier", "Février"];

export default function PresencePage() {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [absences, setAbsences] = useState<DbAbsence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function fetch() {
      const { data } = await supabase.from("absences").select("*").eq("student_id", user!.id);
      setAbsences((data || []) as DbAbsence[]);
      setLoading(false);
    }
    fetch();
  }, [user]);

  if (!user) return null;

  const subjects = useMemo(() => [...new Set(absences.map((a) => a.matiere))], [absences]);
  const filtered = useMemo(() => selectedMonth === "all" ? absences : absences.filter((a) => a.mois === selectedMonth), [absences, selectedMonth]);
  const subjectSummary = useMemo(() => subjects.map((s) => ({ subject: s, total: filtered.filter((a) => a.matiere === s).reduce((sum, a) => sum + a.count, 0) })), [subjects, filtered]);
  const monthSummary = useMemo(() => MONTHS.map((m) => ({ month: m, total: absences.filter((a) => a.mois === m).reduce((sum, a) => sum + a.count, 0) })), [absences]);
  const totalAbsences = subjectSummary.reduce((sum, s) => sum + s.total, 0);
  const maxMonthly = Math.max(...monthSummary.map((m) => m.total), 1);

  const getCellStyle = (c: number) => c === 0 ? { backgroundColor: "#ecfdf5", color: "#10b981" } : c <= 1 ? { backgroundColor: "#fffbeb", color: "#d97706" } : { backgroundColor: "#fef2f2", color: "#dc2626" };
  const getBadgeStyle = (t: number) => t === 0 ? { backgroundColor: "#d1fae5", color: "#047857" } : t <= 2 ? { backgroundColor: "#fef3c7", color: "#b45309" } : { backgroundColor: "#fee2e2", color: "#dc2626" };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: "#0e7c47", borderTopColor: "transparent" }} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "#0f172a" }}><CalendarCheck className="w-6 h-6" style={{ color: "#0e7c47" }} />Suivi des Présences</h1>
          <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>Consultez vos absences par mois et par matière.</p>
        </div>
        <div className="relative">
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="appearance-none pl-4 pr-10 py-2.5 rounded-xl text-sm font-medium cursor-pointer" style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", color: "#0f172a" }}>
            <option value="all">Tous les mois</option>
            {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#94a3b8" }} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[{ icon: TrendingDown, bg: "#fef2f2", ic: "#ef4444", val: totalAbsences, label: selectedMonth === "all" ? "Absences totales" : `Absences en ${selectedMonth}` },
          { icon: AlertTriangle, bg: "#fffbeb", ic: "#f59e0b", val: subjectSummary.filter((s) => s.total > 0).length, label: "Matières concernées" },
          { icon: CheckCircle2, bg: "#ecfdf5", ic: "#10b981", val: subjectSummary.filter((s) => s.total === 0).length, label: "Matières sans absence" }
        ].map((c) => (
          <div key={c.label} className="stat-card rounded-2xl p-5" style={{ backgroundColor: "#ffffff", border: "1px solid #f1f5f9" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: c.bg }}><c.icon className="w-5 h-5" style={{ color: c.ic }} /></div>
              <div><p className="text-2xl font-bold" style={{ color: "#0f172a" }}>{c.val}</p><p className="text-xs" style={{ color: "#94a3b8" }}>{c.label}</p></div>
            </div>
          </div>
        ))}
      </div>

      {selectedMonth === "all" && (
        <div className="rounded-2xl p-6" style={{ backgroundColor: "#ffffff", border: "1px solid #f1f5f9" }}>
          <div className="flex items-center gap-2 mb-5"><BarChart3 className="w-5 h-5" style={{ color: "#0e7c47" }} /><h3 className="text-sm font-bold" style={{ color: "#0f172a" }}>Absences par mois</h3></div>
          <div className="space-y-3">
            {monthSummary.map((item) => (
              <div key={item.month} className="flex items-center gap-4">
                <span className="text-sm w-24 text-right flex-shrink-0" style={{ color: "#64748b" }}>{item.month}</span>
                <div className="flex-1 h-8 rounded-lg overflow-hidden relative" style={{ backgroundColor: "#f8fafc" }}>
                  <div className="h-full rounded-lg transition-all duration-500" style={{ backgroundColor: item.total === 0 ? "#d1fae5" : item.total <= 2 ? "#fde68a" : "#fca5a5", width: `${Math.max((item.total / maxMonthly) * 100, item.total > 0 ? 8 : 2)}%` }} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold" style={{ color: "#475569" }}>{item.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#ffffff", border: "1px solid #f1f5f9" }}>
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <h3 className="text-sm font-bold" style={{ color: "#0f172a" }}>Détail par Matière</h3>
          <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: "#f1f5f9", color: "#94a3b8" }}>{selectedMonth === "all" ? "Année" : selectedMonth}</span>
        </div>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "rgba(248,250,252,0.8)" }}>
                <th className="text-left text-xs font-semibold uppercase tracking-wider px-6 py-3" style={{ color: "#94a3b8" }}>Matière</th>
                {selectedMonth === "all" ? MONTHS.map((m) => <th key={m} className="text-center text-xs font-semibold uppercase tracking-wider px-3 py-3" style={{ color: "#94a3b8" }}>{m.substring(0, 3)}</th>) : <th className="text-center text-xs font-semibold uppercase tracking-wider px-6 py-3" style={{ color: "#94a3b8" }}>Absences</th>}
                <th className="text-center text-xs font-semibold uppercase tracking-wider px-6 py-3" style={{ color: "#94a3b8" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, idx) => {
                const total = filtered.filter((a) => a.matiere === subject).reduce((s, a) => s + a.count, 0);
                return (
                  <tr key={subject} className="table-row-hover" style={{ borderTop: idx > 0 ? "1px solid #f8fafc" : "none" }}>
                    <td className="px-6 py-3.5 text-sm font-medium" style={{ color: "#0f172a" }}>{subject}</td>
                    {selectedMonth === "all" ? MONTHS.map((month) => {
                      const c = absences.find((a) => a.matiere === subject && a.mois === month)?.count ?? 0;
                      return <td key={month} className="text-center px-3 py-3.5"><span className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold" style={getCellStyle(c)}>{c}</span></td>;
                    }) : <td className="text-center px-6 py-3.5"><span className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold" style={getCellStyle(total)}>{total}</span></td>}
                    <td className="text-center px-6 py-3.5"><span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-full text-xs font-bold" style={getBadgeStyle(total)}>{total}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="md:hidden">
          {subjectSummary.map((item, idx) => (
            <div key={item.subject} className="flex items-center justify-between p-4" style={{ borderTop: idx > 0 ? "1px solid #f8fafc" : "none" }}>
              <span className="text-sm font-medium" style={{ color: "#0f172a" }}>{item.subject}</span>
              <span className="inline-flex items-center justify-center min-w-[2rem] px-2.5 py-1 rounded-full text-xs font-bold" style={getBadgeStyle(item.total)}>{item.total}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl p-5 flex gap-3" style={{ backgroundColor: "rgba(239,246,255,0.6)", border: "1px solid #bfdbfe" }}>
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#3b82f6" }} />
        <div className="text-sm" style={{ color: "#1e40af" }}>
          <p className="font-semibold mb-2">Légende</p>
          <div className="flex flex-wrap gap-4 text-xs" style={{ color: "rgba(30,64,175,0.8)" }}>
            <div className="flex items-center gap-1.5"><span className="w-4 h-4 rounded inline-block" style={{ backgroundColor: "#d1fae5" }} /><span>0 absence</span></div>
            <div className="flex items-center gap-1.5"><span className="w-4 h-4 rounded inline-block" style={{ backgroundColor: "#fef3c7" }} /><span>1-2 absences</span></div>
            <div className="flex items-center gap-1.5"><span className="w-4 h-4 rounded inline-block" style={{ backgroundColor: "#fee2e2" }} /><span>3+ absences</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
