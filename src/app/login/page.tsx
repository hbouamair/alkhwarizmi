"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { t, type Lang } from "@/lib/translations";
import {
  GraduationCap,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  BookOpen,
  ClipboardList,
  ArrowLeft,
  ArrowRight,
  Languages,
} from "lucide-react";

export default function LoginPage() {
  const { login, user, isLoading } = useAuth();
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lang, setLang] = useState<Lang>("fr");

  const isAr = lang === "ar";
  const dir = isAr ? "rtl" : "ltr";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("lang") === "ar") setLang("ar");
    }
  }, []);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const success = await login(identifier.trim(), password);
    if (success) {
      router.push("/dashboard");
    } else {
      setError(t.login_error[lang]);
      setIsSubmitting(false);
    }
  };

  const toggleLang = () => setLang(lang === "fr" ? "ar" : "fr");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="w-10 h-10 border-4 rounded-full animate-spin"
          style={{ borderColor: "#0e7c47", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" dir={dir}>
      {/* Left Panel - Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0e7c47 0%, #065f35 50%, #0f2419 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M40 0l40 40-40 40L0 40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 30% 40%, rgba(212,168,67,0.12) 0%, transparent 60%)",
          }}
        />

        {/* Top - Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              <GraduationCap className="w-7 h-7" style={{ color: "#f0d080" }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#ffffff" }}>
                {isAr ? "ثانوية الخوارزمي" : "Lycée Alkhwarizmi"}
              </h1>
              <p className="text-sm" style={{ color: "#86efac" }}>
                {isAr ? "أيت أعميرة" : "Aït Amira"}
              </p>
            </div>
          </div>
        </div>

        {/* Middle - Content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2
              className="text-4xl xl:text-5xl font-bold leading-tight"
              style={{ color: "#ffffff" }}
            >
              {t.login_panel_title[lang]}
            </h2>
            <p
              className="text-lg mt-4 max-w-md leading-relaxed"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              {t.login_panel_desc[lang]}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div
              className="rounded-xl p-4"
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <BookOpen className="w-5 h-5 mb-2" style={{ color: "#f0d080" }} />
              <p className="font-medium text-sm" style={{ color: "#ffffff" }}>
                {t.login_panel_documents[lang]}
              </p>
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                {t.login_panel_documents_desc[lang]}
              </p>
            </div>
            <div
              className="rounded-xl p-4"
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <ClipboardList className="w-5 h-5 mb-2" style={{ color: "#f0d080" }} />
              <p className="font-medium text-sm" style={{ color: "#ffffff" }}>
                {t.login_panel_presence[lang]}
              </p>
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                {t.login_panel_presence_desc[lang]}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            {t.login_panel_footer[lang]}
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div
        className="flex-1 flex items-center justify-center p-6 sm:p-12 relative"
        style={{ background: "linear-gradient(to bottom right, #f8fafc, #ecfdf5)" }}
      >
        {/* Language Toggle - top right */}
        <button
          onClick={toggleLang}
          className="absolute top-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
          style={{
            backgroundColor: isAr ? "#ecfdf5" : "#f8fafc",
            color: "#0e7c47",
            border: "1px solid #e2e8f0",
            ...(isAr ? { left: "16px" } : { right: "16px" }),
          }}
          title={isAr ? "Passer en Français" : "التبديل إلى العربية"}
        >
          <Languages className="w-3.5 h-3.5" />
          {isAr ? "FR" : "عربية"}
        </button>

        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden mb-10 text-center">
            <div className="inline-flex items-center gap-3 mb-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg"
                style={{ background: "linear-gradient(135deg, #0e7c47, #065f35)" }}
              >
                <GraduationCap className="w-6 h-6" style={{ color: "#ffffff" }} />
              </div>
              <div style={{ textAlign: isAr ? "right" : "left" }}>
                <h1 className="text-xl font-bold" style={{ color: "#0f172a" }}>
                  {isAr ? "ثانوية الخوارزمي" : "Lycée Alkhwarizmi"}
                </h1>
                <p className="text-xs" style={{ color: "#94a3b8" }}>
                  {isAr ? "أيت أعميرة" : "Aït Amira"}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "#0f172a" }}>
              {t.login_title[lang]}
            </h2>
            <p className="mt-2" style={{ color: "#64748b" }}>
              {t.login_subtitle[lang]}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                className="flex items-center gap-3 p-4 rounded-xl text-sm"
                style={{
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#b91c1c",
                }}
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="identifier"
                className="block text-sm font-medium"
                style={{ color: "#0f172a" }}
              >
                {t.login_identifier_label[lang]}
              </label>
              <div className="relative">
                <div
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{ color: "#94a3b8", ...(isAr ? { right: "16px" } : { left: "16px" }) }}
                >
                  <User className="w-[18px] h-[18px]" />
                </div>
                <input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={t.login_identifier_placeholder[lang]}
                  required
                  dir="ltr"
                  className="w-full py-3.5 rounded-xl transition-all"
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    color: "#0f172a",
                    paddingLeft: isAr ? "16px" : "48px",
                    paddingRight: isAr ? "48px" : "16px",
                  }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-medium"
                style={{ color: "#0f172a" }}
              >
                {t.login_password_label[lang]}
              </label>
              <div className="relative">
                <div
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{ color: "#94a3b8", ...(isAr ? { right: "16px" } : { left: "16px" }) }}
                >
                  <Lock className="w-[18px] h-[18px]" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.login_password_placeholder[lang]}
                  required
                  dir="ltr"
                  className="w-full py-3.5 rounded-xl transition-all"
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    color: "#0f172a",
                    paddingLeft: isAr ? "48px" : "48px",
                    paddingRight: isAr ? "48px" : "48px",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "#94a3b8", ...(isAr ? { left: "16px" } : { right: "16px" }) }}
                >
                  {showPassword ? (
                    <EyeOff className="w-[18px] h-[18px]" />
                  ) : (
                    <Eye className="w-[18px] h-[18px]" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 font-semibold rounded-xl shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #0e7c47, #065f35)",
                color: "#ffffff",
                boxShadow: "0 10px 25px -5px rgba(14,124,71,0.3)",
              }}
            >
              {isSubmitting ? (
                <>
                  <div
                    className="w-5 h-5 border-2 rounded-full animate-spin"
                    style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#ffffff" }}
                  />
                  {t.login_submitting[lang]}
                </>
              ) : (
                t.login_submit[lang]
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs" style={{ color: "#94a3b8" }}>
            {t.login_help[lang]}
          </p>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium transition-all"
              style={{ color: "#0e7c47" }}
            >
              {isAr ? (
                <>
                  {t.login_back[lang]}
                  <ArrowLeft className="w-3.5 h-3.5" style={{ transform: "rotate(180deg)" }} />
                </>
              ) : (
                <>
                  <ArrowLeft className="w-3.5 h-3.5" />
                  {t.login_back[lang]}
                </>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
