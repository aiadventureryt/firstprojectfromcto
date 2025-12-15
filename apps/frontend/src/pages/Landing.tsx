import React from 'react';
import PageShell from '@/components/layout/PageShell';

const Landing: React.FC = () => {
  return (
    <PageShell title="Welcome">
      <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2>Landing Page</h2>
        <p>This is the landing page of the application.</p>
      </div>
    </PageShell>
  );
};

export default Landing;
