"use client";
import { API_URL, getImageUrl } from '@/lib/api';
import { useState, useEffect } from "react";
import StarRating from "./StarRating";

interface Review {
  _id: string;
  rating: number;
  comment: string;
  user: { name: string };
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  };

  const checkCanReview = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/reviews/can-review/${productId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      setCanReview(data.canReview);
      setHasReviewed(data.hasReviewed);
    } catch (error) {
      console.error("Erreur lors de la vérification:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/reviews/product/${productId}`);
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      console.error("Erreur lors du chargement des avis:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
    checkLoginStatus();
    checkCanReview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRating) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          productId,
          rating: newRating,
          comment: newComment
        })
      });

      if (res.ok) {
        setNewRating(0);
        setNewComment("");
        fetchReviews();
        checkCanReview(); // Recharger le statut
      } else {
        const data = await res.json();
        alert(data.error || "Erreur lors de l'ajout de l'avis");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'avis:", error);
    }
    setLoading(false);
  };

  return (
    <div>
      <h3 style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "24px", fontWeight: "700", marginBottom: "24px", color: "#1e293b" }}>
        <span style={{ width: "4px", height: "24px", borderRadius: "2px", background: "linear-gradient(180deg, #ec4899 0%, #db2777 100%)" }}></span>
        Avis clients
        <span style={{ fontSize: "14px", fontWeight: "600", color: "#db2777", background: "#fdf2f8", padding: "3px 10px", borderRadius: "999px" }}>
          {reviews.length}
        </span>
      </h3>

      {/* Formulaire d'ajout d'avis */}
      {isLoggedIn ? (
        canReview ? (
          <div style={{ backgroundColor: "#fdf2f8", padding: "24px", borderRadius: "16px", marginBottom: "28px", border: "1px solid #fce7f3" }}>
            <h4 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "16px", color: "#1e293b" }}>
              Donnez votre avis
            </h4>
            <form onSubmit={submitReview}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: "600", color: "#64748b" }}>
                  Votre note
                </label>
                <StarRating rating={newRating} onRatingChange={setNewRating} size={26} />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: "600", color: "#64748b" }}>
                  Commentaire (optionnel)
                </label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Partagez votre expérience avec ce produit..."
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: "2px solid #fce7f3",
                    borderRadius: "12px",
                    fontSize: "14px",
                    resize: "vertical",
                    minHeight: "90px",
                    boxSizing: "border-box",
                    outline: "none",
                    background: "white"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#f9a8d4"}
                  onBlur={(e) => e.target.style.borderColor = "#fce7f3"}
                  maxLength={500}
                />
              </div>
              <button
                type="submit"
                disabled={!newRating || loading}
                style={{
                  background: newRating ? "linear-gradient(135deg, #ec4899 0%, #db2777 100%)" : "#cbd5e1",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: newRating ? "pointer" : "not-allowed",
                  boxShadow: newRating ? "0 6px 16px rgba(236, 72, 153, 0.3)" : "none"
                }}
              >
                {loading ? "Envoi..." : "Publier l'avis"}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#f8fafc", padding: "14px 18px", borderRadius: "12px", marginBottom: "28px", border: "1px solid #f1f5f9" }}>
            <i className="fas fa-info-circle" style={{ color: "#94a3b8" }}></i>
            <p style={{ color: "#64748b", margin: 0, fontSize: "14px" }}>
              {hasReviewed 
                ? "Vous avez déjà laissé un avis pour ce produit." 
                : "Vous devez acheter ce produit avant de pouvoir laisser un avis."}
            </p>
          </div>
        )
      ) : (
        <div style={{ backgroundColor: "#fdf2f8", padding: "16px 18px", borderRadius: "12px", marginBottom: "28px", textAlign: "center", border: "1px solid #fce7f3" }}>
          <p style={{ color: "#64748b", margin: 0, fontSize: "14px" }}>
            <a href="/login" style={{ color: "#db2777", textDecoration: "none", fontWeight: "700" }}>
              Connectez-vous
            </a> pour laisser un avis
          </p>
        </div>
      )}

      {/* Liste des avis */}
      <div>
        {reviews.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0 12px" }}>
            <i className="far fa-comment-dots" style={{ fontSize: "32px", color: "#f9a8d4", marginBottom: "12px", display: "block" }}></i>
            <p style={{ color: "#64748b", margin: 0, fontSize: "14px" }}>
              Aucun avis pour le moment. Soyez le premier à donner votre avis !
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              style={{
                display: "flex",
                gap: "14px",
                padding: "20px 0",
                borderTop: "1px solid #f1f5f9"
              }}
            >
              <div style={{
                width: "42px",
                height: "42px",
                flexShrink: 0,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",
                color: "#db2777",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
                fontSize: "16px"
              }}>
                {review.user.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
                  <div style={{ fontWeight: "700", color: "#1e293b", fontSize: "15px" }}>
                    {review.user.name}
                  </div>
                  <div style={{ color: "#94a3b8", fontSize: "13px", whiteSpace: "nowrap" }}>
                    {new Date(review.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                </div>
                <StarRating rating={review.rating} readonly size={15} />
                {review.comment && (
                  <p style={{ color: "#475569", lineHeight: "1.65", margin: "8px 0 0", fontSize: "14px" }}>
                    {review.comment}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
