'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearAuthUser, getAuthUser } from '@/lib/auth';

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const user = getAuthUser();

  const handleLogout = () => {
    clearAuthUser();
    router.push('/');
  };

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/users', label: 'Users', icon: '👥' },
    { href: '/admin/products', label: 'Products', icon: '📦' },
    { href: '/admin/orders', label: 'Orders', icon: '🛒' },
    { href: '/admin/payments', label: 'Payments', icon: '💳' },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.navHeader}>
        <h2 style={styles.title}>Admin Panel</h2>
      </div>

      <ul style={styles.navList}>
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              style={{
                ...styles.navItem,
                ...(pathname === item.href ? styles.navItemActive : {}),
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div style={styles.userSection}>
        <div style={styles.userInfo}>
          <p style={styles.userName}>{user?.name}</p>
          <p style={styles.userEmail}>{user?.email}</p>
        </div>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  nav: {
    width: '260px',
    background: '#1a1a1a',
    color: '#fff',
    padding: '2rem 1rem',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #333',
  },
  navHeader: {
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #333',
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    margin: '0.5rem 0',
    borderRadius: '6px',
    textDecoration: 'none',
    color: '#ccc',
    transition: 'all 0.2s',
    cursor: 'pointer',
  },
  navItemActive: {
    background: '#667eea',
    color: '#fff',
  },
  navIcon: {
    marginRight: '0.75rem',
    fontSize: '1.2rem',
  },
  userSection: {
    paddingTop: '1rem',
    borderTop: '1px solid #333',
    marginTop: 'auto',
  },
  userInfo: {
    marginBottom: '1rem',
  },
  userName: {
    margin: '0.25rem 0',
    fontSize: '0.95rem',
    fontWeight: '600',
  },
  userEmail: {
    margin: '0.25rem 0',
    fontSize: '0.85rem',
    color: '#999',
  },
  logoutBtn: {
    width: '100%',
    padding: '0.75rem',
    background: '#d32f2f',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '600',
    transition: 'background 0.2s',
  },
};
