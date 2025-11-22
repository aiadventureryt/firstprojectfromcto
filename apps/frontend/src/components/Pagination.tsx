'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = [];
  const maxVisible = 5;
  const half = Math.floor(maxVisible / 2);

  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  if (start > 1) {
    pages.push(1);
    if (start > 2) {
      pages.push('...');
    }
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages) {
    if (end < totalPages - 1) {
      pages.push('...');
    }
    pages.push(totalPages);
  }

  return (
    <div style={styles.container}>
      <button
        style={styles.navBtn}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
      >
        ← Previous
      </button>

      <div style={styles.pages}>
        {pages.map((page, idx) => (
          <button
            key={idx}
            style={{
              ...styles.pageBtn,
              ...(page === currentPage ? styles.pageActive : {}),
            }}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...' || isLoading}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        style={styles.navBtn}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
      >
        Next →
      </button>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    padding: '2rem',
  },
  navBtn: {
    padding: '0.75rem 1.5rem',
    background: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  pages: {
    display: 'flex',
    gap: '0.5rem',
  },
  pageBtn: {
    padding: '0.5rem 1rem',
    background: '#f5f5f5',
    color: '#333',
    border: '1px solid #ddd',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
  },
  pageActive: {
    background: '#667eea',
    color: '#fff',
    borderColor: '#667eea',
  },
};
