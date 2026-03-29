'use client';
import { useEffect, useState, useRef } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import Link from 'next/link';
import PromoSection from '../components/PromoSection';
import CategoryCards from '../components/CategoryCards';
import FeaturesSection from '../components/FeaturesSection';
import QualitySection from '../components/QualitySection';
import AnimatedSectionTitle from '../components/AnimatedSectionTitle';
import { API_URL, getImageUrl } from '@/lib/api';
import '../styles/mobile.css';

interface Product {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  description?: string;
  image?: string;
  stock?: number;
  brand?: { name: string };
  subcategory?: { name: string };
  category?: { _id: string; name: string };
}

interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const gateauxScrollRef = useRef<HTMLDivElement>(null);
  const patisserieFineScrollRef = useRef<HTMLDivElement>(null);
  const nouveautesScrollRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/products`).then(res => res.json()),
      fetch(`${API_URL}/categories`).then(res => res.json())
    ])
      .then(([productsData, categoriesData]) => {
        setProducts(productsData);
        setCategories(categoriesData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur:', err);
        setLoading(false);
      });
  }, []);

  // Observer pour l'animation du hero
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeroVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  // Auto-scroll pour les carrousels
  useEffect(() => {
    const autoScrollInterval = setInterval(() => {
      // Auto-scroll Gâteaux
      if (gateauxScrollRef.current) {
        const container = gateauxScrollRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        if (container.scrollLeft >= maxScroll - 10) {
          // Retour au début
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll vers la droite
          container.scrollBy({ left: 330, behavior: 'smooth' });
        }
      }

      // Auto-scroll Pâtisserie Fine
      if (patisserieFineScrollRef.current) {
        const container = patisserieFineScrollRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        if (container.scrollLeft >= maxScroll - 10) {
          // Retour au début
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll vers la droite
          container.scrollBy({ left: 330, behavior: 'smooth' });
        }
      }
    }, 3000); // Défile toutes les 3 secondes

    return () => clearInterval(autoScrollInterval);
  }, [products]);

  // Filtrer les produits par catégorie
  const gateauxCategory = categories.find(c => c.name?.toLowerCase().includes('gateau') || c.name?.toLowerCase().includes('gâteau'));
  const patisserieFineCategory = categories.find(c => 
    c.name?.toLowerCase().includes('pâtisserie fine') || 
    c.name?.toLowerCase().includes('patisserie fine')
  );
  
  const gateauxProducts = products.filter(p => 
    p.category?.name?.toLowerCase().includes('gateau') ||
    p.category?.name?.toLowerCase().includes('gâteau')
  );
  
  const patisserieFineProducts = products.filter(p => 
    p.category?.name?.toLowerCase().includes('pâtisserie fine') ||
    p.category?.name?.toLowerCase().includes('patisserie fine')
  );

  const scrollGateaux = (direction: 'left' | 'right') => {
    if (gateauxScrollRef.current) {
      gateauxScrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth'
      });
    }
  };

  const scrollPatisserieFine = (direction: 'left' | 'right') => {
    if (patisserieFineScrollRef.current) {
      patisserieFineScrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth'
      });
    }
  };

  const scrollNouveautes = (direction: 'left' | 'right') => {
    if (nouveautesScrollRef.current) {
      nouveautesScrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth'
      });
    }
  };

  // Produits les plus récents (triés par date de création)
  const nouveautesProducts = [...products].sort((a, b) => {
    // Trier par _id décroissant (les plus récents en premier car MongoDB ObjectId contient un timestamp)
    return b._id.localeCompare(a._id);
  }).slice(0, 10);

  return (
    <>
      {/* Hero Banner - Style Gourmandise */}
      <div 
        ref={heroRef}
        className="hero-banner"
        style={{ 
          position: 'relative', 
          height: '500px', 
          width: '100%',
          overflow: 'hidden',
          marginTop: '0'
        }}
      >
        {/* Image de fond */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'url(/img/la-rosa-banner.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.75)'
        }}></div>
        
        {/* Overlay gradient */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)'
        }}></div>

        {/* Contenu centré */}
        <div style={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 20px',
          zIndex: 10
        }}>
          <h1 className="hero-title" style={{
            fontFamily: "'Great Vibes', 'Brush Script MT', cursive",
            fontSize: '4rem',
            color: '#ec4899',
            marginBottom: '10px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            fontWeight: '400',
            letterSpacing: '2px',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
            transition: 'all 1s ease-out 0.2s'
          }}>
            La Rosa
          </h1>
          <p className="hero-subtitle" style={{
            fontSize: '1.1rem',
            color: 'white',
            marginBottom: '8px',
            fontWeight: '300',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease-out 0.4s'
          }}>
            Pâtisserie Artisanale
          </p>
          <div style={{
            width: heroVisible ? '80px' : '0',
            height: '1px',
            background: '#ec4899',
            margin: '15px 0',
            opacity: heroVisible ? 1 : 0,
            transition: 'all 0.8s ease-out 0.6s'
          }}></div>
          <p className="hero-description" style={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.95)',
            maxWidth: '600px',
            lineHeight: '1.8',
            marginBottom: '30px',
            fontWeight: '300',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease-out 0.8s'
          }}>
            Chacun son moment gourmand. Découvrez nos créations artisanales inspirées de la tradition française.
          </p>
          <Link href="/shop" className="hero-button" style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
            color: 'white',
            padding: '16px 45px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            border: '3px solid #ec4899',
            boxShadow: '0 4px 20px rgba(236, 72, 153, 0.5)',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease-out 1s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #d946a6 0%, #ec4899 100%)';
            e.currentTarget.style.borderColor = '#d946a6';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 25px rgba(236, 72, 153, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)';
            e.currentTarget.style.borderColor = '#ec4899';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(236, 72, 153, 0.5)';
          }}>
            Découvrir nos produits
          </Link>
        </div>
      </div>

      {/* Section Catégories */}
      <CategoryCards />

      {/* Section Promotions */}
      <PromoSection />

      {/* Section Qualité */}
      <QualitySection />

      {/* Section Gâteaux */}
      {gateauxProducts.length > 0 && (
        <div className="product-section" style={{ background: 'white', padding: '30px 0' }}>
          <div className="container">
            {/* Titre de section élégant */}
            <AnimatedSectionTitle 
              subtitle="Nos Créations"
              title="Gâteaux"
            />

            <div className="row g-5">
              {/* Produits */}
              <div className="col-lg-12">
                {/* Carrousel */}
                <div style={{ position: 'relative' }}>
                  <button onClick={() => scrollGateaux('left')} className="carousel-button" style={{
                    position: 'absolute', left: '-15px', top: '50%', transform: 'translateY(-50%)',
                    width: '45px', height: '45px', borderRadius: '50%', border: '1px solid #ec4899', background: 'white',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)', cursor: 'pointer', zIndex: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#ec4899', transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#ec4899';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.color = '#ec4899';
                  }}>
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button onClick={() => scrollGateaux('right')} className="carousel-button" style={{
                    position: 'absolute', right: '-15px', top: '50%', transform: 'translateY(-50%)',
                    width: '45px', height: '45px', borderRadius: '50%', border: '1px solid #ec4899', background: 'white',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)', cursor: 'pointer', zIndex: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#ec4899', transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#ec4899';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.color = '#ec4899';
                  }}>
                    <i className="fas fa-chevron-right"></i>
                  </button>

                  <div ref={gateauxScrollRef} className="product-carousel" style={{ display: 'flex', gap: '30px', overflowX: 'auto', scrollbarWidth: 'none', padding: '10px 5px' }}>
                    {gateauxProducts.slice(0, 8).map((product) => {
                      const finalPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price;
                      const isFav = favorites.includes(product._id);
                      return (
                        <div key={product._id} className="product-card" style={{
                          minWidth: '300px', maxWidth: '300px', background: 'white',
                          borderRadius: '0', overflow: 'hidden', boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
                          border: '1px solid #e8e8e8', flexShrink: 0,
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
                          e.currentTarget.style.transform = 'translateY(-5px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 2px 15px rgba(0,0,0,0.08)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}>
                          <div className="product-image" style={{ position: 'relative', background: '#faf9f7', height: '280px' }}>
                            <Link href={`/product/${product._id}`}>
                              <img src={getImageUrl(product.image)}
                                alt={product.name} style={{ width: '100%', height: '280px', objectFit: 'cover' }} />
                            </Link>
                            {(product.discount ?? 0) > 0 && (
                              <span style={{ position: 'absolute', top: '15px', right: '15px', background: '#ec4899',
                                color: 'white', padding: '8px 14px', borderRadius: '0', fontSize: '11px', fontWeight: '700',
                                letterSpacing: '1px'
                              }}>-{product.discount}%</span>
                            )}
                            {/* Bouton favoris */}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                if (isFav) {
                                  removeFavorite(product._id);
                                } else {
                                  addFavorite(product._id);
                                }
                              }}
                              style={{
                                position: 'absolute',
                                bottom: '15px',
                                right: '15px',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: '1px solid #ec4899',
                                background: isFav ? '#ec4899' : 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <i 
                                className={isFav ? 'fas fa-heart' : 'far fa-heart'} 
                                style={{ 
                                  color: isFav ? 'white' : '#ec4899',
                                  fontSize: '16px'
                                }}
                              ></i>
                            </button>
                          </div>
                          <div style={{ padding: '25px 20px' }}>
                            <Link href={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                              <h6 className="product-title" style={{ fontWeight: '400', color: '#2c1810', fontSize: '16px', height: '48px', overflow: 'hidden', marginBottom: '12px', letterSpacing: '0.5px' }}>{product.name}</h6>
                            </Link>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '15px',
                              background: (product.stock ?? 0) > 0 ? 'rgba(212, 175, 55, 0.1)' : '#fee2e2', padding: '5px 12px', borderRadius: '0' }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: (product.stock ?? 0) > 0 ? '#ec4899' : '#ef4444' }}></span>
                              <span style={{ color: (product.stock ?? 0) > 0 ? '#ec4899' : '#dc2626', fontSize: '11px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                {(product.stock ?? 0) > 0 ? 'Disponible' : 'Rupture'}
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
                              {(product.discount ?? 0) > 0 && (
                                <span style={{ fontSize: '14px', color: '#999', textDecoration: 'line-through' }}>{product.price.toFixed(3)}</span>
                              )}
                              <span className="product-price" style={{ fontSize: '22px', fontWeight: '400', color: '#2c1810' }}>{finalPrice.toFixed(3)}</span>
                              <span style={{ fontSize: '13px', color: '#999', fontWeight: '400' }}>DT</span>
                            </div>
                            
                            {/* Bouton Voir simple */}
                            <Link href={`/product/${product._id}`}  style={{
                              width: '100%', border: '1px solid #ec4899', background: (product.stock ?? 0) > 0 ? 'transparent' : '#e8e8e8',
                              color: (product.stock ?? 0) > 0 ? '#ec4899' : '#999', borderRadius: '0', padding: '12px', cursor: (product.stock ?? 0) > 0 ? 'pointer' : 'not-allowed',
                              fontSize: '12px', fontWeight: '600', display: 'block', textAlign: 'center', textDecoration: 'none',
                              letterSpacing: '1px', textTransform: 'uppercase', transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => {
                              if ((product.stock ?? 0) > 0) {
                                e.currentTarget.style.background = '#ec4899';
                                e.currentTarget.style.color = 'white';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if ((product.stock ?? 0) > 0) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#ec4899';
                              }
                            }}>
                              Voir les détails
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section Pâtisserie Fine */}
      {patisserieFineProducts.length > 0 && (
        <div className="product-section" style={{ background: '#f8f9fa', padding: '30px 0' }}>
          <div className="container">
            {/* Titre de section élégant */}
            <AnimatedSectionTitle 
              subtitle="Nos Créations"
              title="Pâtisserie Fine"
              background="#f8f9fa"
            />

            <div className="row g-5">
              {/* Produits */}
              <div className="col-lg-12">
                {/* Carrousel */}
                <div style={{ position: 'relative' }}>
                  <button onClick={() => scrollPatisserieFine('left')} className="carousel-button" style={{
                    position: 'absolute', left: '-15px', top: '50%', transform: 'translateY(-50%)',
                    width: '45px', height: '45px', borderRadius: '50%', border: '1px solid #ec4899', background: 'white',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)', cursor: 'pointer', zIndex: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#ec4899', transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#ec4899';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.color = '#ec4899';
                  }}>
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button onClick={() => scrollPatisserieFine('right')} className="carousel-button" style={{
                    position: 'absolute', right: '-15px', top: '50%', transform: 'translateY(-50%)',
                    width: '45px', height: '45px', borderRadius: '50%', border: '1px solid #ec4899', background: 'white',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)', cursor: 'pointer', zIndex: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#ec4899', transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#ec4899';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.color = '#ec4899';
                  }}>
                    <i className="fas fa-chevron-right"></i>
                  </button>

                  <div ref={patisserieFineScrollRef} className="product-carousel" style={{ display: 'flex', gap: '30px', overflowX: 'auto', scrollbarWidth: 'none', padding: '10px 5px' }}>
                    {patisserieFineProducts.slice(0, 8).map((product) => {
                      const finalPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price;
                      const isFav = favorites.includes(product._id);
                      return (
                        <div key={product._id} className="product-card" style={{
                          minWidth: '300px', maxWidth: '300px', background: 'white',
                          borderRadius: '0', overflow: 'hidden', boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
                          border: '1px solid #e8e8e8', flexShrink: 0,
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
                          e.currentTarget.style.transform = 'translateY(-5px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 2px 15px rgba(0,0,0,0.08)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}>
                          <div className="product-image" style={{ position: 'relative', background: '#faf9f7', height: '280px' }}>
                            <Link href={`/product/${product._id}`}>
                              <img src={getImageUrl(product.image)}
                                alt={product.name} style={{ width: '100%', height: '280px', objectFit: 'cover' }} />
                            </Link>
                            {(product.discount ?? 0) > 0 && (
                              <span style={{ position: 'absolute', top: '15px', right: '15px', background: '#ec4899',
                                color: 'white', padding: '8px 14px', borderRadius: '0', fontSize: '11px', fontWeight: '700',
                                letterSpacing: '1px'
                              }}>-{product.discount}%</span>
                            )}
                            {/* Bouton favoris */}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                if (isFav) {
                                  removeFavorite(product._id);
                                } else {
                                  addFavorite(product._id);
                                }
                              }}
                              style={{
                                position: 'absolute',
                                bottom: '15px',
                                right: '15px',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: '1px solid #ec4899',
                                background: isFav ? '#ec4899' : 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <i 
                                className={isFav ? 'fas fa-heart' : 'far fa-heart'} 
                                style={{ 
                                  color: isFav ? 'white' : '#ec4899',
                                  fontSize: '16px'
                                }}
                              ></i>
                            </button>
                          </div>
                          <div style={{ padding: '25px 20px' }}>
                            <Link href={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                              <h6 className="product-title" style={{ fontWeight: '400', color: '#2c1810', fontSize: '16px', height: '48px', overflow: 'hidden', marginBottom: '12px', letterSpacing: '0.5px' }}>{product.name}</h6>
                            </Link>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '15px',
                              background: (product.stock ?? 0) > 0 ? 'rgba(212, 175, 55, 0.1)' : '#fee2e2', padding: '5px 12px', borderRadius: '0' }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: (product.stock ?? 0) > 0 ? '#ec4899' : '#ef4444' }}></span>
                              <span style={{ color: (product.stock ?? 0) > 0 ? '#ec4899' : '#dc2626', fontSize: '11px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                {(product.stock ?? 0) > 0 ? 'Disponible' : 'Rupture'}
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
                              {(product.discount ?? 0) > 0 && (
                                <span style={{ fontSize: '14px', color: '#999', textDecoration: 'line-through' }}>{product.price.toFixed(3)}</span>
                              )}
                              <span className="product-price" style={{ fontSize: '22px', fontWeight: '400', color: '#2c1810' }}>{finalPrice.toFixed(3)}</span>
                              <span style={{ fontSize: '13px', color: '#999', fontWeight: '400' }}>DT</span>
                            </div>
                            
                            {/* Bouton Voir simple */}
                            <Link href={`/product/${product._id}`}  style={{
                              width: '100%', border: '1px solid #ec4899', background: (product.stock ?? 0) > 0 ? 'transparent' : '#e8e8e8',
                              color: (product.stock ?? 0) > 0 ? '#ec4899' : '#999', borderRadius: '0', padding: '12px', cursor: (product.stock ?? 0) > 0 ? 'pointer' : 'not-allowed',
                              fontSize: '12px', fontWeight: '600', display: 'block', textAlign: 'center', textDecoration: 'none',
                              letterSpacing: '1px', textTransform: 'uppercase', transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => {
                              if ((product.stock ?? 0) > 0) {
                                e.currentTarget.style.background = '#ec4899';
                                e.currentTarget.style.color = 'white';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if ((product.stock ?? 0) > 0) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#ec4899';
                              }
                            }}>
                              Voir les détails
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section Pour vous satisfaire */}
      <FeaturesSection />

    </>
  );
}
