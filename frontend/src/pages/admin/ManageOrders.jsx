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

  const handleClearHistory = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus semua riwayat pesanan? Tindakan ini tidak bisa dibatalkan.')) return;
    
    try {
      await deleteAllOrders();
      setOrders([]);
      alert('Riwayat pesanan berhasil dibersihkan!');
    } catch (error) {
      alert('Gagal menghapus riwayat: ' + error.message);
    }
  };

  if (loading && orders.length === 0) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Loader2 className="animate-spin" /></div>;

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Pesanan Masuk</h1>
        {orders.length > 0 && (
          <button onClick={handleClearHistory} style={styles.clearBtn}>
            <Trash2 size={16} /> Bersihkan History
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
    borderRadius: '8px',
    border: '1px solid var(--border)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '1rem',
    textAlign: 'left',
    backgroundColor: 'var(--bg-main)',
    borderBottom: '2px solid var(--border)',
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
  tr: {
    borderBottom: '1px solid var(--border)',
  },
  td: {
    padding: '1rem',
    verticalAlign: 'top',
  },
  badge: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 12px',
    backgroundColor: '#4caf50',
    color: '#fff',
    borderRadius: '4px',
    fontWeight: '600',
    fontSize: '0.875rem',
  },
  clearBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '0.6rem 1.2rem',
    backgroundColor: '#fff',
    color: '#d32f2f',
    border: '1px solid #d32f2f',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }
};

export default ManageOrders;
