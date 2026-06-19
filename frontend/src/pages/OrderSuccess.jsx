import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchOrderById } from '../services/api';
import { CheckCircle, Package, Phone, MapPin, Loader2 } from 'lucide-react';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const result = await fetchOrderById(orderId);
        setOrder(result.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [orderId]);

  if (loading) return (
    <div style={{ height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Loader2 className="animate-spin" size={48} color="var(--success)" />
    </div>
  );

  if (!order) return <div className="text-center p-4">Order not found.</div>;

  return (
    <div className="animate-fade" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <div style={styles.successCard}>
        <CheckCircle size={64} color="var(--success)" />
        <h1 style={{ marginTop: '1rem', fontSize: '1.5rem', fontWeight: 800 }}>Pesanan Berhasil!</h1>
        <p style={{ color: 'var(--text-muted)' }}>Terima kasih {order.customerName}, pesananmu sedang diproses.</p>
        <div style={styles.orderId}>ID Pesanan: {order.id.split('-')[0].toUpperCase()}</div>
      </div>

      <div style={styles.infoSection}>
        <h2 style={styles.sectionTitle}>Detail Pengiriman</h2>
        <div style={styles.infoRow}>
          <Phone size={18} color="var(--text-muted)" />
          <span>{order.customerPhone}</span>
        </div>
        <div style={styles.infoRow}>
          <MapPin size={18} color="var(--text-muted)" />
          <span>{order.deliveryAddress}</span>
        </div>
      </div>

      <div style={styles.infoSection}>
        <h2 style={styles.sectionTitle}>Ringkasan Pesanan</h2>
        {order.orderItems.map(item => (
          <div key={item.id} style={styles.itemRow}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{ fontWeight: 700 }}>{item.quantity}x</span>
              <div>
                <div style={{ fontWeight: 600 }}>{item.product.name}</div>
                {item.toppings.length > 0 && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    + {item.toppings.map(t => t.toppingName).join(', ')}
                  </div>
                )}
              </div>
            </div>
            <span style={{ fontWeight: 700 }}>Rp {(item.unitPrice * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <div style={styles.totalRow}>
          <span>Total Bayar</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>Rp {order.totalAmount.toLocaleString()}</span>
        </div>
      </div>

      <Link to="/" style={styles.homeBtn}>
        Kembali ke Menu
      </Link>
      
      <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
        Admin kami akan menghubungi Anda via WhatsApp untuk konfirmasi pembayaran dan pengiriman.
      </p>
    </div>
  );
};

const styles = {
  successCard: { textAlign: 'center', backgroundColor: '#fff', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', marginBottom: '1.5rem' },
  orderId: { marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', display: 'inline-block' },
  infoSection: { backgroundColor: '#fff', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', marginBottom: '1rem' },
  sectionTitle: { fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' },
  infoRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem', fontSize: '0.875rem' },
  itemRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.875rem' },
  totalRow: { marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  homeBtn: { display: 'block', width: '100%', backgroundColor: 'var(--text-main)', color: '#fff', textAlign: 'center', padding: '1rem', borderRadius: '12px', fontWeight: 700, textDecoration: 'none' }
};

export default OrderSuccess;
