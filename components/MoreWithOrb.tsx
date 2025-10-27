// components/MoreWithOrb.tsx
'use client';
import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';

type Product = {
  id: string;
  name: string;
  brand_name: string | null;
  price_dollars: number | null;
  primary_image_url: string | null;
  product_source_link: string | null;
};

export default function MoreWithOrb({
  productId,
  brandName,
  initial,
}: {
  productId: string;
  brandName: string | null;
  initial: Product[];
}) {
  const [items, setItems] = React.useState<Product[]>(initial ?? []);
  const [title, setTitle] = React.useState<string>(
    brandName ? `MORE FROM ${brandName.toUpperCase()}` : 'YOU MAY ALSO LIKE'
  );

  async function runOrb(text: string) {
    setTitle('RESULTS');
    const res = await fetch('/api/styletalk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, productContextId: productId }),
    });
    const j = await res.json();
    if (j.ok) setItems(j.items);
  }

  return (
    <section className="mt-8 relative">
      <div className="text-xs tracking-widest text-neutral-500 mb-3">{title}</div>

      {/* Horizontal strip (first 4) */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
        {items.slice(0, 4).map((m) => (
          <Link key={m.id} href={`/product/${m.id}`} className="min-w-[180px] w-[180px] shrink-0">
            <div className="w-full h-[120px] rounded-lg overflow-hidden bg-neutral-100">
              {m.primary_image_url ? (
                <Image
                  src={m.primary_image_url}
                  alt={m.name}
                  width={360}
                  height={240}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full grid place-items-center text-xs text-neutral-500">
                  No image
                </div>
              )}
            </div>
            <div className="mt-2 text-sm line-clamp-2">{m.name}</div>
            <div className="text-xs text-neutral-600">
              {m.price_dollars != null ? `$${m.price_dollars.toFixed(2)}` : ''}
            </div>
          </Link>
        ))}
      </div>

      {/* Grid (rest) */}
      {items.length > 4 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
          {items.slice(4).map((m) => (
            <Link key={m.id} href={`/product/${m.id}`} className="block">
              <div className="w-full h-[150px] rounded-lg overflow-hidden bg-neutral-100">
                {m.primary_image_url ? (
                  <Image
                    src={m.primary_image_url}
                    alt={m.name}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center text-xs text-neutral-500">
                    No image
                  </div>
                )}
              </div>
              <div className="mt-2 text-sm line-clamp-2">{m.name}</div>
              <div className="text-xs text-neutral-600">
                {m.price_dollars != null ? `$${m.price_dollars.toFixed(2)}` : ''}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Floating orb */}
      <div className="fixed bottom-6 right-5">
        {/* inline import to avoid circular deps */}
        {React.createElement(require('./InputOrbFab').default, { onSubmit: runOrb, productId })}
      </div>
    </section>
  );
}