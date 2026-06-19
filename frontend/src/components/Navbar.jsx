import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav style={{
      ...styles.nav,
      ...(scrolled ? styles.navScrolled : {})
    }}>
      <div className="container flex justify-between items-center" style={{ height: '100%' }}>
        <Link to="/" style={styles.logoContainer}>
          <img src="/logo-new.png" alt="Menu Kedai Mie Ayam Chili Oil" style={styles.bannerImg} />
        </Link>
        
        <Link to="/checkout" style={styles.cartContainer}>
          <div style={styles.cartIconWrapper}>
            <ShoppingCart size={22} strokeWidth={2.5} />
            {totalItems > 0 && (
              <span style={styles.badge}>{totalItems}</span>
            )}
          </div>
        </Link>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    height: '90px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
    transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
  },
  navScrolled: {
    boxShadow: 'var(--shadow-md)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    height: '100%',
    transition: 'transform 0.3s ease',
  },
  bannerImg: {
    height: '72px',
    objectFit: 'contain',
    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.05))',
  },
  cartContainer: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    transition: 'transform 0.2s ease',
  },
  cartIconWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    color: 'var(--text-main)',
    transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    border: '1px solid var(--border-light)',
  },
  badge: {
    position: 'absolute',
    top: '-2px',
    right: '-2px',
    backgroundColor: 'var(--primary)',
    color: '#fff',
    fontSize: '0.75rem',
    fontWeight: '800',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(255, 59, 29, 0.4)',
    border: '2px solid #fff',
    animation: 'pulse-glow 2s infinite',
  }
};

export default Navbar;
