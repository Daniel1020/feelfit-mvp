'use client';
import React from 'react';
import { supabase } from '@/lib/supabase'; // ⬅️ 不要再引入 publicUrl
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import InputOrb from '@/components/InputOrb';
import DecisionBar from '@/components/DecisionBar';
import MoreGrid from '@/components/MoreGrid';

type ProductRow = {
  id: string;
  brand_name: string;
  name: string;
  price_cents: number | null;
  primary_image_url: string | null;
  images?: { image_url: string; sort_order: number }[];
};

type MoreItem = {
  id: string;
  name: string;
  price_cents: number | null;
  primary_image_url: string | null;
};

async function fetchProduct(id: string): Promise<ProductRow> {
  // 单行产品（含主图）
  const { data: product, error: productError } = await supabase
    .from('feelfit_products')
    .select('id, brand_name, name, price_cents, primary_image_url')
    .eq('id', id)
    .single();

  if (productError || !product) throw productError || new Error('Product not found');

  // 多图（轮播/缩略图）
  const { data: images, error: imagesError } = await supabase
    .from('feelfit_product_images')
    .select('image_url, sort_order')
    .eq('product_id', id)
    .order('sort_order', { ascending: true });

  if (imagesError) throw imagesError;

  return { ...product, images: images ?? [] } as ProductRow;
}

// 用视图查询“同品牌更多”——不再使用 old RPC
async function fetchMore(brandName: string, excludeId: string): Promise<MoreItem[]> {
  const { data, error } = await supabase
    .from('feelfit_products')
    .select('id, name, price_cents, primary_image_url')
    .eq('brand_name', brandName)
    .neq('id', excludeId)
    .limit(8);
  if (error) throw error;
  return data ?? [];
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = React.useState(true);
  const [product, setProduct] = React.useState<ProductRow | null>(null);
  const [hero, setHero] = React.useState<string | null>(null);
  const [more, setMore] = React.useState<MoreItem[]>([]);
  const [showBar, setShowBar] = React.useState(false);

  const calcHeroHeight = React.useCallback(() => {
    const vh = window.innerHeight;
    const twoCards = 230; // 让下方两张卡 + 文案完整露出
    const maxHero = window.innerWidth < window.innerHeight ? Math.floor(vh * 0.7) : Math.floor(vh * 0.66);
    return Math.max(260, Math.min(maxHero, vh - (twoCards + 48)));
  }, []);

  const [heroH, setHeroH] = React.useState(520);

  React.useEffect(() => {
    (async () => {
      try {
        const p = await fetchProduct(params.id);
        const firstImage = p.images && p.images[0]?.image_url;
        const h = firstImage || p.primary_image_url || null;
        setProduct(p);
        setHero(h);
        const m = await fetchMore(p.brand_name, p.id);
        setMore(m);
      } finally {
        setLoading(false);
        setHeroH(calcHeroHeight());
      }
    })();
    const onResize = () => setHeroH(calcHeroHeight());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [params.id, calcHeroHeight]);

  const swapHero = async (nextId: string) => {
    setLoading(true);
    try {
      const p = await fetchProduct(nextId);
      const firstImage = p.images && p.images[0]?.image_url;
      const h = firstImage || p.primary_image_url || null;
      setProduct(p);
      setHero(h);
      const m = await fetchMore(p.brand_name, p.id);
      setMore(m);
      setShowBar(true);
      setHeroH(calcHeroHeight());
    } finally {
      setLoading(false);
    }
  };

  if (loading || !product || !hero) return <div className="p-6">Loading…</div>;

  return (
    <main className="min-h-screen px-4 pt-4 pb-28 relative">
      {/* Close */}
      <button onClick={() => history.back()} className="absolute left-3 top-3 z-50 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center">×</button>

      {/* Hero adaptive */}
      <motion.div
        className="w-full overflow-hidden rounded-xl shadow-glass bg-[#f6f1eb]"
        style={{ height: heroH }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src={hero!}                // ⬅️ 直接用外部 URL，不再 publicUrl(...)
          alt={product.name}
          width={1440}
          height={900}
          className="w-full h-full object-cover"
          priority
        />
      </motion.div>

      {/* More preview (2 items fully visible) */}
      <section className="mt-4">
        <div className="text-xs tracking-widest text-neutral-500 mb-2">
          MORE FROM {product.brand_name?.toUpperCase?.() || 'THIS BRAND'}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {more.slice(0, 2).map((it: MoreItem) => (
            <button key={it.id} onClick={() => swapHero(it.id)} className="text-left">
              <div className="w-full overflow-hidden rounded-lg bg-[#eee]">
                <Image
                  src={it.primary_image_url}    // 外部 URL
                  alt={it.name}
                  width={720}
                  height={900}
                  className="w-full h-[180px] object-cover"
                />
              </div>
              <div className="mt-2 text-sm">{it.name}</div>
              <div className="text-sm text-neutral-600">
                {it.price_cents != null ? `$${(it.price_cents / 100).toFixed(2)}` : ''}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Full grid below */}
      <MoreGrid
        items={more.slice(2).map((m: MoreItem) => ({
          id: m.id,
          name: m.name,
          price_cents: m.price_cents,
          image_url: m.primary_image_url, // 传 image_url 给组件
        }))}
        onPick={(it: { id: string }) => swapHero(it.id)}
      />

      {/* Input orb */}
      <InputOrb
        onSubmit={async (text: string) => {
          const res = await fetch('/api/styletalk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, productContextId: product.id }),
          });
          const data = await res.json();
          if (Array.isArray(data?.suggested) && data.suggested.length) setMore(data.suggested);
        }}
      />

      {/* Decision bar */}
      <AnimatePresence>
        {showBar && <DecisionBar onShop={() => alert('Redirect to brand shop…')} />}
      </AnimatePresence>
    </main>
  );
}
