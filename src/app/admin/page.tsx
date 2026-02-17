"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { GraduationCap, Lock, User, Eye, EyeOff, AlertCircle, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const { admin, login, isLoading } = useAdminAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && admin) router.replace("/admin/dashboard");
  }, [admin, isLoading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    const success = await login(username.trim(), password);
    if (success) {
      router.push("/admin/dashboard");
    } else {
      setError("Nom d'utilisateur ou mot de passe incorrect.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: "#0e7c47", borderTopColor: "transparent" }} /></div>;

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "linear-gradient(135deg, #0f2419, #065f35, #0e7c47)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <ShieldCheck className="w-8 h-8" style={{ color: "#f0d080" }} />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "#ffffff" }}>Administration</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>Lycée Alkhwarizmi — Aït Amira</p>
        </div>

        <div className="rounded-2xl p-8" style={{ backgroundColor: "#ffffff", boxShadow: "0 25px 60px rgba(0,0,0,0.3)" }}>
          <h2 className="text-xl font-bold mb-1" style={{ color: "#0f172a" }}>Connexion Admin</h2>
          <p className="text-sm mb-6" style={{ color: "#94a3b8" }}>Accédez à l&apos;espace d&apos;administration.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-3 p-3 rounded-xl text-sm" style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c" }}>
                <AlertCircle className="w-4 h-4 flex-shrink-0" /><span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#0f172a" }}>Nom d&apos;utilisateur</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#94a3b8" }}><User className="w-4 h-4" /></div>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" required className="w-full pl-10 pr-4 py-3 rounded-xl" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#0f172a" }}>Mot de passe</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#94a3b8" }}><Lock className="w-4 h-4" /></div>
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="w-full pl-10 pr-10 py-3 rounded-xl" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: "#94a3b8" }}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full py-3 font-semibold rounded-xl shadow-lg disabled:opacity-60 flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg, #0e7c47, #065f35)", color: "#ffffff" }}>
              {isSubmitting ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Connexion...</> : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
