import React from 'react';

interface PageShellProps {
  title: string;
  children: React.ReactNode;
}

const PageShell: React.FC<PageShellProps> = ({ title, children }) => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '30px', borderBottom: '1px solid #e0e0e0', paddingBottom: '10px' }}>
        <h1 style={{ margin: 0, color: 'var(--secondary-color)' }}>{title}</h1>
      </header>
      <section>
        {children}
      </section>
    </div>
  );
};

export default PageShell;
