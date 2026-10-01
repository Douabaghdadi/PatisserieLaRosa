"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { API_URL, getImageUrl } from '@/lib/api';

interface Product {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  stock: number;
  image?: string;
  rating?: number;
  ratingCount?: number;
  category?: { _id: string; name: string };
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
}

interface Subcategory {
  _id: string;
  name: string;
  category?: { _id: string } | string;
}

interface Flavor {
  _id: string;
}

interface User {
  _id: string;
  role: string;
  createdAt: string;
}

interface Contact {
  _id: string;
  name: string;
  subject: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

// En dessous de ce stock, un produit apparaît dans "À surveiller"
const LOW_STOCK = 10;

const plural = (n: number, singular: string, pluralForm = `${singular}s`) =>
  `${n} ${n > 1 ? pluralForm : singular}`;

const formatPrice = (product: Product) => {
  const finalPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price;
  return `${finalPrice.toFixed(3)} DT`;
};

const timeAgo = (date: string) => {
  const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "hier";
  if (days < 7) return `il y a ${days} jours`;
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

function KpiCard({ href, icon, label, value, note, highlight = false }: {
  href: string;
  icon: string;
  label: string;
  value: number;
  note: string;
  highlight?: boolean;
}) {
  return (
    <Link href={href} className={`lr-card lr-kpi ${highlight ? 'is-highlight' : ''}`}>
      <span className="lr-kpi-icon"><i className={`mdi ${icon}`}></i></span>
      <span className="lr-kpi-label">{label}</span>
      <span className="lr-kpi-value">{value}</span>
      <span className="lr-kpi-note">{note}</span>
    </Link>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="lr-stars" aria-label={`${rating.toFixed(1)} sur 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <i key={i} className={`mdi ${i <= Math.round(rating) ? 'mdi-star' : 'mdi-star-outline'}`}></i>
      ))}
    </span>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [flavors, setFlavors] = useState<Flavor[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          setUserName(JSON.parse(userData).name || "");
        } catch {
          // JSON invalide dans le localStorage
        }
      }

      // Récupérer toutes les données en parallèle
      const responses = await Promise.all([
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/categories`),
        fetch(`${API_URL}/subcategories`),
        fetch(`${API_URL}/flavors`),
        fetch(`${API_URL}/users`, { headers }),
        fetch(`${API_URL}/contacts`, { headers })
      ]);
      const [productsRes, categoriesRes, subcategoriesRes, flavorsRes, usersRes, contactsRes] = responses;

      // Token expiré ou invalide : retour au login
      if (contactsRes.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
        return;
      }

      if (responses.some((res) => !res.ok)) setLoadError(true);
      const read = async (res: Response) => (res.ok ? res.json() : []);

      setProducts(await read(productsRes));
      setCategories(await read(categoriesRes));
      setSubcategories(await read(subcategoriesRes));
      setFlavors(await read(flavorsRes));
      setUsers(await read(usersRes));
      setContacts(await read(contactsRes));
    } catch (error) {
      console.error("Erreur lors du chargement du tableau de bord:", error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="container-scroller">
        <Navbar />
        <div className="container-fluid page-body-wrapper">
          <Sidebar />
          <div className="main-panel">
            <div className="content-wrapper">
              <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
                <div className="spinner-border" role="status" style={{ color: "#d946a6" }}>
                  <span className="visually-hidden">Chargement...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Produits
  const availableCount = products.filter((p) => p.stock > 0).length;
  const promoProducts = products.filter((p) => (p.discount ?? 0) > 0);
  const averageDiscount = promoProducts.length
    ? Math.round(promoProducts.reduce((sum, p) => sum + (p.discount ?? 0), 0) / promoProducts.length)
    : 0;
  const stockAlerts = products.filter((p) => p.stock < LOW_STOCK).sort((a, b) => a.stock - b.stock);
  const latestProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);
  const topRated = products
    .filter((p) => (p.ratingCount ?? 0) > 0)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.ratingCount ?? 0) - (a.ratingCount ?? 0))
    .slice(0, 4);

  // Catalogue par catégorie
  const productsByCategory = categories
    .map((c) => ({
      ...c,
      count: products.filter((p) => p.category?._id === c._id).length,
      subCount: subcategories.filter((s) =>
        (typeof s.category === 'string' ? s.category : s.category?._id) === c._id
      ).length
    }))
    .sort((a, b) => b.count - a.count);
  const maxCategoryCount = Math.max(1, ...productsByCategory.map((c) => c.count));

  // Clients et messages
  const clients = users.filter((u) => u.role !== 'admin');
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const newClients = clients.filter((u) => new Date(u.createdAt).getTime() >= oneWeekAgo).length;
  const unreadMessages = contacts.filter((c) => c.status === 'unread').length;
  const latestMessages = contacts.slice(0, 4);

  const greeting = new Date().getHours() < 18 ? "Bonjour" : "Bonsoir";
  const displayName = userName ? userName.charAt(0).toUpperCase() + userName.slice(1) : "";
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="container-scroller">
      <Navbar />
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <div className="main-panel">
          <div className="content-wrapper lr-dash">
            <style>{dashboardStyles}</style>

            {/* En-tête */}
            <section className="lr-hero">
              <div>
                <p className="lr-eyebrow">Tableau de bord</p>
                <h1 className="lr-hero-title">{greeting}{displayName ? `, ${displayName}` : ""}</h1>
                <span className="lr-divider"></span>
                <p className="lr-hero-text">Voici un aperçu de votre pâtisserie, {today}.</p>
              </div>
              <div className="lr-hero-actions">
                <a href="/" target="_blank" rel="noopener noreferrer" className="lr-btn lr-btn-outline">
                  <i className="mdi mdi-storefront-outline"></i> Voir le site
                </a>
                <Link href="/admin/products" className="lr-btn lr-btn-primary">
                  <i className="mdi mdi-cupcake"></i> Gérer les produits
                </Link>
              </div>
              <i className="mdi mdi-cupcake lr-hero-deco" aria-hidden="true"></i>
            </section>

            {loadError && (
              <div className="lr-alert">
                <i className="mdi mdi-alert-circle-outline"></i>
                Certaines données n&apos;ont pas pu être chargées. Actualisez la page.
              </div>
            )}

            {/* Chiffres clés */}
            <section className="lr-kpis">
              <KpiCard
                href="/admin/products"
                icon="mdi-cupcake"
                label="Produits"
                value={products.length}
                note={plural(availableCount, "disponible")}
              />
              <KpiCard
                href="/admin/products"
                icon="mdi-tag-heart"
                label="En promotion"
                value={promoProducts.length}
                note={promoProducts.length ? `Remise moyenne de ${averageDiscount} %` : "Aucune promotion en cours"}
              />
              <KpiCard
                href="/admin/users"
                icon="mdi-account-heart"
                label="Clients"
                value={clients.length}
                note={`+${plural(newClients, "nouveau", "nouveaux")} cette semaine`}
              />
              <KpiCard
                href="/admin/messages"
                icon="mdi-email-outline"
                label="Messages non lus"
                value={unreadMessages}
                note={`${plural(contacts.length, "message")} au total`}
                highlight={unreadMessages > 0}
              />
            </section>

            <div className="lr-grid lr-grid-main">
              {/* Dernières créations */}
              <section className="lr-card lr-panel">
                <header className="lr-card-head">
                  <div>
                    <p className="lr-eyebrow">Vitrine</p>
                    <h2 className="lr-card-title">Dernières créations</h2>
                  </div>
                  <Link href="/admin/products" className="lr-link">
                    Tous les produits <i className="mdi mdi-arrow-right"></i>
                  </Link>
                </header>
                {latestProducts.length > 0 ? (
                  <div className="lr-products">
                    {latestProducts.map((product) => (
                      <Link key={product._id} href={`/product/${product._id}`} target="_blank" className="lr-product">
                        <div className="lr-product-img">
                          <img src={getImageUrl(product.image)} alt={product.name} />
                          {(product.discount ?? 0) > 0 && <span className="lr-badge-promo">-{product.discount}%</span>}
                        </div>
                        <div className="lr-product-body">
                          <span className="lr-product-cat">{product.category?.name || "Sans catégorie"}</span>
                          <span className="lr-product-name">{product.name}</span>
                          <span className="lr-product-price">{formatPrice(product)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="lr-empty">
                    <i className="mdi mdi-cupcake"></i>
                    Aucun produit pour le moment
                  </div>
                )}
              </section>

              {/* Stock à surveiller */}
              <section className="lr-card lr-panel">
                <header className="lr-card-head">
                  <div>
                    <p className="lr-eyebrow">Stock</p>
                    <h2 className="lr-card-title">À surveiller</h2>
                  </div>
                  <Link href="/admin/products" className="lr-link">
                    Gérer <i className="mdi mdi-arrow-right"></i>
                  </Link>
                </header>
                {stockAlerts.length > 0 ? (
                  <>
                    <ul className="lr-list">
                      {stockAlerts.slice(0, 5).map((product) => (
                        <li key={product._id} className="lr-list-item">
                          <img src={getImageUrl(product.image)} alt={product.name} className="lr-thumb" />
                          <div className="lr-item-main">
                            <span className="lr-item-title">{product.name}</span>
                            <span className="lr-item-sub">{product.category?.name || "Sans catégorie"}</span>
                          </div>
                          {product.stock <= 0 ? (
                            <span className="lr-pill lr-pill-danger">Rupture</span>
                          ) : (
                            <span className="lr-pill lr-pill-warning">{plural(product.stock, "restant")}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                    {stockAlerts.length > 5 && (
                      <p className="lr-more">+ {plural(stockAlerts.length - 5, "autre produit", "autres produits")}</p>
                    )}
                  </>
                ) : (
                  <div className="lr-empty">
                    <i className="mdi mdi-check-circle-outline"></i>
                    Tous vos produits sont bien en stock
                  </div>
                )}
              </section>
            </div>

            <div className="lr-grid lr-grid-3">
              {/* Catalogue */}
              <section className="lr-card lr-panel">
                <header className="lr-card-head">
                  <div>
                    <p className="lr-eyebrow">Catalogue</p>
                    <h2 className="lr-card-title">Par catégorie</h2>
                  </div>
                  <Link href="/admin/categories" className="lr-link">
                    Gérer <i className="mdi mdi-arrow-right"></i>
                  </Link>
                </header>
                <div className="lr-chips">
                  <span className="lr-chip"><strong>{categories.length}</strong> catégories</span>
                  <span className="lr-chip"><strong>{subcategories.length}</strong> sous-catégories</span>
                  <span className="lr-chip"><strong>{flavors.length}</strong> goûts</span>
                </div>
                {productsByCategory.map((category) => (
                  <div key={category._id} className="lr-bar-row">
                    <div className="lr-bar-label">
                      <span>{category.name}</span>
                      <span>{plural(category.count, "produit")}</span>
                    </div>
                    <div className="lr-bar">
                      <span style={{ width: `${(category.count / maxCategoryCount) * 100}%` }}></span>
                    </div>
                  </div>
                ))}
              </section>

              {/* Les mieux notés */}
              <section className="lr-card lr-panel">
                <header className="lr-card-head">
                  <div>
                    <p className="lr-eyebrow">Avis clients</p>
                    <h2 className="lr-card-title">Les mieux notés</h2>
                  </div>
                </header>
                {topRated.length > 0 ? (
                  <ul className="lr-list">
                    {topRated.map((product) => (
                      <li key={product._id} className="lr-list-item">
                        <img src={getImageUrl(product.image)} alt={product.name} className="lr-thumb" />
                        <div className="lr-item-main">
                          <span className="lr-item-title">{product.name}</span>
                          <span className="lr-item-sub">
                            <Stars rating={product.rating ?? 0} /> {plural(product.ratingCount ?? 0, "avis", "avis")}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="lr-empty">
                    <i className="mdi mdi-star-outline"></i>
                    Pas encore d&apos;avis clients
                  </div>
                )}
              </section>

              {/* Derniers messages */}
              <section className="lr-card lr-panel">
                <header className="lr-card-head">
                  <div>
                    <p className="lr-eyebrow">Contact</p>
                    <h2 className="lr-card-title">Derniers messages</h2>
                  </div>
                  <Link href="/admin/messages" className="lr-link">
                    Tout voir <i className="mdi mdi-arrow-right"></i>
                  </Link>
                </header>
                {latestMessages.length > 0 ? (
                  <ul className="lr-list">
                    {latestMessages.map((message) => (
                      <li key={message._id} className="lr-list-item">
                        <span className="lr-avatar">{message.name.charAt(0).toUpperCase()}</span>
                        <div className="lr-item-main">
                          <span className="lr-item-title">{message.name}</span>
                          <span className="lr-item-sub">{message.subject}</span>
                        </div>
                        <div className="lr-item-side">
                          <span className="lr-time">{timeAgo(message.createdAt)}</span>
                          {message.status === 'unread' && <span className="lr-pill lr-pill-pink">Non lu</span>}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="lr-empty">
                    <i className="mdi mdi-email-open-outline"></i>
                    Aucun message pour le moment
                  </div>
                )}
              </section>
            </div>

            <footer className="lr-footer">
              © {new Date().getFullYear()} La Rosa — Pâtisserie &amp; Glace artisanale
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

// Charte La Rosa : rose #ec4899 / #d946a6 / #be185d, crème, titres en Playfair Display
const dashboardStyles = `
  .lr-dash {
    --pink: #ec4899;
    --pink-deep: #d946a6;
    --pink-dark: #be185d;
    --rose: #fce7f3;
    --rose-soft: #fff5f8;
    --brown: #2c1810;
    --muted: #8c7b80;
    --line: #f3e3ea;
    --serif: 'Playfair Display', Georgia, serif;
    color: var(--brown);
  }
  .lr-dash a { text-decoration: none; }

  .lr-dash .lr-eyebrow {
    margin: 0 0 0.35rem;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--pink);
  }

  /* En-tête */
  .lr-hero {
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1.5rem;
    padding: 2rem 2.25rem;
    margin-bottom: 1.5rem;
    border-radius: 18px;
    border: 1px solid var(--line);
    background: linear-gradient(120deg, #ffffff 0%, var(--rose-soft) 55%, var(--rose) 100%);
  }
  .lr-dash .lr-hero-title {
    margin: 0;
    font-family: var(--serif);
    font-size: 2.1rem;
    font-weight: 400;
    letter-spacing: 0.5px;
    color: var(--brown);
  }
  .lr-divider {
    display: block;
    width: 60px;
    height: 2px;
    margin: 0.9rem 0;
    background: var(--pink);
  }
  .lr-hero-text {
    margin: 0;
    font-size: 0.95rem;
    color: var(--muted);
  }
  .lr-hero-actions {
    position: relative;
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  .lr-hero-deco {
    position: absolute;
    top: 50%;
    right: -30px;
    transform: translateY(-50%) rotate(-12deg);
    font-size: 220px;
    line-height: 1;
    color: var(--pink);
    opacity: 0.06;
    pointer-events: none;
  }

  .lr-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.7rem 1.3rem;
    border-radius: 10px;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    transition: all 0.2s ease;
  }
  .lr-btn i { font-size: 1.05rem; }
  .lr-btn-outline {
    border: 1px solid var(--pink);
    background: #ffffff;
    color: var(--pink);
  }
  .lr-btn-outline:hover {
    background: var(--pink);
    color: #ffffff;
  }
  .lr-btn-primary {
    border: 1px solid transparent;
    background: linear-gradient(135deg, var(--pink-deep) 0%, var(--pink-dark) 100%);
    color: #ffffff;
    box-shadow: 0 6px 18px rgba(217, 70, 166, 0.25);
  }
  .lr-btn-primary:hover {
    color: #ffffff;
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(217, 70, 166, 0.35);
  }

  .lr-alert {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.85rem 1.1rem;
    margin-bottom: 1.25rem;
    border-radius: 12px;
    border: 1px solid #fecdd3;
    background: #fff1f2;
    color: #9f1239;
    font-size: 0.88rem;
  }

  /* Cartes */
  .lr-card {
    background: #ffffff;
    border: 1px solid var(--line);
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(190, 24, 93, 0.04);
  }
  .lr-panel {
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
  }
  .lr-card-head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.25rem;
  }
  .lr-dash .lr-card-title {
    margin: 0;
    font-family: var(--serif);
    font-size: 1.35rem;
    font-weight: 400;
    color: var(--brown);
  }
  .lr-link {
    font-size: 0.78rem;
    font-weight: 600;
    white-space: nowrap;
    color: var(--pink);
  }
  .lr-link:hover { color: var(--pink-dark); }

  /* Chiffres clés */
  .lr-kpis {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1.25rem;
    margin-bottom: 1.5rem;
  }
  .lr-kpi {
    display: flex;
    flex-direction: column;
    padding: 1.4rem 1.5rem;
    color: var(--brown);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .lr-kpi:hover {
    color: var(--brown);
    transform: translateY(-3px);
    box-shadow: 0 12px 28px rgba(190, 24, 93, 0.1);
  }
  .lr-kpi-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    margin-bottom: 1rem;
    border-radius: 12px;
    background: var(--rose);
    color: var(--pink-deep);
    font-size: 1.35rem;
  }
  .lr-kpi-label {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .lr-kpi-value {
    margin: 0.25rem 0;
    font-family: var(--serif);
    font-size: 2.2rem;
    line-height: 1.15;
    color: var(--brown);
  }
  .lr-kpi-note {
    font-size: 0.82rem;
    color: var(--muted);
  }
  .lr-kpi.is-highlight {
    border-color: transparent;
    background: linear-gradient(135deg, var(--pink-deep) 0%, var(--pink-dark) 100%);
  }
  .lr-kpi.is-highlight .lr-kpi-icon {
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
  }
  .lr-kpi.is-highlight .lr-kpi-label,
  .lr-kpi.is-highlight .lr-kpi-note { color: rgba(255, 255, 255, 0.85); }
  .lr-kpi.is-highlight .lr-kpi-value { color: #ffffff; }

  /* Grilles */
  .lr-grid {
    display: grid;
    gap: 1.25rem;
    margin-bottom: 1.5rem;
  }
  .lr-grid-main { grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); }
  .lr-grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }

  /* Produits */
  .lr-products {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1rem;
  }
  .lr-product {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--line);
    border-radius: 12px;
    color: var(--brown);
    transition: all 0.2s ease;
  }
  .lr-product:hover {
    color: var(--brown);
    transform: translateY(-3px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  }
  .lr-product-img {
    position: relative;
    aspect-ratio: 1 / 1;
    background: #faf9f7;
  }
  .lr-product-img img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .lr-badge-promo {
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 0.25rem 0.5rem;
    background: var(--pink);
    color: #ffffff;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.05em;
  }
  .lr-product-body {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    padding: 0.8rem 0.9rem 1rem;
  }
  .lr-product-cat {
    font-size: 0.65rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--pink);
  }
  .lr-product-name {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-family: var(--serif);
    font-size: 0.98rem;
    line-height: 1.3;
  }
  .lr-product-price {
    font-size: 0.85rem;
    color: var(--muted);
  }

  /* Listes */
  .lr-list {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .lr-list-item {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 0.7rem 0;
    border-bottom: 1px solid var(--line);
  }
  .lr-list-item:last-child { border-bottom: none; }
  .lr-thumb {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border-radius: 10px;
    object-fit: cover;
    background: #faf9f7;
  }
  .lr-avatar {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--rose);
    color: var(--pink-dark);
    font-family: var(--serif);
    font-size: 1rem;
  }
  .lr-item-main {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
  }
  .lr-item-title,
  .lr-item-sub {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .lr-item-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--brown);
  }
  .lr-item-sub {
    font-size: 0.78rem;
    color: var(--muted);
  }
  .lr-item-side {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.3rem;
  }
  .lr-time {
    font-size: 0.72rem;
    white-space: nowrap;
    color: var(--muted);
  }
  .lr-stars {
    color: #f59e0b;
    font-size: 0.85rem;
  }
  .lr-pill {
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 600;
    white-space: nowrap;
  }
  .lr-pill-danger { background: #fee2e2; color: #b91c1c; }
  .lr-pill-warning { background: #fef3c7; color: #b45309; }
  .lr-pill-pink { background: var(--rose); color: var(--pink-dark); }
  .lr-more {
    margin: 0.75rem 0 0;
    font-size: 0.8rem;
    color: var(--muted);
  }
  .lr-empty {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1.5rem 0;
    text-align: center;
    font-size: 0.88rem;
    color: var(--muted);
  }
  .lr-empty i {
    font-size: 2.2rem;
    color: var(--pink);
    opacity: 0.6;
  }

  /* Catalogue */
  .lr-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.1rem;
  }
  .lr-chip {
    padding: 0.3rem 0.7rem;
    border: 1px solid var(--line);
    border-radius: 999px;
    background: var(--rose-soft);
    font-size: 0.75rem;
    color: var(--brown);
  }
  .lr-chip strong { color: var(--pink-dark); }
  .lr-bar-row { padding: 0.5rem 0; }
  .lr-bar-label {
    display: flex;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.35rem;
    font-size: 0.85rem;
  }
  .lr-bar-label span:last-child {
    white-space: nowrap;
    color: var(--muted);
  }
  .lr-bar {
    height: 6px;
    overflow: hidden;
    border-radius: 999px;
    background: var(--rose);
  }
  .lr-bar > span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, var(--pink) 0%, var(--pink-dark) 100%);
  }

  .lr-footer {
    padding: 1rem 0 0.5rem;
    text-align: center;
    font-size: 0.78rem;
    letter-spacing: 0.05em;
    color: var(--muted);
  }

  @media (max-width: 1100px) {
    .lr-kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .lr-grid-main,
    .lr-grid-3 { grid-template-columns: minmax(0, 1fr); }
  }
  @media (max-width: 768px) {
    .lr-hero { padding: 1.5rem; }
    .lr-dash .lr-hero-title { font-size: 1.7rem; }
    .lr-products { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 480px) {
    .lr-kpis { grid-template-columns: minmax(0, 1fr); }
  }
`;
