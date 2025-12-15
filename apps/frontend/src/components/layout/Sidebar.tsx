import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      backgroundColor: '#ffffff',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      borderRight: '1px solid #e0e0e0',
      padding: '20px'
    }}>
      <div style={{ marginBottom: '40px', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
        MyApp
      </div>
      <nav>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <li>
            <Link to="/" style={{ display: 'block', padding: '10px', borderRadius: '4px', color: 'var(--text-color)' }}>Home</Link>
          </li>
          <li>
            <Link to="/dashboard" style={{ display: 'block', padding: '10px', borderRadius: '4px', color: 'var(--text-color)' }}>Dashboard</Link>
          </li>
          <li>
            <Link to="/planner" style={{ display: 'block', padding: '10px', borderRadius: '4px', color: 'var(--text-color)' }}>Planner</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
