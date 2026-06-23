import React, { useState } from 'react';
import { Plus, Minus, X } from 'lucide-react';

const ProductCard = ({ product, toppings = [], onAddClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);

  // Check if product supports toppings (i.e. is a Mie Ayam dish)
  const nameLower = product.name.toLowerCase().trim();
  const isNoodle = 
    (nameLower.includes('mie ayam chili oil') || 
     nameLower.includes('mie ayam yamin') || 
     nameLower.includes('mie ayam yamin chili oil')) &&
    !nameLower.includes('+') &&
    !nameLower.includes('bakso') &&
    !nameLower.includes('pangsit');

  const handleAddClick = () => {
    if (isNoodle && toppings.length > 0) {
      setIsExpanded(true);
    } else {
      // Add directly to cart if no toppings supported
      onAddClick(product, 1, []);
    }
  };

  const toggleTopping = (topping) => {
    setSelectedToppings(prev =>
      prev.some(t => t.id === topping.id)
        ? prev.filter(t => t.id !== topping.id)
        : [...prev, topping]
    );
  };

  const isSelected = (toppingId) => selectedToppings.some(t => t.id === toppingId);

  const calculateTotal = () => {
    const toppingsPrice = selectedToppings.reduce((acc, t) => acc + t.price, 0);
    return (product.basePrice + toppingsPrice) * quantity;
  };

  const handleConfirmAdd = () => {
    onAddClick(product, quantity, selectedToppings);
    // Reset states
    setIsExpanded(false);
    setSelectedToppings([]);
    setQuantity(1);
  };

  return (
    <div style={styles.card} className="animate-fade">
      <img src={product.imageUrl} alt={product.name} style={styles.image} />
      <div style={styles.content}>
        <div style={styles.header}>
          <h3 style={styles.title}>{product.name}</h3>
          <span style={styles.price}>Rp {product.basePrice.toLocaleString('id-ID')}</span>
        </div>
        
        {!isExpanded && product.description && (
          <p style={styles.desc}>{product.description}</p>
        )}

        {isExpanded ? (
          <div style={styles.toppingsSection} className="animate-fade">
            <div style={styles.toppingsHeader}>
              <span style={styles.toppingsTitle}>Pilih Topping</span>
              <button 
                type="button" 
                onClick={() => setIsExpanded(false)} 
                style={styles.closeBtn}
              >
                <X size={16} />
              </button>
            </div>

            <div style={styles.toppingsList}>
              {toppings.map(topping => (
                <label 
                  key={topping.id} 
                  style={{
                    ...styles.toppingItem,
                    backgroundColor: isSelected(topping.id) ? 'rgba(255, 59, 48, 0.03)' : 'transparent',
                    borderColor: isSelected(topping.id) ? 'rgba(255, 59, 48, 0.2)' : '#f5f5f7',
                  }}
                >
                  <div style={styles.toppingLeft}>
                    <input
                      type="checkbox"
                      checked={isSelected(topping.id)}
                      onChange={() => toggleTopping(topping)}
                      style={styles.checkbox}
                    />
                    <span style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: isSelected(topping.id) ? '600' : '400',
                      color: isSelected(topping.id) ? 'var(--primary)' : 'var(--text-main)'
                    }}>
                      {topping.name}
                    </span>
                  </div>
                  <span style={styles.toppingPrice}>+Rp {topping.price.toLocaleString('id-ID')}</span>
                </label>
              ))}
            </div>

            <div style={styles.actionRow}>
              <div style={styles.stepper}>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ ...styles.stepBtn, opacity: quantity <= 1 ? 0.4 : 1 }}
                >
                  <Minus size={14} />
                </button>
                <span style={styles.stepperVal}>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  style={styles.stepBtn}
                >
                  <Plus size={14} />
                </button>
              </div>

              <button 
                type="button"
                onClick={handleConfirmAdd}
                style={styles.buyBtn}
              >
                ✓ Beli (Rp {calculateTotal().toLocaleString('id-ID')})
              </button>
            </div>
          </div>
        ) : (
          <button 
            type="button"
            onClick={handleAddClick} 
            style={styles.addButton}
          >
            <Plus size={18} /> Tambah
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'var(--bg-card)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid var(--border)',
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: 'var(--shadow-lg)',
    }
  },
  image: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
  },
  content: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '0.75rem',
  },
  title: {
    fontSize: '1.05rem',
    fontWeight: '800',
    color: 'var(--text-main)',
    lineHeight: '1.3',
    flex: 1,
  },
  price: {
    fontWeight: '800',
    color: 'var(--primary)',
    fontSize: '1.05rem',
    marginLeft: '0.75rem',
  },
  desc: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    marginBottom: '1.25rem',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    lineHeight: '1.4',
  },
  addButton: {
    width: '100%',
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    padding: '0.875rem',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: '700',
    fontSize: '0.9rem',
    marginTop: 'auto',
    boxShadow: '0 4px 12px rgba(255, 59, 48, 0.15)',
    border: 'none',
    cursor: 'pointer',
  },
  toppingsSection: {
    marginTop: '0.5rem',
    paddingTop: '0.75rem',
    borderTop: '1px dashed var(--border)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  toppingsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toppingsTitle: {
    fontSize: '0.85rem',
    fontWeight: '800',
    color: 'var(--text-main)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toppingsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  toppingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0.75rem',
    border: '1px solid #f5f5f7',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  toppingLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    accentColor: 'var(--primary)',
    cursor: 'pointer',
  },
  toppingPrice: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: 'var(--primary)',
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '0.75rem',
    marginTop: '0.5rem',
  },
  stepper: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f5f5f7',
    padding: '4px',
    borderRadius: '12px',
  },
  stepBtn: {
    backgroundColor: '#ffffff',
    border: 'none',
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--text-main)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  },
  stepperVal: {
    fontWeight: '700',
    fontSize: '0.9rem',
    width: '24px',
    textAlign: 'center',
    color: 'var(--text-main)',
  },
  buyBtn: {
    flex: 1,
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    padding: '0.75rem',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '0.85rem',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(255, 59, 48, 0.15)',
    border: 'none',
    cursor: 'pointer',
  }
};

export default ProductCard;
