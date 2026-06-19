import React from 'react';
import { Plus } from 'lucide-react';

const ProductCard = ({ product, onAddClick }) => {
  return (
    <div className="animate-fade" style={styles.card}>
      <img src={product.imageUrl} alt={product.name} style={styles.image} />
      <div style={styles.content}>
        <div style={styles.header}>
          <h3 style={styles.title}>{product.name}</h3>
          <span style={styles.price}>Rp {product.basePrice.toLocaleString()}</span>
        </div>
        <p style={styles.desc}>{product.description}</p>
        <button 
          onClick={() => onAddClick(product)} 
          style={styles.addButton}
        >
          <Plus size={20} /> Tambah
        </button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'var(--bg-card)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow)',
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
  },
  content: {
    padding: '1rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '0.5rem',
  },
  title: {
    fontSize: '1.125rem',
    fontWeight: '700',
    flex: 1,
  },
  price: {
    fontWeight: '800',
    color: 'var(--primary)',
    marginLeft: '0.5rem',
  },
  desc: {
    fontSize: '0.875rem',
    color: 'var(--text-muted)',
    marginBottom: '1rem',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  addButton: {
    width: '100%',
    backgroundColor: 'var(--text-main)',
    color: '#fff',
    padding: '0.75rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: '600',
    fontSize: '0.875rem',
  }
};

export default ProductCard;
