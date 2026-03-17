"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import Header from "../components/Header";

const FacebookLogin = dynamic(() => import("../components/FacebookLogin"), {
  ssr: false,
  loading: () => (
    <button disabled style={{ width: "100%", padding: "15px", backgroundColor: "#e2e8f0", color: "#718096", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "not-allowed", marginBottom: "15px" }}>Chargement...</button>
  )
});

const GoogleLogin = dynamic(() => import("../components/GoogleLogin"), {
  ssr: false,
  loading: () => (
    <button disabled style={{ width: "100%", padding: "15px", backgroundColor: "#e2e8f0", color: "#718096", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "not-allowed", marginBottom: "15px" }}>Chargement...</button>
  )
});

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleFacebookCallback = async (code: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/facebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/");
      } else {
        setError(data.message || "Erreur de connexion Facebook");
      }
    } catch {
      setError("Erreur de connexion");
    }
  };

  const handleGoogleCallback = async (code: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/");
      } else {
        setError(data.message || "Erreur de connexion Google");
      }
    } catch {
      setError("Erreur de connexion");
    }
  };

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      const state = searchParams.get('state');
      if (state === 'google') {
        handleGoogleCallback(code);
      } else {
        handleFacebookCallback(code);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push(data.user.role === 'admin' ? '/admin' : '/');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Erreur de connexion");
    }
  };

  return (
    <>
      <Header />
      <div style={{ 
        minHeight: "100vh", 
        background: "#f8f9fa",
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        padding: "40px 20px",
        paddingTop: "180px"
      }}>
      {/* Carte englobant logo + formulaire */}
      <div style={{ 
        display: "flex",
        alignItems: "center",
        gap: "50px",
        maxWidth: "650px",
        width: "100%",
        background: "white",
        borderRadius: "16px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
        padding: "35px"
      }}>
        {/* Logo à gauche */}
        <div style={{ 
          flex: "0 0 220px", 
          display: "flex", 
          justifyContent: "center",
          alignItems: "center"
        }}>
          <img 
            src="/img/logo-la-rosa.png" 
            alt="La Rosa Logo" 
            style={{ width: "100%", maxWidth: "220px", height: "auto" }}
          />
        </div>

        {/* Formulaire à droite */}
        <div style={{ 
          flex: "1",
          maxWidth: "280px"
        }}>
          {/* Titre */}
          <h2 style={{ 
            fontSize: "22px", 
            fontWeight: "700", 
            marginBottom: "18px", 
            color: "#ec4899",
            textAlign: "center"
          }}>
            Connexion
          </h2>
        
          {error && (
            <div style={{ 
              padding: "8px 12px", 
              background: "#fce7f3", 
              color: "#ec4899", 
              borderRadius: "8px", 
              marginBottom: "12px",
              border: "1px solid #fbcfe8",
              fontSize: "12px"
            }}>{error}</div>
          )}
        
          {/* Boutons sociaux */}
          <FacebookLogin onSuccess={() => {}} onError={() => {}} />
          <GoogleLogin onSuccess={() => {}} onError={() => {}} />
        
          {/* Séparateur */}
          <div style={{ 
            textAlign: "center", 
            margin: "20px 0", 
            color: "#a0aec0",
            position: "relative"
          }}>
            <span style={{ background: "#f8f9fa", padding: "0 15px", position: "relative", zIndex: 1, fontSize: "13px" }}>ou</span>
            <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "#e2e8f0" }}></div>
          </div>
        
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", marginBottom: "5px", color: "#4a5568", fontWeight: "600", fontSize: "12px" }}>Email</label>
              <input
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={{ 
                  width: "100%", 
                  padding: "12px 14px", 
                  border: "1.5px solid #e2e8f0", 
                  borderRadius: "8px", 
                  fontSize: "13px", 
                  boxSizing: "border-box", 
                  outline: "none",
                  transition: "all 0.3s ease",
                  background: "white"
                }}
                onFocus={(e) => e.target.style.borderColor = "#ec4899"}
                onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                required
              />
            </div>
          
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", marginBottom: "5px", color: "#4a5568", fontWeight: "600", fontSize: "12px" }}>Mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                style={{ 
                  width: "100%", 
                  padding: "12px 14px", 
                  border: "1.5px solid #e2e8f0", 
                  borderRadius: "8px", 
                  fontSize: "13px", 
                  boxSizing: "border-box", 
                  outline: "none",
                  transition: "all 0.3s ease",
                  background: "white"
                }}
                onFocus={(e) => e.target.style.borderColor = "#ec4899"}
                onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                required
              />
            </div>
          
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", color: "#718096", fontSize: "12px" }}>
                <input type="checkbox" style={{ width: "14px", height: "14px", accentColor: "#ec4899" }} />
                <span>Se souvenir de moi</span>
              </label>
              <Link href="/forgot-password" style={{ color: "#ec4899", textDecoration: "none", fontSize: "12px", fontWeight: "600" }}>
                Mot de passe oublié ?
              </Link>
            </div>
          
            <button
              type="submit"
              style={{ 
                width: "100%", 
                padding: "12px", 
                background: "#ec4899", 
                color: "white", 
                border: "none", 
                borderRadius: "8px", 
                fontSize: "14px", 
                fontWeight: "700", 
                cursor: "pointer", 
                marginBottom: "16px",
                transition: "background 0.3s ease"
              }}
              onMouseOver={(e) => (e.target as HTMLButtonElement).style.background = "#db2777"}
              onMouseOut={(e) => (e.target as HTMLButtonElement).style.background = "#ec4899"}
            >
              Se connecter
            </button>
          
            <div style={{ textAlign: "center" }}>
              <span style={{ color: "#718096", fontSize: "13px" }}>Pas encore de compte ? </span>
              <Link href="/register" style={{ color: "#ec4899", textDecoration: "none", fontWeight: "700", fontSize: "13px" }}>
                S&apos;inscrire
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner-border" style={{ color: '#ec4899' }} role="status"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
