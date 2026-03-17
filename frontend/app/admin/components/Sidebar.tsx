"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface User {
  name: string;
  email: string;
  role: string;
}

const menuItems = [
  { path: "/admin", icon: "mdi-view-dashboard", label: "Dashboard", color: "#d946a6" },
  { path: "/admin/users", icon: "mdi-account-group", label: "Utilisateurs", color: "#ec4899" },
  { path: "/admin/products", icon: "mdi-package-variant-closed", label: "Produits", color: "#06b6d4" },
  { path: "/admin/orders", icon: "mdi-cart-outline", label: "Commandes", color: "#10b981" },
  { path: "/admin/categories", icon: "mdi-shape", label: "Catégories", color: "#f59e0b" },
  { path: "/admin/subcategories", icon: "mdi-shape-outline", label: "Sous-catégories", color: "#f97316" },
  { path: "/admin/flavors", icon: "mdi-palette", label: "Goûts", color: "#8b5cf6" },
  { path: "/admin/messages", icon: "mdi-email-outline", label: "Messages", color: "#d946a6" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [user] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  });

  const isActive = (path: string) => {
    if (path === "/admin") return pathname === "/admin";
    return pathname.startsWith(path);
  };

  return (
    <>
      <style jsx>{`
        .modern-sidebar {
          background: #ffffff;
          min-height: 100vh;
          width: 260px;
          position: fixed;
          left: 0;
          top: 0;
          padding-top: 80px;
          z-index: 1000;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 2px 0 12px rgba(0, 0, 0, 0.08);
          border-right: 1px solid #e2e8f0;
        }
        
        .sidebar-header {
          padding: 0 1.5rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 1rem;
        }
        
        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: white;
          text-decoration: none;
        }
        
        .sidebar-brand-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #d946a6 0%, #be185d 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
        }
        
        .sidebar-brand-text {
          font-weight: 700;
          font-size: 1.125rem;
        }
        
        .sidebar-nav {
          padding: 0 1rem;
          list-style: none;
          margin: 0;
        }
        
        .nav-item {
          margin-bottom: 0.25rem;
        }
        
        .modern-sidebar .nav-link {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          gap: 1rem;
          padding: 0.625rem 1rem;
          color: #475569;
          text-decoration: none;
          border-radius: 10px;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        
        .modern-sidebar .nav-link:hover {
          color: #1e293b;
          background: #f1f5f9;
        }
        
        .modern-sidebar .nav-link.active {
          color: #d946a6;
          background: linear-gradient(135deg, rgba(217, 70, 166, 0.1) 0%, rgba(190, 24, 93, 0.1) 100%);
        }
        
        .modern-sidebar .nav-link.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 60%;
          background: linear-gradient(180deg, #d946a6 0%, #be185d 100%);
          border-radius: 0 4px 4px 0;
        }
        
        .nav-icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        
        .modern-sidebar .nav-link:hover .nav-icon-wrapper,
        .modern-sidebar .nav-link.active .nav-icon-wrapper {
          transform: scale(1.1);
        }
        
        .nav-icon {
          font-size: 1.25rem;
        }
        
        .nav-label {
          font-weight: 500;
          font-size: 0.9rem;
          color: inherit;
          line-height: 1;
          display: flex;
          align-items: center;
          flex: 1;
        }
        
        .sidebar-section-title {
          padding: 1.5rem 1rem 0.75rem;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #94a3b8;
        }
        
        .sidebar-footer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1rem;
          border-top: 1px solid #fce7f3;
          background: #fef3f2;
        }
        
        .user-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: white;
          border-radius: 10px;
          border: 1px solid #fce7f3;
        }
        
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          object-fit: cover;
          border: 2px solid #fce7f3;
        }
        
        .user-info {
          flex: 1;
          min-width: 0;
        }
        
        .user-name {
          color: #1e293b;
          font-weight: 600;
          font-size: 0.875rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .user-role {
          color: #64748b;
          font-size: 0.75rem;
        }
      `}</style>
      
      <nav className="modern-sidebar" id="sidebar">
        <div className="sidebar-section-title">Menu Principal</div>
        
        <ul className="sidebar-nav">
          {menuItems.slice(0, 4).map((item) => (
            <li key={item.path} className="nav-item">
              <Link 
                href={item.path} 
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem' } as React.CSSProperties}
              >
                <span 
                  className="nav-icon-wrapper" 
                  style={{ background: `${item.color}20`, flexShrink: 0, width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <i className={`mdi ${item.icon} nav-icon`} style={{ color: item.color, fontSize: '1.25rem' }}></i>
                </span>
                <span className="nav-label" style={{ flex: 1, fontWeight: 500, fontSize: '0.9rem' }}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="sidebar-section-title">Catalogue</div>
        
        <ul className="sidebar-nav">
          {menuItems.slice(4, 7).map((item) => (
            <li key={item.path} className="nav-item">
              <Link 
                href={item.path} 
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem' } as React.CSSProperties}
              >
                <span 
                  className="nav-icon-wrapper" 
                  style={{ background: `${item.color}20`, flexShrink: 0, width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <i className={`mdi ${item.icon} nav-icon`} style={{ color: item.color, fontSize: '1.25rem' }}></i>
                </span>
                <span className="nav-label" style={{ flex: 1, fontWeight: 500, fontSize: '0.9rem' }}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="sidebar-section-title">Communication</div>
        
        <ul className="sidebar-nav">
          {menuItems.slice(7).map((item) => (
            <li key={item.path} className="nav-item">
              <Link 
                href={item.path} 
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem' } as React.CSSProperties}
              >
                <span 
                  className="nav-icon-wrapper" 
                  style={{ background: `${item.color}20`, flexShrink: 0, width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <i className={`mdi ${item.icon} nav-icon`} style={{ color: item.color, fontSize: '1.25rem' }}></i>
                </span>
                <span className="nav-label" style={{ flex: 1, fontWeight: 500, fontSize: '0.9rem' }}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        
        {user && (
          <div className="sidebar-footer" style={{ display: 'none' }}>
          </div>
        )}
      </nav>
    </>
  );
}
