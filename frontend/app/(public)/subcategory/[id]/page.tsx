'use client';
import { API_URL, getImageUrl } from '@/lib/api';
import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../../../context/CartContext';
import { useFavorites } from '../../../context/FavoritesContext';
import FlavorDropdown from '../../../components/FlavorDropdown';

interface Flavor {
  _id: string;
  name: string;
  color?: string;
}

interface Subcategory {
  _id: string;
  name: string;
  category?: { _id: string; name: string };
}

interface Product {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  description?: string;
  image?: string;
  stock?: number;
  brand?: { _id: string; name: string };
  subcategories?: { _id: string; name: string }[];
  flavors?: Flavor[];
}

export default function SubcategoryPage() {
  const params = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [flavors, setFlavors] = useState<Flavor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showDiscountOnly, setShowDiscountOnly] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { addToCart } = useCart();
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const resetFilters = () => {
    setSelectedBrand('');
    setSelectedFlavor('');
    setPriceRange({ min: '', max: '' });
    setShowDiscountOnly(false);
    setSortBy('');
  };

  useEffect(() => {
    fetch(`${API_URL}/subcategories/${params.id}`)
      .then(r => r.json())
      .then(data => setSubcategory(data));

    fetch(`${API_URL}/flavors`)
      .then(r => r.json())
      .then(data => setFlavors(data));

    fetch(`${API_URL}/products`)
      .then(r => r.json())
      .then(data => {
        const filtered = data.filter((p: Product) => 
          p.subcategories?.some((sub: { _id: string; name: string }) => sub._id === params.id)
        );
        setProducts(filtered);
        // Initialiser les quantités
        const initialQuantities: { [key: string]: number } = {};
        filtered.forEach((p: Product) => { initialQuantities[p._id] = 1; });
        setQuantities(initialQuantities);
        setLoading(false);
      });
  }, [params.id]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (selectedBrand) result = result.filter((p) => p.brand?._id === selectedBrand);
    if (selectedFlavor) result = result.filter((p) => p.flavors?.some((f: Flavor) => f._id === selectedFlavor));
    if (showDiscountOnly) result = result.filter((p) => (p.discount ?? 0) > 0);
    if (priceRange.min) {
      result = result.filter((p) => {
        const finalPrice = (p.discount ?? 0) > 0 ? p.price * (1 - (p.discount ?? 0) / 100) : p.price;
        return finalPrice >= parseFloat(priceRange.min);
      });
    }
    if (priceRange.max) {
      result = result.filter((p) => {
        const finalPrice = (p.discount ?? 0) > 0 ? p.price * (1 - (p.discount ?? 0) / 100) : p.price;
        return finalPrice <= parseFloat(priceRange.max);
      });
    }
    if (sortBy === 'price-asc') {
      result.sort((a, b) => {
        const priceA = (a.discount ?? 0) > 0 ? a.price * (1 - (a.discount ?? 0) / 100) : a.price;
        const priceB = (b.discount ?? 0) > 0 ? b.price * (1 - (b.discount ?? 0) / 100) : b.price;
        return priceA - priceB;
      });
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => {
        const priceA = (a.discount ?? 0) > 0 ? a.price * (1 - (a.discount ?? 0) / 100) : a.price;
        const priceB = (b.discount ?? 0) > 0 ? b.price * (1 - (b.discount ?? 0) / 100) : b.price;
        return priceB - priceA;
      });
    }
    return result;
  }, [products, selectedBrand, priceRange, showDiscountOnly, sortBy, selectedFlavor]);

  const handleQuantityChange = (productId: string, delta: number) => {
    setQuantities(prev => ({ ...prev, [productId]: Math.max(1, (prev[productId] || 1) + delta) }));
  };

  const handleAddToCart = (product: Product) => {
    const finalPrice = (product.discount ?? 0) > 0 ? product.price * (1 - (product.discount ?? 0) / 100) : product.price;
    addToCart({
      _id: product._id,
      name: product.name,
      price: finalPrice,
      image: product.image || '/img/product-placeholder.jpg',
      quantity: quantities[product._id] || 1
    });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        select option {
          padding: 14px 16px;
          background-color: white;
          color: #1a202c;
          font-size: 14px;
          font-weight: 500;
          border-bottom: 1px solid #fce7f3;
        }
        select option:hover {
          background-color: #fce7f3;
        }
        select option:checked,
        select option:focus {
          background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
          color: white;
          font-weight: 600;
        }
        select::-webkit-scrollbar {
          width: 8px;
        }
        select::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        select::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
          border-radius: 10px;
        }
      `}} />
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh', paddingBottom: '50px' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
        padding: '40px 0 30px',
        marginBottom: '40px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-30px', left: '10%', width: '100px', height: '100px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <nav aria-label="breadcrumb" style={{ marginBottom: '15px' }}>
            <ol className="breadcrumb" style={{ backgroundColor: 'transparent', padding: 0, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <li className="breadcrumb-item">
                <Link href="/" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '500' }}>
                  <i className="fas fa-home" style={{ fontSize: '11px' }}></i> Accueil
                </Link>
              </li>
              <li style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>/</li>
              <li className="breadcrumb-item">
                <Link href="/shop" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}>
                  Boutique
                </Link>
              </li>
              <li style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>/</li>
              <li className="breadcrumb-item active" style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>{subcategory?.name}</li>
            </ol>
          </nav>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <div style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fas fa-layer-group" style={{ color: 'white', fontSize: '22px' }}></i>
            </div>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'white', margin: 0, letterSpacing: '-0.5px' }}>
                {subcategory?.name}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', margin: 0, fontWeight: '400' }}>
                {subcategory?.category?.name}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255,255,255,0.25)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fas fa-box" style={{ fontSize: '12px' }}></i>
              {filteredProducts.length} article{filteredProducts.length > 1 ? 's' : ''}
            </span>
            <span style={{ background: 'rgba(255,255,255,0.25)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fas fa-tags" style={{ fontSize: '12px' }}></i>
              {filteredProducts.filter(p => (p.discount ?? 0) > 0).length} en promo
            </span>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Mobile Filter Button */}
        <div className="d-lg-none" style={{ marginBottom: '20px' }}>
          <button 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            style={{
              width: '100%',
              padding: '14px 20px',
              background: 'white',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#1a202c',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fas fa-sliders-h" style={{ color: '#ec4899' }}></i>
              Filtres et tri
              {(selectedBrand || selectedFlavor || showDiscountOnly || priceRange.min || priceRange.max) && (
                <span style={{ background: '#ec4899', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>!</span>
              )}
            </span>
            <i className={`fas fa-chevron-${showMobileFilters ? 'up' : 'down'}`} style={{ color: '#64748b' }}></i>
          </button>
          
          {showMobileFilters && (
            <div style={{ marginTop: '15px', backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>

              <div style={{ marginBottom: '15px' }}>
                <FlavorDropdown 
                  flavors={flavors}
                  selectedFlavor={selectedFlavor}
                  onSelect={setSelectedFlavor}
                  isMobile={true}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
                <input type="number" placeholder="Prix min" value={priceRange.min} onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })} style={{ width: '100%', padding: '12px', border: '2px solid #fce7f3', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
                <input type="number" placeholder="Prix max" value={priceRange.max} onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })} style={{ width: '100%', padding: '12px', border: '2px solid #fce7f3', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
              </div>
              
              <select style={{ width: '100%', padding: '12px', border: '2px solid #fce7f3', borderRadius: '10px', fontSize: '14px', outline: 'none', marginBottom: '15px' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="">Trier par</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px', background: showDiscountOnly ? '#fce7f3' : '#f8f9fa', borderRadius: '10px', fontSize: '14px', fontWeight: '500', marginBottom: '15px' }}>
                <input type="checkbox" checked={showDiscountOnly} onChange={(e) => setShowDiscountOnly(e.target.checked)} style={{ accentColor: '#ec4899' }} />
                <i className="fas fa-tag" style={{ color: '#ec4899' }}></i> Promotions uniquement
              </label>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={resetFilters} style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                  <i className="fas fa-redo me-2"></i>Réinitialiser
                </button>
                <button onClick={() => setShowMobileFilters(false)} style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                  Voir {filteredProducts.length} résultats
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="row g-4">
          {/* Filtres - Hidden on mobile */}
          <div className="col-lg-3 d-none d-lg-block">
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(236, 72, 153, 0.1)',
              border: '2px solid #fce7f3',
              position: 'sticky',
              top: '160px'
            }}>
              <h5 style={{ fontSize: '16px', fontWeight: '700', color: '#333', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fas fa-filter" style={{ color: '#ec4899', fontSize: '14px' }}></i> Filtres
              </h5>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#ec4899', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Goût</label>
                <FlavorDropdown 
                  flavors={flavors}
                  selectedFlavor={selectedFlavor}
                  onSelect={setSelectedFlavor}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#ec4899', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Prix (DT)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '2px solid #fce7f3', borderRadius: '10px', fontSize: '14px', outline: 'none', background: 'white' }}
                  />
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '2px solid #fce7f3', borderRadius: '10px', fontSize: '14px', outline: 'none', background: 'white' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '10px', background: showDiscountOnly ? '#fce7f3' : '#fafafa', borderRadius: '10px', transition: 'all 0.3s', border: '2px solid', borderColor: showDiscountOnly ? '#ec4899' : '#fce7f3' }}>
                  <input 
                    type="checkbox" 
                    checked={showDiscountOnly}
                    onChange={(e) => setShowDiscountOnly(e.target.checked)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#ec4899' }}
                  />
                  <span style={{ fontSize: '13px', color: showDiscountOnly ? '#ec4899' : '#666', fontWeight: '600' }}>
                    <i className="fas fa-tag me-2"></i>Promotions
                  </span>
                </label>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#ec4899', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Trier par</label>
                <select 
                  style={{ 
                    width: '100%', 
                    padding: '10px 12px', 
                    border: '2px solid #fce7f3', 
                    borderRadius: '10px', 
                    fontSize: '14px', 
                    outline: 'none', 
                    cursor: 'pointer', 
                    color: '#333',
                    backgroundColor: 'white',
                    fontWeight: '500',
                    appearance: 'none',
                    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23ec4899\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '20px',
                    paddingRight: '40px',
                    transition: 'all 0.3s ease'
                  }}
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = '#ec4899'}
                  onBlur={(e) => e.target.style.borderColor = '#fce7f3'}
                >
                  <option value="">Par défaut</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                </select>
              </div>

              <button 
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)',
                  transition: 'all 0.3s'
                }}
                onClick={resetFilters}
                onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #d946a6 0%, #ec4899 100%)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'}
              >
                <i className="fas fa-redo"></i> Réinitialiser
              </button>
            </div>
          </div>

          {/* Produits */}
          <div className="col-12 col-lg-9">
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
                <span style={{ fontWeight: '700', color: '#1a202c' }}>{filteredProducts.length}</span> produit(s) trouvé(s)
              </p>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <div className="spinner-border" style={{ color: '#c53030' }} role="status"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '60px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <i className="fas fa-box-open" style={{ fontSize: '50px', color: '#cbd5e1', marginBottom: '20px' }}></i>
                <p style={{ fontSize: '18px', color: '#64748b', margin: 0 }}>Aucun produit disponible avec ces filtres</p>
              </div>
            ) : (
              <div className="row g-4">
                {filteredProducts.map((product) => {
                  const finalPrice = (product.discount ?? 0) > 0 ? product.price * (1 - (product.discount ?? 0) / 100) : product.price;
                  const isFavorite = favorites.includes(product._id);
                  return (
                    <div key={product._id} className="col-6 col-md-6 col-xl-4">
                      <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                        border: '1px solid #f0f0f0',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.3s ease'
                      }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(236, 72, 153, 0.15)';
                          e.currentTarget.style.transform = 'translateY(-4px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}>
                        <div style={{ position: 'relative', backgroundColor: '#fafafa', height: '260px' }}>
                          <Link href={`/product/${product._id}`}>
                            <img 
                              src={getImageUrl(product.image)}
                              alt={product.name}
                              style={{ width: '100%', height: '260px', objectFit: 'contain', padding: '20px' }}
                            />
                          </Link>
                          {product.brand?.name && (
                            <span style={{
                              position: 'absolute', top: '10px', left: '10px',
                              background: '#333',
                              color: 'white', padding: '5px 10px', borderRadius: '8px',
                              fontSize: '11px', fontWeight: '600'
                            }}>
                              {product.brand.name}
                            </span>
                          )}
                          {(product.discount ?? 0) > 0 && (
                            <span style={{
                              position: 'absolute', top: '10px', right: '10px',
                              background: '#ec4899',
                              color: 'white', padding: '5px 10px', borderRadius: '8px',
                              fontSize: '11px', fontWeight: '700'
                            }}>
                              -{product.discount}%
                            </span>
                          )}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              if (isFavorite) { removeFavorite(product._id); }
                              else { addFavorite(product._id); }
                            }}
                            style={{
                              position: 'absolute', bottom: '10px', right: '10px',
                              width: '36px', height: '36px', borderRadius: '50%', border: 'none',
                              background: isFavorite ? '#fce7f3' : 'white', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                          >
                            <i className={isFavorite ? 'fas fa-heart' : 'far fa-heart'} 
                              style={{ color: isFavorite ? '#ec4899' : '#666', fontSize: '14px' }}></i>
                          </button>
                        </div>
                        <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <Link href={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                            <h6 style={{ fontWeight: '600', color: '#333', fontSize: '14px', lineHeight: '1.4', height: '40px', overflow: 'hidden', marginBottom: '10px' }}>
                              {product.name}
                            </h6>
                          </Link>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '10px',
                            background: (product.stock ?? 0) > 0 ? '#dcfce7' : '#fee2e2', padding: '4px 10px', borderRadius: '20px', width: 'fit-content' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: (product.stock ?? 0) > 0 ? '#22c55e' : '#ef4444' }}></span>
                            <span style={{ color: (product.stock ?? 0) > 0 ? '#16a34a' : '#dc2626', fontSize: '11px', fontWeight: '600' }}>
                              {(product.stock ?? 0) > 0 ? 'En stock' : 'Rupture'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px', marginTop: 'auto' }}>
                            {(product.discount ?? 0) > 0 && (
                              <span style={{ fontSize: '12px', color: '#999', textDecoration: 'line-through' }}>{product.price.toFixed(3)}</span>
                            )}
                            <span style={{ fontSize: '18px', fontWeight: '700', color: (product.discount ?? 0) > 0 ? '#16a34a' : '#ec4899' }}>{finalPrice.toFixed(3)}</span>
                            <span style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>DT</span>
                          </div>
                          <Link 
                            href={`/product/${product._id}`}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              textDecoration: 'none',
                              border: 'none',
                              background: (product.stock ?? 0) > 0 ? 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' : '#cbd5e1',
                              color: 'white',
                              borderRadius: '10px',
                              padding: '12px 15px',
                              cursor: (product.stock ?? 0) > 0 ? 'pointer' : 'not-allowed',
                              fontSize: '13px',
                              fontWeight: '700',
                              boxShadow: (product.stock ?? 0) > 0 ? '0 4px 12px rgba(236, 72, 153, 0.3)' : 'none',
                              pointerEvents: (product.stock ?? 0) === 0 ? 'none' : 'auto'
                            }}
                          >
                            <i className="fas fa-eye"></i> Voir le produit
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
