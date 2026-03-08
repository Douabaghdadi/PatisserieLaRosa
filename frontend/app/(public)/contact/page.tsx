"use client";
import { useState, useEffect } from "react";

export default function ContactPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        alert('Erreur lors de l\'envoi du message');
      }
    } catch (error) {
      alert('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#fafafa", minHeight: "100vh", paddingBottom: "80px" }}>
      {/* Hero Section - Rose moderne */}
      <div style={{ 
        background: "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)", 
        padding: "60px 0 50px", 
        marginBottom: "50px",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          top: "10%",
          right: "10%",
          width: "200px",
          height: "200px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%"
        }}></div>
        <div style={{
          position: "absolute",
          bottom: "-50px",
          left: "5%",
          width: "150px",
          height: "150px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "50%"
        }}></div>
        <div className="container text-center" style={{ position: "relative", zIndex: 1 }}>
          <span style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.25)",
            padding: "6px 18px",
            borderRadius: "20px",
            marginBottom: "15px"
          }}>
            <span style={{ color: "white", fontSize: "12px", fontWeight: "600", letterSpacing: "1.5px", textTransform: "uppercase" }}>
              Support Client
            </span>
          </span>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: "white", marginBottom: "12px", letterSpacing: "-0.5px" }}>
            Contactez-nous
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.9)", maxWidth: "600px", margin: "0 auto", fontWeight: "400" }}>
            Une question sur nos produits ? Notre équipe est là pour vous aider.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="row g-5">
          {/* Informations de contact */}
          <div className="col-lg-4">
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              padding: isMobile ? "25px 20px" : "35px", 
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)", 
              height: "100%",
              border: "1px solid #f0f0f0"
            }}>
              <h3 style={{ fontSize: isMobile ? "18px" : "20px", fontWeight: "700", color: "#333", marginBottom: isMobile ? "25px" : "30px" }}>
                Nos Coordonnées
              </h3>

              {/* Adresse */}
              <div style={{ display: "flex", gap: isMobile ? "15px" : "18px", marginBottom: isMobile ? "25px" : "28px", alignItems: "flex-start" }}>
                <div style={{ 
                  width: isMobile ? "42px" : "46px", 
                  height: isMobile ? "42px" : "46px", 
                  minWidth: isMobile ? "42px" : "46px",
                  borderRadius: "12px", 
                  background: "#fce7f3", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  flexShrink: 0 
                }}>
                  <i className="fas fa-map-marker-alt" style={{ fontSize: isMobile ? "16px" : "18px", color: "#ec4899" }}></i>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h5 style={{ fontSize: isMobile ? "14px" : "15px", fontWeight: "600", color: "#333", marginBottom: "5px" }}>Adresses</h5>
                  <p style={{ fontSize: isMobile ? "13px" : "14px", color: "#666", margin: 0, lineHeight: "1.6", wordBreak: "break-word" }}>
                    Av Habib Bourguiba, Korba<br />
                    Rue dddddddd, Korba<br />
                    Rue Aaaaaaaaa, Kelibia
                  </p>
                </div>
              </div>

              {/* Téléphone */}
              <div style={{ display: "flex", gap: isMobile ? "15px" : "18px", marginBottom: isMobile ? "25px" : "28px", alignItems: "flex-start" }}>
                <div style={{ 
                  width: isMobile ? "42px" : "46px", 
                  height: isMobile ? "42px" : "46px", 
                  minWidth: isMobile ? "42px" : "46px",
                  borderRadius: "12px", 
                  background: "#fce7f3", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  flexShrink: 0 
                }}>
                  <i className="fas fa-phone-alt" style={{ fontSize: isMobile ? "16px" : "18px", color: "#ec4899" }}></i>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h5 style={{ fontSize: isMobile ? "14px" : "15px", fontWeight: "600", color: "#333", marginBottom: "5px" }}>Téléphone</h5>
                  <p style={{ fontSize: isMobile ? "13px" : "14px", color: "#666", margin: 0, lineHeight: "1.6" }}>
                    <a href="tel:+21622644528" style={{ color: "#666", textDecoration: "none" }}>+216 22 644 528</a>
                  </p>
                </div>
              </div>

              {/* Email */}
              <div style={{ display: "flex", gap: isMobile ? "15px" : "18px", marginBottom: isMobile ? "25px" : "28px", alignItems: "flex-start" }}>
                <div style={{ 
                  width: isMobile ? "42px" : "46px", 
                  height: isMobile ? "42px" : "46px", 
                  minWidth: isMobile ? "42px" : "46px",
                  borderRadius: "12px", 
                  background: "#fce7f3", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  flexShrink: 0 
                }}>
                  <i className="fas fa-envelope" style={{ fontSize: isMobile ? "16px" : "18px", color: "#ec4899" }}></i>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h5 style={{ fontSize: isMobile ? "14px" : "15px", fontWeight: "600", color: "#333", marginBottom: "5px" }}>Email</h5>
                  <p style={{ fontSize: isMobile ? "13px" : "14px", color: "#666", margin: 0, wordBreak: "break-word" }}>
                    <a href="mailto:larosa.korba@gmail.com" style={{ color: "#666", textDecoration: "none" }}>larosa.korba@gmail.com</a>
                  </p>
                </div>
              </div>

              {/* Horaires */}
              <div style={{ display: "flex", gap: isMobile ? "15px" : "18px", alignItems: "flex-start" }}>
                <div style={{ 
                  width: isMobile ? "42px" : "46px", 
                  height: isMobile ? "42px" : "46px", 
                  minWidth: isMobile ? "42px" : "46px",
                  borderRadius: "12px", 
                  background: "#fce7f3", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  flexShrink: 0 
                }}>
                  <i className="fas fa-clock" style={{ fontSize: isMobile ? "16px" : "18px", color: "#ec4899" }}></i>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h5 style={{ fontSize: isMobile ? "14px" : "15px", fontWeight: "600", color: "#333", marginBottom: "5px" }}>Horaires</h5>
                  <p style={{ fontSize: isMobile ? "13px" : "14px", color: "#666", margin: 0, lineHeight: "1.6" }}>
                    Lun - Dim: 9h00 - 21h00
                  </p>
                </div>
              </div>

              {/* Réseaux sociaux */}
              <div style={{ marginTop: isMobile ? "30px" : "35px", paddingTop: isMobile ? "25px" : "30px", borderTop: "1px solid #f0f0f0" }}>
                <h5 style={{ fontSize: isMobile ? "14px" : "15px", fontWeight: "600", color: "#333", marginBottom: "15px" }}>Suivez-nous</h5>
                <div style={{ display: "flex", gap: "10px" }}>
                  {[
                    { icon: 'facebook-f', url: 'https://www.facebook.com/LaR0sa' },
                    { icon: 'instagram', url: 'https://www.instagram.com/larosa.korba' },
                    { icon: 'whatsapp', url: 'https://wa.me/21622644528' }
                  ].map((social) => (
                    <a 
                      key={social.icon}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        width: isMobile ? "38px" : "42px", 
                        height: isMobile ? "38px" : "42px", 
                        borderRadius: "10px", 
                        background: "#333", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        color: "white", 
                        transition: "all 0.3s",
                        textDecoration: "none"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#ec4899"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "#333"}
                    >
                      <i className={`fab fa-${social.icon}`}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="col-lg-8">
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              padding: "35px", 
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              border: "1px solid #f0f0f0"
            }}>
              <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#333", marginBottom: "25px" }}>
                Envoyez-nous un message
              </h3>

              {success && (
                <div style={{ 
                  background: "#dcfce7", 
                  color: "#16a34a", 
                  padding: "14px 18px", 
                  borderRadius: "10px", 
                  marginBottom: "25px", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "10px",
                  border: "1px solid #bbf7d0",
                  fontSize: "14px"
                }}>
                  <i className="fas fa-check-circle"></i>
                  Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#666", marginBottom: "8px", display: "block" }}>
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{ 
                        width: "100%", 
                        padding: "12px 16px", 
                        border: "1px solid #e0e0e0", 
                        borderRadius: "10px", 
                        fontSize: "14px", 
                        outline: "none", 
                        transition: "border-color 0.3s", 
                        boxSizing: "border-box",
                        background: "#fafafa"
                      }}
                      placeholder="Votre nom"
                      onFocus={(e) => {
                        e.target.style.borderColor = "#ec4899";
                        e.target.style.background = "white";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e0e0e0";
                        e.target.style.background = "#fafafa";
                      }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#666", marginBottom: "8px", display: "block" }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ 
                        width: "100%", 
                        padding: "12px 16px", 
                        border: "1px solid #e0e0e0", 
                        borderRadius: "10px", 
                        fontSize: "14px", 
                        outline: "none", 
                        transition: "border-color 0.3s", 
                        boxSizing: "border-box",
                        background: "#fafafa"
                      }}
                      placeholder="votre@email.com"
                      onFocus={(e) => {
                        e.target.style.borderColor = "#ec4899";
                        e.target.style.background = "white";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e0e0e0";
                        e.target.style.background = "#fafafa";
                      }}
                    />
                  </div>
                  <div className="col-12">
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#666", marginBottom: "8px", display: "block" }}>
                      Sujet *
                    </label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      style={{ 
                        width: "100%", 
                        padding: "12px 16px", 
                        border: "1px solid #e0e0e0", 
                        borderRadius: "10px", 
                        fontSize: "14px", 
                        outline: "none", 
                        transition: "border-color 0.3s", 
                        boxSizing: "border-box",
                        backgroundColor: "#fafafa"
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#ec4899";
                        e.target.style.background = "white";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e0e0e0";
                        e.target.style.background = "#fafafa";
                      }}
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="info">Information produit</option>
                      <option value="order">Commande personnalisée</option>
                      <option value="reservation">Réservation gâteau</option>
                      <option value="delivery">Livraison</option>
                      <option value="event">Événement spécial</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#666", marginBottom: "8px", display: "block" }}>
                      Message *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{ 
                        width: "100%", 
                        padding: "12px 16px", 
                        border: "1px solid #e0e0e0", 
                        borderRadius: "10px", 
                        fontSize: "14px", 
                        outline: "none", 
                        transition: "border-color 0.3s", 
                        resize: "vertical", 
                        boxSizing: "border-box",
                        background: "#fafafa"
                      }}
                      placeholder="Décrivez votre demande en détail..."
                      onFocus={(e) => {
                        e.target.style.borderColor = "#ec4899";
                        e.target.style.background = "white";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e0e0e0";
                        e.target.style.background = "#fafafa";
                      }}
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        padding: "14px 35px",
                        background: loading ? "#cbd5e0" : "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        fontSize: "15px",
                        fontWeight: "600",
                        cursor: loading ? "not-allowed" : "pointer",
                        transition: "all 0.3s"
                      }}
                      onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "linear-gradient(135deg, #d946a6 0%, #ec4899 100%)")}
                      onMouseLeave={(e) => !loading && (e.currentTarget.style.background = "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)")}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane me-2"></i>
                          Envoyer le message
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
