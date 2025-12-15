import React from 'react';
import PageShell from '@/components/layout/PageShell';

const Dashboard: React.FC = () => {
  return (
    <PageShell title="Dashboard">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Stats</h3>
          <p>Placeholder for dashboard stats.</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Activity</h3>
          <p>Placeholder for recent activity.</p>
        </div>
      </div>
    </PageShell>
  );
};

export default Dashboard;
