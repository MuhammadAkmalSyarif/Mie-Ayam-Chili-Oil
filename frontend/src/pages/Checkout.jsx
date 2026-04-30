import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { checkout as apiCheckout } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, Loader2 } from 'lucide-react';

const Checkout = () => {
  const { cart, subtotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    deliveryAddress: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const orderData = {
        ...formData,
        totalAmount: subtotal,
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.basePrice,
          selectedToppings: item.selectedToppings
        }))
      };

      const result = await apiCheckout(orderData);
      clearCart();
      navigate(`/order-success/${result.data.id}`);
    } catch (err) {
      alert('Checkout gagal: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return (
    <div className="text-center p-4 animate-fade">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Keranjang Kosong</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Kamu belum menambahkan apapun ke keranjang.</p>
      <button 
        onClick={() => navigate('/')}
        style={{ backgroundColor: 'var(--primary)', color: '#fff', padding: '1rem 2rem', borderRadius: '12px', fontWeight: 700 }}
      >
        Lihat Menu
      </button>
    </div>
  );

  return (
    <div className="animate-fade">
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem' }}>Checkout</h1>

      <div style={styles.layout}>
        {/* Cart Summary */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Ringkasan Pesanan</h2>
          <div style={styles.cartList}>
            {cart.map(item => (
              <div key={item.cartItemId} style={styles.cartItem}>
                <img src={item.imageUrl} alt={item.name} style={styles.itemThumb} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{item.name}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {item.selectedToppings.length > 0 
                      ? `Topping: ${item.selectedToppings.map(t => t.name).join(', ')}` 
                      : 'Tanpa Topping'}
                  </p>
                  <div style={styles.itemMeta}>
                    <div style={styles.stepper}>
                      <button onClick={() => updateQuantity(item.cartItemId, -1)} style={styles.stepBtn}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartItemId, 1)} style={styles.stepBtn}>+</button>
                    </div>
                    <span style={{ fontWeight: 700 }}>Rp {(item.basePrice + item.selectedToppings.reduce((acc, t) => acc + t.price, 0)).toLocaleString()}</span>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.cartItemId)} style={styles.removeBtn}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          <div style={styles.totalRow}>
            <span>Subtotal</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>Rp {subtotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} style={styles.section}>
          <h2 style={styles.sectionTitle}>Data Pengiriman</h2>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nama Lengkap</label>
            <input 
              type="text" 
              name="customerName"
              required
              value={formData.customerName}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Masukkan nama Anda"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>No. WhatsApp</label>
            <input 
              type="tel" 
              name="customerPhone"
              required
              value={formData.customerPhone}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="0812xxxxxx"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Alamat Lengkap</label>
            <textarea 
              name="deliveryAddress"
              required
              rows="3"
              value={formData.deliveryAddress}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Jl. Mawar No. 123..."
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Buat Pesanan <ArrowRight size={20} /></>}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  layout: { display: 'flex', flexDirection: 'column', gap: '2rem' },
  section: { backgroundColor: '#fff', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' },
  sectionTitle: { fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '2px solid var(--bg-main)', paddingBottom: '0.5rem' },
  cartList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  cartItem: { display: 'flex', gap: '1rem', alignItems: 'start', paddingBottom: '1rem', borderBottom: '1px solid var(--bg-main)' },
  itemThumb: { width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' },
  itemMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' },
  stepper: { display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#f5f5f5', padding: '0.25rem 0.5rem', borderRadius: '8px' },
  stepBtn: { background: 'none', fontWeight: 'bold', width: '20px' },
  removeBtn: { color: 'var(--error)', background: 'none' },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '2px dashed var(--border)' },
  formGroup: { marginBottom: '1.25rem' },
  label: { display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' },
  input: { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' },
  submitBtn: { width: '100%', backgroundColor: 'var(--primary)', color: '#fff', padding: '1rem', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '1rem' }
};

export default Checkout;
