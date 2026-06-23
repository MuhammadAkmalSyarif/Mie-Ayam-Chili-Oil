import React, { useEffect, useState } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../services/api';
import { Loader2, Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', basePrice: '', categoryId: '', imageUrl: '', description: '' });
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleChangeImage = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  const handleImageFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

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
      const payload = {
        ...formData,
        basePrice: parseInt(formData.basePrice),
        categoryId: parseInt(formData.categoryId)
      };

      if (formData.id) {
        await updateProduct(formData.id, payload);
      } else {
        await createProduct(payload);
      }
      setShowForm(false);
      setFormData({ id: null, name: '', basePrice: '', categoryId: categories[0]?.id || '', imageUrl: '', description: '' });
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
      description: product.description || '',
    });
    setShowForm(true);
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <Loader2 className="animate-spin" size={40} color="var(--primary)" />
    </div>
  );

  return (
    <div className="animate-fade">
      <div style={styles.header}>
        <h1 style={styles.title}>Kelola Menu</h1>
        <button 
          onClick={() => {
            setFormData({ id: null, name: '', basePrice: '', categoryId: categories[0]?.id || '', imageUrl: '', description: '' });
            setShowForm(true);
          }}
          style={styles.btnPrimary}
        >
          <Plus size={18} /> Tambah Menu
        </button>
      </div>

      {showForm && (
        <div style={styles.modalOverlay} onClick={() => setShowForm(false)}>
          <div style={styles.formContainer} className="animate-fade" onClick={e => e.stopPropagation()}>
            <div style={styles.formHeader}>
              <h3 style={styles.formTitle}>{formData.id ? 'Edit Menu' : 'Tambah Menu Baru'}</h3>
              <button onClick={() => setShowForm(false)} style={styles.closeBtn}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Nama Menu</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={styles.input} placeholder="Contoh: Mie Ayam Chili Oil Hijau" />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Harga Dasar (Rp)</label>
                <input required type="number" value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: e.target.value})} style={styles.input} placeholder="Contoh: 15000" />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Kategori</label>
                <select 
                  required
                  value={formData.categoryId} 
                  onChange={e => setFormData({...formData, categoryId: e.target.value})} 
                  style={styles.select}
                >
                  <option value="" disabled>Pilih Kategori</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Deskripsi Singkat</label>
                <textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  style={styles.textarea} 
                  placeholder="Masukkan deskripsi produk..."
                  rows={2}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Gambar Produk</label>
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('image-file-input').click()}
                  style={{
                    ...styles.dragDropZone,
                    borderColor: dragActive ? 'var(--primary)' : 'var(--border)',
                    backgroundColor: dragActive ? 'rgba(255, 59, 48, 0.04)' : '#ffffff'
                  }}
                >
                  <input 
                    id="image-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleChangeImage}
                    style={{ display: 'none' }}
                  />
                  {formData.imageUrl ? (
                    <div style={styles.previewContainer}>
                      <img src={formData.imageUrl} alt="Preview" style={styles.previewImg} />
                      <div style={styles.changeBadge}>
                        <ImageIcon size={12} /> Ubah Gambar
                      </div>
                    </div>
                  ) : (
                    <div style={styles.dropPrompt}>
                      <ImageIcon size={24} color="var(--text-muted)" style={{ marginBottom: '6px' }} />
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)' }}>
                        Drag & Drop gambar ke sini
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        atau klik untuk memilih file
                      </span>
                    </div>
                  )}
                </div>
                
                <div style={{ marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Atau masukkan URL gambar langsung:</span>
                  <input 
                    type="text" 
                    value={formData.imageUrl && formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl} 
                    onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
                    style={{ ...styles.input, marginTop: '4px', fontSize: '0.8rem', padding: '6px 10px' }} 
                    placeholder="https://..." 
                  />
                </div>
              </div>

              <div style={styles.formActions}>
                <button type="submit" style={styles.btnSave}>Simpan Menu</button>
                <button type="button" onClick={() => setShowForm(false)} style={styles.btnCancel}>Batal</button>
              </div>
            </form>
          </div>
        </div>
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
                {/* Image */}
                <td style={styles.td}>
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} style={styles.productThumb} />
                  ) : (
                    <div style={styles.productThumbPlaceholder}>
                      <ImageIcon size={18} color="var(--text-muted)" />
                    </div>
                  )}
                </td>

                {/* Name & Desc */}
                <td style={styles.td}>
                  <div style={styles.productInfoCol}>
                    <strong style={styles.productName}>{product.name}</strong>
                    {product.description && <span style={styles.productDesc}>{product.description}</span>}
                  </div>
                </td>

                {/* Category */}
                <td style={styles.td}>
                  <span style={styles.categoryBadge}>{product.category?.name}</span>
                </td>

                {/* Price */}
                <td style={styles.td}>
                  <strong style={styles.priceText}>Rp {product.basePrice.toLocaleString('id-ID')}</strong>
                </td>

                {/* Action Buttons */}
                <td style={styles.td}>
                  <div style={styles.actionCol}>
                    <button onClick={() => openEdit(product)} style={{...styles.iconBtn, color: '#0066cc', backgroundColor: 'rgba(0, 102, 204, 0.06)'}}>
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} style={{...styles.iconBtn, color: '#ff3b30', backgroundColor: 'rgba(255, 59, 48, 0.06)'}}>
                      <Trash2 size={16} />
                    </button>
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#1d1d1f',
  },
  btnPrimary: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0.65rem 1.25rem',
    backgroundColor: 'var(--primary, #ff3b30)',
    color: '#ffffff',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '0.9rem',
    boxShadow: '0 4px 12px rgba(255, 59, 48, 0.15)',
    border: 'none',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '24px',
    boxShadow: 'var(--shadow-lg)',
    width: '100%',
    maxWidth: '480px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  formHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  formTitle: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: 'var(--text-main)',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--text-main)',
  },
  input: {
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    border: '1px solid var(--border, #eaeaea)',
    fontSize: '0.95rem',
    color: 'var(--text-main)',
    outline: 'none',
    backgroundColor: '#ffffff',
  },
  select: {
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    border: '1px solid var(--border, #eaeaea)',
    fontSize: '0.95rem',
    color: 'var(--text-main)',
    outline: 'none',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
  },
  textarea: {
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    border: '1px solid var(--border, #eaeaea)',
    fontSize: '0.95rem',
    color: 'var(--text-main)',
    outline: 'none',
    backgroundColor: '#ffffff',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  formActions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '0.5rem',
  },
  btnSave: {
    flex: 1,
    padding: '0.875rem',
    backgroundColor: 'var(--primary, #ff3b30)',
    color: '#ffffff',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '0.95rem',
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 4px 12px rgba(255, 59, 48, 0.15)',
  },
  btnCancel: {
    padding: '0.875rem 1.5rem',
    backgroundColor: '#f5f5f7',
    color: 'var(--text-main)',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '0.95rem',
    cursor: 'pointer',
    border: 'none',
  },
  tableWrapper: {
    overflowX: 'auto',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  th: {
    padding: '1.25rem 1.5rem',
    backgroundColor: '#f5f6f8',
    borderBottom: '1px solid var(--border)',
    color: 'var(--text-muted)',
    fontWeight: '700',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tr: {
    borderBottom: '1px solid var(--border)',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#fafafa',
    }
  },
  td: {
    padding: '1.25rem 1.5rem',
    verticalAlign: 'middle',
    fontSize: '0.9rem',
    color: 'var(--text-main)',
  },
  productThumb: {
    width: '56px',
    height: '56px',
    objectFit: 'cover',
    borderRadius: '12px',
  },
  productThumbPlaceholder: {
    width: '56px',
    height: '56px',
    backgroundColor: '#f5f5f7',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfoCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    maxWidth: '300px',
  },
  productName: {
    fontSize: '0.95rem',
    color: 'var(--text-main)',
  },
  productDesc: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  categoryBadge: {
    backgroundColor: '#f5f5f7',
    color: '#1d1d1f',
    padding: '4px 10px',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontWeight: '700',
  },
  priceText: {
    fontSize: '0.95rem',
    color: 'var(--text-main)',
  },
  actionCol: {
    display: 'flex',
    gap: '8px',
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    padding: '8px',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },
  dragDropZone: {
    border: '2px dashed var(--border, #eaeaea)',
    borderRadius: '12px',
    height: '140px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    overflow: 'hidden',
    position: 'relative',
    transition: 'all 0.2s ease',
  },
  previewContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  previewImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  changeBadge: {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    color: '#ffffff',
    padding: '4px 8px',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  dropPrompt: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '1rem',
  }
};

export default ManageProducts;
