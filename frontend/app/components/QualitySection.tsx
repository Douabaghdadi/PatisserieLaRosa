'use client';

export default function QualitySection() {
  return (
    <div style={{ 
      background: '#faf9f7', 
      padding: '100px 0',
      overflow: 'hidden'
    }}>
      <div className="container">
        <div className="row align-items-center g-5">
          {/* Texte à gauche */}
          <div className="col-lg-6">
            <div style={{ paddingRight: '40px' }}>
              {/* Petit titre */}
              <p style={{
                color: '#ec4899',
                fontSize: '0.85rem',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                marginBottom: '20px',
                fontWeight: '500'
              }}>
                Découvrez La Rosa
              </p>

              {/* Titre principal */}
              <h2 style={{
                fontSize: '3rem',
                fontWeight: '300',
                color: '#2c1810',
                marginBottom: '30px',
                lineHeight: '1.2',
                letterSpacing: '0.5px',
                fontFamily: "'Playfair Display', serif"
              }}>
                L&apos;Art de la Pâtisserie<br/>
                Tunisienne
              </h2>

              {/* Premier paragraphe */}
              <p style={{
                fontSize: '1rem',
                color: '#666',
                marginBottom: '25px',
                lineHeight: '1.8',
                fontWeight: '300'
              }}>
                Depuis 15 ans, La Rosa perpétue la tradition de la pâtisserie artisanale en Tunisie. Chaque création est le fruit d&apos;un savoir-faire authentique, alliant recettes traditionnelles et techniques modernes pour vous offrir des moments de pure gourmandise.
              </p>

              {/* Deuxième paragraphe */}
              <p style={{
                fontSize: '0.95rem',
                color: '#666',
                marginBottom: '0',
                lineHeight: '1.8',
                fontWeight: '300'
              }}>
                De nos gâteaux d&apos;anniversaire personnalisés à notre pâtisserie fine raffinée, nous mettons un point d&apos;honneur à utiliser des ingrédients de première qualité. Notre passion : transformer chaque célébration en un souvenir inoubliable grâce à des créations aussi belles que délicieuses.
              </p>
            </div>
          </div>

          {/* Vidéo à droite */}
          <div className="col-lg-6">
            <div style={{ position: 'relative' }}>
              {/* Vidéo en lecture automatique */}
              <div style={{
                position: 'relative',
                width: '100%',
                height: '500px',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
              }}>
                <video 
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  poster="/img/la-rosa-banner.jpg"
                >
                  <source src="/videos/patisserie-video.mp4.mp4" type="video/mp4" />
                  Votre navigateur ne supporte pas la vidéo.
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
