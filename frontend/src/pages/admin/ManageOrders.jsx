import React, { useEffect, useState } from 'react';
import { fetchOrders, updateOrderStatus, deleteAllOrders } from '../../services/api';
import { Loader2, CheckCircle, Trash2 } from 'lucide-react';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const result = await fetchOrders();
      if (result.success) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 10000); // Auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      loadOrders(); // Reload to reflect changes
    } catch (error) {
      alert('Gagal mengupdate status');
    }
  };

  const [isClearing, setIsClearing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClearHistory = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 3000);
      return;
    }

    setIsClearing(true);
    try {
      await deleteAllOrders();
      setOrders([]);
      setShowConfirm(false);
      alert('Riwayat pesanan berhasil dibersihkan!');
    } catch (error) {
      alert('Gagal menghapus riwayat: ' + error.message);
    } finally {
      setIsClearing(false);
    }
  };

  if (loading && orders.length === 0) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Loader2 className="animate-spin" /></div>;

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Pesanan Masuk</h1>
        {orders.length > 0 && (
          <button 
            onClick={handleClearHistory} 
            style={{
              ...styles.clearBtn,
              backgroundColor: showConfirm ? '#d32f2f' : '#fff',
              color: showConfirm ? '#fff' : '#d32f2f',
              borderColor: '#d32f2f'
            }}
            disabled={isClearing}
          >
            {isClearing ? <Loader2 className="animate-spin" size={16} /> : (showConfirm ? 'Yakin Bersihkan?' : <><Trash2 size={16} /> Bersihkan History</>)}
          </button>
        )}
      </div>
      
      {orders.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Belum ada pesanan.</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Waktu</th>
                <th style={styles.th}>Pelanggan</th>
                <th style={styles.th}>Pesanan</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} style={styles.tr}>
                  <td style={styles.td}>
                    {new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style={styles.td}>
                    <strong>{order.customerName}</strong>
                    <br />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {order.deliveryAddress} | <strong>{order.customerPhone}</strong>
                    </span>
                  </td>
                  <td style={styles.td}>
                    <ul style={{ padding: 0, margin: 0, fontSize: '0.9rem' }}>
                      {order.orderItems.map(item => (
                        <li key={item.id}>
                          {item.quantity}x {item.product.name}
                          {item.toppings.length > 0 && (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                              {' '}(+ {item.toppings.map(t => t.toppingName).join(', ')})
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td style={styles.td}>Rp {order.totalAmount.toLocaleString('id-ID')}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: order.status === 'PENDING' ? '#fff3e0' : '#e8f5e9',
                      color: order.status === 'PENDING' ? '#e65100' : '#2e7d32',
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {order.status === 'PENDING' && (
                      <button 
                        onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                        style={styles.actionBtn}
                      >
                        <CheckCircle size={16} /> Selesai
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  tableWrapper: {
    overflowX: 'auto',
    backgroundColor: '#fff',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-light)',
    boxShadow: 'var(--shadow-sm)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '1.25rem 1.5rem',
    textAlign: 'left',
    backgroundColor: 'var(--bg-main)',
    borderBottom: '1px solid var(--border-light)',
    color: 'var(--text-muted)',
    fontWeight: '700',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  tr: {
    borderBottom: '1px solid var(--border-light)',
    transition: 'background-color 0.2s',
  },
  td: {
    padding: '1.25rem 1.5rem',
    verticalAlign: 'top',
    color: 'var(--text-main)',
  },
  badge: {
    padding: '6px 12px',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.75rem',
    fontWeight: '800',
    letterSpacing: '0.05em',
  },
  actionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    backgroundColor: 'var(--success)',
    color: '#fff',
    borderRadius: 'var(--radius-full)',
    fontWeight: '700',
    fontSize: '0.85rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
  },
  clearBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0.75rem 1.25rem',
    backgroundColor: '#fff',
    color: 'var(--error)',
    border: '2px solid var(--error)',
    borderRadius: 'var(--radius-sm)',
    fontWeight: '700',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }
};

export default ManageOrders;
