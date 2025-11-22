'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminNav } from '@/components/AdminNav';
import { DataTable } from '@/components/DataTable';
import { Pagination } from '@/components/Pagination';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { apiGet, apiDelete, apiPost, apiPut } from '@/lib/api';
import { User, PaginatedResponse } from '@workspace/shared';

export default function UsersPage() {
  const [data, setData] = useState<PaginatedResponse<User> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await apiGet<PaginatedResponse<User>>(
        `/admin/users?page=${page}&limit=10`
      );
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await apiDelete(`/admin/users/${deleteConfirm.id}`);
      setDeleteConfirm(null);
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData(user);
  };

  const handleSave = async () => {
    if (!editingUser) return;
    try {
      await apiPut(`/admin/users/${editingUser.id}`, formData);
      setEditingUser(null);
      setFormData({});
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    }
  };

  const handleCreate = async () => {
    try {
      await apiPost('/admin/users', formData);
      setEditingUser(null);
      setFormData({});
      setPage(1);
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    }
  };

  const filteredUsers = data?.items.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <ProtectedRoute requireAdmin>
      <div style={styles.container}>
        <AdminNav />
        <main style={styles.main}>
          <div style={styles.header}>
            <h1 style={styles.title}>Users Management</h1>
            <button
              style={styles.createBtn}
              onClick={() => {
                setEditingUser({} as User);
                setFormData({});
              }}
            >
              + Add User
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
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.tableSection}>
            <DataTable<User>
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                {
                  key: 'role',
                  label: 'Role',
                  render: (value) => (
                    <span style={{ ...styles.badge, ...styles[`role_${value}`] }}>
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
              data={filteredUsers}
              onEdit={handleEdit}
              onDelete={(user) => setDeleteConfirm(user)}
              isLoading={loading}
            />
          </div>

          {data && <Pagination
            currentPage={page}
            totalPages={data.pages}
            onPageChange={setPage}
            isLoading={loading}
          />}

          {editingUser && (
            <UserForm
              user={editingUser}
              formData={formData}
              onFormChange={setFormData}
              onSave={editingUser.id ? handleSave : handleCreate}
              onCancel={() => {
                setEditingUser(null);
                setFormData({});
              }}
            />
          )}

          <ConfirmDialog
            isOpen={!!deleteConfirm}
            title="Delete User"
            message={`Are you sure you want to delete ${deleteConfirm?.name}? This action cannot be undone.`}
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

interface UserFormProps {
  user: Partial<User>;
  formData: Partial<User>;
  onFormChange: (data: Partial<User>) => void;
  onSave: () => Promise<void>;
  onCancel: () => void;
}

function UserForm({
  user,
  formData,
  onFormChange,
  onSave,
  onCancel,
}: UserFormProps) {
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

  const isNew = !user.id;

  return (
    <div style={styles.modalOverlay} onClick={onCancel}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.modalTitle}>
          {isNew ? 'Create User' : 'Edit User'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
              style={styles.input}
              placeholder="User name"
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => onFormChange({ ...formData, email: e.target.value })}
              style={styles.input}
              placeholder="user@example.com"
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Role</label>
            <select
              value={formData.role || 'user'}
              onChange={(e) => onFormChange({ ...formData, role: e.target.value as any })}
              style={styles.input}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
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
  badge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  role_admin: {
    background: '#667eea',
    color: '#fff',
  },
  role_user: {
    background: '#e0e0e0',
    color: '#333',
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
