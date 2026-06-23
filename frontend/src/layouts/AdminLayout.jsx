import React from 'react';
import { Outlet, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Utensils, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Client-side authentication guard
  const isAuthenticated = localStorage.getItem('admin-token') === 'authenticated-session-token';
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    navigate('/admin/login');
  };

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
          <img src="/banner.png" alt="Mie Ayam Bang Ade" style={styles.logoImg} />
        </div>
        
        <nav style={styles.nav}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                style={{
                  ...styles.navItem,
                  ...(isActive ? styles.activeNavItem : {})
                }}
              >
                <span style={isActive ? styles.activeIcon : styles.inactiveIcon}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={styles.logout}>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            <LogOut size={20} />
            Keluar
          </button>
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
    backgroundColor: '#fafafa', // Light layout background
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#ffffff', // Pure white background
    borderRight: '1px solid var(--border, #eaeaea)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    height: '100vh',
    zIndex: 50,
  },
  logo: {
    padding: '1.5rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottom: '1px solid var(--border, #eaeaea)',
  },
  logoImg: {
    height: '50px',
    objectFit: 'contain',
  },
  nav: {
    padding: '1rem 0.75rem',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0.875rem 1rem',
    color: '#4f4f4f', // Dark gray text
    textDecoration: 'none',
    fontWeight: '600',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
  },
  activeNavItem: {
    backgroundColor: 'rgba(255, 59, 48, 0.08)', // Light pinkish red highlight
    color: 'var(--primary, #ff3b30)', // Red primary text
  },
  activeIcon: {
    color: 'var(--primary, #ff3b30)',
  },
  inactiveIcon: {
    color: '#86868b',
  },
  logout: {
    padding: '1rem 0.75rem',
    borderTop: '1px solid var(--border, #eaeaea)',
  },
  logoutBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0.875rem 1rem',
    color: '#ff3b30', // Red for logout
    backgroundColor: 'transparent',
    border: 'none',
    fontWeight: '600',
    borderRadius: '12px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s ease',
  },
  main: {
    flex: 1,
    marginLeft: '250px',
    backgroundColor: '#fafafa',
  },
  content: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '2rem',
    minHeight: '100vh',
  }
};

export default AdminLayout;

