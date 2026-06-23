import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { totalItems } = useCart();

  return (
    <nav style={styles.nav}>
      <div className="container flex justify-between items-center" style={{ height: '100%' }}>
        <Link to="/" style={styles.logo}>
          <img src="/banner.png" alt="Menu Kedai Mie Ayam Chili Oil" style={styles.bannerImg} />
        </Link>
        
        <Link to="/checkout" style={styles.cartContainer}>
          <ShoppingCart size={24} />
          {totalItems > 0 && (
            <span style={styles.badge}>{totalItems}</span>
          )}
        </Link>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#ffffff', // Pure white header
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)', // Subtle premium shadow
    height: '70px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    height: '100%',
  },
  bannerImg: {
    height: '50px',
    objectFit: 'contain',
  },
  cartContainer: {
    position: 'relative',
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: '#f5f5f7', // Cool grey circular background
    color: '#1d1d1f', // Dark charcoal icon
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },
  badge: {
    position: 'absolute',
    top: '-3px',
    right: '-3px',
    backgroundColor: 'var(--primary, #ff3b30)',
    color: '#ffffff',
    fontSize: '0.7rem',
    fontWeight: '800',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #ffffff', // White outline separating badge from background
  }
};

export default Navbar;
