'use client';

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  isLoading?: boolean;
  showActions?: boolean;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  onEdit,
  onDelete,
  isLoading = false,
  showActions = true,
}: DataTableProps<T>) {
  if (isLoading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (data.length === 0) {
    return <div style={styles.empty}>No data available</div>;
  }

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            {columns.map((col) => (
              <th key={String(col.key)} style={styles.headerCell}>
                {col.label}
              </th>
            ))}
            {showActions && (onEdit || onDelete) && (
              <th style={styles.headerCell}>Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} style={styles.row}>
              {columns.map((col) => (
                <td key={String(col.key)} style={styles.cell}>
                  {col.render
                    ? col.render(item[col.key], item)
                    : String(item[col.key])}
                </td>
              ))}
              {showActions && (onEdit || onDelete) && (
                <td style={styles.actionCell}>
                  <div style={styles.actionButtons}>
                    {onEdit && (
                      <button
                        style={styles.editBtn}
                        onClick={() => onEdit(item)}
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        style={styles.deleteBtn}
                        onClick={() => onDelete(item)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.95rem',
  },
  headerRow: {
    background: '#f5f5f5',
    borderBottom: '2px solid #ddd',
  },
  headerCell: {
    padding: '1rem',
    textAlign: 'left',
    fontWeight: '600',
    color: '#333',
  },
  row: {
    borderBottom: '1px solid #eee',
    transition: 'background 0.2s',
  },
  cell: {
    padding: '1rem',
    color: '#666',
  },
  actionCell: {
    padding: '1rem',
  },
  actionButtons: {
    display: 'flex',
    gap: '0.5rem',
  },
  editBtn: {
    padding: '0.5rem 1rem',
    background: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'background 0.2s',
  },
  deleteBtn: {
    padding: '0.5rem 1rem',
    background: '#d32f2f',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'background 0.2s',
  },
  loading: {
    padding: '2rem',
    textAlign: 'center',
    color: '#999',
  },
  empty: {
    padding: '2rem',
    textAlign: 'center',
    color: '#999',
    background: '#f9f9f9',
    borderRadius: '6px',
  },
};
