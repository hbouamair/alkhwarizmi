import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Create a safe client that won't crash during build if env vars are missing
let _supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (_supabase) return _supabase;
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === "your_supabase_project_url") {
    // Return a dummy client during build / when env is not set
    // This prevents build failures
    _supabase = createClient("https://placeholder.supabase.co", "placeholder-key");
  } else {
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _supabase;
}

export const supabase = getSupabaseClient();

// ============================================================
// TypeScript types matching the database schema
// ============================================================

export interface DbStudent {
  id: string;
  massar: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  classe: string;
  niveau: string;
  created_at: string;
}

export interface DbAdmin {
  id: string;
  username: string;
  password: string;
  full_name: string;
  role: string;
  created_at: string;
}

export interface DbDocumentRequest {
  id: string;
  ref_code: string;
  student_id: string;
  type: "attestation_scolarite" | "releve_notes" | "certificat_depart";
  status: "en_cours" | "pret" | "refuse";
  date_requested: string;
  date_ready: string | null;
  notes: string | null;
  admin_notes: string | null;
  processed_by: string | null;
  created_at: string;
  students?: DbStudent;
}

export interface DbAbsence {
  id: string;
  student_id: string;
  matiere: string;
  mois: string;
  count: number;
  recorded_by: string | null;
  updated_at: string;
  students?: DbStudent;
}

export interface DbAnnouncement {
  id: string;
  title: string;
  title_ar: string | null;
  content: string;
  content_ar: string | null;
  date: string;
  category: "general" | "examen" | "orientation" | "activite" | "urgent";
  pinned: boolean;
  created_by: string | null;
  created_at: string;
}
