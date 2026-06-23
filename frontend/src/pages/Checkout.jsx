import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { checkout as apiCheckout } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, Loader2, Utensils, CreditCard, Lightbulb } from 'lucide-react';

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
          selectedToppings: item.selectedToppings || []
        }))
      };

      const result = await apiCheckout(orderData);
      
      if (formData.paymentMethod === 'Online Payment (QRIS/Transfer)') {
        // Handle simulation/mock token
        if (result.data.snapToken === 'mock-snap-token-123') {
          alert('Mode Simulasi: Pembayaran Berhasil!');
          clearCart();
          navigate(`/order-success/${result.data.id}`);
          return;
        }

        // Open Midtrans Snap
        window.snap.pay(result.data.snapToken, {
          onSuccess: function(response) {
            console.log('Payment success:', response);
            clearCart();
            navigate(`/order-success/${result.data.id}`);
          },
          onPending: function(response) {
            console.log('Payment pending:', response);
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
        // Tunai di Kasir
        clearCart();
        navigate(`/order-success/${result.data.id}`);
      }
    } catch (err) {
      alert('Checkout gagal: ' + err.message);
      setLoading(false);
    }
  };

  if (cart.length === 0) return (
    <div className="text-center p-4 animate-fade" style={styles.emptyContainer}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>Keranjang Kosong</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Kamu belum menambahkan apapun ke keranjang.</p>
      <button 
        onClick={() => navigate('/')}
        style={{ ...styles.submitBtn, width: 'auto', padding: '1rem 2.5rem' }}
      >
        Lihat Menu
      </button>
    </div>
  );

  return (
    <div className="animate-fade" style={styles.pageContainer}>
      <div className="checkout-layout">
        {/* Left Column: Cart Summary */}
        <div className="checkout-card" style={styles.cardSpacing}>
          <div style={styles.sectionHeader}>
            <div style={styles.iconWrapper}>
              <Utensils size={20} color="var(--primary)" />
            </div>
            <h2 style={styles.sectionTitle}>Ringkasan Pesanan</h2>
          </div>

          <div style={styles.cartList}>
            {cart.map(item => (
              <div key={item.cartItemId} style={styles.cartItem}>
                {/* Image Wrapper with Badge */}
                <div style={styles.imgContainer}>
                  <img src={item.imageUrl} alt={item.name} style={styles.itemThumb} />
                  <span style={styles.quantityBadge}>{item.quantity}</span>
                </div>

                {/* Details */}
                <div style={styles.itemDetails}>
                  <h3 style={styles.itemName}>{item.name}</h3>
                  <p style={styles.itemToppings}>
                    {(item.selectedToppings || []).length > 0 
                      ? item.selectedToppings.map(t => t.name).join(', ') 
                      : 'Tanpa Topping'}
                  </p>
                  
                  {/* Stepper Inline */}
                  <div style={styles.stepperRow}>
                    <div style={styles.stepper}>
                      <button 
                        type="button" 
                        onClick={() => updateQuantity(item.cartItemId, -1)} 
                        style={styles.stepBtn}
                      >
                        -
                      </button>
                      <span style={styles.stepVal}>{item.quantity}</span>
                      <button 
                        type="button" 
                        onClick={() => updateQuantity(item.cartItemId, 1)} 
                        style={styles.stepBtn}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pricing & Actions */}
                <div style={styles.itemRight}>
                  <span style={styles.itemPrice}>
                    Rp {((item.basePrice + (item.selectedToppings || []).reduce((acc, t) => acc + t.price, 0)) * item.quantity).toLocaleString('id-ID')}
                  </span>
                  <button onClick={() => removeFromCart(item.cartItemId)} style={styles.removeBtn}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>Subtotal</span>
            <span style={styles.totalValue}>Rp {subtotal.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Right Column: Customer Info Form */}
        <form onSubmit={handleSubmit} className="checkout-card">
          <div style={styles.sectionHeader}>
            <div style={{ ...styles.iconWrapper, backgroundColor: 'rgba(255, 149, 0, 0.08)' }}>
              <CreditCard size={20} color="#ff9500" />
            </div>
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
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Metode Pembayaran</label>
            <select 
              name="paymentMethod"
              required
              value={formData.paymentMethod}
              onChange={handleInputChange}
              style={styles.select}
            >
              <option value="Online Payment (QRIS/Transfer)">Online Payment (QRIS/Transfer)</option>
              <option value="Tunai di Kasir">Tunai di Kasir</option>
            </select>

            {formData.paymentMethod === 'Online Payment (QRIS/Transfer)' ? (
              <div className="payment-notice">
                <Lightbulb size={16} style={{ flexShrink: 0 }} />
                <span>Anda akan diarahkan ke gerbang pembayaran aman Midtrans.</span>
              </div>
            ) : (
              <div className="payment-notice" style={{ backgroundColor: '#fff8f0', borderColor: '#ffe8cc', color: '#cc7a00' }}>
                <Lightbulb size={16} style={{ flexShrink: 0 }} />
                <span>Silakan lakukan pembayaran ke kasir setelah memesan.</span>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Konfirmasi Pesanan <ArrowRight size={20} /></>}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  emptyContainer: {
    height: '60vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardSpacing: {
    marginBottom: '0',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '1.75rem',
  },
  iconWrapper: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    backgroundColor: 'rgba(255, 59, 48, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: 'var(--text-main)',
    margin: 0,
  },
  cartList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  cartItem: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    paddingBottom: '1rem',
    borderBottom: '1px solid var(--border, #eaeaea)',
  },
  imgContainer: {
    position: 'relative',
    width: '60px',
    height: '60px',
    flexShrink: 0,
  },
  itemThumb: {
    width: '100%',
    height: '100%',
    borderRadius: '12px',
    objectFit: 'cover',
  },
  quantityBadge: {
    position: 'absolute',
    top: '-6px',
    right: '-6px',
    backgroundColor: '#1d1d1f',
    color: '#ffffff',
    fontSize: '0.7rem',
    fontWeight: '800',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  itemName: {
    fontSize: '0.95rem',
    fontWeight: '800',
    color: 'var(--text-main)',
    margin: 0,
  },
  itemToppings: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    margin: 0,
  },
  stepperRow: {
    marginTop: '4px',
    display: 'flex',
  },
  stepper: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f5f5f7',
    padding: '2px 6px',
    borderRadius: '8px',
    gap: '8px',
  },
  stepBtn: {
    background: 'none',
    border: 'none',
    fontWeight: '800',
    fontSize: '0.9rem',
    cursor: 'pointer',
    color: 'var(--text-main)',
    padding: '0 4px',
  },
  stepVal: {
    fontSize: '0.8rem',
    fontWeight: '800',
    color: 'var(--text-main)',
  },
  itemRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '6px',
  },
  itemPrice: {
    fontWeight: '800',
    fontSize: '0.95rem',
    color: 'var(--primary)',
  },
  removeBtn: {
    color: 'var(--error)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1.5rem',
    paddingTop: '1rem',
    borderTop: '2px dashed var(--border, #eaeaea)',
  },
  totalLabel: {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
  },
  totalValue: {
    fontSize: '1.35rem',
    fontWeight: '800',
    color: 'var(--text-main)',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    color: 'var(--text-main)',
  },
  input: {
    width: '100%',
    padding: '0.875rem 1rem',
    borderRadius: '12px',
    border: '1px solid var(--border, #eaeaea)',
    fontSize: '0.95rem',
    color: 'var(--text-main)',
    outline: 'none',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.2s',
  },
  select: {
    width: '100%',
    padding: '0.875rem 1rem',
    borderRadius: '12px',
    border: '1px solid var(--border, #eaeaea)',
    fontSize: '0.95rem',
    color: 'var(--text-main)',
    outline: 'none',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
  },
  submitBtn: {
    width: '100%',
    backgroundColor: 'var(--primary, #ff3b30)',
    color: '#ffffff',
    padding: '1rem',
    borderRadius: '16px',
    fontWeight: '700',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '1.5rem',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(255, 59, 48, 0.2)',
  }
};

export default Checkout;
