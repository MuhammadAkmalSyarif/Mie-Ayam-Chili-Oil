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
        const totalRev = orders.reduce((sum, o) => sum + o.totalAmount, 0);
        
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

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Loader2 className="animate-spin" /></div>;

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Ringkasan Hari Ini</h1>
        <button onClick={handleReset} style={styles.resetBtn}>
          <RotateCcw size={16} /> Reset Data
        </button>
      </div>
      
      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.iconWrapper}><ShoppingBag color="var(--primary)" /></div>
          <div>
            <p style={styles.label}>Total Pesanan</p>
            <h3 style={styles.value}>{stats.totalOrders}</h3>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.iconWrapper}><Clock color="#ff9800" /></div>
          <div>
            <p style={styles.label}>Pesanan Menunggu</p>
            <h3 style={styles.value}>{stats.pendingOrders}</h3>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.iconWrapper}><TrendingUp color="#4caf50" /></div>
          <div>
            <p style={styles.label}>Total Pendapatan</p>
            <h3 style={styles.value}>Rp {stats.revenue.toLocaleString('id-ID')}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  iconWrapper: {
    padding: '1rem',
    backgroundColor: 'var(--bg-main)',
    borderRadius: '50%',
  },
  label: {
    color: 'var(--text-muted)',
    fontSize: '0.875rem',
    marginBottom: '0.25rem',
  },
  value: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  resetBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '0.6rem 1.2rem',
    backgroundColor: '#fff',
    color: 'var(--primary)',
    border: '1px solid var(--primary)',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};

export default Dashboard;
