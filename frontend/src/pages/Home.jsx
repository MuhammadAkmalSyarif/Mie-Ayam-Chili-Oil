import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { Loader2, Utensils } from 'lucide-react';

const Home = () => {
  const [data, setData] = useState({ products: [], toppings: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchProducts();
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return (
    <div style={{ height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Loader2 className="animate-spin" size={48} color="var(--primary)" />
    </div>
  );

  if (error) return (
    <div className="text-center p-4">
      <p style={{ color: 'var(--error)', fontWeight: 600 }}>Error: {error}</p>
      <button className="btn btn-outline mt-4" onClick={() => window.location.reload()}>Coba Lagi</button>
    </div>
  );

  // Group by category
  const categories = [...new Set(data.products.map(p => p.category.name))];

  return (
    <div className="animate-fade">
      <header style={styles.header}>
        <h1 style={styles.title}>Menu Spesial Hari Ini</h1>
        <p style={styles.subtitle}>Mie Ayam Chili Oil home-made dengan bumbu rahasia dan bahan premium.</p>
      </header>

      {categories.map(catName => (
        <section key={catName} style={{ marginBottom: '4rem' }}>
          <div style={styles.categoryHeader}>
            <div style={styles.iconWrapper}><Utensils size={24} /></div>
            <h2 style={styles.categoryTitle}>{catName}</h2>
          </div>
          <div style={styles.grid}>
            {data.products
              .filter(p => p.category.name === catName)
              .map(product => {
                const nameLower = product.name.toLowerCase();
                // Deteksi apakah produk adalah mie ayam biasa (tidak memiliki tambahan bakso, pangsit, ceker, porsi, kerupuk, atau tanda +)
                const isBasicProduct = nameLower.includes('mie') && 
                                       !nameLower.includes('+') && 
                                       !nameLower.includes('bakso') && 
                                       !nameLower.includes('pangsit') && 
                                       !nameLower.includes('ceker') &&
                                       !nameLower.includes('komplit');
                
                return (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    toppings={isBasicProduct ? data.toppings : []}
                    onAddToCart={addToCart}
                  />
                );
              })
            }
          </div>
        </section>
      ))}
    </div>
  );
};

const styles = {
  header: {
    marginBottom: '4rem',
    textAlign: 'center',
    padding: '4rem 0',
    position: 'relative',
  },
  title: {
    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
    fontWeight: 900,
    background: 'linear-gradient(135deg, var(--text-main) 0%, var(--primary) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '1.25rem',
    letterSpacing: '-0.04em',
    lineHeight: 1.1,
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: '1.15rem',
    maxWidth: '650px',
    margin: '0 auto',
    fontWeight: 400,
    lineHeight: 1.6,
  },
  categoryHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '2.5rem',
    borderBottom: '2px solid var(--border-light)',
    paddingBottom: '1rem',
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(255,59,29,0.1), rgba(255,183,3,0.1))',
    color: 'var(--primary)',
    boxShadow: '0 4px 10px rgba(255, 59, 29, 0.05)',
  },
  categoryTitle: {
    fontSize: '2rem',
    fontWeight: 800,
    color: 'var(--text-main)',
    letterSpacing: '-0.02em',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '2.5rem',
  }
};

export default Home;
