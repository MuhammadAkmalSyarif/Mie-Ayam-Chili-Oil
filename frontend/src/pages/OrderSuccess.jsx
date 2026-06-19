import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchOrderById } from '../services/api';
import { CheckCircle, Printer, ChevronLeft, Loader2, Utensils } from 'lucide-react';

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

  const handlePrint = () => {
    window.print();
  };

  if (loading) return (
    <div style={{ height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Loader2 className="animate-spin" size={48} color="var(--primary)" />
    </div>
  );

  if (!order) return <div className="text-center p-4">Pesanan tidak ditemukan.</div>;

  // Format date
  const orderDate = new Date(order.createdAt).toLocaleString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const isPaid = order.customerPhone.includes('Online Payment');

  return (
    <div className="animate-fade" style={{ maxWidth: '400px', margin: '0 auto', paddingBottom: '2rem' }}>
      {/* Notifikasi Berhasil */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }} className="no-print">
        <CheckCircle size={64} color="var(--success)" style={{ margin: '0 auto', marginBottom: '1rem' }} />
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Pesanan Diterima!</h1>
        <p style={{ color: 'var(--text-muted)' }}>Terima kasih, pesanan Anda sedang diproses.</p>
      </div>

      {/* Struk Receipt */}
      <div className="receipt-container" style={styles.receiptWrapper}>
        <div style={styles.receiptHeader}>
          <div style={{ backgroundColor: 'var(--primary)', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <Utensils size={28} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Mie Ayam Chili Oil</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>Struk Pesanan Digital</p>
        </div>

        <div style={styles.divider}></div>

        <div style={styles.receiptMeta}>
          <div style={styles.metaRow}>
            <span>No. Pesanan</span>
            <span style={{ fontWeight: 600 }}>#{order.id.split('-')[0].toUpperCase()}</span>
          </div>
          <div style={styles.metaRow}>
            <span>Tanggal</span>
            <span>{orderDate}</span>
          </div>
          <div style={styles.metaRow}>
            <span>Atas Nama</span>
            <span style={{ fontWeight: 600 }}>{order.customerName}</span>
          </div>
          <div style={styles.metaRow}>
            <span>Lokasi</span>
            <span style={{ fontWeight: 600 }}>{order.deliveryAddress}</span>
          </div>
        </div>

        <div style={styles.divider}></div>

        <div style={styles.receiptItems}>
          {order.orderItems.map(item => (
            <div key={item.id} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', flex: 1, lineHeight: 1.3 }}>{item.product.name}</div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap' }}>Rp {(item.unitPrice * item.quantity).toLocaleString()}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>{item.quantity}x @ Rp {item.unitPrice.toLocaleString()}</span>
              </div>
              {item.toppings.length > 0 && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: '8px', marginTop: '6px', borderLeft: '2px solid var(--border-light)' }}>
                  {item.toppings.map(t => (
                    <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span>+ {t.toppingName}</span>
                      <span>Rp {t.toppingPrice.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={styles.divider}></div>

        <div style={styles.receiptTotal}>
          <div style={styles.metaRow}>
            <span>Metode Bayar</span>
            <span style={{ fontSize: '0.85rem', textAlign: 'right', maxWidth: '60%', fontWeight: 500 }}>{order.customerPhone}</span>
          </div>
          <div style={styles.metaRow}>
            <span>Status</span>
            <span style={{ fontWeight: 800, color: isPaid ? 'var(--success)' : 'var(--accent)' }}>
              {isPaid ? 'LUNAS' : 'BELUM BAYAR'}
            </span>
          </div>
          <div style={{ ...styles.metaRow, marginTop: '12px', fontSize: '1.25rem', fontWeight: 800 }}>
            <span>Total Bayar</span>
            <span style={{ color: 'var(--primary)' }}>Rp {order.totalAmount.toLocaleString()}</span>
          </div>
        </div>
        
        <div style={styles.receiptFooter}>
          <p style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--text-main)' }}>Terima kasih atas pesanan Anda!</p>
          <p>Tunjukkan struk ini kepada staf kami jika diperlukan.</p>
        </div>
        
        {/* Decorative zig-zag bottom */}
        <div style={styles.zigzag}></div>
      </div>

      <div style={styles.actions} className="no-print">
        <button onClick={handlePrint} className="btn" style={styles.printBtn}>
          <Printer size={18} /> Cetak Struk
        </button>
        <Link to="/" className="btn btn-primary" style={styles.homeBtn}>
          <ChevronLeft size={18} /> Kembali ke Menu
        </Link>
      </div>

      {/* Global CSS for Printing */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .receipt-container, .receipt-container * {
            visibility: visible;
          }
          .receipt-container {
            position: absolute;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            width: 100%;
            max-width: 400px;
            box-shadow: none !important;
            margin: 0 auto;
          }
          .no-print {
            display: none !important;
          }
          body {
            background-color: white;
          }
        }
      `}</style>
    </div>
  );
};

const styles = {
  receiptWrapper: {
    backgroundColor: '#fff',
    borderRadius: '12px 12px 0 0',
    padding: '2.5rem 2rem 3rem',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    position: 'relative',
    marginBottom: '2rem',
  },
  receiptHeader: {
    textAlign: 'center',
    marginBottom: '1.75rem',
  },
  divider: {
    borderTop: '2px dashed var(--border)',
    margin: '1.5rem 0',
  },
  receiptMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    fontSize: '0.9rem',
    color: 'var(--text-main)',
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptItems: {
    display: 'flex',
    flexDirection: 'column',
  },
  receiptTotal: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  receiptFooter: {
    textAlign: 'center',
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    marginTop: '2.5rem',
    lineHeight: 1.5,
  },
  zigzag: {
    position: 'absolute',
    bottom: '-10px',
    left: 0,
    right: 0,
    height: '10px',
    background: 'linear-gradient(135deg, #fff 50%, transparent 50%), linear-gradient(-135deg, #fff 50%, transparent 50%)',
    backgroundSize: '20px 10px',
    backgroundRepeat: 'repeat-x',
    filter: 'drop-shadow(0 5px 5px rgba(0,0,0,0.04))'
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    flexDirection: 'column',
  },
  printBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#fff',
    color: 'var(--text-main)',
    border: '1px solid var(--border)',
    padding: '1rem',
    width: '100%',
    fontWeight: 700,
    fontSize: '1rem',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  homeBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '1rem',
    width: '100%',
    fontWeight: 700,
    fontSize: '1rem',
    borderRadius: '10px',
  }
};

export default OrderSuccess;

