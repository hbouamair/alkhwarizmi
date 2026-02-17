// ============================================================
// Mock Data for Lycée Alkhwarizmi - Aït Amira
// ============================================================

export interface Student {
  id: string;
  massar: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  classe: string;
  niveau: string;
  avatar?: string;
}

export interface DocumentRequest {
  id: string;
  studentId: string;
  type: "attestation_scolarite" | "releve_notes" | "certificat_depart";
  status: "en_cours" | "pret" | "refuse";
  dateRequested: string;
  dateReady?: string;
  notes?: string;
}

export interface Absence {
  studentId: string;
  matiere: string;
  mois: string;
  count: number;
}

export interface Announcement {
  id: string;
  title: string;
  titleAr?: string;
  content: string;
  contentAr?: string;
  date: string;
  category: "general" | "examen" | "orientation" | "activite" | "urgent";
  pinned?: boolean;
}

// ============================================================
// Students (mock accounts)
// ============================================================
export const students: Student[] = [
  {
    id: "1",
    massar: "G132456789",
    firstName: "Youssef",
    lastName: "El Amrani",
    email: "youssef.amrani@lycee.ma",
    password: "123456",
    classe: "2BAC-SVT-1",
    niveau: "2ème Bac Sciences de la Vie et de la Terre",
  },
  {
    id: "2",
    massar: "G987654321",
    firstName: "Fatima",
    lastName: "Benali",
    email: "fatima.benali@lycee.ma",
    password: "123456",
    classe: "1BAC-SE-2",
    niveau: "1ère Bac Sciences Expérimentales",
  },
  {
    id: "3",
    massar: "G112233445",
    firstName: "Ahmed",
    lastName: "Moussa",
    email: "ahmed.moussa@lycee.ma",
    password: "123456",
    classe: "TC-S-3",
    niveau: "Tronc Commun Scientifique",
  },
];

// ============================================================
// Document Requests
// ============================================================
export const documentRequests: DocumentRequest[] = [
  {
    id: "DOC-001",
    studentId: "1",
    type: "attestation_scolarite",
    status: "pret",
    dateRequested: "2026-01-15",
    dateReady: "2026-01-18",
  },
  {
    id: "DOC-002",
    studentId: "1",
    type: "releve_notes",
    status: "en_cours",
    dateRequested: "2026-02-10",
  },
  {
    id: "DOC-003",
    studentId: "2",
    type: "certificat_depart",
    status: "en_cours",
    dateRequested: "2026-02-05",
    notes: "Transfert vers un autre établissement",
  },
  {
    id: "DOC-004",
    studentId: "1",
    type: "certificat_depart",
    status: "refuse",
    dateRequested: "2025-12-20",
    notes: "Dossier incomplet",
  },
];

// ============================================================
// Absences
// ============================================================
export const absences: Absence[] = [
  // Youssef (id: "1")
  { studentId: "1", matiere: "Mathématiques", mois: "Septembre", count: 1 },
  { studentId: "1", matiere: "Physique-Chimie", mois: "Septembre", count: 0 },
  { studentId: "1", matiere: "SVT", mois: "Septembre", count: 2 },
  { studentId: "1", matiere: "Français", mois: "Septembre", count: 0 },
  { studentId: "1", matiere: "Anglais", mois: "Septembre", count: 1 },
  { studentId: "1", matiere: "Arabe", mois: "Septembre", count: 0 },
  { studentId: "1", matiere: "Philosophie", mois: "Septembre", count: 0 },
  { studentId: "1", matiere: "Éducation Islamique", mois: "Septembre", count: 0 },

  { studentId: "1", matiere: "Mathématiques", mois: "Octobre", count: 0 },
  { studentId: "1", matiere: "Physique-Chimie", mois: "Octobre", count: 1 },
  { studentId: "1", matiere: "SVT", mois: "Octobre", count: 0 },
  { studentId: "1", matiere: "Français", mois: "Octobre", count: 2 },
  { studentId: "1", matiere: "Anglais", mois: "Octobre", count: 0 },
  { studentId: "1", matiere: "Arabe", mois: "Octobre", count: 1 },
  { studentId: "1", matiere: "Philosophie", mois: "Octobre", count: 1 },
  { studentId: "1", matiere: "Éducation Islamique", mois: "Octobre", count: 0 },

  { studentId: "1", matiere: "Mathématiques", mois: "Novembre", count: 2 },
  { studentId: "1", matiere: "Physique-Chimie", mois: "Novembre", count: 0 },
  { studentId: "1", matiere: "SVT", mois: "Novembre", count: 1 },
  { studentId: "1", matiere: "Français", mois: "Novembre", count: 0 },
  { studentId: "1", matiere: "Anglais", mois: "Novembre", count: 0 },
  { studentId: "1", matiere: "Arabe", mois: "Novembre", count: 0 },
  { studentId: "1", matiere: "Philosophie", mois: "Novembre", count: 0 },
  { studentId: "1", matiere: "Éducation Islamique", mois: "Novembre", count: 1 },

  { studentId: "1", matiere: "Mathématiques", mois: "Décembre", count: 0 },
  { studentId: "1", matiere: "Physique-Chimie", mois: "Décembre", count: 0 },
  { studentId: "1", matiere: "SVT", mois: "Décembre", count: 0 },
  { studentId: "1", matiere: "Français", mois: "Décembre", count: 1 },
  { studentId: "1", matiere: "Anglais", mois: "Décembre", count: 0 },
  { studentId: "1", matiere: "Arabe", mois: "Décembre", count: 0 },
  { studentId: "1", matiere: "Philosophie", mois: "Décembre", count: 0 },
  { studentId: "1", matiere: "Éducation Islamique", mois: "Décembre", count: 0 },

  { studentId: "1", matiere: "Mathématiques", mois: "Janvier", count: 1 },
  { studentId: "1", matiere: "Physique-Chimie", mois: "Janvier", count: 0 },
  { studentId: "1", matiere: "SVT", mois: "Janvier", count: 0 },
  { studentId: "1", matiere: "Français", mois: "Janvier", count: 0 },
  { studentId: "1", matiere: "Anglais", mois: "Janvier", count: 2 },
  { studentId: "1", matiere: "Arabe", mois: "Janvier", count: 0 },
  { studentId: "1", matiere: "Philosophie", mois: "Janvier", count: 1 },
  { studentId: "1", matiere: "Éducation Islamique", mois: "Janvier", count: 0 },

  { studentId: "1", matiere: "Mathématiques", mois: "Février", count: 0 },
  { studentId: "1", matiere: "Physique-Chimie", mois: "Février", count: 1 },
  { studentId: "1", matiere: "SVT", mois: "Février", count: 0 },
  { studentId: "1", matiere: "Français", mois: "Février", count: 0 },
  { studentId: "1", matiere: "Anglais", mois: "Février", count: 0 },
  { studentId: "1", matiere: "Arabe", mois: "Février", count: 0 },
  { studentId: "1", matiere: "Philosophie", mois: "Février", count: 0 },
  { studentId: "1", matiere: "Éducation Islamique", mois: "Février", count: 0 },
];

