'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminNav } from '@/components/AdminNav';
import { DataTable } from '@/components/DataTable';
import { Pagination } from '@/components/Pagination';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { apiGet, apiDelete, apiPost, apiPut } from '@/lib/api';
import { Product, PaginatedResponse } from '@workspace/shared';

export default function ProductsPage() {
  const [data, setData] = useState<PaginatedResponse<Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const result = await apiGet<PaginatedResponse<Product>>(
        `/admin/products?page=${page}&limit=10`
      );
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await apiDelete(`/admin/products/${deleteConfirm.id}`);
      setDeleteConfirm(null);
      fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
  };

  const handleSave = async () => {
    if (!editingProduct) return;
    try {
      await apiPut(`/admin/products/${editingProduct.id}`, formData);
      setEditingProduct(null);
      setFormData({});
      fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
    }
  };

  const handleCreate = async () => {
    try {
      await apiPost('/admin/products', formData);
      setEditingProduct(null);
      setFormData({});
      setPage(1);
      fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    }
  };

  const filteredProducts = data?.items.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <ProtectedRoute requireAdmin>
      <div style={styles.container}>
        <AdminNav />
        <main style={styles.main}>
          <div style={styles.header}>
            <h1 style={styles.title}>Products Management</h1>
            <button
              style={styles.createBtn}
              onClick={() => {
                setEditingProduct({} as Product);
                setFormData({});
              }}
            >
              + Add Product
            </button>
          </div>

          {error && (
            <div style={styles.error}>
              <strong>Error:</strong> {error}
            </div>
          )}

          <div style={styles.searchSection}>
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.tableSection}>
            <DataTable<Product>
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Product Name' },
                {
                  key: 'price',
                  label: 'Price',
                  render: (value) => `$${Number(value).toFixed(2)}`,
                },
                {
                  key: 'stock',
                  label: 'Stock',
                  render: (value) => (
                    <span style={value > 0 ? styles.inStock : styles.outOfStock}>
                      {value} units
                    </span>
                  ),
                },
                {
                  key: 'createdAt',
                  label: 'Created At',
                  render: (value) => new Date(value).toLocaleDateString(),
                },
              ]}
              data={filteredProducts}
              onEdit={handleEdit}
              onDelete={(product) => setDeleteConfirm(product)}
              isLoading={loading}
            />
          </div>

          {data && <Pagination
            currentPage={page}
            totalPages={data.pages}
            onPageChange={setPage}
            isLoading={loading}
          />}

          {editingProduct && (
            <ProductForm
              product={editingProduct}
              formData={formData}
              onFormChange={setFormData}
              onSave={editingProduct.id ? handleSave : handleCreate}
              onCancel={() => {
                setEditingProduct(null);
                setFormData({});
              }}
            />
          )}

          <ConfirmDialog
            isOpen={!!deleteConfirm}
            title="Delete Product"
            message={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
            confirmText="Delete"
            cancelText="Cancel"
            isDangerous
            onConfirm={handleDelete}
            onCancel={() => setDeleteConfirm(null)}
          />
        </main>
      </div>
    </ProtectedRoute>
  );
}

interface ProductFormProps {
  product: Partial<Product>;
  formData: Partial<Product>;
  onFormChange: (data: Partial<Product>) => void;
  onSave: () => Promise<void>;
  onCancel: () => void;
}

function ProductForm({
  product,
  formData,
  onFormChange,
  onSave,
  onCancel,
}: ProductFormProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  };

  const isNew = !product.id;

  return (
    <div style={styles.modalOverlay} onClick={onCancel}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.modalTitle}>
          {isNew ? 'Create Product' : 'Edit Product'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Product Name</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
              style={styles.input}
              placeholder="Product name"
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
              style={{ ...styles.input, minHeight: '100px', fontFamily: 'inherit' }}
              placeholder="Product description"
              required
            />
          </div>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.price || ''}
                onChange={(e) => onFormChange({ ...formData, price: parseFloat(e.target.value) })}
                style={styles.input}
                placeholder="0.00"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Stock</label>
              <input
                type="number"
                value={formData.stock || ''}
                onChange={(e) => onFormChange({ ...formData, stock: parseInt(e.target.value) })}
                style={styles.input}
                placeholder="0"
                required
              />
            </div>
          </div>
          <div style={styles.formActions}>
            <button
              type="button"
              style={styles.cancelFormBtn}
              onClick={onCancel}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={styles.submitBtn}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f9f9f9',
  },
  main: {
    flex: 1,
    padding: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: 0,
    color: '#333',
  },
  createBtn: {
    padding: '0.75rem 1.5rem',
    background: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background 0.2s',
  },
  error: {
    padding: '1rem',
    background: '#fee',
    border: '1px solid #fcc',
    borderRadius: '6px',
    color: '#c33',
    marginBottom: '2rem',
  },
  searchSection: {
    marginBottom: '2rem',
  },
  searchInput: {
    width: '100%',
    maxWidth: '400px',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
  },
  tableSection: {
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  inStock: {
    color: '#2e7d32',
    fontWeight: '600',
  },
  outOfStock: {
    color: '#d32f2f',
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modalContent: {
    background: '#fff',
    borderRadius: '8px',
    padding: '2rem',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    margin: '0 0 1.5rem 0',
    color: '#333',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#333',
    fontSize: '0.95rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    boxSizing: 'border-box',
  },
  formActions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
    justifyContent: 'flex-end',
  },
  cancelFormBtn: {
    padding: '0.75rem 1.5rem',
    background: '#f5f5f5',
    color: '#333',
    border: '1px solid #ddd',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  submitBtn: {
    padding: '0.75rem 1.5rem',
    background: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
};
