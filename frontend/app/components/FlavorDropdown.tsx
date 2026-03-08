'use client';
import { useState, useRef, useEffect } from 'react';

interface Flavor {
  _id: string;
  name: string;
  color?: string;
}

interface FlavorDropdownProps {
  flavors: Flavor[];
  selectedFlavor: string;
  onSelect: (flavorId: string) => void;
  isMobile?: boolean;
}

export default function FlavorDropdown({ flavors, selectedFlavor, onSelect, isMobile = false }: FlavorDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedFlavorObj = flavors.find(f => f._id === selectedFlavor);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (flavorId: string) => {
    onSelect(flavorId);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      {/* Bouton principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: isMobile ? '12px 16px' : '12px 15px',
          border: '2px solid #fce7f3',
          borderRadius: isMobile ? '10px' : '12px',
          fontSize: '14px',
          backgroundColor: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.3s ease',
          outline: 'none',
          fontWeight: '500',
          color: selectedFlavorObj ? '#1a202c' : '#94a3b8'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#ec4899';
        }}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.borderColor = '#fce7f3';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {selectedFlavorObj ? (
            <>
              <span
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: selectedFlavorObj.color || '#ec4899',
                  border: '2px solid white',
                  boxShadow: '0 0 0 1px #e2e8f0'
                }}
              ></span>
              <span>{selectedFlavorObj.name}</span>
            </>
          ) : (
            <>
              <i className="fas fa-ice-cream" style={{ color: '#ec4899', fontSize: '12px' }}></i>
              <span>Tous les goûts</span>
            </>
          )}
        </div>
        <i
          className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}
          style={{
            color: '#ec4899',
            fontSize: '12px',
            transition: 'transform 0.3s ease'
          }}
        ></i>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '2px solid #fce7f3',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(236, 72, 153, 0.15)',
            zIndex: 1000,
            maxHeight: '320px',
            overflowY: 'auto',
            animation: 'slideDown 0.2s ease-out'
          }}
        >
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes slideDown {
                from {
                  opacity: 0;
                  transform: translateY(-10px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              .flavor-option:hover {
                background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%) !important;
              }
              .flavor-option.selected {
                background: linear-gradient(135deg, #ec4899 0%, #db2777 100%) !important;
                color: white !important;
              }
              .flavor-option.selected .flavor-dot {
                border-color: white !important;
                box-shadow: 0 0 0 2px rgba(255,255,255,0.3) !important;
              }
            `
          }} />

          {/* Option "Tous les goûts" */}
          <div
            className={`flavor-option ${!selectedFlavor ? 'selected' : ''}`}
            onClick={() => handleSelect('')}
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.2s ease',
              borderBottom: '1px solid #fce7f3',
              fontWeight: !selectedFlavor ? '600' : '500',
              fontSize: '14px',
              color: !selectedFlavor ? 'white' : '#4a5568'
            }}
          >
            <i className="fas fa-ice-cream" style={{ fontSize: '14px', color: !selectedFlavor ? 'white' : '#ec4899' }}></i>
            <span>Tous les goûts</span>
            {!selectedFlavor && (
              <i className="fas fa-check" style={{ marginLeft: 'auto', fontSize: '12px' }}></i>
            )}
          </div>

          {/* Options des goûts */}
          {flavors.map((flavor) => {
            const isSelected = selectedFlavor === flavor._id;
            return (
              <div
                key={flavor._id}
                className={`flavor-option ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(flavor._id)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.2s ease',
                  borderBottom: '1px solid #fce7f3',
                  fontWeight: isSelected ? '600' : '500',
                  fontSize: '14px',
                  color: isSelected ? 'white' : '#4a5568'
                }}
              >
                <span
                  className="flavor-dot"
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: flavor.color || '#ec4899',
                    border: '2px solid white',
                    boxShadow: isSelected ? '0 0 0 2px rgba(255,255,255,0.3)' : '0 0 0 1px #e2e8f0',
                    flexShrink: 0,
                    transition: 'all 0.2s ease'
                  }}
                ></span>
                <span style={{ flex: 1 }}>{flavor.name}</span>
                {isSelected && (
                  <i className="fas fa-check" style={{ fontSize: '12px' }}></i>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
