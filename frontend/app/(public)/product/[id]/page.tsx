'use client';
import { API_URL, getImageUrl } from '@/lib/api';
import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProductReviews from '../../../components/ProductReviews';
import StarRating from '../../../components/StarRating';
import { useFavorites } from '../../../context/FavoritesContext';

interface Subcategory {
  _id: string;
  name: string;
}

interface Flavor {
  _id: string;
  name: string;
  color?: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  description?: string;
  image?: string;
  stock?: number;
  rating?: number;
  ratingCount?: number;
  brand?: { _id: string; name: string };
  category?: { _id: string; name: string };
  subcategories?: Subcategory[];
  flavors?: Flavor[];
}

const formatPrice = (value: number) => value.toFixed(3);

const getFinalPrice = (p: Product) =>
  (p.discount ?? 0) > 0 ? p.price * (1 - (p.discount ?? 0) / 100) : p.price;

const styles = `
  .pd-page { background: #fafafa; min-height: 100vh; padding: 40px 0 70px; }
  @media (max-width: 991.98px) { .pd-page { padding-top: 16px; } }

  /* Breadcrumb */
  .pd-breadcrumb { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 13px; margin-bottom: 24px; }
  .pd-breadcrumb a { color: #64748b; text-decoration: none; font-weight: 500; transition: color .2s; }
  .pd-breadcrumb a:hover { color: #ec4899; }
  .pd-breadcrumb .pd-sep { color: #cbd5e1; font-size: 9px; }
  .pd-breadcrumb .pd-current { color: #1e293b; font-weight: 600; max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  /* Image */
  @media (min-width: 992px) { .pd-gallery-sticky { position: sticky; top: 180px; } }
  .pd-gallery { position: relative; aspect-ratio: 1 / 1; border-radius: 24px; overflow: hidden; background: #fef3f8; border: 1px solid #fce7f3; box-shadow: 0 10px 40px rgba(236, 72, 153, .08); }
  .pd-gallery img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .6s ease; }
  .pd-gallery:hover img { transform: scale(1.04); }
  .pd-badge { position: absolute; top: 16px; padding: 6px 14px; border-radius: 999px; font-size: 13px; font-weight: 700; color: white; }
  .pd-badge-discount { left: 16px; background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); box-shadow: 0 4px 12px rgba(236, 72, 153, .35); }
  .pd-badge-out { right: 16px; background: rgba(30, 41, 59, .85); }

  /* Infos */
  @media (min-width: 992px) { .pd-info { padding: 8px 0 0 12px; } }
  .pd-eyebrow { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 12px; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; }
  .pd-eyebrow a { color: #ec4899; text-decoration: none; }
  .pd-eyebrow a:hover { color: #be185d; }
  .pd-eyebrow .pd-dot { width: 4px; height: 4px; border-radius: 50%; background: #f9a8d4; }
  .pd-title { font-size: 38px; font-weight: 700; color: #1e293b; line-height: 1.15; letter-spacing: -.5px; margin: 0 0 14px; word-break: break-word; }
  @media (max-width: 575.98px) { .pd-title { font-size: 28px; } }
  .pd-rating { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; font-size: 13px; color: #64748b; }
  .pd-rating a { color: #64748b; text-decoration: none; border-bottom: 1px dashed #cbd5e1; }
  .pd-rating a:hover { color: #ec4899; border-color: #ec4899; }

  .pd-price-block { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; padding: 22px 0; margin-bottom: 24px; border-top: 1px solid #f1e8ee; border-bottom: 1px solid #f1e8ee; }
  .pd-price { font-size: 36px; font-weight: 800; color: #db2777; letter-spacing: -1px; line-height: 1; }
  .pd-price small { font-size: 16px; font-weight: 700; color: #f472b6; margin-left: 4px; letter-spacing: 0; }
  .pd-old-price { font-size: 17px; color: #94a3b8; text-decoration: line-through; }
  .pd-stock { display: inline-flex; align-items: center; gap: 6px; margin-left: auto; padding: 6px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; }
  .pd-stock::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
  .pd-stock-in { background: #dcfce7; color: #16a34a; }
  .pd-stock-out { background: #fee2e2; color: #dc2626; }
  .pd-saving { width: 100%; display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #16a34a; }

  .pd-description { font-size: 15px; line-height: 1.75; color: #475569; white-space: pre-line; margin-bottom: 24px; }

  .pd-label { font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #94a3b8; margin-bottom: 10px; }
  .pd-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 26px; }
  .pd-chip { display: inline-flex; align-items: center; gap: 8px; padding: 7px 14px; border-radius: 999px; background: white; border: 1px solid #fce7f3; color: #334155; font-size: 13px; font-weight: 500; }
  .pd-swatch { width: 10px; height: 10px; border-radius: 50%; box-shadow: 0 0 0 1px rgba(0, 0, 0, .08); }

  .pd-btn-primary { display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 16px 24px; border-radius: 14px; border: 2px solid transparent; background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); color: white; font-size: 15px; font-weight: 700; text-decoration: none; cursor: pointer; box-shadow: 0 8px 20px rgba(236, 72, 153, .3); transition: transform .2s, box-shadow .2s; }
  .pd-btn-primary:hover { color: white; transform: translateY(-2px); box-shadow: 0 12px 28px rgba(236, 72, 153, .4); }
  .pd-btn-fav { width: 100%; margin-bottom: 28px; }
  .pd-btn-fav i { font-size: 18px; }
  .pd-btn-fav.pd-active, .pd-btn-fav.pd-active:hover { background: #fdf2f8; border-color: #f9a8d4; color: #db2777; box-shadow: none; }

  .pd-features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .pd-feature { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px 8px; text-align: center; background: white; border: 1px solid #f1f5f9; border-radius: 16px; }
  .pd-feature-icon { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 12px; background: #fdf2f8; color: #ec4899; font-size: 16px; }
  .pd-feature span { font-size: 12px; font-weight: 600; color: #475569; line-height: 1.3; }

  /* Sections */
  .pd-section { margin-top: 56px; }
  .pd-card { background: white; border: 1px solid #f1f5f9; border-radius: 20px; padding: 28px; box-shadow: 0 4px 20px rgba(0, 0, 0, .03); }
  @media (max-width: 575.98px) { .pd-card { padding: 20px; } }
  .pd-section-title { display: flex; align-items: center; gap: 12px; font-size: 24px; font-weight: 700; color: #1e293b; margin-bottom: 24px; }
  .pd-section-title::before { content: ''; width: 4px; height: 24px; border-radius: 2px; background: linear-gradient(180deg, #ec4899 0%, #db2777 100%); }

  /* Produits similaires */
  .pd-related { display: block; height: 100%; background: white; border: 1px solid #fce7f3; border-radius: 18px; overflow: hidden; text-decoration: none; transition: transform .25s, box-shadow .25s; }
  .pd-related:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(236, 72, 153, .15); }
  .pd-related-img { aspect-ratio: 1 / 1; background: #fef3f8; overflow: hidden; }
  .pd-related-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s; }
  .pd-related:hover .pd-related-img img { transform: scale(1.06); }
  .pd-related-body { padding: 14px 16px 16px; }
  .pd-related-name { font-size: 14px; font-weight: 600; color: #1e293b; line-height: 1.3; min-height: 2.6em; margin-bottom: 6px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .pd-related-price { font-size: 16px; font-weight: 800; color: #db2777; }
  .pd-related-price small { font-size: 11px; font-weight: 700; color: #94a3b8; margin-left: 3px; }

  /* Chargement */
  .pd-skeleton { background: linear-gradient(90deg, #f1f5f9 25%, #fce7f3 50%, #f1f5f9 75%); background-size: 200% 100%; animation: pd-shimmer 1.4s infinite; border-radius: 12px; }
  @keyframes pd-shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
`;

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    fetch(`${API_URL}/products/${params.id}`)
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  const productId = product?._id;
  const categoryId = product?.category?._id;

  useEffect(() => {
    if (!categoryId) return;
    fetch(`${API_URL}/products`)
      .then(r => r.json())
      .then((data: Product[]) => {
        setRelated(data.filter(p => p.category?._id === categoryId && p._id !== productId).slice(0, 4));
      })
      .catch(() => {});
  }, [categoryId, productId]);

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="pd-page">
          <div className="container">
            <div className="pd-skeleton" style={{ width: '260px', height: '14px', marginBottom: '24px' }}></div>
            <div className="row g-4 g-lg-5">
              <div className="col-lg-6">
                <div className="pd-skeleton" style={{ aspectRatio: '1 / 1', borderRadius: '24px' }}></div>
              </div>
              <div className="col-lg-6">
                <div className="pd-skeleton" style={{ width: '40%', height: '12px', marginBottom: '16px' }}></div>
                <div className="pd-skeleton" style={{ width: '75%', height: '38px', marginBottom: '18px' }}></div>
                <div className="pd-skeleton" style={{ width: '30%', height: '14px', marginBottom: '32px' }}></div>
                <div className="pd-skeleton" style={{ width: '45%', height: '40px', marginBottom: '32px' }}></div>
                <div className="pd-skeleton" style={{ width: '100%', height: '56px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <style>{styles}</style>
        <div className="pd-page">
          <div className="container">
            <div className="pd-card" style={{ maxWidth: '520px', margin: '40px auto', textAlign: 'center', padding: '48px 28px' }}>
              <div className="pd-feature-icon" style={{ width: '64px', height: '64px', fontSize: '26px', margin: '0 auto 20px', borderRadius: '18px' }}>
                <i className="fas fa-cookie-bite"></i>
              </div>
              <h1 style={{ fontSize: '24px', color: '#1e293b', marginBottom: '10px' }}>Produit introuvable</h1>
              <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '28px' }}>
                Ce produit n&apos;existe pas ou n&apos;est plus disponible.
              </p>
              <Link href="/shop" className="pd-btn-primary">
                <i className="fas fa-arrow-left" style={{ fontSize: '14px' }}></i> Retour à la boutique
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const hasDiscount = (product.discount ?? 0) > 0;
  const finalPrice = getFinalPrice(product);
  const inStock = (product.stock ?? 0) > 0;
  const favorite = isFavorite(product._id);

  return (
    <>
      <style>{styles}</style>
      <div className="pd-page">
        <div className="container">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="pd-breadcrumb">
            <Link href="/">Accueil</Link>
            <i className="fas fa-chevron-right pd-sep"></i>
            <Link href="/shop">Boutique</Link>
            {product.category && (
              <>
                <i className="fas fa-chevron-right pd-sep"></i>
                <Link href={`/category/${product.category._id}`}>{product.category.name}</Link>
              </>
            )}
            <i className="fas fa-chevron-right pd-sep"></i>
            <span className="pd-current" aria-current="page">{product.name}</span>
          </nav>

          <div className="row g-4 g-lg-5 align-items-start">
            {/* Image */}
            <div className="col-lg-6">
              <div className="pd-gallery-sticky">
                <div className="pd-gallery">
                  <img src={getImageUrl(product.image)} alt={product.name} />
                  {hasDiscount && <span className="pd-badge pd-badge-discount">-{product.discount}%</span>}
                  {!inStock && <span className="pd-badge pd-badge-out">Rupture de stock</span>}
                </div>
              </div>
            </div>

            {/* Infos */}
            <div className="col-lg-6">
              <div className="pd-info">
                {(product.category || (product.subcategories?.length ?? 0) > 0) && (
                  <div className="pd-eyebrow">
                    {product.category && (
                      <Link href={`/category/${product.category._id}`}>{product.category.name}</Link>
                    )}
                    {product.subcategories?.map(sub => (
                      <Fragment key={sub._id}>
                        <span className="pd-dot"></span>
                        <Link href={`/subcategory/${sub._id}`}>{sub.name}</Link>
                      </Fragment>
                    ))}
                  </div>
                )}

                <h1 className="pd-title">{product.name}</h1>

                <div className="pd-rating">
                  <StarRating rating={product.rating || 0} readonly size={16} />
                  {(product.ratingCount ?? 0) > 0 && (
                    <strong style={{ color: '#1e293b' }}>{(product.rating ?? 0).toFixed(1)}</strong>
                  )}
                  <a href="#avis">{product.ratingCount || 0} avis</a>
                </div>

                {/* Prix */}
                <div className="pd-price-block">
                  <div className="pd-price">
                    {formatPrice(finalPrice)}<small>DT</small>
                  </div>
                  {hasDiscount && <span className="pd-old-price">{formatPrice(product.price)} DT</span>}
                  <span className={`pd-stock ${inStock ? 'pd-stock-in' : 'pd-stock-out'}`}>
                    {inStock ? 'En stock' : 'Rupture de stock'}
                  </span>
                  {hasDiscount && (
                    <div className="pd-saving">
                      <i className="fas fa-tag"></i>
                      Vous économisez {formatPrice(product.price - finalPrice)} DT
                    </div>
                  )}
                </div>

                {product.description && <p className="pd-description">{product.description}</p>}

                {product.flavors && product.flavors.length > 0 && (
                  <>
                    <div className="pd-label">Goûts disponibles</div>
                    <div className="pd-chips">
                      {product.flavors.map(flavor => (
                        <span key={flavor._id} className="pd-chip">
                          {flavor.color && <span className="pd-swatch" style={{ background: flavor.color }}></span>}
                          {flavor.name}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                {/* Favoris */}
                <button
                  type="button"
                  onClick={() => (favorite ? removeFavorite(product._id) : addFavorite(product._id))}
                  className={`pd-btn-primary pd-btn-fav ${favorite ? 'pd-active' : ''}`}
                >
                  <i className={favorite ? 'fas fa-heart' : 'far fa-heart'}></i>
                  {favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                </button>

                {/* Garanties */}
                <div className="pd-features">
                  {[
                    { icon: 'fa-truck', text: 'Livraison rapide' },
                    { icon: 'fa-birthday-cake', text: 'Fraîcheur garantie' },
                    { icon: 'fa-award', text: 'Qualité artisanale' }
                  ].map(feature => (
                    <div key={feature.text} className="pd-feature">
                      <div className="pd-feature-icon"><i className={`fas ${feature.icon}`}></i></div>
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Avis */}
          <section id="avis" className="pd-section pd-card" style={{ scrollMarginTop: '180px' }}>
            <ProductReviews productId={product._id} />
          </section>

          {/* Produits similaires */}
          {related.length > 0 && (
            <section className="pd-section">
              <h2 className="pd-section-title">Vous aimerez aussi</h2>
              <div className="row g-3 g-md-4">
                {related.map(item => (
                  <div key={item._id} className="col-6 col-lg-3">
                    <Link href={`/product/${item._id}`} className="pd-related">
                      <div className="pd-related-img">
                        <img src={getImageUrl(item.image)} alt={item.name} />
                      </div>
                      <div className="pd-related-body">
                        <div className="pd-related-name">{item.name}</div>
                        <div className="pd-related-price">
                          {formatPrice(getFinalPrice(item))}<small>DT</small>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