// ============================================================
// Announcements
// ============================================================
export const announcements: Announcement[] = [
  {
    id: "ANN-001",
    title: "Examens du 2ème Semestre",
    titleAr: "امتحانات الدورة الثانية",
    content:
      "Les examens du deuxième semestre débuteront le 15 mars 2026. Les élèves sont priés de consulter les emplois du temps affichés dans l'établissement.",
    contentAr:
      "ستنطلق امتحانات الدورة الثانية يوم 15 مارس 2026. يُرجى من التلاميذ الاطلاع على جداول الحصص المعلقة بالمؤسسة.",
    date: "2026-02-15",
    category: "examen",
    pinned: true,
  },
  {
    id: "ANN-002",
    title: "Journée Portes Ouvertes - Orientation",
    titleAr: "يوم مفتوح - التوجيه",
    content:
      "Le Lycée Alkhwarizmi organise une journée portes ouvertes le samedi 22 février 2026 pour accompagner les élèves dans leur choix d'orientation post-bac.",
    contentAr:
      "ينظم ثانوية الخوارزمي يوماً مفتوحاً يوم السبت 22 فبراير 2026 لمرافقة التلاميذ في اختياراتهم التوجيهية بعد البكالوريا.",
    date: "2026-02-12",
    category: "orientation",
  },
  {
    id: "ANN-003",
    title: "Compétition Inter-lycées de Mathématiques",
    titleAr: "مسابقة بين الثانويات في الرياضيات",
    content:
      "Notre lycée participera à la compétition régionale de mathématiques le 5 mars 2026. Les élèves intéressés peuvent s'inscrire auprès de M. Rachidi avant le 25 février.",
    contentAr:
      "ستشارك ثانويتنا في المسابقة الجهوية للرياضيات يوم 5 مارس 2026. يمكن للتلاميذ الراغبين التسجيل لدى الأستاذ الرشيدي قبل 25 فبراير.",
    date: "2026-02-10",
    category: "activite",
  },
  {
    id: "ANN-004",
    title: "Mise à jour du Règlement Intérieur",
    titleAr: "تحديث القانون الداخلي",
    content:
      "Le règlement intérieur a été mis à jour pour l'année scolaire 2025-2026. Tous les élèves doivent en prendre connaissance. Disponible au bureau de la vie scolaire.",
    contentAr:
      "تم تحديث القانون الداخلي للموسم الدراسي 2025-2026. على جميع التلاميذ الاطلاع عليه. متوفر بمكتب الحياة المدرسية.",
    date: "2026-02-01",
    category: "general",
  },
  {
    id: "ANN-005",
    title: "⚠️ Alerte Météo - Suspension des Cours",
    titleAr: "⚠️ تحذير جوي - تعليق الدراسة",
    content:
      "En raison des conditions météorologiques exceptionnelles, les cours seront suspendus le jeudi 20 février 2026. Restez en sécurité.",
    contentAr:
      "بسبب الظروف الجوية الاستثنائية، ستُعلق الدراسة يوم الخميس 20 فبراير 2026. ابقوا في أمان.",
    date: "2026-02-19",
    category: "urgent",
    pinned: true,
  },
];

// ============================================================
// Helper: Document type label
// ============================================================
export const documentTypeLabels: Record<DocumentRequest["type"], string> = {
  attestation_scolarite: "Attestation de Scolarité",
  releve_notes: "Relevé de Notes",
  certificat_depart: "Certificat de Départ",
};

export const documentStatusLabels: Record<DocumentRequest["status"], string> = {
  en_cours: "En cours",
  pret: "Prêt",
  refuse: "Refusé",
};

export const categoryLabels: Record<Announcement["category"], string> = {
  general: "Général",
  examen: "Examens",
  orientation: "Orientation",
  activite: "Activités",
  urgent: "Urgent",
};

export const categoryColors: Record<Announcement["category"], string> = {
  general: "bg-blue-100 text-blue-700",
  examen: "bg-amber-100 text-amber-700",
  orientation: "bg-purple-100 text-purple-700",
  activite: "bg-emerald-100 text-emerald-700",
  urgent: "bg-red-100 text-red-700",
};

export const months = [
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
  "Janvier",
  "Février",
];
