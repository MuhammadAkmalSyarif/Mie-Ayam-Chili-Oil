import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { Loader2 } from 'lucide-react';

const Home = () => {
  const [data, setData] = useState({ products: [], toppings: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Makanan');
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
      <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', color: 'var(--primary)' }}>Coba Lagi</button>
    </div>
  );

  return (
    <div className="animate-fade">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 400, letterSpacing: '1px' }}>PILIH MENU FAVORITMU</h1>
        <p style={{ color: 'var(--text-muted)' }}>Mie Ayam Chili Oil home-made dengan bahan premium.</p>
      </header>

      {/* Tabs */}
      <div style={styles.tabsContainer}>
        <button 
          onClick={() => setActiveTab('Makanan')}
          style={{...styles.tab, ...(activeTab === 'Makanan' ? styles.activeTab : {})}}
        >
          Makanan
        </button>
        <button 
          onClick={() => setActiveTab('Minuman')}
          style={{...styles.tab, ...(activeTab === 'Minuman' ? styles.activeTab : {})}}
        >
          Minuman
        </button>
      </div>

      <section style={{ marginBottom: '2.5rem' }}>
        <div style={styles.grid}>
          {data.products
            .filter(p => p.category.name === activeTab)
            .map(product => {
              // Products that already include toppings don't need topping options
              const isBasicProduct = !(/bakso|pangsit|komplit/i.test(product.name));
              const productToppings = (activeTab === 'Makanan' && isBasicProduct) ? data.toppings : [];
              
              return (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  toppings={productToppings}
                  onAddToCart={addToCart}
                />
              );
            })
          }
        </div>
      </section>
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1rem',
  },
  tabsContainer: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    borderBottom: '2px solid var(--border)',
    paddingBottom: '0.5rem',
  },
  tab: {
    padding: '0.5rem 1rem',
    fontSize: '1.125rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    background: 'none',
    borderBottom: '3px solid transparent',
    marginBottom: '-0.65rem',
    transition: 'all 0.2s ease',
  },
  activeTab: {
    color: 'var(--primary)',
    borderBottomColor: 'var(--primary)',
  }
};

export default Home;
