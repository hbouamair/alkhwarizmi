"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase, DbStudent } from "@/lib/supabase";
import { UserPlus, Edit3, Trash2, Search, Save, X, Users, GraduationCap, AlertCircle, Eye, EyeOff, BookOpen } from "lucide-react";

const CLASSES = [
  "TC-S-1", "TC-S-2", "TC-S-3", "TC-L-1", "TC-L-2",
  "1BAC-SE-1", "1BAC-SE-2", "1BAC-SL-1", "1BAC-SL-2",
  "2BAC-SVT-1", "2BAC-SVT-2", "2BAC-PC-1", "2BAC-SM-1", "2BAC-SL-1",
];

function getNiveauFromClasse(classe: string): string {
  if (classe.startsWith("TC-S")) return "Tronc Commun Scientifique";
  if (classe.startsWith("TC-L")) return "Tronc Commun Littéraire";
  if (classe.startsWith("1BAC-SE")) return "1ère Bac Sciences Expérimentales";
  if (classe.startsWith("1BAC-SL")) return "1ère Bac Sciences Littéraires";
  if (classe.startsWith("2BAC-SVT")) return "2ème Bac Sciences de la Vie et de la Terre";
  if (classe.startsWith("2BAC-PC")) return "2ème Bac Physique-Chimie";
  if (classe.startsWith("2BAC-SM")) return "2ème Bac Sciences Mathématiques";
  if (classe.startsWith("2BAC-SL")) return "2ème Bac Sciences Littéraires";
  return classe;
}

const emptyForm = { massar: "", first_name: "", last_name: "", email: "", password: "", classe: CLASSES[0] };

