'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminNav } from '@/components/AdminNav';
import { DataTable } from '@/components/DataTable';
import { Pagination } from '@/components/Pagination';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { apiGet, apiDelete, apiPut } from '@/lib/api';
import { Order, PaginatedResponse } from '@workspace/shared';

export default function OrdersPage() {
  const [data, setData] = useState<PaginatedResponse<Order> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState<Partial<Order>>({});

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const result = await apiGet<PaginatedResponse<Order>>(
        `/admin/orders?page=${page}&limit=10`
      );
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await apiDelete(`/admin/orders/${deleteConfirm.id}`);
      setDeleteConfirm(null);
      fetchOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete order');
    }
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setFormData(order);
  };

  const handleSave = async () => {
    if (!editingOrder) return;
    try {
      await apiPut(`/admin/orders/${editingOrder.id}`, formData);
      setEditingOrder(null);
      setFormData({});
      fetchOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order');
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <div style={styles.container}>
        <AdminNav />
        <main style={styles.main}>
          <div style={styles.header}>
            <h1 style={styles.title}>Orders Management</h1>
          </div>

          {error && (
            <div style={styles.error}>
              <strong>Error:</strong> {error}
            </div>
          )}

          <div style={styles.tableSection}>
            <DataTable<Order>
              columns={[
                { key: 'id', label: 'Order ID' },
                { key: 'userId', label: 'User ID' },
                { key: 'productId', label: 'Product ID' },
                { key: 'quantity', label: 'Quantity' },
                {
                  key: 'totalPrice',
                  label: 'Total Price',
                  render: (value) => `$${Number(value).toFixed(2)}`,
                },
                {
                  key: 'status',
                  label: 'Status',
                  render: (value) => (
                    <span style={{ ...styles.badge, ...styles[`status_${value}`] }}>
                      {value}
                    </span>
                  ),
                },
                {
                  key: 'createdAt',
                  label: 'Created At',
                  render: (value) => new Date(value).toLocaleDateString(),
                },
              ]}
              data={data?.items || []}
              onEdit={handleEdit}
              onDelete={(order) => setDeleteConfirm(order)}
              isLoading={loading}
            />
          </div>

          {data && <Pagination
            currentPage={page}
            totalPages={data.pages}
            onPageChange={setPage}
            isLoading={loading}
          />}

          {editingOrder && (
            <OrderForm
              order={editingOrder}
              formData={formData}
              onFormChange={setFormData}
              onSave={handleSave}
              onCancel={() => {
                setEditingOrder(null);
                setFormData({});
              }}
            />
          )}

          <ConfirmDialog
            isOpen={!!deleteConfirm}
            title="Delete Order"
            message={`Are you sure you want to delete order ${deleteConfirm?.id}? This action cannot be undone.`}
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

interface OrderFormProps {
  order: Partial<Order>;
  formData: Partial<Order>;
  onFormChange: (data: Partial<Order>) => void;
  onSave: () => Promise<void>;
  onCancel: () => void;
}

function OrderForm({
  order,
  formData,
  onFormChange,
  onSave,
  onCancel,
}: OrderFormProps) {
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

  return (
    <div style={styles.modalOverlay} onClick={onCancel}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.modalTitle}>Edit Order</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Status</label>
            <select
              value={formData.status || 'pending'}
              onChange={(e) => onFormChange({ ...formData, status: e.target.value as any })}
              style={styles.input}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
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
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: 0,
    color: '#333',
  },
  error: {
    padding: '1rem',
    background: '#fee',
    border: '1px solid #fcc',
    borderRadius: '6px',
    color: '#c33',
    marginBottom: '2rem',
  },
  tableSection: {
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  badge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  status_pending: {
    background: '#fff3cd',
    color: '#856404',
  },
  status_completed: {
    background: '#d4edda',
    color: '#155724',
  },
  status_cancelled: {
    background: '#f8d7da',
    color: '#721c24',
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
