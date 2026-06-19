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
    backgroundColor: '#1a1a1a',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    overflow: 'hidden',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    height: '100%',
  },
  bannerImg: {
    height: '60px',
    objectFit: 'contain',
  },
  cartContainer: {
    position: 'relative',
    padding: '8px',
    color: '#fff',
  },
  badge: {
    position: 'absolute',
    top: '0',
    right: '0',
    backgroundColor: 'var(--primary)',
    color: '#fff',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
};

export default Navbar;
