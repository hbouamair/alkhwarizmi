"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { supabase, DbDocumentRequest } from "@/lib/supabase";
import { FileText, CheckCircle2, XCircle, Clock, Calendar, Search, Filter } from "lucide-react";

const typeLabels: Record<string, string> = { attestation_scolarite: "Attestation de Scolarité", releve_notes: "Relevé de Notes", certificat_depart: "Certificat de Départ" };
const statusLabels: Record<string, string> = { en_cours: "En attente", pret: "Approuvé", refuse: "Refusé" };
const statusStyles: Record<string, { bg: string; color: string; border: string }> = {
  en_cours: { bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
  pret: { bg: "#ecfdf5", color: "#047857", border: "#a7f3d0" },
  refuse: { bg: "#fef2f2", color: "#b91c1c", border: "#fecaca" },
};

export default function AdminDocumentsPage() {
  const { admin } = useAdminAuth();
  const [requests, setRequests] = useState<(DbDocumentRequest & { students?: { first_name: string; last_name: string; massar: string; classe: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchDocs = useCallback(async () => {
    const { data } = await supabase
      .from("document_requests")
      .select("*, students(first_name, last_name, massar, classe)")
      .order("created_at", { ascending: false });
    setRequests(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  const handleAction = async (id: string, status: "pret" | "refuse") => {
    if (!admin) return;
    setProcessing(id);
    await supabase.from("document_requests").update({
      status,
      admin_notes: adminNotes[id] || null,
      processed_by: admin.id,
      date_ready: status === "pret" ? new Date().toISOString() : null,
    }).eq("id", id);
    setProcessing(null);
    fetchDocs();
  };

  const filtered = requests.filter((r) => {
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    if (search) {
      const s = search.toLowerCase();
      return r.ref_code.toLowerCase().includes(s) || r.students?.first_name.toLowerCase().includes(s) || r.students?.last_name.toLowerCase().includes(s) || r.students?.massar.toLowerCase().includes(s);
    }
    return true;
  });

  const formatDate = (d: string) => new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" }).format(new Date(d));

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: "#d4a843", borderTopColor: "transparent" }} /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "#0f172a" }}>
          <FileText className="w-6 h-6" style={{ color: "#d4a843" }} />Gestion des Documents
        </h1>
        <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>Approuvez ou refusez les demandes des élèves.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#94a3b8" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher par nom, massar, réf..." className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm" style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", color: "#0f172a" }} />
        </div>
        <div className="flex gap-2">
          {["all", "en_cours", "pret", "refuse"].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)} className="px-3 py-2 text-xs font-semibold rounded-lg transition-all" style={{ backgroundColor: filterStatus === s ? "#0f172a" : "#ffffff", color: filterStatus === s ? "#ffffff" : "#64748b", border: "1px solid #e2e8f0" }}>
              {s === "all" ? "Tous" : statusLabels[s]}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 && <p className="text-center py-12 text-sm" style={{ color: "#94a3b8" }}>Aucune demande trouvée.</p>}
        {filtered.map((req) => {
          const s = statusStyles[req.status];
          return (
            <div key={req.id} className="rounded-2xl p-5 transition-all" style={{ backgroundColor: "#ffffff", border: `1px solid ${req.status === "en_cours" ? "#fde68a" : "#f1f5f9"}` }}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: "#f1f5f9", color: "#64748b" }}>{req.ref_code}</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full" style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                      {req.status === "en_cours" ? <Clock className="w-3 h-3" /> : req.status === "pret" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {statusLabels[req.status]}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#f3e8ff", color: "#7c3aed" }}>{typeLabels[req.type]}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <p className="text-sm font-semibold" style={{ color: "#0f172a" }}>
                      {req.students?.last_name?.toUpperCase()} {req.students?.first_name}
                    </p>
                    <span className="text-xs" style={{ color: "#94a3b8" }}>Massar: {req.students?.massar}</span>
                    <span className="text-xs" style={{ color: "#94a3b8" }}>Classe: {req.students?.classe}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs" style={{ color: "#94a3b8" }}>
                    <Calendar className="w-3 h-3" />Demandé le {formatDate(req.date_requested)}
                    {req.notes && <span className="ml-2">• Note: {req.notes}</span>}
                  </div>
                </div>

                {/* Actions */}
                {req.status === "en_cours" && (
                  <div className="flex flex-col gap-2 lg:w-64 flex-shrink-0">
                    <input
                      value={adminNotes[req.id] || ""}
                      onChange={(e) => setAdminNotes({ ...adminNotes, [req.id]: e.target.value })}
                      placeholder="Note admin (optionnel)..."
                      className="w-full px-3 py-2 text-xs rounded-lg"
                      style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(req.id, "pret")}
                        disabled={processing === req.id}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg disabled:opacity-50"
                        style={{ backgroundColor: "#ecfdf5", color: "#047857", border: "1px solid #a7f3d0" }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />Approuver
                      </button>
                      <button
                        onClick={() => handleAction(req.id, "refuse")}
                        disabled={processing === req.id}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg disabled:opacity-50"
                        style={{ backgroundColor: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}
                      >
                        <XCircle className="w-3.5 h-3.5" />Refuser
                      </button>
                    </div>
                  </div>
                )}

                {req.status !== "en_cours" && req.admin_notes && (
                  <p className="text-xs lg:w-48 flex-shrink-0" style={{ color: "#94a3b8" }}>Admin: {req.admin_notes}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
