'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminNav } from '@/components/AdminNav';
import { apiGet } from '@/lib/api';
import { AnalyticsMetrics } from '@workspace/shared';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await apiGet<AnalyticsMetrics>('/admin/analytics');
        setMetrics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <ProtectedRoute requireAdmin>
      <div style={styles.container}>
        <AdminNav />
        <main style={styles.main}>
          <div style={styles.header}>
            <h1 style={styles.title}>Dashboard</h1>
            <p style={styles.subtitle}>Welcome to the admin panel</p>
          </div>

          {error && (
            <div style={styles.error}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {loading ? (
            <div style={styles.loading}>Loading analytics...</div>
          ) : metrics ? (
            <div style={styles.metricsGrid}>
              <MetricCard
                icon="👥"
                title="Total Users"
                value={metrics.totalUsers}
                description="Active users in the system"
              />
              <MetricCard
                icon="🛒"
                title="Total Orders"
                value={metrics.totalOrders}
                description="All orders placed"
              />
              <MetricCard
                icon="⏳"
                title="Pending Orders"
                value={metrics.pendingOrders}
                description="Orders awaiting processing"
              />
              <MetricCard
                icon="💳"
                title="Total Revenue"
                value={`$${metrics.totalRevenue.toFixed(2)}`}
                description="Total revenue collected"
              />
              <MetricCard
                icon="📦"
                title="Total Products"
                value={metrics.totalProducts}
                description="Products in catalog"
              />
              <MetricCard
                icon="📊"
                title="Avg Order Value"
                value={`$${metrics.averageOrderValue.toFixed(2)}`}
                description="Average order amount"
              />
            </div>
          ) : null}

          <div style={styles.chartSection}>
            <h2 style={styles.sectionTitle}>Charts & Analytics</h2>
            <div style={styles.chartPlaceholder}>
              <p>📈 Chart visualization will be rendered here</p>
              <p style={styles.placeholderText}>
                Integrate with a charting library like Chart.js, Recharts, or
                Victory Charts
              </p>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

interface MetricCardProps {
  icon: string;
  title: string;
  value: string | number;
  description: string;
}

function MetricCard({ icon, title, value, description }: MetricCardProps) {
  return (
    <div style={styles.metricCard}>
      <div style={styles.metricIcon}>{icon}</div>
      <h3 style={styles.metricTitle}>{title}</h3>
      <p style={styles.metricValue}>{value}</p>
      <p style={styles.metricDescription}>{description}</p>
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
    margin: '0 0 0.5rem 0',
    color: '#333',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#666',
    margin: 0,
  },
  error: {
    padding: '1rem',
    background: '#fee',
    border: '1px solid #fcc',
    borderRadius: '6px',
    color: '#c33',
    marginBottom: '2rem',
  },
  loading: {
    padding: '2rem',
    textAlign: 'center',
    color: '#999',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  metricCard: {
    background: '#fff',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s, boxShadow 0.2s',
  },
  metricIcon: {
    fontSize: '2.5rem',
    marginBottom: '0.5rem',
  },
  metricTitle: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#666',
    margin: '0 0 0.5rem 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  metricValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '0.5rem 0',
  },
  metricDescription: {
    fontSize: '0.85rem',
    color: '#999',
    margin: '0.5rem 0 0 0',
  },
  chartSection: {
    background: '#fff',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    margin: '0 0 2rem 0',
    color: '#333',
  },
  chartPlaceholder: {
    background: '#f9f9f9',
    border: '2px dashed #ddd',
    borderRadius: '8px',
    padding: '3rem',
    textAlign: 'center',
    color: '#999',
  },
  placeholderText: {
    fontSize: '0.9rem',
    color: '#aaa',
    margin: '0.5rem 0 0 0',
  },
};
