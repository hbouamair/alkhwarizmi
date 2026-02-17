"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronRight,
  Users,
  BookOpen,
  Trophy,
  Globe,
  Bell,
  Pin,
  Menu,
  X,
  ArrowRight,
  Facebook,
  CalendarDays,
  Star,
  Heart,
  Languages,
} from "lucide-react";
import { announcements } from "@/lib/mock-data";
import type { Announcement } from "@/lib/mock-data";
import { t, type Lang } from "@/lib/translations";

const catBadgeStyles: Record<Announcement["category"], { bg: string; color: string }> = {
  general: { bg: "#dbeafe", color: "#1d4ed8" },
  examen: { bg: "#fef3c7", color: "#b45309" },
  orientation: { bg: "#f3e8ff", color: "#7c3aed" },
  activite: { bg: "#d1fae5", color: "#047857" },
  urgent: { bg: "#fee2e2", color: "#dc2626" },
};

const catKeys: Record<Announcement["category"], "cat_general" | "cat_examen" | "cat_orientation" | "cat_activite" | "cat_urgent"> = {
  general: "cat_general",
  examen: "cat_examen",
  orientation: "cat_orientation",
  activite: "cat_activite",
  urgent: "cat_urgent",
};

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [lang, setLang] = useState<Lang>("fr");

  const isAr = lang === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat(isAr ? "ar-MA" : "fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(dateStr));
  };

  const toggleLang = () => setLang(lang === "fr" ? "ar" : "fr");

  const stats = [
    { icon: Users, value: "1200+", label: t.stat_students[lang] },
    { icon: BookOpen, value: "85+", label: t.stat_teachers[lang] },
    { icon: Trophy, value: "95%", label: t.stat_success[lang] },
    { icon: Star, value: "15+", label: t.stat_clubs[lang] },
  ];

  const communityFeatures = [
    { icon: Users, title: t.feat_school_life[lang], desc: t.feat_school_life_desc[lang] },
    { icon: Trophy, title: t.feat_excellence[lang], desc: t.feat_excellence_desc[lang] },
    { icon: Globe, title: t.feat_culture[lang], desc: t.feat_culture_desc[lang] },
    { icon: Heart, title: t.feat_community[lang], desc: t.feat_community_desc[lang] },
  ];

  return (
    <div className="min-h-screen" dir={dir} style={{ backgroundColor: "#f8fafc" }}>
      {/* ============ NAVBAR ============ */}
      <nav
        className="sticky top-0 z-50"
        style={{
          backgroundColor: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #0e7c47, #065f35)" }}
              >
                <GraduationCap className="w-5 h-5" style={{ color: "#f0d080" }} />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold leading-tight" style={{ color: "#0f172a" }}>
                  {isAr ? "ثانوية الخوارزمي" : "Lycée Alkhwarizmi"}
                </h1>
                <p className="text-[11px] leading-tight" style={{ color: "#0e7c47" }}>
                  {isAr ? "أيت أعميرة" : "Aït Amira"}
                </p>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-7">
              <a href="#accueil" className="nav-link active text-sm font-medium" style={{ color: "#0e7c47" }}>
                {t.nav_home[lang]}
              </a>
              <a href="#actualites" className="nav-link text-sm font-medium" style={{ color: "#475569" }}>
                {t.nav_news[lang]}
              </a>
              <a href="#communaute" className="nav-link text-sm font-medium" style={{ color: "#475569" }}>
                {t.nav_community[lang]}
              </a>
              <a href="#localisation" className="nav-link text-sm font-medium" style={{ color: "#475569" }}>
                {t.nav_location[lang]}
              </a>
              <a href="#contact" className="nav-link text-sm font-medium" style={{ color: "#475569" }}>
                {t.nav_contact[lang]}
              </a>
            </div>

            {/* Lang toggle + CTA + Mobile */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language toggle */}
              <button
                onClick={toggleLang}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={{
                  backgroundColor: isAr ? "#ecfdf5" : "#f8fafc",
                  color: "#0e7c47",
                  border: "1px solid #e2e8f0",
                }}
                title={isAr ? "Passer en Français" : "التبديل إلى العربية"}
              >
                <Languages className="w-3.5 h-3.5" />
                {isAr ? "FR" : "عربية"}
              </button>

              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all"
                style={{
                  background: "linear-gradient(135deg, #0e7c47, #065f35)",
                  color: "#ffffff",
                  boxShadow: "0 4px 15px rgba(14,124,71,0.25)",
                }}
              >
                {t.nav_student[lang]}
                <ArrowRight className="w-4 h-4" style={{ transform: isAr ? "rotate(180deg)" : "none" }} />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg"
                style={{ color: "#0f172a" }}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-1 pt-2" style={{ borderTop: "1px solid #f1f5f9" }}>
              <a href="#accueil" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link block px-3 py-2.5 text-sm font-medium rounded-lg" style={{ color: "#0e7c47" }}>
                {t.nav_home[lang]}
              </a>
              <a href="#actualites" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link block px-3 py-2.5 text-sm font-medium rounded-lg" style={{ color: "#475569" }}>
                {t.nav_news[lang]}
              </a>
              <a href="#communaute" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link block px-3 py-2.5 text-sm font-medium rounded-lg" style={{ color: "#475569" }}>
                {t.nav_community[lang]}
              </a>
              <a href="#localisation" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link block px-3 py-2.5 text-sm font-medium rounded-lg" style={{ color: "#475569" }}>
                {t.nav_location[lang]}
              </a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link block px-3 py-2.5 text-sm font-medium rounded-lg" style={{ color: "#475569" }}>
                {t.nav_contact[lang]}
              </a>
              <Link
                href="/login"
                className="block mx-3 mt-2 px-4 py-2.5 text-sm font-semibold rounded-xl text-center"
                style={{ background: "linear-gradient(135deg, #0e7c47, #065f35)", color: "#ffffff" }}
              >
                {t.nav_student[lang]} →
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <section
        id="accueil"
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0e7c47 0%, #065f35 40%, #0f2419 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M40 0l40 40-40 40L0 40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 70% 30%, rgba(212,168,67,0.1) 0%, transparent 50%)" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className={isAr ? "max-w-3xl mr-0 ml-auto" : "max-w-3xl"}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <GraduationCap className="w-4 h-4" style={{ color: "#f0d080" }} />
              <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
                {t.hero_badge[lang]}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ color: "#ffffff" }}>
              {t.hero_title_1[lang]}{" "}
              <span style={{ color: "#f0d080" }}>{t.hero_title_2[lang]}</span>
          </h1>

            <p className="text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl" style={{ color: "rgba(255,255,255,0.75)" }}>
              {t.hero_desc[lang]}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold rounded-xl transition-all"
                style={{ backgroundColor: "#ffffff", color: "#065f35", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
              >
                {t.hero_cta_student[lang]}
                <ChevronRight className="w-4 h-4" style={{ transform: isAr ? "rotate(180deg)" : "none" }} />
              </Link>
              <a
                href="#actualites"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold rounded-xl transition-all"
                style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.2)" }}
              >
                {t.hero_cta_news[lang]}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS BAR ============ */}
      <section className="relative z-10 -mt-8 sm:-mt-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-6 sm:p-8 rounded-2xl"
            style={{ backgroundColor: "#ffffff", boxShadow: "0 20px 60px rgba(0,0,0,0.08)", border: "1px solid #f1f5f9" }}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#ecfdf5" }}>
                    <stat.icon className="w-5 h-5" style={{ color: "#0e7c47" }} />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold" style={{ color: "#0f172a" }}>{stat.value}</p>
                <p className="text-xs sm:text-sm mt-0.5" style={{ color: "#94a3b8" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ACTUALITÉS ============ */}
      <section id="actualites" className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4" style={{ backgroundColor: "#ecfdf5", color: "#0e7c47" }}>
              <Bell className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">{t.news_badge[lang]}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: "#0f172a" }}>{t.news_title[lang]}</h2>
            <p className="max-w-xl mx-auto" style={{ color: "#64748b" }}>{t.news_desc[lang]}</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedAnnouncements.slice(0, 6).map((ann) => (
              <article
                key={ann.id}
                onClick={() => setSelectedAnnouncement(ann)}
                className="rounded-2xl p-6 transition-all hover:shadow-lg group cursor-pointer"
                style={{ backgroundColor: "#ffffff", border: ann.pinned ? "1px solid rgba(14,124,71,0.2)" : "1px solid #f1f5f9" }}
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {ann.pinned && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full" style={{ backgroundColor: "rgba(14,124,71,0.1)", color: "#0e7c47" }}>
                      <Pin className="w-3 h-3" />
                      {t.news_pinned[lang]}
                    </span>
                  )}
                  <span className="inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-full" style={{ backgroundColor: catBadgeStyles[ann.category].bg, color: catBadgeStyles[ann.category].color }}>
                    {t[catKeys[ann.category]][lang]}
                  </span>
                </div>

                <h3 className="text-base font-bold mb-2 leading-snug" style={{ color: "#0f172a" }}>
                  {isAr && ann.titleAr ? ann.titleAr : ann.title}
                </h3>
                <p className="text-sm leading-relaxed mb-3 line-clamp-3" style={{ color: "#64748b" }}>
                  {isAr && ann.contentAr ? ann.contentAr : ann.content}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: "#94a3b8" }}>
                    <CalendarDays className="w-3.5 h-3.5" />
                    {formatDate(ann.date)}
                  </div>
                  <span className="text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#0e7c47" }}>
                    {t.news_read_more[lang]} <ChevronRight className="w-3.5 h-3.5" style={{ transform: isAr ? "rotate(180deg)" : "none" }} />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ COMMUNAUTÉ ============ */}
      <section id="communaute" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4" style={{ backgroundColor: "#f3e8ff", color: "#7c3aed" }}>
              <Heart className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">{t.community_badge[lang]}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: "#0f172a" }}>{t.community_title[lang]}</h2>
            <p className="max-w-xl mx-auto" style={{ color: "#64748b" }}>{t.community_desc[lang]}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityFeatures.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl p-6 text-center transition-all hover:shadow-lg group"
                style={{ backgroundColor: "#f8fafc", border: "1px solid #f1f5f9" }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all group-hover:scale-110" style={{ background: "linear-gradient(135deg, #ecfdf5, #d1fae5)" }}>
                  <feature.icon className="w-6 h-6" style={{ color: "#0e7c47" }} />
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: "#0f172a" }}>{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0e7c47, #065f35, #0f2419)" }}>
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M40 0l40 40-40 40L0 40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: "#ffffff" }}>{t.cta_title[lang]}</h3>
              <p className="mb-6 max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>{t.cta_desc[lang]}</p>
              <Link href="/login" className="inline-flex items-center gap-2 px-8 py-3.5 font-bold rounded-xl transition-all" style={{ backgroundColor: "#ffffff", color: "#065f35", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
                {t.cta_login[lang]}
                <ArrowRight className="w-4 h-4" style={{ transform: isAr ? "rotate(180deg)" : "none" }} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ LOCALISATION ============ */}
      <section id="localisation" className="py-20 sm:py-24" style={{ backgroundColor: "#f8fafc" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4" style={{ backgroundColor: "#fee2e2", color: "#dc2626" }}>
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">{t.loc_badge[lang]}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: "#0f172a" }}>{t.loc_title[lang]}</h2>
            <p className="max-w-xl mx-auto" style={{ color: "#64748b" }}>{t.loc_desc[lang]}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-lg" style={{ border: "1px solid #e2e8f0" }}>
              <iframe
                src="https://maps.google.com/maps?q=Lyc%C3%A9e+Alkhwarizmi+Ait+Amira+Maroc&t=&z=16&ie=UTF8&iwloc=B&output=embed"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation Lycée Alkhwarizmi - Aït Amira"
              />
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl p-6" style={{ backgroundColor: "#ffffff", border: "1px solid #f1f5f9" }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#fef2f2" }}>
                    <MapPin className="w-5 h-5" style={{ color: "#ef4444" }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1" style={{ color: "#0f172a" }}>{t.loc_address[lang]}</h4>
                    <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#64748b" }}>
                      {t.loc_address_text[lang]}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6" style={{ backgroundColor: "#ffffff", border: "1px solid #f1f5f9" }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#ecfdf5" }}>
                    <Phone className="w-5 h-5" style={{ color: "#0e7c47" }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1" style={{ color: "#0f172a" }}>{t.loc_phone[lang]}</h4>
                    <p className="text-sm" style={{ color: "#64748b" }} dir="ltr">0528 81 23 41</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6" style={{ backgroundColor: "#ffffff", border: "1px solid #f1f5f9" }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#eff6ff" }}>
                    <Clock className="w-5 h-5" style={{ color: "#2563eb" }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1" style={{ color: "#0f172a" }}>{t.loc_hours[lang]}</h4>
                    <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#64748b" }}>
                      {t.loc_hours_text[lang]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <section id="contact" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="rounded-2xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6" style={{ backgroundColor: "#f8fafc", border: "1px solid #f1f5f9" }}>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: "#0f172a" }}>{t.contact_title[lang]}</h3>
              <p className="text-sm" style={{ color: "#64748b" }}>{t.contact_desc[lang]}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="mailto:lycee_alkhawarizmi@yahoo.fr" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all" style={{ background: "linear-gradient(135deg, #0e7c47, #065f35)", color: "#ffffff", boxShadow: "0 4px 15px rgba(14,124,71,0.25)" }}>
                <Mail className="w-4 h-4" />
                {t.contact_email[lang]}
              </a>
              <a href="tel:+212528812341" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all" style={{ backgroundColor: "#ffffff", color: "#0f172a", border: "1px solid #e2e8f0" }}>
                <Phone className="w-4 h-4" />
                {t.contact_call[lang]}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer style={{ backgroundColor: "#0f2419" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(14,124,71,0.3)" }}>
                  <GraduationCap className="w-5 h-5" style={{ color: "#f0d080" }} />
                </div>
                <div>
                  <h3 className="font-bold" style={{ color: "#ffffff" }}>{isAr ? "ثانوية الخوارزمي" : "Lycée Alkhwarizmi"}</h3>
                  <p className="text-xs" style={{ color: "rgba(74,222,128,0.6)" }}>{isAr ? "أيت أعميرة" : "Aït Amira"}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{t.footer_brand_desc[lang]}</p>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-4" style={{ color: "#ffffff" }}>{t.footer_nav[lang]}</h4>
              <ul className="space-y-2">
                <li><a href="#accueil" className="text-sm hover:underline" style={{ color: "rgba(255,255,255,0.5)" }}>{t.nav_home[lang]}</a></li>
                <li><a href="#actualites" className="text-sm hover:underline" style={{ color: "rgba(255,255,255,0.5)" }}>{t.nav_news[lang]}</a></li>
                <li><a href="#communaute" className="text-sm hover:underline" style={{ color: "rgba(255,255,255,0.5)" }}>{t.nav_community[lang]}</a></li>
                <li><a href="#localisation" className="text-sm hover:underline" style={{ color: "rgba(255,255,255,0.5)" }}>{t.nav_location[lang]}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-4" style={{ color: "#ffffff" }}>{t.footer_student_space[lang]}</h4>
              <ul className="space-y-2">
                <li><Link href="/login" className="text-sm hover:underline" style={{ color: "rgba(255,255,255,0.5)" }}>{t.footer_login[lang]}</Link></li>
                <li><span className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>{t.footer_documents[lang]}</span></li>
                <li><span className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>{t.footer_presence[lang]}</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-4" style={{ color: "#ffffff" }}>{t.footer_contact[lang]}</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" /> {isAr ? "أيت أعميرة، المغرب" : "Aït Amira, Maroc"}
                </li>
                <li className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" /> <span dir="ltr">0528 81 23 41</span>
                </li>
                <li className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" /> <span dir="ltr">lycee_alkhawarizmi@yahoo.fr</span>
                </li>
              </ul>
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{t.footer_rights[lang]}</p>
            <div className="flex items-center gap-3">
              <a href="https://www.facebook.com/alkhawarizmi.lycee" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" }}>
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" }}>
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ============ MODAL ACTUALITÉ ============ */}
      {selectedAnnouncement && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setSelectedAnnouncement(null)}
        >
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} />

          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl modal-animate"
            style={{ backgroundColor: "#ffffff" }}
            onClick={(e) => e.stopPropagation()}
            dir={dir}
          >
            <div className="relative p-6 sm:p-8 rounded-t-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #0e7c47 0%, #065f35 50%, #0f2419 100%)" }}>
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M40 0l40 40-40 40L0 40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="absolute top-4 w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#ffffff", ...(isAr ? { left: "16px" } : { right: "16px" }) }}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {selectedAnnouncement.pinned && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#ffffff" }}>
                      <Pin className="w-3 h-3" />
                      {t.news_pinned[lang]}
                    </span>
                  )}
                  <span className="inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#ffffff" }}>
                    {t[catKeys[selectedAnnouncement.category]][lang]}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold leading-snug mb-2" style={{ color: "#ffffff" }}>
                  {selectedAnnouncement.title}
                </h2>
                {selectedAnnouncement.titleAr && (
                  <p className="text-base font-medium mb-3" dir="rtl" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {selectedAnnouncement.titleAr}
                  </p>
                )}
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <CalendarDays className="w-3.5 h-3.5" />
                  {formatDate(selectedAnnouncement.date)}
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#94a3b8" }}>{t.modal_french[lang]}</p>
                <p className="text-sm sm:text-base leading-relaxed" dir="ltr" style={{ color: "#334155" }}>{selectedAnnouncement.content}</p>
              </div>

              {selectedAnnouncement.contentAr && (
                <div className="rounded-xl p-5" style={{ backgroundColor: "#f8fafc", border: "1px solid #f1f5f9" }}>
                  <p className="text-[11px] font-semibold uppercase tracking-wider mb-2 text-right" style={{ color: "#94a3b8" }}>{t.modal_arabic[lang]}</p>
                  <p className="text-sm sm:text-base leading-relaxed" dir="rtl" style={{ color: "#334155" }}>{selectedAnnouncement.contentAr}</p>
                </div>
              )}

              <div className="flex items-center gap-3 pt-4" style={{ borderTop: "1px solid #f1f5f9" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0e7c47, #065f35)" }}>
                  <GraduationCap className="w-4 h-4" style={{ color: "#f0d080" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#0f172a" }}>{t.modal_direction[lang]}</p>
                  <p className="text-xs" style={{ color: "#94a3b8" }}>{t.modal_province[lang]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
