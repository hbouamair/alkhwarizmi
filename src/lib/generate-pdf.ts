import { jsPDF } from "jspdf";

// Simplified types for PDF generation (works with both mock and Supabase data)
interface Student {
  id: string;
  massar: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  classe: string;
  niveau: string;
}

interface DocumentRequest {
  id: string;
  studentId: string;
  type: "attestation_scolarite" | "releve_notes" | "certificat_depart";
  status: "en_cours" | "pret" | "refuse";
  dateRequested: string;
  dateReady?: string;
  notes?: string;
}

// ============================================================
// Moroccan school document PDF generator
// with Arabic font support (Amiri from Google Fonts)
// ============================================================

let amiriFontLoaded = false;
let amiriFontBase64: string | null = null;
let amiriBoldBase64: string | null = null;

async function loadAmiriFont(): Promise<void> {
  if (amiriFontLoaded) return;

  try {
    // Fetch Amiri Regular
    const regularRes = await fetch(
      "https://fonts.gstatic.com/s/amiri/v27/J7aRnpd8CGxBHqUpvrIw74NL.ttf"
    );
    const regularBuf = await regularRes.arrayBuffer();
    amiriFontBase64 = arrayBufferToBase64(regularBuf);

    // Fetch Amiri Bold
    const boldRes = await fetch(
      "https://fonts.gstatic.com/s/amiri/v27/J7acnpd8CGxBHp2VkZY4xJ9CGyAa.ttf"
    );
    const boldBuf = await boldRes.arrayBuffer();
    amiriBoldBase64 = arrayBufferToBase64(boldBuf);

    amiriFontLoaded = true;
  } catch (e) {
    console.warn("Could not load Amiri font, Arabic text may not render:", e);
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function registerAmiriFont(doc: jsPDF) {
  if (!amiriFontBase64 || !amiriBoldBase64) return;

  doc.addFileToVFS("Amiri-Regular.ttf", amiriFontBase64);
  doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");

  doc.addFileToVFS("Amiri-Bold.ttf", amiriBoldBase64);
  doc.addFont("Amiri-Bold.ttf", "Amiri", "bold");
}

/** Helper to print Arabic text (RTL) */
function textAr(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  options?: { align?: "center" | "right" | "left"; fontSize?: number; bold?: boolean }
) {
  const prevFont = doc.getFont();
  doc.setFont("Amiri", options?.bold ? "bold" : "normal");
  if (options?.fontSize) doc.setFontSize(options.fontSize);
  doc.text(text, x, y, { align: options?.align || "right" });
  doc.setFont(prevFont.fontName, prevFont.fontStyle);
}

// ============================================================

function drawHeader(doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Top green bar
  doc.setFillColor(14, 124, 71);
  doc.rect(0, 0, pageWidth, 8, "F");

  // Gold accent line
  doc.setFillColor(212, 168, 67);
  doc.rect(0, 8, pageWidth, 1.5, "F");

  // Kingdom of Morocco header — French (left)
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.text("Royaume du Maroc", 20, 20);
  doc.text("Ministère de l'Éducation Nationale", 20, 25);
  doc.text("Direction Provinciale Chtouka-Aït Baha", 20, 30);

  // Arabic (right)
  doc.setTextColor(100, 116, 139);
  if (amiriFontLoaded) {
    textAr(doc, "المملكة المغربية", pageWidth - 20, 20, { fontSize: 10 });
    textAr(doc, "وزارة التربية الوطنية", pageWidth - 20, 25, { fontSize: 10 });
    textAr(doc, "المديرية الإقليمية شتوكة أيت باها", pageWidth - 20, 30, { fontSize: 10 });
  }

  // School name — centered
  doc.setFontSize(16);
  doc.setTextColor(14, 124, 71);
  doc.setFont("helvetica", "bold");
  doc.text("Lycée Qualifiant Alkhwarizmi", pageWidth / 2, 42, { align: "center" });

  if (amiriFontLoaded) {
    doc.setTextColor(100, 116, 139);
    textAr(doc, "ثانوية الخوارزمي التأهيلية", pageWidth / 2, 48, {
      fontSize: 12,
      align: "center",
    });
  }

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.text("Aït Amira — Province Chtouka-Aït Baha", pageWidth / 2, 53, { align: "center" });

  // Separator
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(20, 58, pageWidth - 20, 58);

  return 65;
}

function drawFooter(doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(20, pageHeight - 30, pageWidth - 20, pageHeight - 30);

  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Lycée Qualifiant Alkhwarizmi — Aït Amira, Province Chtouka-Aït Baha, Région Souss-Massa",
    pageWidth / 2,
    pageHeight - 22,
    { align: "center" }
  );
  doc.text(
    "Tél: 0528 81 23 41 | Email: lycee_alkhawarizmi@yahoo.fr",
    pageWidth / 2,
    pageHeight - 18,
    { align: "center" }
  );

  // Bottom bars
  doc.setFillColor(212, 168, 67);
  doc.rect(0, pageHeight - 9.5, pageWidth, 1.5, "F");
  doc.setFillColor(14, 124, 71);
  doc.rect(0, pageHeight - 8, pageWidth, 8, "F");
}

function drawStamp(doc: jsPDF, y: number) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const stampX = pageWidth - 60;

  doc.setDrawColor(14, 124, 71);
  doc.setLineWidth(1);
  doc.circle(stampX, y, 18);
  doc.circle(stampX, y, 15);

  doc.setFontSize(6);
  doc.setTextColor(14, 124, 71);
  doc.setFont("helvetica", "bold");
  doc.text("LYCÉE ALKHWARIZMI", stampX, y - 6, { align: "center" });
  doc.text("AÏT AMIRA", stampX, y - 2, { align: "center" });
  doc.setFontSize(5);
  doc.setFont("helvetica", "normal");
  doc.text("CACHET", stampX, y + 3, { align: "center" });
  doc.text("ET SIGNATURE", stampX, y + 6, { align: "center" });
}

