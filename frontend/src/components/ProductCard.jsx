import React, { useState } from 'react';
import { Plus, Minus, X, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product, toppings = [], onAddToCart }) => {
  const hasToppings = toppings.length > 0;
  const [expanded, setExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState([]);

  const toggleTopping = (topping) => {
    setSelectedToppings(prev =>
      prev.some(t => t.id === topping.id)
        ? prev.filter(t => t.id !== topping.id)
        : [...prev, topping]
    );
  };

  const isSelected = (toppingId) => selectedToppings.some(t => t.id === toppingId);

  const totalPrice = (product.basePrice + selectedToppings.reduce((acc, t) => acc + t.price, 0)) * quantity;

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedToppings);
    setExpanded(false);
    setQuantity(1);
    setSelectedToppings([]);
  };

  const handleClose = () => {
    setExpanded(false);
    setQuantity(1);
    setSelectedToppings([]);
  };

  const handleTambahClick = () => {
    if (hasToppings) {
      // Show inline expansion for basic products
      setExpanded(true);
    } else {
      // Directly add to cart for products without topping options
      onAddToCart(product, 1, []);
    }
  };

  return (
    <div className="animate-fade" style={styles.card}>
      <img src={product.imageUrl} alt={product.name} style={styles.image} />
      <div style={styles.content}>
        <div style={styles.header}>
          <h3 style={styles.title}>{product.name}</h3>
          <span style={styles.price}>Rp {product.basePrice.toLocaleString()}</span>
        </div>

        {/* Expanded inline customization - only for products with toppings */}
        {expanded && hasToppings ? (
          <div style={styles.expandedSection}>
            {/* Toppings */}
            <div>
              <h4 style={styles.sectionTitle}>Tambah Topping</h4>
              {toppings.map(topping => (
                <label key={topping.id} style={{
                  ...styles.toppingItem,
                  backgroundColor: isSelected(topping.id) ? 'rgba(211, 47, 47, 0.06)' : 'transparent',
                  borderColor: isSelected(topping.id) ? 'var(--primary)' : 'var(--border)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={isSelected(topping.id)}
                      onChange={() => toggleTopping(topping)}
                      style={styles.checkbox}
                    />
                    <span style={{ fontWeight: isSelected(topping.id) ? 600 : 400, fontSize: '0.875rem' }}>{topping.name}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)' }}>+Rp {topping.price.toLocaleString()}</span>
                </label>
              ))}
            </div>

            {/* Quantity */}
            <div style={styles.quantityRow}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Jumlah</span>
              <div style={styles.stepper}>
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ ...styles.stepBtn, opacity: quantity <= 1 ? 0.4 : 1 }}>
                  <Minus size={14} />
                </button>
                <span style={{ fontWeight: 700, width: '28px', textAlign: 'center', fontSize: '0.95rem' }}>{quantity}</span>
                <button type="button" onClick={() => setQuantity(quantity + 1)} style={styles.stepBtn}>
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Total & Actions */}
            <div style={styles.totalRow}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>Rp {totalPrice.toLocaleString()}</span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" onClick={handleClose} style={styles.cancelBtn}>
                <X size={16} />
              </button>
              <button type="button" onClick={handleAdd} style={styles.confirmBtn}>
                <ShoppingCart size={16} /> Tambah ke Keranjang
              </button>
            </div>
          </div>
        ) : (
          <button onClick={handleTambahClick} style={styles.addButton}>
            <Plus size={20} /> Tambah
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
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    transition: 'box-shadow 0.2s ease',
  },
  image: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
  },
  content: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.125rem',
    fontWeight: '700',
    flex: 1,
    paddingRight: '0.5rem',
  },
  price: {
    fontWeight: '800',
    color: 'var(--primary)',
    marginLeft: '0.5rem',
    whiteSpace: 'nowrap',
  },
  addButton: {
    width: '100%',
    backgroundColor: 'var(--text-main)',
    color: '#fff',
    padding: '0.75rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: '600',
    fontSize: '0.875rem',
    marginTop: 'auto',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  // Expanded section styles
  expandedSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    borderTop: '1px dashed var(--border)',
    paddingTop: '0.75rem',
    marginTop: 'auto',
  },
  sectionTitle: {
    fontSize: '0.8rem',
    fontWeight: 700,
    marginBottom: '0.4rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  toppingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0.6rem',
    border: '1px solid var(--border)',
    cursor: 'pointer',
    borderRadius: '8px',
    marginBottom: '0.4rem',
    transition: 'all 0.15s ease',
  },
  checkbox: {
    width: '15px',
    height: '15px',
    accentColor: 'var(--primary)',
    cursor: 'pointer',
    flexShrink: 0,
  },
  quantityRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    backgroundColor: '#f5f5f5',
    padding: '0.2rem 0.4rem',
    borderRadius: '10px',
  },
  stepBtn: {
    backgroundColor: '#fff',
    width: '26px',
    height: '26px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    cursor: 'pointer',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid var(--border)',
    paddingTop: '0.5rem',
  },
  cancelBtn: {
    backgroundColor: '#f5f5f5',
    color: 'var(--text-muted)',
    padding: '0.6rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: 'var(--primary)',
    color: '#fff',
    padding: '0.6rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontWeight: '600',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
};

export default ProductCard;
