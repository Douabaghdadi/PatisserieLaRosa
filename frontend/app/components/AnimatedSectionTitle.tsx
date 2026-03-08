'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedSectionTitleProps {
  subtitle: string;
  title: string;
  background?: string;
}

export default function AnimatedSectionTitle({ subtitle, title, background = 'white' }: AnimatedSectionTitleProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // L'animation se déclenche quand on entre dans la section
        // et se réinitialise quand on sort
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
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
        textAlign: 'center', 
        marginBottom: '60px'
      }}
    >
      <p style={{
        color: '#ec4899',
        fontSize: '0.9rem',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        marginBottom: '15px',
        fontWeight: '500',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.8s ease-out 0.2s'
      }}>
        {subtitle}
      </p>
      <h2 style={{ 
        fontSize: '2.5rem', 
        fontWeight: '300', 
        color: '#2c1810', 
        margin: 0,
        letterSpacing: '1px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.8s ease-out 0.4s'
      }}>
        {title}
      </h2>
      <div style={{
        width: isVisible ? '60px' : '0',
        height: '2px',
        background: '#ec4899',
        margin: '20px auto 0',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.8s ease-out 0.6s',
        transformOrigin: 'center'
      }}></div>
    </div>
  );
}