// ============================================================
// Attestation de Scolarité
// ============================================================
function generateAttestationScolarite(doc: jsPDF, student: Student, request: DocumentRequest) {
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = drawHeader(doc);

  // Reference
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.text(`Réf: ${request.id}/${new Date().getFullYear()}`, 20, y);
  const today = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
  doc.text(`Aït Amira, le ${today}`, pageWidth - 20, y, { align: "right" });

  y += 18;

  // Title FR
  doc.setFontSize(20);
  doc.setTextColor(14, 124, 71);
  doc.setFont("helvetica", "bold");
  doc.text("ATTESTATION DE SCOLARITÉ", pageWidth / 2, y, { align: "center" });

  // Title AR
  y += 8;
  if (amiriFontLoaded) {
    doc.setTextColor(14, 124, 71);
    textAr(doc, "شهادة التمدرس", pageWidth / 2, y, { fontSize: 16, align: "center", bold: true });
  }

  // Gold line
  y += 5;
  doc.setFillColor(212, 168, 67);
  doc.rect(pageWidth / 2 - 30, y, 60, 1, "F");

  y += 15;

  // Body
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "normal");
  doc.text("Le Directeur du Lycée Qualifiant Alkhwarizmi, Aït Amira,", 30, y);
  y += 8;
  doc.text("atteste que l'élève :", 30, y);

  y += 15;

  // Student info box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(25, y - 5, pageWidth - 50, 50, 3, 3, "FD");

  y += 5;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(14, 124, 71);
  doc.setFontSize(14);
  doc.text(`${student.lastName.toUpperCase()} ${student.firstName}`, pageWidth / 2, y, {
    align: "center",
  });

  y += 12;
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "normal");
  doc.text(`Code Massar : ${student.massar}`, 35, y);
  y += 8;
  doc.text(`Classe : ${student.classe}`, 35, y);
  y += 8;
  doc.text(`Niveau : ${student.niveau}`, 35, y);

  y += 20;

  const annee = "2025-2026";
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(
    `est régulièrement inscrit(e) dans notre établissement pour l'année scolaire ${annee}.`,
    30,
    y
  );
  y += 12;
  doc.text(
    "Cette attestation est délivrée à l'intéressé(e) pour servir et valoir ce que de droit.",
    30,
    y
  );

  y += 30;

  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.text("Le Directeur", pageWidth - 60, y, { align: "center" });

  drawStamp(doc, y + 25);
  drawFooter(doc);
}

