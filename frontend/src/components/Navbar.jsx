import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Flame } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { totalItems } = useCart();

  return (
    <nav style={styles.nav}>
      <div className="container flex justify-between items-center" style={{ height: '100%' }}>
        <Link to="/" style={styles.logo}>
          <Flame size={24} color="var(--primary)" fill="var(--primary)" />
          <span style={{ fontWeight: 800 }}>MIE AYAM <span style={{ color: 'var(--primary)' }}>CHILI OIL</span></span>
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
    height: '64px',
    backgroundColor: '#fff',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: 'var(--shadow)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '1.25rem',
    textDecoration: 'none',
    color: 'var(--text-main)',
  },
  cartContainer: {
    position: 'relative',
    padding: '8px',
    color: 'var(--text-main)',
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
