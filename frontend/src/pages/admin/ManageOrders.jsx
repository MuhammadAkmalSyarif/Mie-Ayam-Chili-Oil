import React, { useEffect, useState } from 'react';
import { fetchOrders, updateOrderStatus, deleteAllOrders } from '../../services/api';
import { Loader2, CheckCircle, Trash2, Calendar, User, MapPin, ClipboardList } from 'lucide-react';

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

  if (loading && orders.length === 0) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <Loader2 className="animate-spin" size={40} color="var(--primary)" />
    </div>
  );

  return (
    <div className="animate-fade">
      <div style={styles.header}>
        <h1 style={styles.title}>Pesanan Masuk</h1>
        {orders.length > 0 && (
          <button onClick={handleClearHistory} style={styles.clearBtn}>
            <Trash2 size={16} /> Bersihkan History
          </button>
        )}
      </div>
      
      {orders.length === 0 ? (
        <div style={styles.emptyState}>
          <ClipboardList size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Belum ada pesanan masuk hari ini.</p>
        </div>
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
                  {/* Time */}
                  <td style={styles.td}>
                    <div style={styles.timeWrapper}>
                      <Calendar size={14} color="var(--text-muted)" />
                      <span style={styles.timeText}>
                        {new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>
                  
                  {/* Customer Info */}
                  <td style={styles.td}>
                    <div style={styles.customerCol}>
                      <div style={styles.customerNameRow}>
                        <User size={14} color="var(--text-muted)" />
                        <strong>{order.customerName}</strong>
                      </div>
                      <div style={styles.customerMetaRow}>
                        <span style={styles.tableBadge}>{order.deliveryAddress}</span>
                        <span style={styles.payMethodText}>{order.customerPhone}</span>
                      </div>
                    </div>
                  </td>

                  {/* Order Items */}
                  <td style={styles.td}>
                    <ul style={styles.itemsList}>
                      {order.orderItems.map(item => (
                        <li key={item.id} style={styles.itemLi}>
                          <span style={styles.itemQty}>{item.quantity}x</span>
                          <span style={styles.itemName}>{item.product.name}</span>
                          {item.toppings.length > 0 && (
                            <span style={styles.itemToppings}>
                              ({item.toppings.map(t => t.toppingName).join(', ')})
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </td>

                  {/* Total Amount */}
                  <td style={styles.td}>
                    <span style={styles.totalText}>Rp {order.totalAmount.toLocaleString('id-ID')}</span>
                  </td>

                  {/* Status Badge */}
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor:
                        order.status === 'PENDING' ? 'rgba(255, 149, 0, 0.08)' :
                        order.status === 'PAID' ? 'rgba(52, 199, 89, 0.08)' :
                        order.status === 'COMPLETED' ? 'rgba(0, 102, 204, 0.08)' :
                        order.status === 'CANCELLED' ? 'rgba(255, 59, 48, 0.08)' : '#f5f5f7',
                      color:
                        order.status === 'PENDING' ? '#ff9500' :
                        order.status === 'PAID' ? '#34c759' :
                        order.status === 'COMPLETED' ? '#0066cc' :
                        order.status === 'CANCELLED' ? '#ff3b30' : '#86868b',
                    }}>
                      {order.status === 'PENDING' ? 'Menunggu' :
                       order.status === 'PAID' ? 'Dibayar' :
                       order.status === 'COMPLETED' ? 'Selesai' :
                       order.status === 'CANCELLED' ? 'Batal' : order.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={styles.td}>
                    {order.status === 'PENDING' && (
                      <div style={styles.actionCol}>
                        <button 
                          onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                          style={styles.actionBtn}
                        >
                          <CheckCircle size={14} /> Selesai
                        </button>
                      </div>
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#1d1d1f',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow)',
  },
  tableWrapper: {
    overflowX: 'auto',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  th: {
    padding: '1.25rem 1.5rem',
    backgroundColor: '#f5f6f8',
    borderBottom: '1px solid var(--border)',
    color: 'var(--text-muted)',
    fontWeight: '700',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tr: {
    borderBottom: '1px solid var(--border)',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#fafafa',
    }
  },
  td: {
    padding: '1.25rem 1.5rem',
    verticalAlign: 'top',
    fontSize: '0.9rem',
    color: 'var(--text-main)',
  },
  timeWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  timeText: {
    fontWeight: '600',
    color: 'var(--text-main)',
  },
  customerCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  customerNameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.95rem',
  },
  customerMetaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  tableBadge: {
    backgroundColor: '#f5f5f7',
    color: '#1d1d1f',
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: '700',
  },
  payMethodText: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  itemsList: {
    padding: 0,
    margin: 0,
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  itemLi: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '6px',
  },
  itemQty: {
    fontWeight: '800',
    color: 'var(--primary)',
    fontSize: '0.85rem',
  },
  itemName: {
    fontWeight: '600',
    color: 'var(--text-main)',
  },
  itemToppings: {
    color: 'var(--text-muted)',
    fontSize: '0.75rem',
    fontStyle: 'italic',
  },
  totalText: {
    fontWeight: '800',
    fontSize: '1rem',
    color: 'var(--text-main)',
  },
  badge: {
    padding: '4px 10px',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontWeight: '800',
    display: 'inline-block',
  },
  actionCol: {
    display: 'flex',
    gap: '6px',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: '#34c759',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '0.8rem',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(52, 199, 89, 0.15)',
  },
  clearBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0.65rem 1.25rem',
    backgroundColor: '#ffffff',
    color: 'var(--primary)',
    border: '1px solid var(--primary)',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(255, 59, 48, 0.02)',
  }
};

export default ManageOrders;