// ============================================================
// Relevé de Notes
// ============================================================
function generateReleveNotes(doc: jsPDF, student: Student, request: DocumentRequest) {
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = drawHeader(doc);

  // Reference
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.text(`Réf: ${request.id}/${new Date().getFullYear()}`, 20, y);
  const today = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
  doc.text(`Aït Amira, le ${today}`, pageWidth - 20, y, { align: "right" });

  y += 18;

  // Title
  doc.setFontSize(20);
  doc.setTextColor(14, 124, 71);
  doc.setFont("helvetica", "bold");
  doc.text("RELEVÉ DE NOTES", pageWidth / 2, y, { align: "center" });

  y += 8;
  if (amiriFontLoaded) {
    doc.setTextColor(14, 124, 71);
    textAr(doc, "بيان النقط", pageWidth / 2, y, { fontSize: 16, align: "center", bold: true });
  }

  y += 5;
  doc.setFillColor(212, 168, 67);
  doc.rect(pageWidth / 2 - 25, y, 50, 1, "F");

  y += 10;

  // Student info
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "normal");
  doc.text(`Élève : ${student.lastName.toUpperCase()} ${student.firstName}`, 25, y);
  doc.text(`Massar : ${student.massar}`, pageWidth - 25, y, { align: "right" });
  y += 6;
  doc.text(`Classe : ${student.classe}  |  Année scolaire : 2025-2026  |  Semestre 1`, 25, y);

  y += 10;

  // Grades table
  const subjects = [
    { name: "Mathématiques", coef: 7, note: 14.5 },
    { name: "Physique-Chimie", coef: 5, note: 13.0 },
    { name: "SVT", coef: 5, note: 15.5 },
    { name: "Français", coef: 3, note: 12.0 },
    { name: "Anglais", coef: 2, note: 16.0 },
    { name: "Arabe", coef: 3, note: 13.5 },
    { name: "Éducation Islamique", coef: 2, note: 14.0 },
    { name: "Philosophie", coef: 2, note: 11.5 },
    { name: "Éducation Physique", coef: 1, note: 17.0 },
  ];

  const colWidths = [80, 30, 30, 30];
  const tableX = 25;
  const headers = ["Matière", "Coef.", "Note /20", "Note × Coef."];

  // Table header
  doc.setFillColor(14, 124, 71);
  doc.rect(tableX, y, colWidths.reduce((a, b) => a + b, 0), 8, "F");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");

  let xPos = tableX;
  headers.forEach((header, i) => {
    doc.text(header, xPos + colWidths[i] / 2, y + 5.5, { align: "center" });
    xPos += colWidths[i];
  });

  y += 8;

  let totalCoef = 0;
  let totalWeighted = 0;

  subjects.forEach((subject, idx) => {
    const rowY = y + idx * 8;
    const weighted = subject.note * subject.coef;
    totalCoef += subject.coef;
    totalWeighted += weighted;

    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(tableX, rowY, colWidths.reduce((a, b) => a + b, 0), 8, "F");
    }

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(tableX, rowY + 8, tableX + colWidths.reduce((a, b) => a + b, 0), rowY + 8);

    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "normal");

    xPos = tableX;
    doc.text(subject.name, xPos + 3, rowY + 5.5);
    xPos += colWidths[0];
    doc.text(String(subject.coef), xPos + colWidths[1] / 2, rowY + 5.5, { align: "center" });
    xPos += colWidths[1];

    if (subject.note >= 14) doc.setTextColor(14, 124, 71);
    else if (subject.note >= 10) doc.setTextColor(180, 83, 9);
    else doc.setTextColor(220, 38, 38);
    doc.setFont("helvetica", "bold");
    doc.text(subject.note.toFixed(1), xPos + colWidths[2] / 2, rowY + 5.5, { align: "center" });

    xPos += colWidths[2];
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.text(weighted.toFixed(1), xPos + colWidths[3] / 2, rowY + 5.5, { align: "center" });
  });

  y += subjects.length * 8;

  const average = totalWeighted / totalCoef;
  doc.setFillColor(14, 124, 71);
  doc.rect(tableX, y, colWidths.reduce((a, b) => a + b, 0), 10, "F");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("Moyenne Générale", tableX + 3, y + 7);
  doc.text(
    average.toFixed(2) + " / 20",
    tableX + colWidths[0] + colWidths[1] + colWidths[2] / 2,
    y + 7,
    { align: "center" }
  );

  y += 25;

  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "normal");
  const appreciation =
    average >= 16
      ? "Très Bien"
      : average >= 14
      ? "Bien"
      : average >= 12
      ? "Assez Bien"
      : average >= 10
      ? "Passable"
      : "Insuffisant";
  doc.text(`Appréciation générale : `, 25, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(14, 124, 71);
  doc.text(appreciation, 75, y);

  y += 20;

  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.text("Le Directeur", pageWidth - 60, y, { align: "center" });

  drawStamp(doc, y + 25);
  drawFooter(doc);
}

