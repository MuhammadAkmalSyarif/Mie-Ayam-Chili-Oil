import React, { useEffect, useState } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../services/api';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', basePrice: '', categoryId: '', imageUrl: '' });

  const loadProducts = async () => {
    try {
      const result = await fetchProducts();
      if (result.success) {
        setProducts(result.data.products);
        setCategories(result.data.categories || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await updateProduct(formData.id, formData);
      } else {
        await createProduct(formData);
      }
      setShowForm(false);
      setFormData({ id: null, name: '', basePrice: '', categoryId: categories[0]?.id || '', imageUrl: '' });
      loadProducts();
    } catch (error) {
      alert('Gagal menyimpan menu');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus menu ini?')) {
      try {
        await deleteProduct(id);
        loadProducts();
      } catch (error) {
        alert('Gagal menghapus menu');
      }
    }
  };

  const openEdit = (product) => {
    setFormData({
      id: product.id,
      name: product.name,
      basePrice: product.basePrice,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl || '',
    });
    setShowForm(true);
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Loader2 className="animate-spin" /></div>;

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Kelola Menu</h1>
        <button 
          onClick={() => {
            setFormData({ id: null, name: '', basePrice: '', categoryId: categories[0]?.id || '', imageUrl: '' });
            setShowForm(true);
          }}
          style={styles.btnPrimary}
        >
          <Plus size={18} /> Tambah Menu
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.formContainer}>
          <h3 style={{ marginBottom: '1rem' }}>{formData.id ? 'Edit Menu' : 'Tambah Menu Baru'}</h3>
          
          <div style={styles.inputGroup}>
            <label>Nama Menu</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={styles.input} />
          </div>
          
          <div style={styles.inputGroup}>
            <label>Harga Dasar (Rp)</label>
            <input required type="number" value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: e.target.value})} style={styles.input} />
          </div>

          <div style={styles.inputGroup}>
            <label>Kategori</label>
            <select 
              required
              value={formData.categoryId} 
              onChange={e => setFormData({...formData, categoryId: e.target.value})} 
              style={styles.input}
            >
              <option value="" disabled>Pilih Kategori</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label>URL Gambar</label>
            <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} style={styles.input} placeholder="https://..." />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" style={styles.btnPrimary}>Simpan</button>
            <button type="button" onClick={() => setShowForm(false)} style={styles.btnSecondary}>Batal</button>
          </div>
        </form>
      )}

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Gambar</th>
              <th style={styles.th}>Nama Menu</th>
              <th style={styles.th}>Kategori</th>
              <th style={styles.th}>Harga</th>
              <th style={styles.th}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} style={styles.tr}>
                <td style={styles.td}>
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                  ) : (
                    <div style={{ width: '50px', height: '50px', backgroundColor: '#eee', borderRadius: '4px' }}></div>
                  )}
                </td>
                <td style={styles.td}><strong>{product.name}</strong></td>
                <td style={styles.td}>{product.category?.name}</td>
                <td style={styles.td}>Rp {product.basePrice.toLocaleString('id-ID')}</td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => openEdit(product)} style={{...styles.iconBtn, color: '#2196f3'}}><Edit size={18} /></button>
                    <button onClick={() => handleDelete(product.id)} style={{...styles.iconBtn, color: '#f44336'}}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  btnPrimary: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: 'var(--primary)',
    color: '#fff',
    borderRadius: '8px',
    fontWeight: 'bold',
  },
  btnSecondary: {
    padding: '8px 16px',
    backgroundColor: '#e0e0e0',
    color: '#333',
    borderRadius: '8px',
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: '#fafafa',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    marginBottom: '2rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '1rem',
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid var(--border)',
    fontSize: '1rem',
  },
  tableWrapper: {
    overflowX: 'auto',
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '1px solid var(--border)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '1rem',
    textAlign: 'left',
    backgroundColor: 'var(--bg-main)',
    borderBottom: '2px solid var(--border)',
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
  tr: {
    borderBottom: '1px solid var(--border)',
  },
  td: {
    padding: '1rem',
    verticalAlign: 'middle',
  },
  iconBtn: {
    background: 'none',
    padding: '4px',
  }
};

export default ManageProducts;
