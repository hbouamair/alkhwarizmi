-- ============================================================
-- Lycée Alkhwarizmi - Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor
-- ============================================================

-- 1. Students table
CREATE TABLE students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  massar VARCHAR(20) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  password VARCHAR(200) NOT NULL,
  classe VARCHAR(50) NOT NULL,
  niveau VARCHAR(200) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Admins table
CREATE TABLE admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(200) NOT NULL,
  full_name VARCHAR(200) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Document Requests table
CREATE TABLE document_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ref_code VARCHAR(20) UNIQUE NOT NULL,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('attestation_scolarite', 'releve_notes', 'certificat_depart')),
  status VARCHAR(20) DEFAULT 'en_cours' CHECK (status IN ('en_cours', 'pret', 'refuse')),
  date_requested TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date_ready TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  admin_notes TEXT,
  processed_by UUID REFERENCES admins(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Absences table
CREATE TABLE absences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  matiere VARCHAR(100) NOT NULL,
  mois VARCHAR(30) NOT NULL,
  count INTEGER DEFAULT 0,
  recorded_by UUID REFERENCES admins(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, matiere, mois)
);

-- 5. Announcements table
CREATE TABLE announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(300) NOT NULL,
  title_ar VARCHAR(300),
  content TEXT NOT NULL,
  content_ar TEXT,
  date DATE DEFAULT CURRENT_DATE,
  category VARCHAR(30) DEFAULT 'general' CHECK (category IN ('general', 'examen', 'orientation', 'activite', 'urgent')),
  pinned BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES admins(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- Enable Row Level Security (RLS)
-- ============================================================
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE absences ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for now (simple auth via app logic)
CREATE POLICY "Allow all" ON students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON admins FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON document_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON absences FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON announcements FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- Seed Data
-- ============================================================

-- Insert demo students
INSERT INTO students (massar, first_name, last_name, email, password, classe, niveau) VALUES
('G132456789', 'Youssef', 'El Amrani', 'youssef.amrani@lycee.ma', '123456', '2BAC-SVT-1', '2ème Bac Sciences de la Vie et de la Terre'),
('G987654321', 'Fatima', 'Benali', 'fatima.benali@lycee.ma', '123456', '1BAC-SE-2', '1ère Bac Sciences Expérimentales'),
('G112233445', 'Ahmed', 'Moussa', 'ahmed.moussa@lycee.ma', '123456', 'TC-S-3', 'Tronc Commun Scientifique');

-- Insert demo admin
INSERT INTO admins (username, password, full_name, role) VALUES
('admin', 'admin123', 'Administrateur Principal', 'admin'),
('directeur', 'dir2026', 'M. El Fassi', 'directeur');

-- Insert demo announcements
INSERT INTO announcements (title, title_ar, content, content_ar, date, category, pinned) VALUES
('Examens du 2ème Semestre', 'امتحانات الدورة الثانية', 'Les examens du deuxième semestre débuteront le 15 mars 2026.', 'ستنطلق امتحانات الدورة الثانية يوم 15 مارس 2026.', '2026-02-15', 'examen', true),
('Journée Portes Ouvertes - Orientation', 'يوم مفتوح - التوجيه', 'Le Lycée Alkhwarizmi organise une journée portes ouvertes le samedi 22 février 2026.', 'ينظم ثانوية الخوارزمي يوماً مفتوحاً يوم السبت 22 فبراير 2026.', '2026-02-12', 'orientation', false),
('Compétition Inter-lycées de Mathématiques', 'مسابقة بين الثانويات في الرياضيات', 'Notre lycée participera à la compétition régionale de mathématiques le 5 mars 2026.', 'ستشارك ثانويتنا في المسابقة الجهوية للرياضيات يوم 5 مارس 2026.', '2026-02-10', 'activite', false);

-- Insert demo document requests (using subquery for student_id)
INSERT INTO document_requests (ref_code, student_id, type, status, date_requested, date_ready) VALUES
('DOC-001', (SELECT id FROM students WHERE massar = 'G132456789'), 'attestation_scolarite', 'pret', '2026-01-15', '2026-01-18'),
('DOC-002', (SELECT id FROM students WHERE massar = 'G132456789'), 'releve_notes', 'en_cours', '2026-02-10', NULL);

-- Insert demo absences
INSERT INTO absences (student_id, matiere, mois, count) VALUES
((SELECT id FROM students WHERE massar = 'G132456789'), 'Mathématiques', 'Septembre', 1),
((SELECT id FROM students WHERE massar = 'G132456789'), 'Physique-Chimie', 'Septembre', 0),
((SELECT id FROM students WHERE massar = 'G132456789'), 'SVT', 'Septembre', 2),
((SELECT id FROM students WHERE massar = 'G132456789'), 'Français', 'Septembre', 0),
((SELECT id FROM students WHERE massar = 'G132456789'), 'Anglais', 'Septembre', 1),
((SELECT id FROM students WHERE massar = 'G132456789'), 'Mathématiques', 'Octobre', 0),
((SELECT id FROM students WHERE massar = 'G132456789'), 'Physique-Chimie', 'Octobre', 1),
((SELECT id FROM students WHERE massar = 'G132456789'), 'SVT', 'Octobre', 0),
((SELECT id FROM students WHERE massar = 'G132456789'), 'Français', 'Octobre', 2),
((SELECT id FROM students WHERE massar = 'G132456789'), 'Mathématiques', 'Novembre', 2),
((SELECT id FROM students WHERE massar = 'G132456789'), 'Physique-Chimie', 'Novembre', 0),
((SELECT id FROM students WHERE massar = 'G132456789'), 'SVT', 'Novembre', 1);
