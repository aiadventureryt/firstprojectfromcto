import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fullstack Monorepo',
  description: 'A modern full-stack application with Next.js and NestJS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
