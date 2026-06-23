import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchOrderById } from '../services/api';
import { Loader2, CheckCircle2, AlertCircle, Utensils, ArrowLeft } from 'lucide-react';

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
      <Loader2 className="animate-spin" size={48} color="var(--primary)" />
    </div>
  );

  if (!order) return <div className="text-center p-4">Order tidak ditemukan.</div>;

  const isPaid = order.status === 'PAID' || order.status === 'COMPLETED';
  const paymentMethod = order.customerPhone; // Reused as payment method in Checkout.jsx
  const tableNumber = order.deliveryAddress;  // Reused as table number in Checkout.jsx

  // Format Date
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year}, ${hour}.${minute}`;
  };

  return (
    <div className="animate-fade" style={styles.container}>
      {/* Success Icon State */}
      <div style={styles.headerState}>
        {isPaid ? (
          <div style={styles.iconCircleSuccess}>
            <CheckCircle2 size={48} color="#34c759" />
          </div>
        ) : (
          <div style={styles.iconCirclePending}>
            <AlertCircle size={48} color="#ff9500" />
          </div>
        )}
        <h1 style={styles.stateTitle}>
          {isPaid ? 'Pesanan Diterima!' : 'Menunggu Pembayaran'}
        </h1>
        <p style={styles.stateDesc}>
          {isPaid 
            ? 'Terima kasih, pembayaran berhasil dan pesanan Anda sedang diproses.' 
            : 'Silakan lakukan pembayaran di kasir untuk menyelesaikan pesanan.'}
        </p>
      </div>

      {/* Struk Card */}
      <div style={styles.receiptCard}>
        {/* Top Header */}
        <div style={styles.receiptHeader}>
          <div style={styles.receiptIconWrapper}>
            <Utensils size={24} color="#ffffff" />
          </div>
          <h2 style={styles.brandTitle}>MIE AYAM CHILI OIL</h2>
          <span style={styles.receiptSubtitle}>Struk Pesanan Digital</span>
        </div>

        <div style={styles.dashedDivider}></div>

        {/* Transaction Meta */}
        <div style={styles.metaSection}>
          <div style={styles.metaRow}>
            <span style={styles.metaLabel}>No. Pesanan</span>
            <span style={styles.metaValBold}>#{order.id.split('-')[0].toUpperCase()}</span>
          </div>
          <div style={styles.metaRow}>
            <span style={styles.metaLabel}>Tanggal</span>
            <span style={styles.metaVal}>{formatDate(order.createdAt)}</span>
          </div>
          <div style={styles.metaRow}>
            <span style={styles.metaLabel}>Atas Nama</span>
            <span style={styles.metaValBold}>{order.customerName}</span>
          </div>
          <div style={styles.metaRow}>
            <span style={styles.metaLabel}>Lokasi</span>
            <span style={styles.metaValBold}>{tableNumber}</span>
          </div>
        </div>

        <div style={styles.dashedDivider}></div>

        {/* Order Items */}
        <div style={styles.itemsSection}>
          {order.orderItems.map(item => {
            const itemToppingsTotal = item.toppings.reduce((acc, t) => acc + t.toppingPrice, 0);
            const totalItemPrice = (item.unitPrice + itemToppingsTotal) * item.quantity;
            return (
              <div key={item.id} style={styles.itemRow}>
                <div style={styles.itemLeft}>
                  <div style={styles.itemNameRow}>
                    <span style={styles.itemName}>{item.product.name}</span>
                    <span style={styles.itemPrice}>Rp {totalItemPrice.toLocaleString('id-ID')}</span>
                  </div>
                  <span style={styles.itemQtyMeta}>
                    {item.quantity}x @ Rp {(item.unitPrice + itemToppingsTotal).toLocaleString('id-ID')}
                  </span>
                  {item.toppings.length > 0 && (
                    <span style={styles.itemToppings}>
                      + {item.toppings.map(t => t.toppingName).join(', ')}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={styles.dashedDivider}></div>

        {/* Payment Meta */}
        <div style={styles.paymentSection}>
          <div style={styles.metaRow}>
            <span style={styles.metaLabel}>Metode Pembayaran</span>
            <span style={styles.metaVal}>{paymentMethod}</span>
          </div>
          <div style={styles.metaRow}>
            <span style={styles.metaLabel}>Status</span>
            <span style={{
              ...styles.statusBadge,
              backgroundColor: isPaid ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 149, 0, 0.1)',
              color: isPaid ? '#34c759' : '#ff9500',
            }}>
              {isPaid ? 'Lunas / Berhasil' : 'Menunggu Pembayaran'}
            </span>
          </div>
        </div>

        <div style={styles.dashedDivider}></div>

        {/* Grand Total */}
        <div style={styles.totalRow}>
          <span style={styles.totalLabel}>Total Bayar</span>
          <span style={styles.totalValPrice}>Rp {order.totalAmount.toLocaleString('id-ID')}</span>
        </div>
      </div>

      {/* Back Button */}
      <Link to="/" style={styles.backBtn}>
        <ArrowLeft size={18} /> Kembali ke Menu
      </Link>

      <p style={styles.notesText}>
        Jika Anda memerlukan bantuan atau ingin menambahkan pesanan, silakan hubungi kasir atau waiter kami.
      </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '480px',
    margin: '0 auto',
    padding: '1rem 0.5rem',
  },
  headerState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  iconCircleSuccess: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'rgba(52, 199, 89, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  iconCirclePending: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 149, 0, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  stateTitle: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: 'var(--text-main)',
    marginBottom: '0.5rem',
  },
  stateDesc: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    lineHeight: '1.4',
    padding: '0 1rem',
  },
  receiptCard: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    boxShadow: 'var(--shadow-lg)',
    padding: '2rem 1.5rem',
    border: '1px solid var(--border)',
    position: 'relative',
    overflow: 'hidden',
  },
  receiptHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  receiptIconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.75rem',
    boxShadow: '0 4px 10px rgba(255, 59, 48, 0.15)',
  },
  brandTitle: {
    fontSize: '1.15rem',
    fontWeight: '800',
    color: 'var(--text-main)',
    letterSpacing: '1px',
    marginBottom: '2px',
  },
  receiptSubtitle: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  dashedDivider: {
    borderTop: '2px dashed var(--border)',
    margin: '1.25rem 0',
  },
  metaSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
  },
  metaLabel: {
    color: 'var(--text-muted)',
  },
  metaVal: {
    color: 'var(--text-main)',
    fontWeight: '500',
  },
  metaValBold: {
    color: 'var(--text-main)',
    fontWeight: '700',
  },
  itemsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  itemRow: {
    display: 'flex',
  },
  itemLeft: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  itemNameRow: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  itemName: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: 'var(--text-main)',
  },
  itemPrice: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: 'var(--text-main)',
  },
  itemQtyMeta: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  itemToppings: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
  },
  paymentSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontWeight: '800',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: '1rem',
    fontWeight: '700',
    color: 'var(--text-main)',
  },
  totalValPrice: {
    fontSize: '1.35rem',
    fontWeight: '800',
    color: 'var(--primary)',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    backgroundColor: '#1d1d1f',
    color: '#ffffff',
    padding: '1rem',
    borderRadius: '16px',
    fontWeight: '700',
    fontSize: '0.95rem',
    marginTop: '1.5rem',
    textDecoration: 'none',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    transition: 'background-color 0.2s',
  },
  notesText: {
    textAlign: 'center',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '1.5rem',
    lineHeight: '1.4',
  }
};

export default OrderSuccess;
