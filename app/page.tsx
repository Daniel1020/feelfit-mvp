'use client';
export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';

type Product = {
  id: string;
  name: string;
  brand_name: string | null;
  price_cents: number | null;
  primary_image_url: string | null;
};

export default function HomePage() {
  const [items, setItems] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);
  const [count, setCount] = React.useState<number>(0);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        const json = await res.json();
        if (!json.ok) throw new Error(json.error || 'load error');
        setItems(json.items);
        setCount(json.count ?? json.items?.length ?? 0);
      } catch (e: any) {
        setErr(e?.message || 'load error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <main className="p-6">Loading…</main>;
  if (err) return <main className="p-6 text-red-600">Home load error: {err}</main>;

  return (
    <main className="min-h-screen bg-[#F5F1EC] p-4">
      <h1 className="text-2xl font-semibold mb-3">
        🪞 FeelFit Collection — from app/page.tsx
      </h1>

      {/* Debug badge so you can verify actual count */}
      <div className="text-xs text-neutral-500 mb-2">Showing {count} products</div>

      <div className="grid grid-cols-2 gap-3">
        {items.map((p: Product) => (
          <Link key={p.id} href={`/product/${p.id}`} className="block">
            <div className="rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition">
              {p.primary_image_url ? (
                <img
                  src={p.primary_image_url}
                  alt={p.name}
                  className="w-full h-[180px] object-cover"
                />
              ) : (
                <div className="w-full h-[180px] bg-neutral-200" />
              )}
            </div>
            <div className="mt-2 text-sm leading-tight">
              <div className="text-neutral-500">{p.brand_name ?? '—'}</div>
              <div className="font-medium line-clamp-2">{p.name}</div>
              {typeof p.price_cents === 'number' && (
                <div className="text-neutral-600">
                  ${(p.price_cents / 100).toFixed(2)}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}