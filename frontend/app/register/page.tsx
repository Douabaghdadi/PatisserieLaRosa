"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../components/Header";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
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
      setError("Erreur d'inscription");
    }
  };

  return (
    <>
      <Header />
      <div style={{ 
        minHeight: "100vh", 
        marginTop: "100px",
        background: "#f8f9fa",
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        padding: "40px 20px"
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
              Inscription
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
          
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: "#4a5568", fontWeight: "600", fontSize: "12px" }}>Nom complet</label>
                <input
                  type="text"
                  placeholder="Votre nom"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
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

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: "#4a5568", fontWeight: "600", fontSize: "12px" }}>Confirmer le mot de passe</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
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
                S&apos;inscrire
              </button>
            
              <div style={{ textAlign: "center" }}>
                <span style={{ color: "#718096", fontSize: "13px" }}>Vous avez déjà un compte ? </span>
                <Link href="/login" style={{ color: "#ec4899", textDecoration: "none", fontWeight: "700", fontSize: "13px" }}>
                  Se connecter
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