// ============================================================
// Certificat de Départ
// ============================================================
function generateCertificatDepart(doc: jsPDF, student: Student, request: DocumentRequest) {
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = drawHeader(doc);

  // Reference
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.text(`Réf: ${request.id}/${new Date().getFullYear()}`, 20, y);
  const today = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
  doc.text(`Aït Amira, le ${today}`, pageWidth - 20, y, { align: "right" });

  y += 18;

  // Title
  doc.setFontSize(20);
  doc.setTextColor(14, 124, 71);
  doc.setFont("helvetica", "bold");
  doc.text("CERTIFICAT DE DÉPART", pageWidth / 2, y, { align: "center" });

  y += 8;
  if (amiriFontLoaded) {
    doc.setTextColor(14, 124, 71);
    textAr(doc, "شهادة المغادرة", pageWidth / 2, y, { fontSize: 16, align: "center", bold: true });
  }

  y += 5;
  doc.setFillColor(212, 168, 67);
  doc.rect(pageWidth / 2 - 25, y, 50, 1, "F");

  y += 15;

  // Body
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "normal");
  doc.text("Le Directeur du Lycée Qualifiant Alkhwarizmi, Aït Amira,", 30, y);
  y += 8;
  doc.text("certifie que l'élève :", 30, y);

  y += 15;

  // Student info box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(25, y - 5, pageWidth - 50, 50, 3, 3, "FD");

  y += 5;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(14, 124, 71);
  doc.setFontSize(14);
  doc.text(`${student.lastName.toUpperCase()} ${student.firstName}`, pageWidth / 2, y, {
    align: "center",
  });

  y += 12;
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "normal");
  doc.text(`Code Massar : ${student.massar}`, 35, y);
  y += 8;
  doc.text(`Classe : ${student.classe}`, 35, y);
  y += 8;
  doc.text(`Niveau : ${student.niveau}`, 35, y);

  y += 20;

  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(
    "a été régulièrement inscrit(e) dans notre établissement pour l'année scolaire 2025-2026",
    30,
    y
  );
  y += 8;
  doc.text(`et a quitté l'établissement à la date du ${today}.`, 30, y);

  if (request.notes) {
    y += 12;
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Motif : ${request.notes}`, 30, y);
  }

  y += 12;
  doc.text(
    "Ce certificat est délivré à l'intéressé(e) pour servir et valoir ce que de droit.",
    30,
    y
  );

  y += 30;

  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.text("Le Directeur", pageWidth - 60, y, { align: "center" });

  drawStamp(doc, y + 25);
  drawFooter(doc);
}

// ============================================================
// Main export (async to load font first)
// ============================================================
export async function generateDocument(student: Student, request: DocumentRequest) {
  // Load Arabic font before generating
  await loadAmiriFont();

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Register Arabic font
  registerAmiriFont(doc);

  switch (request.type) {
    case "attestation_scolarite":
      generateAttestationScolarite(doc, student, request);
      break;
    case "releve_notes":
      generateReleveNotes(doc, student, request);
      break;
    case "certificat_depart":
      generateCertificatDepart(doc, student, request);
      break;
  }

  const typeNames = {
    attestation_scolarite: "Attestation_Scolarite",
    releve_notes: "Releve_Notes",
    certificat_depart: "Certificat_Depart",
  };

  const fileName = `${typeNames[request.type]}_${student.lastName}_${student.firstName}_${request.id}.pdf`;
  doc.save(fileName);
}