export default function AdminElevesPage() {
  const [students, setStudents] = useState<DbStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterClasse, setFilterClasse] = useState("all");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPw, setShowPw] = useState(false);

  const fetchStudents = useCallback(async () => {
    const { data } = await supabase.from("students").select("*").order("last_name");
    setStudents((data || []) as DbStudent[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const openNew = () => { setEditingId(null); setForm(emptyForm); setErrorMsg(""); setShowPw(false); setShowModal(true); };
  const openEdit = (s: DbStudent) => {
    setEditingId(s.id);
    setForm({ massar: s.massar, first_name: s.first_name, last_name: s.last_name, email: s.email, password: s.password, classe: s.classe });
    setErrorMsg(""); setShowPw(false); setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditingId(null); setErrorMsg(""); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setErrorMsg(""); setSuccessMsg("");
    const niveau = getNiveauFromClasse(form.classe);
    const payload = { ...form, niveau };

    if (editingId) {
      const { error } = await supabase.from("students").update(payload).eq("id", editingId);
      if (error) { 
        setErrorMsg(error.message); 
        setSaving(false); 
        setTimeout(() => setErrorMsg(""), 5000);
        return; 
      }
      setSuccessMsg("Élève modifié !");
      setSaving(false); closeModal(); fetchStudents();
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      const { error } = await supabase.from("students").insert(payload);
      if (error) {
        setErrorMsg(error.message.includes("duplicate") ? "Ce code Massar ou email existe déjà." : error.message);
        setSaving(false);
        setTimeout(() => setErrorMsg(""), 5000);
        return;
      }
      setSuccessMsg("Élève inscrit !");
      setSaving(false); closeModal(); fetchStudents();
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer l'élève ${name} ? Ses demandes et absences seront aussi supprimées.`)) return;
    setDeleting(id);
    await supabase.from("students").delete().eq("id", id);
    setDeleting(null); fetchStudents();
    setSuccessMsg("Élève supprimé."); setTimeout(() => setSuccessMsg(""), 3000);
  };

  const filtered = students.filter((s) => {
    if (filterClasse !== "all" && s.classe !== filterClasse) return false;
    if (search) {
      const q = search.toLowerCase();
      return s.first_name.toLowerCase().includes(q) || s.last_name.toLowerCase().includes(q) || s.massar.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    }
    return true;
  });

  const uniqueClasses = [...new Set(students.map((s) => s.classe))].sort();

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: "#d4a843", borderTopColor: "transparent" }} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "#0f172a" }}>
            <UserPlus className="w-6 h-6" style={{ color: "#d4a843" }} />Inscription des Élèves
          </h1>
          <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>Gérez les inscriptions. <strong>{students.length}</strong> élèves inscrits.</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-5 py-2.5 font-semibold text-sm rounded-xl shadow-lg transition-all" style={{ background: "linear-gradient(135deg, #d4a843, #b8902e)", color: "#ffffff" }}>
          <UserPlus className="w-4 h-4" />Inscrire un élève
        </button>
      </div>

      {/* Notifications en bas de page */}
      {(successMsg || errorMsg) && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4">
          {successMsg && (
            <div className="flex items-center gap-3 p-4 rounded-xl text-sm shadow-lg animate-slide-up" style={{ backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0", color: "#047857" }}>
              <AlertCircle className="w-5 h-5 flex-shrink-0" /><span>{successMsg}</span>
            </div>
          )}
          {errorMsg && !successMsg && (
            <div className="flex items-center gap-3 p-4 rounded-xl text-sm shadow-lg animate-slide-up" style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c" }}>
              <AlertCircle className="w-5 h-5 flex-shrink-0" /><span>{errorMsg}</span>
            </div>
          )}
        </div>
      )}

      {/* Class Selector - Prominent */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: "#ffffff", border: "1px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#eff6ff" }}>
            <BookOpen className="w-5 h-5" style={{ color: "#2563eb" }} />
          </div>
          <div>
            <h3 className="text-base font-bold" style={{ color: "#0f172a" }}>Sélectionner une classe</h3>
            <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>Choisissez une classe pour voir la liste des élèves</p>
          </div>
        </div>
        <div className="relative">
          <select 
            value={filterClasse} 
            onChange={(e) => { setFilterClasse(e.target.value); setSearch(""); }} 
            className="w-full px-4 py-3.5 rounded-xl text-sm font-semibold appearance-none pr-10" 
            style={{ backgroundColor: filterClasse === "all" ? "#f8fafc" : "#eff6ff", border: `2px solid ${filterClasse === "all" ? "#e2e8f0" : "#3b82f6"}`, color: "#0f172a" }}
          >
            <option value="all">— Sélectionner une classe —</option>
            {CLASSES.map((c) => (
              <option key={c} value={c}>{c} - {getNiveauFromClasse(c)}</option>
            ))}
          </select>
          <BookOpen className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: filterClasse === "all" ? "#94a3b8" : "#2563eb" }} />
        </div>
      </div>

      {/* Search Filter - Only show when class is selected */}
      {filterClasse !== "all" && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#94a3b8" }} />
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder={`Rechercher dans ${filterClasse}...`} 
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm" 
            style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", color: "#0f172a" }} 
          />
        </div>
      )}

      {/* Students Table */}
      {filterClasse === "all" ? (
        <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: "#ffffff", border: "1px solid #f1f5f9" }}>
          <BookOpen className="w-12 h-12 mx-auto mb-4" style={{ color: "#cbd5e1" }} />
          <p className="text-base font-semibold mb-1" style={{ color: "#0f172a" }}>Sélectionnez une classe</p>
          <p className="text-sm" style={{ color: "#94a3b8" }}>Choisissez une classe ci-dessus pour voir la liste des élèves</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#ffffff", border: "1px solid #f1f5f9" }}>
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" style={{ color: "#d4a843" }} />
              <h3 className="text-sm font-bold" style={{ color: "#0f172a" }}>
                {filterClasse} — {filtered.length} élève{filtered.length !== 1 ? "s" : ""}
              </h3>
            </div>
          </div>
          {filtered.length === 0 ? (
            <div className="p-12 text-center"><GraduationCap className="w-10 h-10 mx-auto mb-3" style={{ color: "#cbd5e1" }} /><p className="text-sm" style={{ color: "#94a3b8" }}>Aucun élève trouvé dans cette classe.</p></div>
          ) : (
          <>
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: "rgba(248,250,252,0.8)" }}>
                    {["Massar", "Nom & Prénom", "Classe", "Email", "Actions"].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider px-6 py-3" style={{ color: "#94a3b8" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, idx) => (
                    <tr key={s.id} className="table-row-hover transition-colors" style={{ borderTop: idx > 0 ? "1px solid #f8fafc" : "none" }}>
                      <td className="px-6 py-3.5 text-sm font-mono" style={{ color: "#64748b" }}>{s.massar}</td>
                      <td className="px-6 py-3.5"><p className="text-sm font-semibold" style={{ color: "#0f172a" }}>{s.last_name.toUpperCase()} {s.first_name}</p></td>
                      <td className="px-6 py-3.5"><span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: "#f1f5f9", color: "#475569" }}>{s.classe}</span></td>
                      <td className="px-6 py-3.5 text-sm" style={{ color: "#94a3b8" }}>{s.email}</td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(s)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#eff6ff", color: "#2563eb" }}><Edit3 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(s.id, `${s.last_name} ${s.first_name}`)} disabled={deleting === s.id} className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-50" style={{ backgroundColor: "#fef2f2", color: "#dc2626" }}><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="lg:hidden">
              {filtered.map((s, idx) => (
                <div key={s.id} className="p-4 space-y-2" style={{ borderTop: idx > 0 ? "1px solid #f8fafc" : "none" }}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold" style={{ color: "#0f172a" }}>{s.last_name.toUpperCase()} {s.first_name}</p>
                    <div className="flex gap-1.5">
                      <button onClick={() => openEdit(s)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#eff6ff", color: "#2563eb" }}><Edit3 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(s.id, `${s.last_name} ${s.first_name}`)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#fef2f2", color: "#dc2626" }}><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: "#94a3b8" }}>
                    <span className="font-mono">{s.massar}</span>
                    <span className="font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#f1f5f9", color: "#475569" }}>{s.classe}</span>
                    <span>{s.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
          )}
        </div>
      )}

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={closeModal}>
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} />
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl modal-animate" style={{ backgroundColor: "#ffffff" }} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 pb-4 rounded-t-2xl" style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #f1f5f9" }}>
              <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: "#0f172a" }}>
                <GraduationCap className="w-5 h-5" style={{ color: "#d4a843" }} />
                {editingId ? "Modifier l'élève" : "Inscrire un élève"}
              </h3>
              <button onClick={closeModal} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{ backgroundColor: "#f1f5f9", color: "#64748b" }}><X className="w-4 h-4" /></button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMsg && (
                <div className="flex items-center gap-3 p-3 rounded-xl text-sm" style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c" }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0" /><span>{errorMsg}</span>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#0f172a" }}>Code Massar *</label>
                  <input value={form.massar} onChange={(e) => setForm({ ...form, massar: e.target.value.toUpperCase() })} required placeholder="G132456789" className="w-full px-4 py-2.5 rounded-xl text-sm" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#0f172a" }}>Classe *</label>
                  <select value={form.classe} onChange={(e) => setForm({ ...form, classe: e.target.value })} className="w-full px-4 py-2.5 rounded-xl text-sm appearance-none" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }}>
                    {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#0f172a" }}>Nom *</label>
                  <input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} required placeholder="El Amrani" className="w-full px-4 py-2.5 rounded-xl text-sm" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#0f172a" }}>Prénom *</label>
                  <input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} required placeholder="Youssef" className="w-full px-4 py-2.5 rounded-xl text-sm" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#0f172a" }}>Email *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="youssef@lycee.ma" className="w-full px-4 py-2.5 rounded-xl text-sm" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#0f172a" }}>Mot de passe *</label>
                  <div className="relative">
                    <input type={showPw ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required placeholder="••••••" className="w-full px-4 pr-10 py-2.5 rounded-xl text-sm" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }} />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#94a3b8" }}>
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl text-xs" style={{ backgroundColor: "#f8fafc", border: "1px solid #f1f5f9", color: "#64748b" }}>
                <strong>Niveau auto-détecté :</strong> {getNiveauFromClasse(form.classe)}
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-4" style={{ borderTop: "1px solid #f1f5f9" }}>
                <button type="button" onClick={closeModal} className="px-5 py-2.5 text-sm font-semibold rounded-xl" style={{ color: "#64748b", border: "1px solid #e2e8f0" }}>Annuler</button>
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 font-semibold text-sm rounded-xl shadow-lg disabled:opacity-50" style={{ background: "linear-gradient(135deg, #d4a843, #b8902e)", color: "#ffffff" }}>
                  {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Enregistrement...</> : <><Save className="w-4 h-4" />{editingId ? "Modifier" : "Inscrire"}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
