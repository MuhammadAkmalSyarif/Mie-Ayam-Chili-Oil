import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import ToppingModal from '../components/ToppingModal';
import { Loader2 } from 'lucide-react';

const Home = () => {
  const [data, setData] = useState({ products: [], toppings: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
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

  // Group by category
  const categories = [...new Set(data.products.map(p => p.category.name))];

  return (
    <div className="animate-fade">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Pilih Menu Favoritmu</h1>
        <p style={{ color: 'var(--text-muted)' }}>Mie Ayam Chili Oil home-made dengan bahan premium.</p>
      </header>

      {categories.map(catName => (
        <section key={catName} style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '4px', height: '20px', backgroundColor: 'var(--primary)', borderRadius: '2px' }}></span>
            {catName}
          </h2>
          <div style={styles.grid}>
            {data.products
              .filter(p => p.category.name === catName)
              .map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddClick={(p) => setSelectedProduct(p)} 
                />
              ))
            }
          </div>
        </section>
      ))}

      {selectedProduct && (
        <ToppingModal 
          product={selectedProduct}
          toppings={data.toppings}
          onClose={() => setSelectedProduct(null)}
          onAdd={addToCart}
        />
      )}
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1rem',
  }
};

export default Home;
