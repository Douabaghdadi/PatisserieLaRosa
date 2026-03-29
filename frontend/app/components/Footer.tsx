'use client';
import { API_URL, getImageUrl } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import '../styles/mobile.css';

export default function Footer() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Erreur chargement catégories:', err));
  }, []);

  return (
    <footer className="footer" style={{
      background: '#1a1a1a',
      color: 'white',
      paddingTop: '40px'
    }}>
      {/* Main Footer */}
      <div className="container">
        <div className="row g-4">
          {/* Brand */}
          <div className="col-lg-4 col-md-6 col-12 footer-brand">
            <div className="mb-3">
              <Image 
                src="/img/logo-la-rosa.png" 
                alt="La Rosa - Pâtisserie & Glace Artisanale" 
                width={140}
                unoptimized
                height={45}
                style={{
                  objectFit: 'contain'
                }}
              />
            </div>
            <p className="footer-description" style={{color: 'rgba(255,255,255,0.6)', lineHeight: '1.6', marginBottom: '18px', fontSize: '13px'}}>
              Votre pâtisserie artisanale en Tunisie. Gâteaux, pâtisseries françaises, 
              glaces et macarons de qualité supérieure.
            </p>
            <div className="footer-social d-flex gap-2">
              {[
                { icon: 'facebook-f', url: 'https://www.facebook.com/LaR0sa' },
                { icon: 'instagram', url: 'https://www.instagram.com/larosa.korba' },
                { icon: 'whatsapp', url: 'https://wa.me/21622644528' }
              ].map((social) => (
                <a 
                  key={social.icon}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(236, 72, 153, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ec4899',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    fontSize: '13px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#ec4899';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(236, 72, 153, 0.15)';
                    e.currentTarget.style.color = '#ec4899';
                  }}
                >
                  <i className={'fab fa-' + social.icon}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 col-6 footer-links">
            <h5 className="footer-title" style={{fontWeight: '600', marginBottom: '15px', color: 'white', fontSize: '15px'}}>Liens Rapides</h5>
            <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
              {[
                { name: 'Accueil', href: '/' },
                { name: 'Nos Créations', href: '/shop' },
                { name: 'Nos Magasins', href: '/magasins' },
                { name: 'Contact', href: '/contact' }
              ].map((link) => (
                <li key={link.name} style={{marginBottom: '8px'}}>
                  <Link 
                    href={link.href}
                    style={{
                      color: 'rgba(255,255,255,0.6)',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      fontSize: '13px',
                      display: 'inline-block'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ec4899';
                      e.currentTarget.style.paddingLeft = '5px';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                      e.currentTarget.style.paddingLeft = '0';
                    }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="col-lg-2 col-md-6 col-6 footer-categories">
            <h5 className="footer-title" style={{fontWeight: '600', marginBottom: '15px', color: 'white', fontSize: '15px'}}>Catégories</h5>
            <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
              {categories.slice(0, 5).map((cat) => (
                <li key={cat._id} style={{marginBottom: '8px'}}>
                  <Link 
                    href={`/category/${cat._id}`}
                    style={{
                      color: 'rgba(255,255,255,0.6)',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      fontSize: '13px',
                      display: 'inline-block'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ec4899';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                    }}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-4 col-md-6 col-12 footer-contact">
            <h5 className="footer-title" style={{fontWeight: '600', marginBottom: '15px', color: 'white', fontSize: '15px'}}>Contact</h5>
            <div style={{marginBottom: '15px'}}>
              <div className="d-flex align-items-start gap-3 mb-2">
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(236, 72, 153, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className="fas fa-map-marker-alt" style={{color: '#ec4899', fontSize: '13px'}}></i>
                </div>
                <div>
                  <div style={{color: 'white', fontWeight: '600', marginBottom: '3px', fontSize: '13px'}}>Adresses</div>
                  <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '12px', lineHeight: '1.5'}}>Av Habib Bourguiba, Korba</div>
                  <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '12px', lineHeight: '1.5'}}>Rue dddddddd, Korba</div>
                  <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '12px', lineHeight: '1.5'}}>Rue Aaaaaaaaa, Kelibia</div>
                </div>
              </div>
              
              <div className="d-flex align-items-start gap-3 mb-2">
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(236, 72, 153, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className="fas fa-phone-alt" style={{color: '#ec4899', fontSize: '13px'}}></i>
                </div>
                <div>
                  <div style={{color: 'white', fontWeight: '600', marginBottom: '3px', fontSize: '13px'}}>Téléphone</div>
                  <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '12px'}}>+216 22 644 528</div>
                </div>
              </div>
              
              <div className="d-flex align-items-start gap-3">
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(236, 72, 153, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className="fas fa-envelope" style={{color: '#ec4899', fontSize: '13px'}}></i>
                </div>
                <div>
                  <div style={{color: 'white', fontWeight: '600', marginBottom: '3px', fontSize: '13px'}}>Email</div>
                  <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '12px'}}>larosa.korba@gmail.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        marginTop: '35px',
        padding: '16px 0'
      }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p style={{color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: 0}}>
                © 2026 La Rosa. Tous droits réservés.
              </p>
            </div>
            <div className="col-md-6 text-md-end mt-3 mt-md-0">
              <div className="d-flex gap-4 justify-content-md-end flex-wrap">
                <Link href="/privacy" style={{color: 'rgba(255,255,255,0.5)', fontSize: '12px', textDecoration: 'none'}}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ec4899'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                  Politique de confidentialité
                </Link>
                <Link href="/terms" style={{color: 'rgba(255,255,255,0.5)', fontSize: '12px', textDecoration: 'none'}}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ec4899'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                  Conditions d'utilisation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
