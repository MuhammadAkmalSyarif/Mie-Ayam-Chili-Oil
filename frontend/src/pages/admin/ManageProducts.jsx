import React, { useEffect, useState, useRef } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct, fixImageUrl } from '../../services/api';
import { Loader2, Plus, Edit, Trash2, UploadCloud, Image as ImageIcon } from 'lucide-react';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const [formData, setFormData] = useState({ id: null, name: '', basePrice: '', categoryId: '', imageUrl: '' });
  const fileInputRef = useRef(null);

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

  // --- Upload Handlers ---
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file.type.match('image.*')) {
      alert('Hanya file gambar yang diperbolehkan');
      return;
    }

    setIsUploading(true);
    const token = localStorage.getItem('adminToken');
    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      // NOTE: Base URL is assumed http://localhost:5000/api as defined in services/api.js
      const response = await fetch(`http://${window.location.hostname}:5000/api/products/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadData
      });

      const result = await response.json();
      if (result.success) {
        setFormData(prev => ({ ...prev, imageUrl: result.imageUrl }));
      } else {
        alert('Gagal mengupload gambar');
      }
    } catch (error) {
      alert('Terjadi kesalahan saat upload');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Loader2 className="animate-spin" /></div>;

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Kelola Menu</h1>
        <button 
          onClick={() => {
            setFormData({ id: null, name: '', basePrice: '', categoryId: categories[0]?.id || '', imageUrl: '' });
            setShowForm(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={18} /> Tambah Menu
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card" style={styles.formContainer}>
          <div style={styles.formLayout}>
            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 700 }}>{formData.id ? 'Edit Menu' : 'Tambah Menu Baru'}</h3>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Nama Menu</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={styles.input} />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Harga Dasar (Rp)</label>
                <input required type="number" value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: e.target.value})} style={styles.input} />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Kategori</label>
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
            </div>

            {/* Gambar Upload Zone */}
            <div style={{ flex: 1 }}>
              <label style={{...styles.label, marginBottom: '0.75rem', display: 'block'}}>Foto Produk</label>
              
              <div 
                className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  height: '220px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*"
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
                
                {isUploading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'var(--primary)' }}>
                    <Loader2 className="animate-spin" size={32} />
                    <span>Mengunggah...</span>
                  </div>
                ) : formData.imageUrl ? (
                  <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                    <img 
                      src={fixImageUrl(formData.imageUrl)} 
                      alt="Preview" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} 
                    />
                    <div style={{
                      position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: 0, transition: 'opacity 0.2s', borderRadius: 'var(--radius-sm)'
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0}
                    >
                      <span style={{ color: 'white', fontWeight: 600 }}>Klik untuk Ganti Foto</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                    <UploadCloud size={48} color="var(--primary-light)" />
                    <p style={{ fontWeight: 600, color: 'var(--text-main)' }}>Tarik file gambar ke sini</p>
                    <p style={{ fontSize: '0.85rem' }}>atau klik untuk memilih file</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary">Simpan Menu</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn" style={{ backgroundColor: 'var(--border-light)', color: 'var(--text-main)' }}>Batal</button>
          </div>
        </form>
      )}

      <div style={styles.tableWrapper} className="glass-card">
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
                    <img src={fixImageUrl(product.imageUrl)} alt={product.name} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  ) : (
                    <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--border-light)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                      <ImageIcon size={20} />
                    </div>
                  )}
                </td>
                <td style={styles.td}>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{product.name}</strong>
                </td>
                <td style={styles.td}>
                  <span style={{ backgroundColor: 'var(--bg-main)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 500 }}>
                    {product.category?.name}
                  </span>
                </td>
                <td style={styles.td}><span style={{ fontWeight: 600 }}>Rp {product.basePrice.toLocaleString('id-ID')}</span></td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => openEdit(product)} style={{...styles.iconBtn, color: 'var(--accent)'}}><Edit size={20} /></button>
                    <button onClick={() => handleDelete(product.id)} style={{...styles.iconBtn, color: 'var(--error)'}}><Trash2 size={20} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Belum ada menu. Silakan tambah menu baru.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  formContainer: {
    padding: '2.5rem',
    marginBottom: '2rem',
    borderRadius: 'var(--radius-lg)',
    backgroundColor: '#fff',
    border: '1px solid var(--border-light)',
    boxShadow: 'var(--shadow-md)',
  },
  formLayout: {
    display: 'flex',
    gap: '3rem',
    flexWrap: 'wrap'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1.25rem',
  },
  label: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: 'var(--text-main)',
    letterSpacing: '-0.01em',
  },
  input: {
    padding: '0.875rem 1rem',
    borderRadius: 'var(--radius-sm)',
    border: '2px solid var(--border-light)',
    fontSize: '1rem',
    backgroundColor: 'var(--bg-main)',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
  },
  tableWrapper: {
    overflowX: 'auto',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-light)',
    boxShadow: 'var(--shadow-sm)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '1.25rem 1.5rem',
    textAlign: 'left',
    backgroundColor: 'var(--bg-main)',
    borderBottom: '1px solid var(--border-light)',
    color: 'var(--text-muted)',
    fontWeight: '700',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  tr: {
    borderBottom: '1px solid var(--border-light)',
    transition: 'background-color 0.2s',
  },
  td: {
    padding: '1.25rem 1.5rem',
    verticalAlign: 'middle',
  },
  iconBtn: {
    background: 'var(--bg-main)',
    padding: '8px',
    borderRadius: 'var(--radius-sm)',
    transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--border-light)',
  }
};

export default ManageProducts;
