import React, { useState } from 'react';
import { Plus, Minus, Check, X } from 'lucide-react';
import { fixImageUrl } from '../services/api';

const ProductCard = ({ product, toppings = [], onAddToCart }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const handleTambahClick = (e) => {
    e.stopPropagation();
    if (toppings && toppings.length > 0) {
      setIsExpanded(true);
    } else {
      onAddToCart(product, 1, []);
    }
  };

  const handleConfirmAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product, quantity, selectedToppings);
    // Reset states
    setIsExpanded(false);
    setSelectedToppings([]);
    setQuantity(1);
  };

  return (
    <div 
      className="animate-fade glass-card" 
      style={{
        ...styles.card,
        transform: isHovered && !isExpanded ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered && !isExpanded ? 'var(--shadow-lg)' : 'var(--shadow-sm)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.imageContainer}>
        {product.imageUrl ? (
          <img 
            src={fixImageUrl(product.imageUrl)} 
            alt={product.name} 
            style={{
              ...styles.image,
              transform: isHovered && !isExpanded ? 'scale(1.05)' : 'scale(1)'
            }} 
          />
        ) : (
          <div style={styles.placeholderImage}>
            <span>No Image</span>
          </div>
        )}
      </div>

      <div style={styles.content}>
        <div style={styles.header}>
          <h3 style={styles.title}>{product.name}</h3>
          <span style={styles.price}>Rp {product.basePrice.toLocaleString()}</span>
        </div>
        {!isExpanded && <p style={styles.desc}>{product.description}</p>}

        {isExpanded ? (
          <div style={styles.inlineToppingPanel} onClick={e => e.stopPropagation()}>
            <div style={styles.inlineHeader}>
              <h4 style={styles.inlineSectionTitle}>Pilih Topping</h4>
              <button 
                onClick={() => setIsExpanded(false)} 
                style={styles.cancelBtn}
                title="Batal"
              >
                <X size={16} />
              </button>
            </div>
            
            <div style={styles.toppingsList}>
              {toppings.map(topping => {
                const isSelected = selectedToppings.some(t => t.id === topping.id);
                return (
                  <label 
                    key={topping.id} 
                    style={{
                      ...styles.toppingRow,
                      backgroundColor: isSelected ? 'rgba(255, 75, 43, 0.05)' : 'transparent',
                      borderColor: isSelected ? 'var(--primary)' : 'rgba(0,0,0,0.08)',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {
                        setSelectedToppings(prev =>
                          isSelected ? prev.filter(t => t.id !== topping.id) : [...prev, topping]
                        );
                      }}
                      style={styles.checkbox}
                    />
                    <span style={{ fontSize: '0.85rem', flex: 1, fontWeight: isSelected ? 600 : 400 }}>{topping.name}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>+Rp {topping.price.toLocaleString()}</span>
                  </label>
                );
              })}
            </div>
            
            <div style={styles.stepperAndConfirm}>
              <div style={styles.stepper}>
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  style={{ ...styles.stepBtn, opacity: quantity <= 1 ? 0.4 : 1 }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ fontWeight: 700, width: '24px', textAlign: 'center', fontSize: '0.9rem' }}>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} style={styles.stepBtn}>
                  <Plus size={14} />
                </button>
              </div>
              
              <button onClick={handleConfirmAdd} className="btn btn-primary" style={styles.confirmBtn}>
                <Check size={16} /> Beli (Rp {((product.basePrice + selectedToppings.reduce((acc, t) => acc + t.price, 0)) * quantity).toLocaleString()})
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={handleTambahClick} 
            className="btn btn-primary"
            style={styles.addButton}
          >
            <Plus size={20} /> Tambah
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    borderRadius: 'var(--radius-xl)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
    border: '1px solid var(--border-light)',
    backgroundColor: 'var(--bg-card)',
  },
  imageContainer: {
    width: '100%',
    height: '240px',
    overflow: 'hidden',
    backgroundColor: 'var(--bg-main)',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    background: 'linear-gradient(135deg, var(--border-light) 0%, var(--border) 100%)',
    fontWeight: 600,
  },
  content: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    gap: '0.5rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.25rem',
    gap: '0.75rem',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '800',
    lineHeight: 1.3,
    color: 'var(--text-main)',
  },
  price: {
    fontWeight: '800',
    color: 'var(--primary)',
    fontSize: '1.15rem',
    whiteSpace: 'nowrap',
    backgroundColor: 'rgba(255, 59, 29, 0.08)',
    padding: '4px 10px',
    borderRadius: 'var(--radius-sm)',
  },
  desc: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    marginBottom: '1rem',
    lineHeight: 1.6,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  addButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: 'auto',
    padding: '0.875rem',
  },
  inlineToppingPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: '0.5rem',
    animation: 'fadeInUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
    backgroundColor: 'var(--bg-main)',
    padding: '1rem',
    borderRadius: 'var(--radius-md)',
  },
  inlineHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inlineSectionTitle: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: 'var(--text-main)',
  },
  cancelBtn: {
    background: '#fff',
    border: '1px solid var(--border)',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-sm)',
  },
  toppingsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  toppingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem 0.75rem',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: '#fff',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    accentColor: 'var(--primary)',
    cursor: 'pointer',
  },
  stepperAndConfirm: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginTop: '0.5rem',
  },
  stepper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#fff',
    padding: '0.35rem',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
  },
  stepBtn: {
    backgroundColor: 'var(--bg-main)',
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
    color: 'var(--text-main)',
  },
  confirmBtn: {
    flex: 1,
    fontSize: '0.9rem',
    padding: '0.6rem 0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  }
};

export default ProductCard;
