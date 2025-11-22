'use client';

import { useState, useEffect } from 'react';
import { HealthCheckResponse } from '@workspace/shared';

export default function Home() {
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/health`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: HealthCheckResponse = await response.json();
        setHealth(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch health status'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
  }, []);

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🚀 Fullstack Monorepo</h1>
        <p style={styles.subtitle}>
          A modern full-stack application with Next.js and NestJS
        </p>

        <div style={styles.statusSection}>
          <h2 style={styles.sectionTitle}>System Status</h2>

          {loading ? (
            <p style={styles.loading}>Checking system health...</p>
          ) : error ? (
            <div style={styles.error}>
              <strong>Backend Connection Error:</strong>
              <p>{error}</p>
            </div>
          ) : health ? (
            <div style={styles.healthStatus}>
              <div style={styles.statusItem}>
                <strong>Backend Status:</strong>
                <span
                  style={{ ...styles.statusBadge, ...styles[health.status] }}
                >
                  {health.status.toUpperCase()}
                </span>
              </div>
              <div style={styles.statusItem}>
                <strong>Uptime:</strong> {health.uptime}s
              </div>
              <div style={styles.statusItem}>
                <strong>Version:</strong> {health.version}
              </div>
              <div style={styles.statusItem}>
                <strong>Last Check:</strong>{' '}
                {new Date(health.timestamp).toLocaleString()}
              </div>
            </div>
          ) : null}
        </div>

        <div style={styles.techStack}>
          <h3 style={styles.sectionTitle}>Tech Stack</h3>
          <div style={styles.techGrid}>
            <div style={styles.techItem}>
              <strong>Frontend:</strong> Next.js 14 + TypeScript
            </div>
            <div style={styles.techItem}>
              <strong>Backend:</strong> NestJS + TypeScript
            </div>
            <div style={styles.techItem}>
              <strong>Package Manager:</strong> pnpm Workspaces
            </div>
            <div style={styles.techItem}>
              <strong>Styling:</strong> CSS-in-JS (inline styles)
            </div>
          </div>
        </div>

        <div style={styles.commands}>
          <h3 style={styles.sectionTitle}>Development Commands</h3>
          <div style={styles.commandList}>
            <code>pnpm dev</code> - Start both frontend and backend
            <br />
            <code>pnpm dev:frontend</code> - Start frontend only
            <br />
            <code>pnpm dev:backend</code> - Start backend only
            <br />
            <code>pnpm build</code> - Build all packages
            <br />
            <code>pnpm test</code> - Run all tests
          </div>
        </div>
      </div>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  card: {
    maxWidth: '800px',
    margin: '0 auto',
    background: 'white',
    borderRadius: '16px',
    padding: '3rem',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '0 0 1rem 0',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: '1.2rem',
    textAlign: 'center',
    color: '#666',
    margin: '0 0 2rem 0',
  },
  statusSection: {
    marginBottom: '2rem',
    padding: '1.5rem',
    background: '#f8f9fa',
    borderRadius: '8px',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    margin: '0 0 1rem 0',
    color: '#333',
  },
  loading: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  error: {
    padding: '1rem',
    background: '#fee',
    border: '1px solid #fcc',
    borderRadius: '4px',
    color: '#c33',
  },
  healthStatus: {
    display: 'grid',
    gap: '0.5rem',
  },
  statusItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
  },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: '600',
  },
  healthy: {
    background: '#d4edda',
    color: '#155724',
  },
  unhealthy: {
    background: '#f8d7da',
    color: '#721c24',
  },
  techStack: {
    marginBottom: '2rem',
  },
  techGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
  },
  techItem: {
    padding: '1rem',
    background: '#f1f3f4',
    borderRadius: '6px',
    borderLeft: '4px solid #667eea',
  },
  commands: {
    marginBottom: '2rem',
  },
  commandList: {
    background: '#2d3748',
    color: '#e2e8f0',
    padding: '1.5rem',
    borderRadius: '8px',
    fontFamily: 'Monaco, Consolas, monospace',
    fontSize: '0.9rem',
    lineHeight: '1.6',
  },
};
