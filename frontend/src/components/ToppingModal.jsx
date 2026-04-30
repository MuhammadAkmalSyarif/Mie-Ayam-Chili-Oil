import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';

const ToppingModal = ({ product, toppings, onClose, onAdd }) => {
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

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div className="animate-fade" style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Kustomisasi Pesanan</h2>
          <button type="button" onClick={onClose} style={styles.closeBtn}><X /></button>
        </div>

        <div style={styles.body}>
          {/* Product Info */}
          <div style={styles.productInfo}>
            <img src={product.imageUrl} alt={product.name} style={styles.thumb} />
            <div>
              <h3 style={{ fontWeight: 700 }}>{product.name}</h3>
              <p style={{ color: 'var(--primary)', fontWeight: 800 }}>Rp {product.basePrice.toLocaleString()}</p>
            </div>
          </div>

          {/* Toppings */}
          {toppings.length > 0 && (
            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>Pilih Topping (Opsional)</h4>
              {toppings.map(topping => (
                <label key={topping.id} style={{
                  ...styles.toppingItem,
                  backgroundColor: isSelected(topping.id) ? 'rgba(211, 47, 47, 0.05)' : 'transparent',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      checked={isSelected(topping.id)}
                      onChange={() => toggleTopping(topping)}
                      style={styles.checkbox}
                    />
                    <span style={{ fontWeight: isSelected(topping.id) ? 600 : 400 }}>{topping.name}</span>
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>+Rp {topping.price.toLocaleString()}</span>
                </label>
              ))}
            </div>
          )}

          {/* Quantity Stepper */}
          <div style={styles.quantitySection}>
            <h4 style={styles.sectionTitle}>Jumlah</h4>
            <div style={styles.stepper}>
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ ...styles.stepBtn, opacity: quantity <= 1 ? 0.4 : 1 }}
              >
                <Minus size={18} />
              </button>
              <span style={{ fontWeight: 700, width: '36px', textAlign: 'center', fontSize: '1.125rem' }}>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                style={styles.stepBtn}
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.totalInfo}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Harga</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
              Rp {totalPrice.toLocaleString()}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              onAdd(product, quantity, selectedToppings);
              onClose();
            }}
            style={styles.submitBtn}
          >
            Tambah ke Keranjang
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'flex-end',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 'var(--container-width)',
    margin: '0 auto',
    borderTopLeftRadius: '24px',
    borderTopRightRadius: '24px',
    padding: '1.5rem',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  title: { fontSize: '1.25rem', fontWeight: 800 },
  closeBtn: { background: 'none', color: 'var(--text-muted)', padding: '4px' },
  body: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  productInfo: { display: 'flex', gap: '1rem', alignItems: 'center' },
  thumb: { width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 },
  section: {},
  sectionTitle: { fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' },
  toppingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0.5rem',
    borderBottom: '1px solid var(--border)',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'background-color 0.15s ease',
  },
  checkbox: { width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer', flexShrink: 0 },
  quantitySection: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  stepper: {
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    backgroundColor: '#f5f5f5', padding: '0.4rem 0.6rem', borderRadius: '12px'
  },
  stepBtn: {
    backgroundColor: '#fff', width: '34px', height: '34px', borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: 'var(--shadow)', transition: 'opacity 0.2s',
  },
  footer: { marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' },
  totalInfo: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  submitBtn: {
    width: '100%', backgroundColor: 'var(--primary)', color: '#fff',
    padding: '1rem', borderRadius: '12px', fontWeight: 700, fontSize: '1rem',
    transition: 'background-color 0.2s ease',
  },
};

export default ToppingModal;
