import './globals.css';
import React from 'react';

export const metadata = { title: 'FEELFIT MVP', description: 'Minimal MVP' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="bg-ivory">{children}</body>
    </html>
 
  );

}
