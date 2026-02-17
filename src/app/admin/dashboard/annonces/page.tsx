"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { supabase, DbAnnouncement } from "@/lib/supabase";
import { Megaphone, Plus, Edit3, Trash2, Pin, PinOff, Save, X, Calendar, AlertCircle } from "lucide-react";

const CATEGORIES = [
  { value: "general", label: "Général", bg: "#dbeafe", color: "#1d4ed8" },
  { value: "examen", label: "Examens", bg: "#fef3c7", color: "#b45309" },
  { value: "orientation", label: "Orientation", bg: "#f3e8ff", color: "#7c3aed" },
  { value: "activite", label: "Activités", bg: "#d1fae5", color: "#047857" },
  { value: "urgent", label: "Urgent", bg: "#fee2e2", color: "#dc2626" },
];

const emptyForm = { title: "", title_ar: "", content: "", content_ar: "", category: "general", pinned: false };

export default function AdminAnnoncesPage() {
  const { admin } = useAdminAuth();
  const [announcements, setAnnouncements] = useState<DbAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchAnnouncements = useCallback(async () => {
    const { data } = await supabase.from("announcements").select("*").order("pinned", { ascending: false }).order("date", { ascending: false });
    setAnnouncements((data || []) as DbAnnouncement[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAnnouncements(); }, [fetchAnnouncements]);

  const openNew = () => { setEditingId(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (ann: DbAnnouncement) => {
    setEditingId(ann.id);
    setForm({ title: ann.title, title_ar: ann.title_ar || "", content: ann.content, content_ar: ann.content_ar || "", category: ann.category, pinned: ann.pinned });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditingId(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admin) return;
    setSaving(true);
    const payload = { title: form.title, title_ar: form.title_ar || null, content: form.content, content_ar: form.content_ar || null, category: form.category, pinned: form.pinned, created_by: admin.id };
    if (editingId) {
      await supabase.from("announcements").update(payload).eq("id", editingId);
      setSuccessMsg("Annonce modifiée !");
    } else {
      await supabase.from("announcements").insert({ ...payload, date: new Date().toISOString().split("T")[0] });
      setSuccessMsg("Annonce publiée !");
    }
    setSaving(false); closeModal(); fetchAnnouncements();
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette annonce ?")) return;
    setDeleting(id);
    await supabase.from("announcements").delete().eq("id", id);
    setDeleting(null); fetchAnnouncements();
    setSuccessMsg("Annonce supprimée."); setTimeout(() => setSuccessMsg(""), 3000);
  };

  const togglePin = async (ann: DbAnnouncement) => {
    await supabase.from("announcements").update({ pinned: !ann.pinned }).eq("id", ann.id);
    fetchAnnouncements();
  };

  const formatDate = (d: string) => new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(d));
  const getCat = (cat: string) => CATEGORIES.find((c) => c.value === cat) || CATEGORIES[0];

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: "#d4a843", borderTopColor: "transparent" }} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "#0f172a" }}>
            <Megaphone className="w-6 h-6" style={{ color: "#d4a843" }} />Gestion des Annonces
          </h1>
          <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>Publiez et gérez les actualités du lycée.</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-5 py-2.5 font-semibold text-sm rounded-xl shadow-lg transition-all" style={{ background: "linear-gradient(135deg, #d4a843, #b8902e)", color: "#ffffff" }}>
          <Plus className="w-4 h-4" />Nouvelle Annonce
        </button>
      </div>

      {/* Notifications en bas de page */}
      {successMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4">
          <div className="flex items-center gap-3 p-4 rounded-xl text-sm shadow-lg animate-slide-up" style={{ backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0", color: "#047857" }}>
            <AlertCircle className="w-5 h-5 flex-shrink-0" /><span>{successMsg}</span>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {announcements.length === 0 && <p className="text-center py-12 text-sm" style={{ color: "#94a3b8" }}>Aucune annonce publiée.</p>}
        {announcements.map((ann) => {
          const cat = getCat(ann.category);
          return (
            <div key={ann.id} className="rounded-2xl p-5 transition-all" style={{ backgroundColor: "#ffffff", border: ann.pinned ? "1px solid rgba(14,124,71,0.2)" : "1px solid #f1f5f9" }}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {ann.pinned && <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full" style={{ backgroundColor: "rgba(14,124,71,0.1)", color: "#0e7c47" }}><Pin className="w-3 h-3" />Épinglé</span>}
                    <span className="inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-full" style={{ backgroundColor: cat.bg, color: cat.color }}>{cat.label}</span>
                    <span className="text-xs flex items-center gap-1" style={{ color: "#94a3b8" }}><Calendar className="w-3 h-3" />{formatDate(ann.date)}</span>
                  </div>
                  <h3 className="text-base font-bold" style={{ color: "#0f172a" }}>{ann.title}</h3>
                  {ann.title_ar && <p className="text-sm font-medium" dir="rtl" style={{ color: "#64748b" }}>{ann.title_ar}</p>}
                  <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "#64748b" }}>{ann.content}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => togglePin(ann)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{ backgroundColor: ann.pinned ? "rgba(14,124,71,0.1)" : "#f8fafc", color: ann.pinned ? "#0e7c47" : "#94a3b8" }}>{ann.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}</button>
                  <button onClick={() => openEdit(ann)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{ backgroundColor: "#eff6ff", color: "#2563eb" }}><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(ann.id)} disabled={deleting === ann.id} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-50" style={{ backgroundColor: "#fef2f2", color: "#dc2626" }}><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={closeModal}>
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl modal-animate" style={{ backgroundColor: "#ffffff" }} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 pb-4 rounded-t-2xl" style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #f1f5f9" }}>
              <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: "#0f172a" }}>
                <Megaphone className="w-5 h-5" style={{ color: "#d4a843" }} />
                {editingId ? "Modifier l'annonce" : "Nouvelle annonce"}
              </h3>
              <button onClick={closeModal} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{ backgroundColor: "#f1f5f9", color: "#64748b" }}><X className="w-4 h-4" /></button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#0f172a" }}>Titre (Français) *</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full px-4 py-2.5 rounded-xl text-sm" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }} placeholder="Titre de l'annonce..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#0f172a" }}>العنوان (عربية)</label>
                  <input value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} dir="rtl" className="w-full px-4 py-2.5 rounded-xl text-sm" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }} placeholder="...عنوان الإعلان" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#0f172a" }}>Contenu (Français) *</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required rows={3} className="w-full px-4 py-2.5 rounded-xl text-sm resize-none" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }} placeholder="Contenu de l'annonce..." />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#0f172a" }}>المحتوى (عربية)</label>
                <textarea value={form.content_ar} onChange={(e) => setForm({ ...form, content_ar: e.target.value })} rows={3} dir="rtl" className="w-full px-4 py-2.5 rounded-xl text-sm resize-none" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }} placeholder="...محتوى الإعلان" />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1" style={{ color: "#0f172a" }}>Catégorie</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button key={cat.value} type="button" onClick={() => setForm({ ...form, category: cat.value })} className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all" style={{ backgroundColor: form.category === cat.value ? cat.bg : "#f8fafc", color: form.category === cat.value ? cat.color : "#94a3b8", border: `1px solid ${form.category === cat.value ? cat.color + "40" : "#e2e8f0"}` }}>
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#0f172a" }}>Options</label>
                  <button type="button" onClick={() => setForm({ ...form, pinned: !form.pinned })} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all" style={{ backgroundColor: form.pinned ? "rgba(14,124,71,0.1)" : "#f8fafc", color: form.pinned ? "#0e7c47" : "#94a3b8", border: `1px solid ${form.pinned ? "rgba(14,124,71,0.3)" : "#e2e8f0"}` }}>
                    {form.pinned ? <Pin className="w-3.5 h-3.5" /> : <PinOff className="w-3.5 h-3.5" />}
                    {form.pinned ? "Épinglée" : "Non épinglée"}
                  </button>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-4" style={{ borderTop: "1px solid #f1f5f9" }}>
                <button type="button" onClick={closeModal} className="px-5 py-2.5 text-sm font-semibold rounded-xl" style={{ color: "#64748b", border: "1px solid #e2e8f0" }}>Annuler</button>
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 font-semibold text-sm rounded-xl shadow-lg disabled:opacity-50" style={{ background: "linear-gradient(135deg, #d4a843, #b8902e)", color: "#ffffff" }}>
                  {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Enregistrement...</> : <><Save className="w-4 h-4" />{editingId ? "Modifier" : "Publier"}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
