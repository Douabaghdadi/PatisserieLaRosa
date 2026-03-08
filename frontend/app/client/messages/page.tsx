"use client";
import Link from "next/link";

export default function ClientMessages() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f7fa", padding: "2rem 0" }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1" style={{ color: "#2c3e50", fontWeight: "700" }}>
              ✉️ Messagerie
            </h2>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link href="/client" style={{ textDecoration: "none" }}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Messagerie</li>
              </ol>
            </nav>
          </div>
          <Link href="/client" className="btn btn-outline-primary">
            <i className="mdi mdi-arrow-left me-2"></i>
            Retour
          </Link>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <div style={{ fontSize: "5rem", opacity: 0.3 }}>✉️</div>
            <h4 className="mt-3 mb-2">Messagerie</h4>
            <p className="text-muted">Accédez à votre messagerie</p>
            <p className="text-muted small">Cette fonctionnalité sera bientôt disponible</p>
          </div>
        </div>
      </div>
    </div>
  );
}
