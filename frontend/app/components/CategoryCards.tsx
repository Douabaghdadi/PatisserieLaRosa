'use client';
import { API_URL, getImageUrl } from '@/lib/api';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
}

export default function CategoryCards() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/categories').then(res => res.json()),
      fetch(`${API_URL}/subcategories').then(res => res.json())
    ])
      .then(([categoriesData, subcategoriesData]) => {
        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur chargement:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ background: '#fafafa', padding: '60px 0', textAlign: 'center' }}>
        <div className="spinner-border" style={{ color: '#ec4899' }} role="status"></div>
      </div>
    );
  }

  // Définir les 3 catégories principales avec leurs images
  const mainCategories = [
    {
      name: 'Pâtisserie Fine',
      image: '/img/category-patisserie.jpg',
      searchTerm: 'pâtisserie'
    },
    {
      name: 'Macarons',
      image: '/img/category-sale.jpg',
      searchTerm: 'macarons'
    },
    {
      name: 'Gâteaux',
      image: '/img/category-cadeaux.jpg',
      searchTerm: 'gâteaux'
    }
  ];

  return (
    <div style={{ background: '#fafafa', padding: '60px 0' }}>
      <div className="container">
        <div className="row g-4">
          {mainCategories.map((cat, index) => {
            let link = '/shop';
            
            if (cat.searchTerm === 'macarons') {
              // Pour Macarons, chercher la sous-catégorie
              const macaronsSubcategory = subcategories.find(sub => 
                sub.name?.toLowerCase().includes('macaron')
              );
              link = macaronsSubcategory ? `/subcategory/${macaronsSubcategory._id}` : '/shop';
            } else {
              // Pour les autres, chercher la catégorie
              const dbCategory = categories.find(c => 
                c.name?.toLowerCase().includes(cat.searchTerm.toLowerCase())
              );
              link = dbCategory ? `/category/${dbCategory._id}` : '/shop';
            }

            return (
              <div key={index} className="col-md-4">
                <Link href={link} style={{ textDecoration: 'none' }}>
                  <div 
                    style={{
                      position: 'relative',
                      height: '400px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease',
                      borderRadius: '0'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <img 
                      src={cat.image}
                      alt={cat.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'brightness(0.75)'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                      padding: '50px 30px',
                      textAlign: 'center'
                    }}>
                      <h3 style={{
                        color: 'white',
                        fontSize: '1.8rem',
                        fontWeight: '700',
                        marginBottom: '0',
                        letterSpacing: '0.5px'
                      }}>
                        {cat.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
