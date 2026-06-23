import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { Loader2, Utensils, GlassWater, Coffee } from 'lucide-react';

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
      <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', color: 'var(--primary)', border: 'none', background: 'none', fontWeight: 700, cursor: 'pointer' }}>Coba Lagi</button>
    </div>
  );

  // Group by category
  const categories = [...new Set(data.products.map(p => p.category.name))];

  // Helper to render Category Icon with custom theme
  const renderCategoryHeader = (catName) => {
    let icon = <Utensils size={20} color="var(--primary)" />;
    let bgColor = 'rgba(255, 59, 48, 0.08)';

    if (catName.toLowerCase().includes('minum')) {
      icon = <GlassWater size={20} color="#ff9500" />;
      bgColor = 'rgba(255, 149, 0, 0.08)';
    }

    return (
      <div style={styles.categoryHeader}>
        <div style={{ ...styles.iconWrapper, backgroundColor: bgColor }}>
          {icon}
        </div>
        <h2 style={styles.categoryTitle}>{catName}</h2>
      </div>
    );
  };

  return (
    <div className="animate-fade" style={styles.container}>
      <header style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Pilih Menu Favoritmu</h1>
        <p style={styles.pageSubtitle}>Mie Ayam Chili Oil home-made dengan bahan premium.</p>
      </header>

      {categories.map(catName => (
        <section key={catName} style={{ marginBottom: '3rem' }}>
          {renderCategoryHeader(catName)}
          <div style={styles.grid}>
            {data.products
              .filter(p => p.category.name === catName)
              .map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  toppings={data.toppings}
                  onAddClick={addToCart} 
                />
              ))
            }
          </div>
        </section>
      ))}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  pageHeader: {
    marginBottom: '2.5rem',
    textAlign: 'left',
  },
  pageTitle: {
    fontSize: '2rem',
    fontWeight: '800',
    color: 'var(--text-main)',
    marginBottom: '0.25rem',
  },
  pageSubtitle: {
    fontSize: '1rem',
    color: 'var(--text-muted)',
  },
  categoryHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '1.5rem',
  },
  iconWrapper: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTitle: {
    fontSize: '1.35rem',
    fontWeight: '800',
    color: 'var(--text-main)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  }
};

export default Home;
