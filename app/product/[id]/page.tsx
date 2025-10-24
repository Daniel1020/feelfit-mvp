'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import FigmaProductShell from '@/components/FigmaProductShell';
import InputOrb from '@/components/InputOrb';

type Product = {
  id: string;
  name: string;
  brand_name: string | null;
  price_cents: number | null;
  primary_image_url: string | null;
  product_source_link: string | null;
};

type ImageRow = {
  image_url: string;
  sort_order: number | null;
};

async function fetchProduct(id: string): Promise<{
  product: Product;
  hero: string | null;
  images: ImageRow[];
}> {
  // 1) product
  const { data: product, error: pe } = await supabase
    .from('feelfit_products')
    .select('id, name, brand_name, price_cents, primary_image_url, product_source_link')
    .eq('id', id)
    .single();
  if (pe) throw pe;

  // 2) images (may be empty)
  const { data: images, error: ie } = await supabase
    .from('feelfit_product_images')
    .select('image_url, sort_order')
    .eq('product_id', id)
    .order('sort_order', { ascending: true });
  if (ie) throw ie;

  const hero =
    (images && images[0]?.image_url) ||
    product?.primary_image_url ||
    null;

  return { product: product as Product, hero, images: (images ?? []) as ImageRow[] };
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const [loading, setLoading] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const [product, setProduct] = React.useState<Product | null>(null);
  const [hero, setHero] = React.useState<string | null>(null);
  const [images, setImages] = React.useState<ImageRow[]>([]);

  const [showInput, setShowInput] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const { product, hero, images } = await fetchProduct(params.id);
        if (!mounted) return;
        setProduct(product);
        setHero(hero);
        setImages(images);
      } catch (err: any) {
        console.error(err);
        if (!mounted) return;
        setErrorMsg(err?.message || 'Failed to load product');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [params.id]);

  // simple skeleton
  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5F1EC] p-6">
        <div className="h-10 w-10 rounded-full bg-black/10 animate-pulse mb-4" />
        <div className="h-[360px] rounded-2xl bg-black/10 animate-pulse mb-4" />
        <div className="h-6 w-2/3 bg-black/10 animate-pulse mb-2" />
        <div className="h-5 w-1/3 bg-black/10 animate-pulse" />
      </main>
    );
  }

  if (errorMsg || !product) {
    return (
      <main className="min-h-screen bg-[#F5F1EC] p-6">
        <button
          onClick={() => router.back()}
          className="mb-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center"
          aria-label="Back"
        >
          ×
        </button>
        <div className="text-sm text-red-600">{errorMsg ?? 'Product not found'}</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F1EC] relative">
      {/* Close/back */}
      <button
        onClick={() => router.back()}
        className="absolute left-3 top-3 z-50 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center"
        aria-label="Close"
      >
        ×
      </button>

      {/* Figma-look shell with real data */}
      <FigmaProductShell
        imageUrl={hero ?? product.primary_image_url}
        brand={product.brand_name ?? '—'}
        name={product.name}
        priceCents={product.price_cents ?? null}
        onShop={() => {
          const url =
            product.product_source_link ??
            `https://www.google.com/search?q=${encodeURIComponent(product.name)}`;
          window.open(url, '_blank', 'noopener,noreferrer');
        }}
        onSave={() => {
          // MVP: log; later: supabase.from('user_saves').insert(...)
          console.log('save', product.id);
        }}
        onCollect={() => {
          console.log('collect', product.id);
        }}
        onShare={async () => {
          try {
            if (navigator.share) {
              await navigator.share({
                title: product.name,
                url: window.location.href,
              });
            } else {
              await navigator.clipboard.writeText(window.location.href);
              alert('Link copied');
            }
          } catch {}
        }}
        onOpenInput={() => setShowInput(true)}
      />

      {/* Animated InputOrb overlay */}
      <AnimatePresence>
        {showInput && (
          <motion.div
            key="orb-overlay"
            className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.18 } }}
            exit={{ opacity: 0, transition: { duration: 0.14 } }}
            onClick={() => setShowInput(false)} // tap outside to close
          >
            <div
              className="absolute inset-x-0 bottom-0"
              onClick={(e) => e.stopPropagation()} // keep clicks inside
            >
              <InputOrb
                onClose={() => setShowInput(false)}
                onSubmit={async (text: string) => {
                  // call your AI endpoint; replace body structure as needed
                  const res = await fetch('/api/styletalk', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      text,
                      productContextId: product.id,
                    }),
                  });
                  const data = await res.json();
                  console.log('styletalk result', data);
                  // TODO: if API returns suggested products, update a "more" grid here
                  setShowInput(false);
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}