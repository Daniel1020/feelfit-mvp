import './globals.css';
import React from 'react';

export const metadata = { title: 'FEELFIT MVP', description: 'Minimal MVP' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-ivory">{children}</body>
    </html>
  );
}
