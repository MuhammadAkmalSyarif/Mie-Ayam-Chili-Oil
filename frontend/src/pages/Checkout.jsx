import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { checkout as apiCheckout, fixImageUrl } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, Loader2, Utensils, CreditCard, ChevronRight, Minus, Plus } from 'lucide-react';

const Checkout = () => {
  const { cart, subtotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    paymentMethod: 'Online Payment (QRIS/Transfer)',
    tableNumber: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!formData.tableNumber) {
      alert('Mohon masukkan nomor meja Anda.');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        customerName: formData.customerName,
        customerPhone: formData.paymentMethod, 
        deliveryAddress: `Meja ${formData.tableNumber}`,
        totalAmount: subtotal,
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.basePrice,
          selectedToppings: item.selectedToppings
        }))
      };

      const result = await apiCheckout(orderData);
      
      if (formData.paymentMethod === 'Online Payment (QRIS/Transfer)') {
        if (result.data.snapToken === 'mock-snap-token-123') {
          alert('Mode Simulasi: Pembayaran Berhasil!');
          clearCart();
          navigate(`/order-success/${result.data.id}`);
          return;
        }

        window.snap.pay(result.data.snapToken, {
          onSuccess: function(response) {
            clearCart();
            navigate(`/order-success/${result.data.id}`);
          },
          onPending: function(response) {
            clearCart();
            navigate(`/order-success/${result.data.id}`);
          },
          onError: function(response) {
            alert('Pembayaran gagal: ' + response.status_message);
            setLoading(false);
          },
          onClose: function() {
            alert('Anda menutup pembayaran sebelum selesai.');
            setLoading(false);
          }
        });
      } else {
        clearCart();
        navigate(`/order-success/${result.data.id}`);
      }
    } catch (err) {
      alert('Checkout gagal: ' + err.message);
      setLoading(false);
    }
  };

  if (cart.length === 0) return (
    <div className="text-center p-4 animate-fade" style={{ height: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'var(--border-light)', padding: '2rem', borderRadius: 'var(--radius-full)', marginBottom: '1.5rem' }}>
        <Utensils size={48} color="var(--text-muted)" />
      </div>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Keranjang Kosong</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>Kamu belum menambahkan apapun ke keranjang.</p>
      <button onClick={() => navigate('/')} className="btn btn-primary">
        Lihat Menu <ChevronRight size={18} />
      </button>
    </div>
  );

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '0.5rem' }}>Selesaikan Pesanan</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Satu langkah lagi untuk menikmati hidangan lezat kami.</p>
      </div>

      <div style={styles.layout}>
        {/* Cart Summary */}
        <div className="glass-card" style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={styles.iconWrapper}><Utensils size={20} /></div>
            <h2 style={styles.sectionTitle}>Ringkasan Pesanan</h2>
          </div>
          
          <div style={styles.cartList}>
            {cart.map(item => (
              <div key={item.cartItemId} style={styles.cartItem}>
                <div style={styles.itemThumbWrapper}>
                  {item.imageUrl ? (
                    <img src={fixImageUrl(item.imageUrl)} alt={item.name} style={styles.itemThumb} />
                  ) : (
                    <div style={styles.itemThumbPlaceholder}><Utensils size={16} /></div>
                  )}
                  <span style={styles.itemQtyBadge}>{item.quantity}</span>
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '0.25rem' }}>{item.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    {(item.selectedToppings || []).length > 0 
                      ? (item.selectedToppings || []).map(t => t.name).join(', ')
                      : 'Tanpa Topping'}
                  </p>
                  <div style={styles.itemMeta}>
                    <div style={styles.stepper}>
                      <button type="button" onClick={() => updateQuantity(item.cartItemId, -1)} style={styles.stepBtn}><Minus size={14}/></button>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, width: '24px', textAlign: 'center' }}>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.cartItemId, 1)} style={styles.stepBtn}><Plus size={14}/></button>
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                      Rp {((item.basePrice + (item.selectedToppings || []).reduce((acc, t) => acc + t.price, 0)) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.cartItemId)} style={styles.removeBtn} aria-label="Remove item">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          <div style={styles.totalRow}>
            <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>Subtotal</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Rp {subtotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="glass-card" style={{...styles.section, height: 'fit-content'}}>
          <div style={styles.sectionHeader}>
            <div style={styles.iconWrapper}><CreditCard size={20} /></div>
            <h2 style={styles.sectionTitle}>Informasi Pemesan</h2>
          </div>
          
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
            <label style={styles.label}>Nomor Meja</label>
            <input 
              type="number" 
              name="tableNumber"
              required
              value={formData.tableNumber}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Contoh: 5"
              min="1"
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Metode Pembayaran</label>
            <div style={styles.selectWrapper}>
              <select 
                name="paymentMethod"
                required
                value={formData.paymentMethod}
                onChange={handleInputChange}
                style={{...styles.input, appearance: 'none', paddingRight: '2.5rem'}}
              >
                <option value="Online Payment (QRIS/Transfer)">Online Payment (QRIS/Transfer)</option>
                <option value="Tunai di Kasir">Tunai di Kasir</option>
              </select>
              <div style={styles.selectIcon}><ChevronRight size={16} /></div>
            </div>
            
            <div style={{ 
              marginTop: '0.75rem', 
              padding: '0.75rem', 
              backgroundColor: formData.paymentMethod === 'Online Payment (QRIS/Transfer)' ? 'rgba(33, 158, 188, 0.1)' : 'rgba(255, 183, 3, 0.1)', 
              borderRadius: 'var(--radius-sm)',
              border: `1px solid ${formData.paymentMethod === 'Online Payment (QRIS/Transfer)' ? 'rgba(33, 158, 188, 0.2)' : 'rgba(255, 183, 3, 0.2)'}`
            }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>💡</span>
                {formData.paymentMethod === 'Online Payment (QRIS/Transfer)' 
                  ? 'Anda akan diarahkan ke gerbang pembayaran aman Midtrans.' 
                  : 'Silakan lakukan pembayaran ke kasir setelah menekan tombol Pesan.'}
              </p>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', fontSize: '1.1rem' }}
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Konfirmasi Pesanan <ArrowRight size={20} /></>}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  layout: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
    gap: '2.5rem',
    alignItems: 'start',
  },
  section: { 
    padding: '2rem', 
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid var(--border-light)',
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'rgba(255, 75, 43, 0.1)',
    color: 'var(--primary)',
  },
  sectionTitle: { 
    fontSize: '1.25rem', 
    fontWeight: 700,
  },
  cartList: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '1.25rem' 
  },
  cartItem: { 
    display: 'flex', 
    gap: '1.25rem', 
    alignItems: 'start', 
    paddingBottom: '1.25rem', 
    borderBottom: '1px dashed var(--border-light)' 
  },
  itemThumbWrapper: {
    position: 'relative',
  },
  itemThumb: { 
    width: '72px', 
    height: '72px', 
    borderRadius: 'var(--radius-sm)', 
    objectFit: 'cover',
    boxShadow: 'var(--shadow-sm)',
  },
  itemThumbPlaceholder: {
    width: '72px', 
    height: '72px', 
    borderRadius: 'var(--radius-sm)', 
    backgroundColor: 'var(--border-light)',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemQtyBadge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: 'var(--text-main)',
    color: '#fff',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    border: '2px solid #fff',
  },
  itemMeta: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: '0.75rem' 
  },
  stepper: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '0.5rem', 
    backgroundColor: 'var(--bg-main)', 
    padding: '0.25rem', 
    borderRadius: 'var(--radius-full)',
    border: '1px solid var(--border-light)',
  },
  stepBtn: { 
    backgroundColor: '#fff', 
    width: '24px', 
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-sm)',
    color: 'var(--text-main)',
  },
  removeBtn: { 
    color: 'var(--text-muted)', 
    background: 'none',
    padding: '0.25rem',
    transition: 'color 0.2s',
  },
  totalRow: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: '1.5rem', 
    paddingTop: '1rem', 
  },
  formGroup: { 
    marginBottom: '1.5rem' 
  },
  label: { 
    display: 'block', 
    fontSize: '0.9rem', 
    fontWeight: 600, 
    marginBottom: '0.5rem',
    color: 'var(--text-main)'
  },
  input: { 
    width: '100%', 
    padding: '0.875rem 1rem', 
    borderRadius: 'var(--radius-sm)', 
    border: '1px solid var(--border)', 
    fontSize: '1rem',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    outline: 'none',
    fontFamily: 'inherit',
    backgroundColor: '#fff',
  },
  selectWrapper: {
    position: 'relative',
  },
  selectIcon: {
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
    display: 'flex',
  }
};

export default Checkout;
