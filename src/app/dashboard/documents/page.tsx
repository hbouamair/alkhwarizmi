"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase, DbDocumentRequest } from "@/lib/supabase";
import { generateDocument } from "@/lib/generate-pdf";
import {
  FileText, Plus, Clock, CheckCircle2, XCircle, Calendar,
  Send, ChevronDown, AlertCircle, X, Download,
} from "lucide-react";

const typeLabels: Record<string, string> = {
  attestation_scolarite: "Attestation de Scolarité",
  releve_notes: "Relevé de Notes",
  certificat_depart: "Certificat de Départ",
};
const statusLabels: Record<string, string> = { en_cours: "En cours", pret: "Prêt", refuse: "Refusé" };
const statusStyles: Record<string, { bg: string; color: string; border: string }> = {
  en_cours: { bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
  pret: { bg: "#ecfdf5", color: "#047857", border: "#a7f3d0" },
  refuse: { bg: "#fef2f2", color: "#b91c1c", border: "#fecaca" },
};

export default function DocumentsPage() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [notes, setNotes] = useState("");
  const [requests, setRequests] = useState<DbDocumentRequest[]>([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [downloading, setDownloading] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("document_requests")
      .select("*")
      .eq("student_id", user.id)
      .order("created_at", { ascending: false });
    setRequests((data || []) as DbDocumentRequest[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;

    const refCode = `DOC-${String(Date.now()).slice(-6)}`;
    const { error } = await supabase.from("document_requests").insert({
      ref_code: refCode,
      student_id: user.id,
      type: selectedType,
      status: "en_cours",
      notes: notes || null,
    });

    if (!error) {
      setShowForm(false);
      setSelectedType("");
      setNotes("");
      setSuccessMsg("Votre demande a été soumise avec succès !");
      setTimeout(() => setSuccessMsg(""), 4000);
      fetchRequests();
    }
  };

  const handleDownload = async (req: DbDocumentRequest) => {
    if (!user || req.status !== "pret") return;
    setDownloading(req.id);
    try {
      const u = user as unknown as Record<string, string>;
      const pdfStudent = {
        id: user.id, massar: user.massar, firstName: u.first_name || u.firstName || "",
        lastName: u.last_name || u.lastName || "", email: user.email, password: "",
        classe: user.classe, niveau: user.niveau,
      };
      const pdfReq = {
        id: req.ref_code, studentId: user.id, type: req.type, status: req.status,
        dateRequested: req.date_requested, dateReady: req.date_ready || undefined,
        notes: req.notes || undefined,
      };
      await generateDocument(pdfStudent, pdfReq);
    } finally {
      setDownloading(null);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === "en_cours") return <Clock className="w-4 h-4" style={{ color: "#f59e0b" }} />;
    if (status === "pret") return <CheckCircle2 className="w-4 h-4" style={{ color: "#10b981" }} />;
    return <XCircle className="w-4 h-4" style={{ color: "#ef4444" }} />;
  };

  const getStatusBadge = (status: string) => {
    const s = statusStyles[status] || statusStyles.en_cours;
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full" style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
        {getStatusIcon(status)}{statusLabels[status]}
      </span>
    );
  };

  const formatDate = (dateStr: string) =>
    new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" }).format(new Date(dateStr));

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: "#0e7c47", borderTopColor: "transparent" }} /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "#0f172a" }}>
            <FileText className="w-6 h-6" style={{ color: "#0e7c47" }} />Documents Administratifs
          </h1>
          <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>Demandez vos attestations, relevés de notes et certificats.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-5 py-2.5 font-semibold text-sm rounded-xl shadow-lg transition-all" style={{ background: "linear-gradient(135deg, #0e7c47, #065f35)", color: "#ffffff" }}>
          <Plus className="w-4 h-4" /> Nouvelle Demande
        </button>
      </div>

      {/* Notifications en bas de page */}
      {successMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4">
          <div className="flex items-center gap-3 p-4 rounded-xl text-sm shadow-lg animate-slide-up" style={{ backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0", color: "#047857" }}>
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" /><span>{successMsg}</span>
          </div>
        </div>
      )}

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#ffffff", border: "1px solid #f1f5f9" }}>
        <div className="px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <h3 className="text-sm font-bold" style={{ color: "#0f172a" }}>Mes Demandes ({requests.length})</h3>
        </div>

        {requests.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-7 h-7 mx-auto mb-4" style={{ color: "#94a3b8" }} />
            <p className="text-sm" style={{ color: "#94a3b8" }}>Aucune demande pour le moment.</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: "rgba(248,250,252,0.8)" }}>
                    {["Réf.", "Type", "Date", "Statut", "Actions"].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider px-6 py-3" style={{ color: "#94a3b8" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req, idx) => (
                    <tr key={req.id} className="table-row-hover transition-colors" style={{ borderTop: idx > 0 ? "1px solid #f8fafc" : "none" }}>
                      <td className="px-6 py-4 text-sm font-mono" style={{ color: "#94a3b8" }}>{req.ref_code}</td>
                      <td className="px-6 py-4 text-sm font-medium" style={{ color: "#0f172a" }}>{typeLabels[req.type]}</td>
                      <td className="px-6 py-4"><span className="text-sm flex items-center gap-1.5" style={{ color: "#94a3b8" }}><Calendar className="w-3.5 h-3.5" />{formatDate(req.date_requested)}</span></td>
                      <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                      <td className="px-6 py-4">
                        {req.status === "pret" ? (
                          <button onClick={() => handleDownload(req)} disabled={downloading === req.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg disabled:opacity-60" style={{ background: "linear-gradient(135deg, #0e7c47, #065f35)", color: "#ffffff" }}>
                            {downloading === req.id ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Génération...</> : <><Download className="w-3.5 h-3.5" />Télécharger PDF</>}
                          </button>
                        ) : req.status === "refuse" ? (
                          <span className="text-xs" style={{ color: "#94a3b8" }}>{req.admin_notes || "Refusé"}</span>
                        ) : (
                          <span className="text-xs flex items-center gap-1" style={{ color: "#94a3b8" }}><Clock className="w-3 h-3" />En attente...</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden">
              {requests.map((req, idx) => (
                <div key={req.id} className="p-4 space-y-3" style={{ borderTop: idx > 0 ? "1px solid #f8fafc" : "none" }}>
                  <div className="flex items-center justify-between"><span className="text-xs font-mono" style={{ color: "#94a3b8" }}>{req.ref_code}</span>{getStatusBadge(req.status)}</div>
                  <p className="text-sm font-semibold" style={{ color: "#0f172a" }}>{typeLabels[req.type]}</p>
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: "#94a3b8" }}><Calendar className="w-3 h-3" />{formatDate(req.date_requested)}</div>
                  {req.status === "pret" && (
                    <button onClick={() => handleDownload(req)} disabled={downloading === req.id} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl disabled:opacity-60" style={{ background: "linear-gradient(135deg, #0e7c47, #065f35)", color: "#ffffff" }}>
                      {downloading === req.id ? "Génération..." : <><Download className="w-4 h-4" />Télécharger PDF</>}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="rounded-2xl p-5 flex gap-3" style={{ backgroundColor: "rgba(239,246,255,0.6)", border: "1px solid #bfdbfe" }}>
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#3b82f6" }} />
        <div className="text-sm" style={{ color: "#1e40af" }}>
          <p className="font-semibold mb-1">ℹ️ Information</p>
          <p style={{ color: "rgba(30,64,175,0.8)" }}>Les documents prêts peuvent être téléchargés en PDF. Délai moyen : <strong>3 à 5 jours ouvrables</strong>.</p>
        </div>
      </div>

      {/* ===== MODAL ===== */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} />
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl modal-animate" style={{ backgroundColor: "#ffffff" }} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 pb-4 rounded-t-2xl" style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #f1f5f9" }}>
              <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: "#0f172a" }}>
                <FileText className="w-5 h-5" style={{ color: "#0e7c47" }} />
                Nouvelle demande
              </h3>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{ backgroundColor: "#f1f5f9", color: "#64748b" }}><X className="w-4 h-4" /></button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#0f172a" }}>Type de document *</label>
                <div className="relative">
                  <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} required className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }}>
                    <option value="">— Sélectionner un document —</option>
                    <option value="attestation_scolarite">Attestation de Scolarité</option>
                    <option value="releve_notes">Relevé de Notes</option>
                    <option value="certificat_depart">Certificat de Départ</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#94a3b8" }} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#0f172a" }}>Remarques <span style={{ color: "#94a3b8", fontWeight: 400 }}>(optionnel)</span></label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Précisions sur votre demande..." className="w-full px-4 py-3 rounded-xl resize-none" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }} />
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-4" style={{ borderTop: "1px solid #f1f5f9" }}>
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm font-semibold rounded-xl" style={{ color: "#64748b", border: "1px solid #e2e8f0" }}>Annuler</button>
                <button type="submit" className="inline-flex items-center gap-2 px-6 py-2.5 font-semibold text-sm rounded-xl shadow-lg" style={{ background: "linear-gradient(135deg, #0e7c47, #065f35)", color: "#ffffff" }}>
                  <Send className="w-4 h-4" />Soumettre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
