"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { supabase, DbStudent, DbAbsence } from "@/lib/supabase";
import { CalendarCheck, Plus, Save, Search, ChevronDown, Users, X } from "lucide-react";

const SUBJECTS = ["Mathématiques", "Physique-Chimie", "SVT", "Français", "Anglais", "Arabe", "Philosophie", "Éducation Islamique", "Éducation Physique"];
const MONTHS = ["Septembre", "Octobre", "Novembre", "Décembre", "Janvier", "Février", "Mars", "Avril", "Mai", "Juin"];

export default function AdminAbsencesPage() {
  const { admin } = useAdminAuth();
  const [students, setStudents] = useState<DbStudent[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<DbStudent | null>(null);
  const [absences, setAbsences] = useState<DbAbsence[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0]);
  const [editValues, setEditValues] = useState<Record<string, number>>({});
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function fetchStudents() {
      const { data } = await supabase.from("students").select("*").order("last_name");
      setStudents((data || []) as DbStudent[]);
      setLoading(false);
    }
    fetchStudents();
  }, []);

  const fetchAbsences = useCallback(async (studentId: string) => {
    const { data } = await supabase.from("absences").select("*").eq("student_id", studentId);
    setAbsences((data || []) as DbAbsence[]);

    // Initialize edit values for current month
    const vals: Record<string, number> = {};
    SUBJECTS.forEach((subject) => {
      const existing = (data || []).find((a: DbAbsence) => a.matiere === subject && a.mois === selectedMonth);
      vals[subject] = existing?.count ?? 0;
    });
    setEditValues(vals);
  }, [selectedMonth]);

  useEffect(() => {
    if (selectedStudent) fetchAbsences(selectedStudent.id);
  }, [selectedStudent, fetchAbsences]);

  useEffect(() => {
    if (!selectedStudent || absences.length === 0) {
      const vals: Record<string, number> = {};
      SUBJECTS.forEach((s) => { vals[s] = 0; });
      setEditValues(vals);
      return;
    }
    const vals: Record<string, number> = {};
    SUBJECTS.forEach((subject) => {
      const existing = absences.find((a) => a.matiere === subject && a.mois === selectedMonth);
      vals[subject] = existing?.count ?? 0;
    });
    setEditValues(vals);
  }, [selectedMonth, absences, selectedStudent]);

  const handleSave = async () => {
    if (!selectedStudent || !admin) return;
    setSaving(true);

    for (const subject of SUBJECTS) {
      const count = editValues[subject] ?? 0;
      const existing = absences.find((a) => a.matiere === subject && a.mois === selectedMonth);

      if (existing) {
        await supabase.from("absences").update({ count, recorded_by: admin.id, updated_at: new Date().toISOString() }).eq("id", existing.id);
      } else if (count > 0) {
        await supabase.from("absences").insert({
          student_id: selectedStudent.id,
          matiere: subject,
          mois: selectedMonth,
          count,
          recorded_by: admin.id,
        });
      }
    }

    await fetchAbsences(selectedStudent.id);
    setSaving(false);
    setSuccessMsg("Absences enregistrées avec succès !");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const filteredStudents = students.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return s.first_name.toLowerCase().includes(q) || s.last_name.toLowerCase().includes(q) || s.massar.toLowerCase().includes(q) || s.classe.toLowerCase().includes(q);
  });

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: "#d4a843", borderTopColor: "transparent" }} /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "#0f172a" }}>
          <CalendarCheck className="w-6 h-6" style={{ color: "#d4a843" }} />Gestion des Absences
        </h1>
        <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>Sélectionnez un élève puis saisissez ses absences par matière et par mois.</p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-3 p-4 rounded-xl text-sm" style={{ backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0", color: "#047857" }}>
          <Save className="w-5 h-5" /><span>{successMsg}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Student List */}
        <div className="lg:col-span-1 rounded-2xl overflow-hidden" style={{ backgroundColor: "#ffffff", border: "1px solid #f1f5f9" }}>
          <div className="p-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4" style={{ color: "#d4a843" }} />
              <h3 className="text-sm font-bold" style={{ color: "#0f172a" }}>Élèves ({students.length})</h3>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#94a3b8" }} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Chercher..." className="w-full pl-9 pr-3 py-2 rounded-lg text-xs" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }} />
            </div>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {filteredStudents.map((student) => (
              <button
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                className="w-full text-left px-4 py-3 transition-all"
                style={{
                  backgroundColor: selectedStudent?.id === student.id ? "rgba(212,168,67,0.08)" : "transparent",
                  borderBottom: "1px solid #f8fafc",
                  borderLeft: selectedStudent?.id === student.id ? "3px solid #d4a843" : "3px solid transparent",
                }}
              >
                <p className="text-sm font-medium" style={{ color: "#0f172a" }}>{student.last_name.toUpperCase()} {student.first_name}</p>
                <p className="text-xs" style={{ color: "#94a3b8" }}>{student.massar} — {student.classe}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Absence Editor */}
        <div className="lg:col-span-2">
          {!selectedStudent ? (
            <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: "#ffffff", border: "1px solid #f1f5f9" }}>
              <CalendarCheck className="w-12 h-12 mx-auto mb-4" style={{ color: "#cbd5e1" }} />
              <p className="font-medium" style={{ color: "#94a3b8" }}>Sélectionnez un élève pour gérer ses absences</p>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#ffffff", border: "1px solid #f1f5f9" }}>
              {/* Header */}
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: "rgba(248,250,252,0.5)" }}>
                <div>
                  <p className="text-base font-bold" style={{ color: "#0f172a" }}>
                    {selectedStudent.last_name.toUpperCase()} {selectedStudent.first_name}
                  </p>
                  <p className="text-xs" style={{ color: "#94a3b8" }}>{selectedStudent.massar} — {selectedStudent.classe}</p>
                </div>
                <div className="relative">
                  <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="appearance-none pl-3 pr-8 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", color: "#0f172a" }}>
                    {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#94a3b8" }} />
                </div>
              </div>

              {/* Grid */}
              <div className="p-5 space-y-3">
                {SUBJECTS.map((subject) => (
                  <div key={subject} className="flex items-center justify-between gap-4 py-2" style={{ borderBottom: "1px solid #f8fafc" }}>
                    <span className="text-sm font-medium flex-1" style={{ color: "#0f172a" }}>{subject}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditValues({ ...editValues, [subject]: Math.max(0, (editValues[subject] || 0) - 1) })}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all"
                        style={{ backgroundColor: "#f1f5f9", color: "#64748b" }}
                      >
                        −
                      </button>
                      <span
                        className="w-10 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                        style={{
                          backgroundColor: (editValues[subject] || 0) === 0 ? "#ecfdf5" : (editValues[subject] || 0) <= 2 ? "#fffbeb" : "#fef2f2",
                          color: (editValues[subject] || 0) === 0 ? "#10b981" : (editValues[subject] || 0) <= 2 ? "#d97706" : "#dc2626",
                        }}
                      >
                        {editValues[subject] || 0}
                      </span>
                      <button
                        onClick={() => setEditValues({ ...editValues, [subject]: (editValues[subject] || 0) + 1 })}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all"
                        style={{ backgroundColor: "#f1f5f9", color: "#64748b" }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Save Button */}
              <div className="p-5" style={{ borderTop: "1px solid #f1f5f9" }}>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 font-semibold text-sm rounded-xl shadow-lg disabled:opacity-50 transition-all"
                  style={{ background: "linear-gradient(135deg, #d4a843, #b8902e)", color: "#ffffff", boxShadow: "0 4px 15px rgba(212,168,67,0.3)" }}
                >
                  {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Enregistrement...</> : <><Save className="w-4 h-4" />Enregistrer les absences</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
