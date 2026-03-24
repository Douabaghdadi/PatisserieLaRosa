'use client';
import { API_URL, getImageUrl } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/Header';
import ProductReviews from '../../../components/ProductReviews';
import StarRating from '../../../components/StarRating';
import { useFavorites } from '../../../context/FavoritesContext';

interface Subcategory {
  _id: string;
  name: string;
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
}

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    fetch(`${API_URL}/products/${params.id}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="container-fluid py-5" style={{marginTop: '130px', background: '#f7fafc', minHeight: '100vh'}}>
        <div className="text-center py-5">
          <div className="spinner-border" style={{color: '#ec4899'}} role="status"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-fluid py-5" style={{marginTop: '130px'}}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)',
          border: '1px solid rgba(236, 72, 153, 0.2)',
          borderRadius: '12px',
          padding: '20px',
          color: '#ec4899'
        }}>Produit non trouvé</div>
      </div>
    );
  }

  const finalPrice = (product.discount ?? 0) > 0 
    ? (product.price * (1 - (product.discount ?? 0) / 100)).toFixed(2)
    : product.price.toFixed(2);

  return (
    <>
      <Header />
      <div style={{paddingTop: '110px', backgroundColor: '#f7fafc', minHeight: '100vh'}}>
        <div className="container" style={{paddingBottom: '40px'}}>
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" style={{marginBottom: '10px'}}>
          <ol className="breadcrumb" style={{backgroundColor: 'transparent', padding: 0, margin: 0}}>
            <li className="breadcrumb-item">
              <Link href="/" style={{color: '#718096', textDecoration: 'none', fontWeight: '500'}}>Accueil</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/shop" style={{color: '#718096', textDecoration: 'none', fontWeight: '500'}}>Boutique</Link>
            </li>
            {product.category && (
              <li className="breadcrumb-item">
                <span style={{color: '#718096'}}>{product.category.name}</span>
              </li>
            )}
            <li className="breadcrumb-item active" style={{color: '#1a202c', fontWeight: '600'}}>{product.name}</li>
          </ol>
        </nav>

        {/* Product Card */}
        <div style={{
          backgroundColor: 'white', 
          borderRadius: '16px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)', 
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          maxWidth: '1100px',
          margin: '0 auto'
        }}>
          <div className="row g-0">
            {/* Product Image */}
            <div className="col-lg-6">
              <div style={{
                padding: '0', 
                background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)', 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                position: 'relative',
                minHeight: '365px',
                overflow: 'hidden'
              }}>
                <img 
                  src={product.image ? (product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`) : '/img/product-placeholder.jpg'} 
                  style={{width: '100%', height: '100%', objectFit: 'cover'}} 
                  alt={product.name} 
                />
                {(product.discount ?? 0) > 0 && (
                  <div style={{
                    position: 'absolute', 
                    top: '20px', 
                    left: '20px',
                    background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '700',
                    boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)'
                  }}>
                    -{product.discount}%
                  </div>
                )}
                {(product.stock ?? 0) === 0 && (
                  <div style={{
                    position: 'absolute', 
                    top: '20px', 
                    right: '20px',
                    background: '#718096',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '700',
                    boxShadow: '0 4px 15px rgba(113, 128, 150, 0.3)'
                  }}>
                    Rupture de stock
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="col-lg-6">
              <div style={{
                padding: '30px',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                justifyContent: 'space-between'
              }}>
                <div>
                {/* Title */}
                <h1 style={{
                  fontSize: '28px', 
                  fontWeight: '700', 
                  color: '#2d3748', 
                  marginBottom: '10px', 
                  lineHeight: '1.2',
                  letterSpacing: '-0.5px'
                }}>{product.name}</h1>
                
                {/* Rating */}
                <div style={{marginBottom: '16px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <StarRating rating={product.rating || 0} readonly size={16} />
                    <span style={{color: '#a0aec0', fontSize: '13px', fontWeight: '400'}}>
                      ({product.ratingCount || 0} avis)
                    </span>
                  </div>
                </div>

                {/* Subcategories */}
                {product.subcategories && product.subcategories.length > 0 && (
                  <div style={{marginBottom: '20px'}}>
                    {product.subcategories.map((sub: Subcategory) => (
                      <span key={sub._id} style={{
                        display: 'inline-block', 
                        backgroundColor: '#f7fafc', 
                        color: '#4a5568', 
                        padding: '5px 12px', 
                        borderRadius: '18px', 
                        fontSize: '12px', 
                        fontWeight: '500', 
                        marginRight: '6px', 
                        marginBottom: '6px',
                        border: '1px solid #e2e8f0'
                      }}>{sub.name}</span>
                    ))}
                  </div>
                )}

                {/* Price */}
                <div style={{
                  background: '#f8fafc', 
                  padding: '20px', 
                  borderRadius: '12px', 
                  marginBottom: '20px',
                  border: '1px solid #e2e8f0'
                }}>
                  {(product.discount ?? 0) > 0 ? (
                    <>
                      <div style={{fontSize: '14px', color: '#cbd5e0', textDecoration: 'line-through', marginBottom: '4px', fontWeight: '500'}}>
                        {product.price.toFixed(3)} DT
                      </div>
                      <div style={{fontSize: '32px', fontWeight: '800', color: '#2d3748', marginBottom: '8px', letterSpacing: '-1px'}}>
                        {finalPrice} <span style={{fontSize: '16px', color: '#a0aec0', fontWeight: '600'}}>DT</span>
                      </div>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'linear-gradient(135deg, rgba(72, 187, 120, 0.1) 0%, rgba(72, 187, 120, 0.05) 100%)',
                        color: '#276749',
                        padding: '5px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        <i className="fas fa-check-circle"></i>
                        Économisez {(product.price - parseFloat(finalPrice)).toFixed(3)} DT
                      </div>
                    </>
                  ) : (
                    <div style={{fontSize: '32px', fontWeight: '800', color: '#2d3748', letterSpacing: '-1px'}}>
                      {product.price.toFixed(3)} <span style={{fontSize: '16px', color: '#a0aec0', fontWeight: '600'}}>DT</span>
                    </div>
                  )}
                </div>

                {/* Stock Status */}
                {product.stock === 0 && (
                  <div style={{
                    marginBottom: '15px',
                    padding: '12px 16px',
                    background: 'linear-gradient(135deg, rgba(113, 128, 150, 0.1) 0%, rgba(113, 128, 150, 0.05) 100%)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    border: '1px solid rgba(113, 128, 150, 0.2)'
                  }}>
                    <i className="fas fa-times-circle" style={{color: '#718096', fontSize: '18px'}}></i>
                    <div>
                      <span style={{color: '#4a5568', fontSize: '14px', fontWeight: '700', display: 'block'}}>
                        Rupture de stock
                      </span>
                      <span style={{color: '#718096', fontSize: '12px'}}>
                        Ce produit n&apos;est plus disponible actuellement
                      </span>
                    </div>
                  </div>
                )}

                {/* Wishlist Button */}
                <button 
                  onClick={() => {
                    if (isFavorite(product._id)) {
                      removeFavorite(product._id);
                    } else {
                      addFavorite(product._id);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: 'rgba(236, 72, 153, 0.12)',
                    color: '#4a5568',
                    border: '2px solid rgba(236, 72, 153, 0.3)',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    marginTop: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(236, 72, 153, 0.18)';
                    e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(236, 72, 153, 0.12)';
                    e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.3)';
                  }}
                >
                  <i className={isFavorite(product._id) ? "fas fa-heart" : "far fa-heart"} style={{fontSize: '15px', color: '#ec4899'}}></i>
                  {isFavorite(product._id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                </button>
                </div>

                {/* Features */}
                <div style={{marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
                  {[
                    { icon: 'fa-truck', text: 'Livraison rapide' },
                    { icon: 'fa-birthday-cake', text: 'Fraîcheur garantie' },
                    { icon: 'fa-award', text: 'Qualité artisanale' }
                  ].map((feature, index) => (
                    <div key={index} style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                      <i className={`fas ${feature.icon}`} style={{color: '#ec4899', fontSize: '11px'}}></i>
                      <span style={{color: '#718096', fontSize: '11px', fontWeight: '500'}}>{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{
          backgroundColor: 'white', 
          borderRadius: '14px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)', 
          padding: '25px', 
          marginTop: '20px',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            fontSize: '18px', 
            fontWeight: '700', 
            color: '#1a202c', 
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{
              width: '3px',
              height: '18px',
              background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
              borderRadius: '2px'
            }}></span>
            Description du produit
          </h3>
          <p style={{
            fontSize: '14px', 
            lineHeight: '1.7', 
            color: '#4a5568', 
            whiteSpace: 'pre-line'
          }}>{product.description}</p>
        </div>

        {/* Reviews */}
        <div style={{
          backgroundColor: 'white', 
          borderRadius: '14px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)', 
          padding: '25px', 
          marginTop: '20px', 
          marginBottom: '40px',
          border: '1px solid #e2e8f0'
        }}>
          <ProductReviews productId={product._id} />
        </div>
      </div>
      </div>
    </>
  );
}
