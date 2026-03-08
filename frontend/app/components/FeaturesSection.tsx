'use client';

import { useEffect, useRef, useState } from 'react';

export default function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // L'animation se déclenche quand on entre dans la section
        // et se réinitialise quand on sort
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={sectionRef}
      style={{ 
        background: 'white', 
        padding: '80px 0',
        overflow: 'hidden'
      }}
    >
      <div className="container">
        <div className="row align-items-center g-5">
          {/* Image à gauche */}
          <div 
            className="col-lg-6"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-50px)',
              transition: 'all 0.8s ease-out'
            }}
          >
            <div style={{
              position: 'relative',
              height: '500px',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
            }}>
              <img 
                src="/img/satisfaire.jpg" 
                alt="Pâtisserie artisanale"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          </div>

          {/* Contenu à droite */}
          <div 
            className="col-lg-6"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(50px)',
              transition: 'all 0.8s ease-out 0.2s'
            }}
          >
            <div style={{ paddingLeft: '40px' }}>
              {/* Titre principal */}
              <h2 style={{
                fontSize: '2.8rem',
                fontWeight: '300',
                color: '#2c1810',
                marginBottom: '20px',
                lineHeight: '1.2',
                letterSpacing: '0.5px'
              }}>
                Pour vous satisfaire!
              </h2>

              {/* Sous-titre */}
              <p style={{
                fontSize: '1rem',
                color: '#666',
                marginBottom: '50px',
                lineHeight: '1.6'
              }}>
                Nous vous offrons des produits de qualité et une meilleure expérience client
              </p>

              {/* Grille des avantages */}
              <div className="row g-4">
                {/* Avantage 1 - Qualité Premium */}
                <div 
                  className="col-6"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                    transition: 'all 0.6s ease-out 0.4s'
                  }}
                >
                  <div style={{
                    textAlign: 'center',
                    padding: '30px 20px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}>
                    {/* Icône */}
                    <div style={{
                      width: '70px',
                      height: '70px',
                      margin: '0 auto 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #fef3f2 0%, #fce7f3 100%)',
                      borderRadius: '50%',
                      transition: 'all 0.3s ease'
                    }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="1.5">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    {/* Texte */}
                    <h5 style={{
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: '#2c1810',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      QUALITÉ<br/>PREMIUM
                    </h5>
                  </div>
                </div>

                {/* Avantage 2 - Fait Maison */}
                <div 
                  className="col-6"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                    transition: 'all 0.6s ease-out 0.5s'
                  }}
                >
                  <div style={{
                    textAlign: 'center',
                    padding: '30px 20px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}>
                    {/* Icône */}
                    <div style={{
                      width: '70px',
                      height: '70px',
                      margin: '0 auto 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #fef3f2 0%, #fce7f3 100%)',
                      borderRadius: '50%',
                      transition: 'all 0.3s ease'
                    }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="1.5">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                    </div>
                    {/* Texte */}
                    <h5 style={{
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: '#2c1810',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      FAIT<br/>MAISON
                    </h5>
                  </div>
                </div>

                {/* Avantage 3 - 100% Naturel */}
                <div 
                  className="col-6"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                    transition: 'all 0.6s ease-out 0.6s'
                  }}
                >
                  <div style={{
                    textAlign: 'center',
                    padding: '30px 20px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}>
                    {/* Icône */}
                    <div style={{
                      width: '70px',
                      height: '70px',
                      margin: '0 auto 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #fef3f2 0%, #fce7f3 100%)',
                      borderRadius: '50%',
                      transition: 'all 0.3s ease'
                    }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="1.5">
                        <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>
                        <line x1="16" y1="8" x2="2" y2="22"/>
                        <line x1="17.5" y1="15" x2="9" y2="15"/>
                      </svg>
                    </div>
                    {/* Texte */}
                    <h5 style={{
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: '#2c1810',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      100%<br/>NATUREL
                    </h5>
                  </div>
                </div>

                {/* Avantage 4 - 15 ans d'expérience */}
                <div 
                  className="col-6"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                    transition: 'all 0.6s ease-out 0.7s'
                  }}
                >
                  <div style={{
                    textAlign: 'center',
                    padding: '30px 20px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}>
                    {/* Icône */}
                    <div style={{
                      width: '70px',
                      height: '70px',
                      margin: '0 auto 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #fef3f2 0%, #fce7f3 100%)',
                      borderRadius: '50%',
                      transition: 'all 0.3s ease'
                    }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                    </div>
                    {/* Texte */}
                    <h5 style={{
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: '#2c1810',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      15 ANS<br/>D'EXPÉRIENCE
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
