import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Utensils, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/orders', icon: <ShoppingBag size={20} />, label: 'Pesanan' },
    { path: '/admin/products', icon: <Utensils size={20} />, label: 'Menu' },
  ];

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--primary)' }}>
            MIE AYAM ADMIN
          </h2>
        </div>
        
        <nav style={styles.nav}>
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              style={{
                ...styles.navItem,
                ...(location.pathname === item.path ? styles.activeNavItem : {})
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={styles.logout}>
          <Link to="/" style={styles.navItem}>
            <LogOut size={20} />
            Ke Toko (Pembeli)
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: 'var(--bg-main)',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    height: '100vh',
  },
  logo: {
    padding: '1.5rem',
    borderBottom: '1px solid #333',
  },
  nav: {
    padding: '1rem 0',
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '1rem 1.5rem',
    color: '#ccc',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  },
  activeNavItem: {
    backgroundColor: 'var(--primary)',
    color: '#fff',
    borderLeft: '4px solid #fff',
  },
  logout: {
    padding: '1rem 0',
    borderTop: '1px solid #333',
  },
  main: {
    flex: 1,
    marginLeft: '250px',
    padding: '2rem',
  },
  content: {
    maxWidth: '1000px',
    margin: '0 auto',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)',
    padding: '2rem',
    minHeight: '80vh',
  }
};

export default AdminLayout;
