import React, { useEffect, useState } from 'react';
import { fetchOrders, deleteAllOrders } from '../../services/api';
import { Loader2, TrendingUp, ShoppingBag, Clock, RotateCcw } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const result = await fetchOrders();
      if (result.success) {
        const orders = result.data;
        const pending = orders.filter(o => o.status === 'PENDING').length;
        const totalRev = orders.reduce((sum, o) => {
          // Only add revenue if the status is PAID or COMPLETED
          if (o.status === 'PAID' || o.status === 'COMPLETED') {
            return sum + o.totalAmount;
          }
          return sum;
        }, 0);
        
        setStats({
          totalOrders: orders.length,
          pendingOrders: pending,
          revenue: totalRev,
        });
      }
    } catch (error) {
      console.error('Failed to load stats', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleReset = async () => {
    if (!window.confirm('Apakah Anda yakin ingin mereset semua data pesanan dan pendapatan? Tindakan ini tidak bisa dibatalkan.')) return;
    
    try {
      await deleteAllOrders();
      setStats({ totalOrders: 0, pendingOrders: 0, revenue: 0 });
      alert('Data berhasil direset!');
    } catch (error) {
      alert('Gagal mereset data: ' + error.message);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <Loader2 className="animate-spin" size={40} color="var(--primary)" />
    </div>
  );

  return (
    <div className="animate-fade">
      <div style={styles.header}>
        <h1 style={styles.title}>Ringkasan Hari Ini</h1>
        <button onClick={handleReset} style={styles.resetBtn}>
          <RotateCcw size={16} /> Reset Data
        </button>
      </div>
      
      <div style={styles.grid}>
        {/* Card 1 */}
        <div style={styles.card}>
          <div style={{ ...styles.iconWrapper, backgroundColor: 'rgba(255, 59, 48, 0.08)' }}>
            <ShoppingBag size={24} color="var(--primary)" />
          </div>
          <div style={styles.cardContent}>
            <span style={styles.label}>Total Pesanan</span>
            <h3 style={styles.value}>{stats.totalOrders}</h3>
          </div>
        </div>

        {/* Card 2 */}
        <div style={styles.card}>
          <div style={{ ...styles.iconWrapper, backgroundColor: 'rgba(255, 149, 0, 0.08)' }}>
            <Clock size={24} color="#ff9500" />
          </div>
          <div style={styles.cardContent}>
            <span style={styles.label}>Pesanan Menunggu</span>
            <h3 style={styles.value}>{stats.pendingOrders}</h3>
          </div>
        </div>

        {/* Card 3 */}
        <div style={styles.card}>
          <div style={{ ...styles.iconWrapper, backgroundColor: 'rgba(52, 199, 89, 0.08)' }}>
            <TrendingUp size={24} color="#34c759" />
          </div>
          <div style={styles.cardContent}>
            <span style={styles.label}>Total Pendapatan</span>
            <h3 style={styles.value}>Rp {stats.revenue.toLocaleString('id-ID')}</h3>
          </div>
        </div>
      </div>
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '1.75rem',
    borderRadius: '20px',
    border: '1px solid var(--border, #eaeaea)',
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    boxShadow: 'var(--shadow)',
  },
  iconWrapper: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  label: {
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  value: {
    fontSize: '1.65rem',
    fontWeight: '800',
    color: 'var(--text-main)',
  },
  resetBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0.65rem 1.25rem',
    backgroundColor: '#ffffff',
    color: '#ff3b30',
    border: '1px solid #ff3b30',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(255, 59, 48, 0.02)',
  },
};

export default Dashboard;
