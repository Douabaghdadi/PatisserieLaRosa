'use client';
import { API_URL, getImageUrl } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';

interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
}

interface Category {
  _id: string;
  name: string;
  image?: string;
}

interface Subcategory {
  _id: string;
  name: string;
  category: string | Category;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
  category?: Category;
}

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData && userData !== 'undefined') {
        try {
          return JSON.parse(userData);
        } catch {
          return null;
        }
      }
    }
    return null;
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
  const [showStoresMenu, setShowStoresMenu] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [categoryMenuTimeout, setCategoryMenuTimeout] = useState<NodeJS.Timeout | null>(null);
  const [storesMenuTimeout, setStoresMenuTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { favoritesCount } = useFavorites();

  useEffect(() => {
    const apiUrl = API_URL;
    
    fetch(`${apiUrl}/categories`)
      .then(res => res.json())
      .then(data => {
        console.log('Categories loaded:', data);
        setCategories(data);
      })
      .catch(err => console.error('Erreur chargement catégories:', err));

    fetch(`${apiUrl}/subcategories`)
      .then(res => res.json())
      .then(data => {
        console.log('Subcategories loaded:', data);
        setSubcategories(data);
      })
      .catch(err => console.error('Erreur chargement sous-catégories:', err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/recherche?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchBar(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  // Recherche automatique avec debounce
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        const apiUrl = API_URL;
        fetch(`${apiUrl}/products?search=${encodeURIComponent(searchQuery)}`)
          .then(res => res.json())
          .then(data => {
            setSearchResults(data.slice(0, 6)); // Limiter à 6 résultats
            setIsSearching(false);
          })
          .catch(err => {
            console.error('Erreur recherche:', err);
            setIsSearching(false);
          });
      } else {
        setSearchResults([]);
      }
    }, 300); // Attendre 300ms après la dernière frappe

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  return (
    <>
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1030,
      background: 'white',
      borderBottom: '1px solid #e5e5e5'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 0',
          gap: '40px'
        }}>
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="d-lg-none"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              color: '#1a1a1a',
              cursor: 'pointer',
              padding: '5px'
            }}
          >
            <i className={showMobileMenu ? 'fas fa-times' : 'fas fa-bars'}></i>
          </button>

          {/* Left Navigation */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '35px',
            flex: 1
          }} className="d-none d-lg-flex">
            <Link href="/" style={{
              color: '#1a1a1a',
              fontSize: '13px',
              fontWeight: '400',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'color 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ec4899'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#1a1a1a'}>
              Accueil
            </Link>

            <Link href="/shop" style={{
              color: '#1a1a1a',
              fontSize: '13px',
              fontWeight: '400',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'color 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ec4899'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#1a1a1a'}>
              Boutique
            </Link>

            {/* Categories Dropdown */}
            <div 
              style={{ position: 'relative' }}
              onMouseEnter={() => {
                if (categoryMenuTimeout) {
                  clearTimeout(categoryMenuTimeout);
                  setCategoryMenuTimeout(null);
                }
                setShowCategoriesMenu(true);
              }}
              onMouseLeave={() => {
                const timeout = setTimeout(() => {
                  setShowCategoriesMenu(false);
                }, 300);
                setCategoryMenuTimeout(timeout);
              }}
            >
              <button style={{
                color: '#1a1a1a',
                fontSize: '13px',
                fontWeight: '400',
                textDecoration: 'none',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ec4899'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#1a1a1a'}>
                Catégories
                <i className="fas fa-chevron-down" style={{ fontSize: '9px' }}></i>
              </button>
              
              {showCategoriesMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '15px',
                  background: 'white',
                  border: '1px solid #e5e5e5',
                  borderRadius: '0',
                  minWidth: '200px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  zIndex: 1050
                }}>
                  {categories.map((cat: any) => (
                    <Link 
                      key={cat._id} 
                      href={`/category/${cat._id}`}
                      style={{
                        display: 'block',
                        padding: '12px 20px',
                        color: '#1a1a1a',
                        fontSize: '13px',
                        textDecoration: 'none',
                        borderBottom: '1px solid #f5f5f5',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fafafa';
                        e.currentTarget.style.color = '#ec4899';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.color = '#1a1a1a';
                      }}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Center Logo */}
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none'
          }}>
            <Image 
              src="/img/logo-la-rosa.png" 
              alt="La Rosa Pâtisserie" 
              width={160}
              height={55}
              style={{ objectFit: 'contain', maxHeight: '55px', width: 'auto' }}
              priority
              unoptimized
            />
          </Link>

          {/* Right Navigation */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '35px',
            flex: 1,
            justifyContent: 'flex-end'
          }} className="d-none d-lg-flex">
            {/* Stores Dropdown */}
            <div 
              style={{ position: 'relative' }}
              onMouseEnter={() => {
                if (storesMenuTimeout) {
                  clearTimeout(storesMenuTimeout);
                  setStoresMenuTimeout(null);
                }
                setShowStoresMenu(true);
              }}
              onMouseLeave={() => {
                const timeout = setTimeout(() => {
                  setShowStoresMenu(false);
                }, 300);
                setStoresMenuTimeout(timeout);
              }}
            >
              <button style={{
                color: '#1a1a1a',
                fontSize: '13px',
                fontWeight: '400',
                textDecoration: 'none',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ec4899'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#1a1a1a'}>
                Nos Magasins
                <i className="fas fa-chevron-down" style={{ fontSize: '9px' }}></i>
              </button>
              
              {showStoresMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '15px',
                  background: 'white',
                  border: '2px solid #fce7f3',
                  borderRadius: '12px',
                  minWidth: '280px',
                  boxShadow: '0 8px 30px rgba(236, 72, 153, 0.2)',
                  zIndex: 1050,
                  overflow: 'hidden'
                }}>
                  {/* Triangle pointer */}
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '20px',
                    width: 0,
                    height: 0,
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderBottom: '8px solid #fce7f3'
                  }}></div>
                  
                  <div style={{
                    padding: '8px 0'
                  }}>
                    <Link 
                      href="/magasins#korba-1"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px 20px',
                        color: '#1a1a1a',
                        fontSize: '13px',
                        textDecoration: 'none',
                        borderBottom: '1px solid #fce7f3',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fdf2f8';
                        e.currentTarget.style.paddingLeft = '24px';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.paddingLeft = '20px';
                      }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <i className="fas fa-store" style={{ color: 'white', fontSize: '12px' }}></i>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', color: '#1a1a1a', marginBottom: '2px' }}>Korba</div>
                        <div style={{ fontSize: '11px', color: '#999' }}>Av Habib Bourguiba</div>
                      </div>
                      <i className="fas fa-chevron-right" style={{ color: '#ec4899', fontSize: '10px' }}></i>
                    </Link>
                    
                    <Link 
                      href="/magasins#korba-2"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px 20px',
                        color: '#1a1a1a',
                        fontSize: '13px',
                        textDecoration: 'none',
                        borderBottom: '1px solid #fce7f3',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fdf2f8';
                        e.currentTarget.style.paddingLeft = '24px';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.paddingLeft = '20px';
                      }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <i className="fas fa-store" style={{ color: 'white', fontSize: '12px' }}></i>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', color: '#1a1a1a', marginBottom: '2px' }}>Korba</div>
                        <div style={{ fontSize: '11px', color: '#999' }}>Rue dddddddd</div>
                      </div>
                      <i className="fas fa-chevron-right" style={{ color: '#ec4899', fontSize: '10px' }}></i>
                    </Link>
                    
                    <Link 
                      href="/magasins#kelibia"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px 20px',
                        color: '#1a1a1a',
                        fontSize: '13px',
                        textDecoration: 'none',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fdf2f8';
                        e.currentTarget.style.paddingLeft = '24px';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.paddingLeft = '20px';
                      }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <i className="fas fa-store" style={{ color: 'white', fontSize: '12px' }}></i>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', color: '#1a1a1a', marginBottom: '2px' }}>Kelibia</div>
                        <div style={{ fontSize: '11px', color: '#999' }}>Rue Aaaaaaaaa</div>
                      </div>
                      <i className="fas fa-chevron-right" style={{ color: '#ec4899', fontSize: '10px' }}></i>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/contact" style={{
              color: '#1a1a1a',
              fontSize: '13px',
              fontWeight: '400',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'color 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ec4899'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#1a1a1a'}>
              Contact
            </Link>
          </nav>

          {/* Right Icons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            {/* Search Icon */}
            <button 
              onClick={() => setShowSearchBar(!showSearchBar)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
            >
              <i className="fas fa-search" style={{ color: '#1a1a1a', fontSize: '16px' }}></i>
            </button>

            {/* Favorites Icon */}
            <button
              onClick={() => {
                if (!user) {
                  router.push('/login');
                } else {
                  router.push('/client/favorites');
                }
              }}
              style={{
                position: 'relative',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
            >
              <i className="fas fa-heart" style={{ color: '#1a1a1a', fontSize: '16px' }}></i>
              {favoritesCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#ec4899',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: '600'
                }}>
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* User */}
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  <i className="fas fa-user" style={{ color: '#1a1a1a', fontSize: '16px' }}></i>
                </button>
                
                {showUserMenu && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '100%',
                    marginTop: '15px',
                    background: 'white',
                    border: '1px solid #e5e5e5',
                    minWidth: '200px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    zIndex: 1050
                  }}>
                    <div style={{
                      padding: '15px 20px',
                      borderBottom: '1px solid #f5f5f5'
                    }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a1a' }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
                        {user.email}
                      </div>
                    </div>
                    
                    <Link
                      href={user.role === 'admin' ? '/admin' : '/client'}
                      onClick={() => setShowUserMenu(false)}
                      style={{
                        display: 'block',
                        padding: '12px 20px',
                        color: '#1a1a1a',
                        fontSize: '13px',
                        textDecoration: 'none',
                        borderBottom: '1px solid #f5f5f5',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fafafa';
                        e.currentTarget.style.color = '#ec4899';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.color = '#1a1a1a';
                      }}
                    >
                      {user.role === 'admin' ? 'Administration' : 'Mon Compte'}
                    </Link>
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowUserMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 20px',
                        color: '#ec4899',
                        fontSize: '13px',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fafafa';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white';
                      }}
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <i className="fas fa-user" style={{ color: '#1a1a1a', fontSize: '16px' }}></i>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>

    {/* Luxury Fullscreen Search */}
    {showSearchBar && (
      <>
        {/* Backdrop Overlay */}
        <div 
          onClick={() => {
            setShowSearchBar(false);
            setSearchQuery('');
            setSearchResults([]);
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 9998,
            animation: 'fadeIn 0.3s ease-out'
          }}
        />
        
        {/* Search Container */}
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          width: '90%',
          maxWidth: '800px',
          animation: 'slideDown 0.4s ease-out'
        }}>
          {/* Close Button */}
          <button
            onClick={() => {
              setShowSearchBar(false);
              setSearchQuery('');
              setSearchResults([]);
            }}
            style={{
              position: 'absolute',
              top: '-50px',
              right: '0',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              transition: 'all 0.3s',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(236, 72, 153, 0.9)';
              e.currentTarget.style.borderColor = '#ec4899';
              e.currentTarget.style.transform = 'rotate(90deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'rotate(0deg)';
            }}
          >
            <i className="fas fa-times"></i>
          </button>

          {/* Search Box */}
          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%)',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(236, 72, 153, 0.1)',
            border: '1px solid rgba(236, 72, 153, 0.2)'
          }}>
            {/* Title */}
            <div style={{
              textAlign: 'center',
              marginBottom: '30px'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                margin: '0 auto 15px',
                background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(236, 72, 153, 0.4)'
              }}>
                <i className="fas fa-search" style={{ color: 'white', fontSize: '24px' }}></i>
              </div>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#1a1a1a',
                margin: '0 0 8px 0',
                letterSpacing: '-0.5px'
              }}>
                Rechercher un produit
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#666',
                margin: 0
              }}>
                Découvrez nos délicieuses pâtisseries
              </p>
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearch}>
              <div style={{ position: 'relative', marginBottom: '20px' }}>
                <div style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#ec4899',
                  fontSize: '20px',
                  zIndex: 1
                }}>
                  <i className="fas fa-search"></i>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Gâteaux, macarons, glaces..."
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '20px 60px',
                    border: '2px solid transparent',
                    borderRadius: '16px',
                    fontSize: '16px',
                    outline: 'none',
                    background: 'white',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s',
                    fontWeight: '500'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#ec4899';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(236, 72, 153, 0.25)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                  }}
                />
                {isSearching && (
                  <div style={{
                    position: 'absolute',
                    right: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}>
                    <i className="fas fa-spinner fa-spin" style={{ color: '#ec4899', fontSize: '20px' }}></i>
                  </div>
                )}
                {searchQuery && !isSearching && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    style={{
                      position: 'absolute',
                      right: '20px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#f5f5f5',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#ec4899';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f5f5f5';
                      e.currentTarget.style.color = '#666';
                    }}
                  >
                    <i className="fas fa-times" style={{ fontSize: '12px' }}></i>
                  </button>
                )}
              </div>
            </form>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                <div style={{
                  padding: '12px 20px',
                  background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} trouvé{searchResults.length > 1 ? 's' : ''}
                </div>
                {searchResults.map((product: any) => {
                  const finalPrice = product.discount 
                    ? product.price * (1 - product.discount / 100) 
                    : product.price;
                  
                  return (
                    <Link
                      key={product._id}
                      href={`/product/${product._id}`}
                      onClick={() => {
                        setShowSearchBar(false);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '16px 20px',
                        textDecoration: 'none',
                        borderBottom: '1px solid #f5f5f5',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(90deg, #fdf2f8 0%, #ffffff 100%)';
                        e.currentTarget.style.paddingLeft = '28px';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.paddingLeft = '20px';
                      }}
                    >
                      {/* Product Image */}
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        background: '#f8f9fa',
                        flexShrink: 0,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                      }}>
                        <img
                          src={product.image?.startsWith('http') 
                            ? product.image 
                            : product.image 
                              ? `${API_URL}${product.image}` 
                              : '/img/product-placeholder.jpg'}
                          alt={product.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>

                      {/* Product Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h6 style={{
                          fontSize: '15px',
                          fontWeight: '600',
                          color: '#1a1a1a',
                          margin: '0 0 4px 0',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {product.name}
                        </h6>
                        <div style={{
                          fontSize: '12px',
                          color: '#999',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <span>{product.category?.name}</span>
                          {product.discount > 0 && (
                            <span style={{
                              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                              color: 'white',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '10px',
                              fontWeight: '700'
                            }}>
                              -{product.discount}%
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div style={{
                        textAlign: 'right',
                        flexShrink: 0
                      }}>
                        {product.discount > 0 && (
                          <div style={{
                            fontSize: '11px',
                            color: '#999',
                            textDecoration: 'line-through',
                            marginBottom: '2px'
                          }}>
                            {product.price.toFixed(3)} DT
                          </div>
                        )}
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#ec4899'
                        }}>
                          {finalPrice.toFixed(3)} DT
                        </div>
                      </div>

                      {/* Arrow */}
                      <i className="fas fa-arrow-right" style={{
                        color: '#ec4899',
                        fontSize: '14px',
                        opacity: 0.6
                      }}></i>
                    </Link>
                  );
                })}

                {/* View All Results */}
                <Link
                  href={`/recherche?q=${encodeURIComponent(searchQuery)}`}
                  onClick={() => {
                    setShowSearchBar(false);
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '16px 20px',
                    textDecoration: 'none',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)';
                    e.currentTarget.style.gap = '12px';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)';
                    e.currentTarget.style.gap = '8px';
                  }}
                >
                  Voir tous les résultats
                  <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            )}

            {/* No Results Message */}
            {searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '40px',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 20px',
                  background: 'linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="fas fa-search" style={{ 
                    fontSize: '32px', 
                    color: '#ccc'
                  }}></i>
                </div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  margin: '0 0 8px 0'
                }}>
                  Aucun résultat trouvé
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#666',
                  margin: 0
                }}>
                  Essayez avec d'autres mots-clés
                </p>
              </div>
            )}

            {/* Quick Suggestions */}
            {searchQuery.length === 0 && (
              <div style={{
                marginTop: '20px'
              }}>
                <p style={{
                  fontSize: '12px',
                  color: '#999',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: '600',
                  marginBottom: '12px'
                }}>
                  Suggestions populaires
                </p>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  {['Gâteaux', 'Macarons', 'Glaces', 'Chocolat', 'Anniversaire'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setSearchQuery(suggestion)}
                      style={{
                        padding: '8px 16px',
                        background: 'white',
                        border: '2px solid #f5f5f5',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#666',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#ec4899';
                        e.currentTarget.style.color = '#ec4899';
                        e.currentTarget.style.background = '#fdf2f8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#f5f5f5';
                        e.currentTarget.style.color = '#666';
                        e.currentTarget.style.background = 'white';
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    )}

    <style jsx global>{`
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translate(-50%, -60%);
        }
        to {
          opacity: 1;
          transform: translate(-50%, -50%);
        }
      }
    `}</style>

    {/* Categories Bar */}
    <div className="categories-bar" style={{
      position: 'fixed',
      top: '95px',
      left: 0,
      right: 0,
      zIndex: 1020,
      background: 'white',
      borderBottom: '1px solid #e5e5e5',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    }}>
      <div className="container">
        <div className="categories-container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '30px',
          padding: '12px 0',
          position: 'relative'
        }}>
          
          {categories.map((cat: any, index: number) => {
            const categorySubcategories = subcategories.filter((sub: any) => sub.category?._id === cat._id);
            const hasSubcategories = categorySubcategories.length > 0;
            const isHovered = hoveredCategory === cat._id;
            
            // Déterminer si c'est une des 2 dernières catégories
            const isLastTwo = index >= categories.length - 2;
            
            // Debug log
            if (isHovered) {
              console.log(`Category: ${cat.name}, Subcategories:`, categorySubcategories);
            }
            
            return (
              <div 
                key={cat._id}
                className="category-item"
                style={{ position: 'relative' }}
                onMouseEnter={() => setHoveredCategory(cat._id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <Link 
                  href={`/category/${cat._id}`}
                  style={{
                    color: isHovered ? '#ec4899' : '#1a1a1a',
                    fontSize: '13px',
                    fontWeight: '400',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    whiteSpace: 'nowrap',
                    padding: '8px 0',
                    transition: 'all 0.3s',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    borderBottom: isHovered ? '2px solid #ec4899' : '2px solid transparent'
                  }}
                >
                  {cat.name}
                  <i className="fas fa-chevron-down" style={{ fontSize: '9px' }}></i>
                </Link>

                {/* Dropdown avec image */}
                {isHovered && (
                  <div 
                    className="category-dropdown"
                    style={{
                      position: 'absolute',
                      top: '100%',
                      ...(isLastTwo ? { right: '0' } : { left: '0' }),
                      marginTop: '10px',
                      background: 'white',
                      border: '1px solid #e5e5e5',
                      borderRadius: '0',
                      width: '700px',
                      height: '350px',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                      zIndex: 10050,
                      overflow: 'hidden',
                      pointerEvents: 'auto',
                      display: 'flex'
                    }}
                    onMouseEnter={() => setHoveredCategory(cat._id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    {/* Liste des sous-catégories à gauche */}
                    <div style={{ 
                      flex: '0 0 280px',
                      padding: '15px 0',
                      background: 'white',
                      overflowY: 'auto'
                    }}>
                      {categorySubcategories.length > 0 ? (
                        categorySubcategories.map((sub: any, index: number) => (
                          <Link 
                            key={sub._id} 
                            href={`/subcategory/${sub._id}`}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '12px 25px',
                              color: '#1a1a1a',
                              fontSize: '13px',
                              textDecoration: 'none',
                              transition: 'all 0.2s',
                              fontWeight: '400'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#fafafa';
                              e.currentTarget.style.color = '#ec4899';
                              e.currentTarget.style.paddingLeft = '30px';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'white';
                              e.currentTarget.style.color = '#1a1a1a';
                              e.currentTarget.style.paddingLeft = '25px';
                            }}
                          >
                            <i className="fas fa-chevron-right" style={{ 
                              fontSize: '9px', 
                              marginRight: '10px',
                              color: '#ec4899'
                            }}></i>
                            {sub.name}
                          </Link>
                        ))
                      ) : (
                        <div style={{
                          padding: '12px 25px',
                          color: '#999',
                          fontSize: '13px',
                          fontStyle: 'italic'
                        }}>
                          Aucune sous-catégorie
                        </div>
                      )}
                    </div>

                    {/* Image à droite */}
                    <div style={{ 
                      flex: 1,
                      background: '#d4af37',
                      position: 'relative',
                      overflow: 'hidden',
                      height: '350px'
                    }}>
                      <img 
                        src={cat.image?.startsWith('http') ? cat.image : cat.image ? `${API_URL}${cat.image}` : '/img/category-patisserie.jpg'}
                        alt={cat.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>

    <style jsx>{`
      /* Styles responsive pour la barre de catégories */
      @media (max-width: 768px) {
        .categories-bar {
          display: none !important;
        }
      }
    `}</style>

    {/* Menu Mobile */}
    {showMobileMenu && (
      <div style={{
        position: 'fixed',
        top: '95px',
        left: 0,
        right: 0,
        bottom: 0,
        background: 'white',
        zIndex: 1025,
        overflowY: 'auto',
        padding: '0'
      }}>
        {/* Navigation principale */}
        <div style={{ 
          borderBottom: '1px solid #f0f0f0',
          padding: '20px'
        }}>
          <Link 
            href="/" 
            onClick={() => setShowMobileMenu(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              padding: '15px 10px',
              color: '#1a1a1a',
              fontSize: '16px',
              fontWeight: '500',
              textDecoration: 'none',
              borderRadius: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fdf2f8';
              e.currentTarget.style.color = '#ec4899';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#1a1a1a';
            }}
          >
            <i className="fas fa-home" style={{ fontSize: '18px', width: '20px' }}></i>
            Accueil
          </Link>
          <Link 
            href="/shop" 
            onClick={() => setShowMobileMenu(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              padding: '15px 10px',
              color: '#1a1a1a',
              fontSize: '16px',
              fontWeight: '500',
              textDecoration: 'none',
              borderRadius: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fdf2f8';
              e.currentTarget.style.color = '#ec4899';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#1a1a1a';
            }}
          >
            <i className="fas fa-shopping-bag" style={{ fontSize: '18px', width: '20px' }}></i>
            Boutique
          </Link>
        </div>

        {/* Catégories */}
        <div style={{ 
          padding: '20px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#ec4899',
            marginBottom: '15px',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            paddingLeft: '10px'
          }}>
            Catégories
          </h3>
          {categories.map((cat: any) => (
            <Link 
              key={cat._id}
              href={`/category/${cat._id}`}
              onClick={() => setShowMobileMenu(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                padding: '12px 10px',
                color: '#1a1a1a',
                fontSize: '15px',
                textDecoration: 'none',
                borderRadius: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fdf2f8';
                e.currentTarget.style.color = '#ec4899';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#1a1a1a';
              }}
            >
              <i className="fas fa-chevron-right" style={{ fontSize: '12px', width: '20px', color: '#ec4899' }}></i>
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Magasins et Contact */}
        <div style={{ 
          padding: '20px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Link 
            href="/magasins" 
            onClick={() => setShowMobileMenu(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              padding: '15px 10px',
              color: '#1a1a1a',
              fontSize: '16px',
              fontWeight: '500',
              textDecoration: 'none',
              borderRadius: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fdf2f8';
              e.currentTarget.style.color = '#ec4899';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#1a1a1a';
            }}
          >
            <i className="fas fa-map-marker-alt" style={{ fontSize: '18px', width: '20px' }}></i>
            Nos Magasins
          </Link>
          <Link 
            href="/contact" 
            onClick={() => setShowMobileMenu(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              padding: '15px 10px',
              color: '#1a1a1a',
              fontSize: '16px',
              fontWeight: '500',
              textDecoration: 'none',
              borderRadius: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fdf2f8';
              e.currentTarget.style.color = '#ec4899';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#1a1a1a';
            }}
          >
            <i className="fas fa-envelope" style={{ fontSize: '18px', width: '20px' }}></i>
            Contact
          </Link>
        </div>

        {/* Compte utilisateur */}
        <div style={{ padding: '20px' }}>
          {user ? (
            <>
              <Link 
                href="/client" 
                onClick={() => setShowMobileMenu(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '15px 10px',
                  color: '#1a1a1a',
                  fontSize: '16px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fdf2f8';
                  e.currentTarget.style.color = '#ec4899';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#1a1a1a';
                }}
              >
                <i className="fas fa-user" style={{ fontSize: '18px', width: '20px' }}></i>
                Mon Compte
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setShowMobileMenu(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  width: '100%',
                  textAlign: 'left',
                  padding: '15px 10px',
                  color: '#ec4899',
                  fontSize: '16px',
                  fontWeight: '500',
                  background: 'none',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fdf2f8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <i className="fas fa-sign-out-alt" style={{ fontSize: '18px', width: '20px' }}></i>
                Déconnexion
              </button>
            </>
          ) : (
            <Link 
              href="/login" 
              onClick={() => setShowMobileMenu(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                padding: '15px 10px',
                color: '#ec4899',
                fontSize: '16px',
                fontWeight: '500',
                textDecoration: 'none',
                borderRadius: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fdf2f8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <i className="fas fa-sign-in-alt" style={{ fontSize: '18px', width: '20px' }}></i>
              Connexion
            </Link>
          )}
        </div>
      </div>
    )}
    </>
  );
}
