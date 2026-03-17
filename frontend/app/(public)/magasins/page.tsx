'use client';
import Link from 'next/link';
import { useState } from 'react';

const stores = [
  {
    id: 'korba-1',
    name: 'La Rosa Korba',
    address: 'Av Habib Bourguiba, Korba',
    city: 'Korba',
    phone: '+216 22 644 528',
    hours: '9h - 21h',
    image: '/img/stores/store-korba.jpg',
    mapUrl: 'https://www.google.com/maps/search/La+Rosa+Korba+Av+Habib+Bourguiba'
  },
  {
    id: 'korba-2',
    name: 'La Rosa Korba',
    address: 'Rue dddddddd, Korba',
    city: 'Korba',
    phone: '+216 22 644 528',
    hours: '9h - 21h',
    image: '/img/stores/store-korba.jpg',
    mapUrl: 'https://www.google.com/maps/search/La+Rosa+Korba'
  },
  {
    id: 'kelibia',
    name: 'La Rosa Kelibia',
    address: 'Rue Aaaaaaaaa, Kelibia',
    city: 'Kelibia',
    phone: '+216 22 644 528',
    hours: '9h - 21h',
    image: '/img/stores/store-korba.jpg',
    mapUrl: 'https://www.google.com/maps/search/La+Rosa+Kelibia'
  }
];

function StoreCard({ store }: { store: typeof stores[0] }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      height: '100%',
      border: '1px solid #f0f0f0',
      transition: 'all 0.3s'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 8px 25px rgba(236, 72, 153, 0.15)';
      e.currentTarget.style.transform = 'translateY(-4px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}>
      {/* Store Image */}
      <div style={{
        height: '220px',
        position: 'relative',
        background: '#fafafa'
      }}>
        {!imageError ? (
          <img 
            src={store.image}
            alt={store.name}
            onError={() => setImageError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)'
          }}>
            <i className="fas fa-store" style={{ fontSize: '60px', color: '#ccc' }}></i>
          </div>
        )}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: '#ec4899',
          color: 'white',
          padding: '6px 14px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: '600',
          zIndex: 2
        }}>
          <i className="fas fa-map-marker-alt me-2"></i>{store.city}
        </div>
      </div>

      {/* Store Info */}
      <div style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#333', marginBottom: '20px' }}>
          {store.name}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Address */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: '#fce7f3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <i className="fas fa-map-marker-alt" style={{ color: '#ec4899', fontSize: '16px' }}></i>
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: '600', color: '#333', fontSize: '14px', marginBottom: '3px' }}>Adresse</p>
              <p style={{ margin: 0, color: '#666', fontSize: '14px', lineHeight: '1.5' }}>{store.address}</p>
            </div>
          </div>

          {/* Phone */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: '#fce7f3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <i className="fas fa-phone-alt" style={{ color: '#ec4899', fontSize: '16px' }}></i>
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: '600', color: '#333', fontSize: '14px', marginBottom: '3px' }}>Téléphone</p>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{store.phone}</p>
            </div>
          </div>

          {/* Hours */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <i className="fas fa-clock" style={{ color: '#16a34a', fontSize: '16px' }}></i>
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: '600', color: '#333', fontSize: '14px', marginBottom: '3px' }}>Horaires</p>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{store.hours}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
          <a 
            href={store.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 18px',
              background: '#ec4899',
              color: 'white',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#d946a6'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#ec4899'}
          >
            <i className="fas fa-directions"></i>
            Itinéraire
          </a>
          <a 
            href={`tel:${store.phone.replace(/\s/g, '')}`}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 18px',
              background: 'white',
              color: '#333',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
              border: '1px solid #e0e0e0',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fafafa';
              e.currentTarget.style.borderColor = '#ec4899';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#e0e0e0';
            }}
          >
            <i className="fas fa-phone-alt"></i>
            Appeler
          </a>
        </div>
      </div>
    </div>
  );
}

export default function MagasinsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      {/* Hero Section - Rose moderne */}
      <div style={{
        background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
        padding: '60px 0 50px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '10%',
          width: '200px',
          height: '200px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '5%',
          width: '150px',
          height: '150px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%'
        }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.25)',
            padding: '6px 18px',
            borderRadius: '20px',
            marginBottom: '15px'
          }}>
            <span style={{ color: 'white', fontSize: '12px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              Nos Points de Vente
            </span>
          </span>
          <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: '700', marginBottom: '12px', letterSpacing: '-0.5px' }}>
            Nos Magasins
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', maxWidth: '600px', margin: '0 auto', fontWeight: '400' }}>
            Retrouvez-nous dans nos trois points de vente pour découvrir nos produits
          </p>
        </div>
      </div>

      {/* Stores Section */}
      <div className="container" style={{ padding: '50px 15px' }}>
        <div className="row g-4">
          {stores.map((store) => (
            <div key={store.id} id={store.id} className="col-lg-4 col-md-6">
              <StoreCard store={store} />
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div style={{
          marginTop: '50px',
          background: 'white',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          border: '1px solid #f0f0f0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#fce7f3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <i className="fas fa-question-circle" style={{ fontSize: '28px', color: '#ec4899' }}></i>
          </div>
          <h3 style={{ color: '#333', fontSize: '1.4rem', fontWeight: '700', marginBottom: '12px' }}>
            Besoin d&apos;aide ?
          </h3>
          <p style={{ color: '#666', fontSize: '15px', marginBottom: '25px', maxWidth: '500px', margin: '0 auto 25px', lineHeight: '1.6' }}>
            Notre équipe est disponible pour vous conseiller et répondre à toutes vos questions
          </p>
          <Link href="/contact" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 28px',
            background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
            color: 'white',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #d946a6 0%, #ec4899 100%)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)'}>
            <i className="fas fa-envelope"></i>
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
}
