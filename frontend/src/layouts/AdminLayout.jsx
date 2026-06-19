import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, LogOut } from 'lucide-react';

const AdminLayout = ({ onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Pesanan', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Menu', path: '/admin/products', icon: <UtensilsCrossed size={20} /> },
  ];

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, width: isSidebarOpen ? '280px' : '80px' }}>
        <div style={styles.sidebarHeader}>
          <h2 
            style={{ ...styles.logo, display: isSidebarOpen ? 'block' : 'none', cursor: 'pointer' }}
            onClick={() => setIsSidebarOpen(false)}
          >
            MIE AYAM <span style={{ color: 'var(--primary)' }}>ADMIN</span>
          </h2>
          <div 
            style={{ ...styles.logoSmall, display: isSidebarOpen ? 'none' : 'flex', cursor: 'pointer' }}
            onClick={() => setIsSidebarOpen(true)}
          >
            M
          </div>
        </div>

        <nav style={styles.nav}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.navItem,
                backgroundColor: location.pathname === item.path ? 'rgba(220, 38, 38, 0.1)' : 'transparent',
                color: location.pathname === item.path ? 'var(--primary)' : 'var(--text-muted)',
                justifyContent: isSidebarOpen ? 'flex-start' : 'center',
              }}
            >
              {item.icon}
              {isSidebarOpen && <span style={{ marginLeft: '12px', fontWeight: '500' }}>{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div style={styles.sidebarFooter}>
          <button 
            onClick={onLogout}
            style={{
              ...styles.logoutBtn,
              justifyContent: isSidebarOpen ? 'flex-start' : 'center',
            }}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span style={{ marginLeft: '12px' }}>Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ ...styles.main, marginLeft: isSidebarOpen ? '280px' : '80px' }}>
        <div style={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: 'var(--bg-main)',
  },
  sidebar: {
    backgroundColor: '#0F172A',
    borderRight: '1px solid #1E293B',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
    position: 'fixed',
    height: '100vh',
    zIndex: 50,
  },
  sidebarHeader: {
    padding: '2rem 1.5rem',
    borderBottom: '1px solid #1E293B',
    marginBottom: '1rem',
  },
  logo: {
    fontSize: '1.25rem',
    fontWeight: '800',
    margin: 0,
    color: '#F8FAFC',
    letterSpacing: '1px',
  },
  logoSmall: {
    fontSize: '1.5rem',
    fontWeight: '800',
    justifyContent: 'center',
    color: 'var(--primary)',
  },
  nav: {
    flex: 1,
    padding: '0 1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.875rem 1rem',
    borderRadius: '12px',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  },
  sidebarFooter: {
    padding: '1.5rem',
    borderTop: '1px solid #1E293B',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '0.875rem 1rem',
    borderRadius: '12px',
    border: 'none',
    background: 'rgba(239, 68, 68, 0.1)',
    cursor: 'pointer',
    color: '#F87171',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  main: {
    flex: 1,
    transition: 'margin-left 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-md)',
    padding: '2.5rem',
    minHeight: '85vh',
    border: '1px solid var(--border-light)',
  }
};

export default AdminLayout;
