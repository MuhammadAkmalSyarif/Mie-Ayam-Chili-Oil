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

  const [isResetting, setIsResetting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 3000);
      return;
    }
    
    setIsResetting(true);
    try {
      await deleteAllOrders();
      setStats({ totalOrders: 0, pendingOrders: 0, revenue: 0 });
      setShowConfirm(false);
      alert('Data berhasil direset!');
    } catch (error) {
      alert('Gagal mereset data: ' + error.message);
    } finally {
      setIsResetting(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Loader2 className="animate-spin" /></div>;

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Ringkasan Hari Ini</h1>
        <button 
          onClick={handleReset} 
          style={{
            ...styles.resetBtn,
            backgroundColor: showConfirm ? 'var(--primary)' : '#fff',
            color: showConfirm ? '#fff' : 'var(--primary)',
          }}
          disabled={isResetting}
        >
          {isResetting ? <Loader2 className="animate-spin" size={16} /> : (showConfirm ? 'Yakin Hapus Semua?' : <><RotateCcw size={16} /> Reset Data</>)}
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
  },
  card: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-light)',
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    boxShadow: 'var(--shadow-sm)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'default',
  },
  iconWrapper: {
    padding: '1.25rem',
    backgroundColor: 'var(--bg-main)',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
  },
  label: {
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
    marginBottom: '0.25rem',
    fontWeight: '500',
  },
  value: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: 'var(--text-main)',
    letterSpacing: '-0.02em',
  },
  resetBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0.75rem 1.25rem',
    backgroundColor: '#fff',
    color: 'var(--primary)',
    border: '2px solid var(--primary)',
    borderRadius: 'var(--radius-sm)',
    fontWeight: '700',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
  },
};

export default Dashboard;
