'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import FigmaProductShell from '@/components/FigmaProductShell';
// 如果你的 InputOrb 组件已经存在，继续保留（放在页面底部渲染即可）
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

async function fetchProduct(id: string) {
  // 读取主产品信息
  const { data: product, error: pe } = await supabase
    .from('feelfit_products')
    .select('id, name, brand_name, price_cents, primary_image_url, product_source_link')
    .eq('id', id)
    .single();

  if (pe) throw pe;

  // 读取多图（如有）
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
  const [product, setProduct] = React.useState<Product | null>(null);
  const [hero, setHero] = React.useState<string | null>(null);
  const [showInput, setShowInput] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { product, hero } = await fetchProduct(params.id);
        setProduct(product);
        setHero(hero);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [params.id]);

  if (loading) return <main className="p-6">Loading…</main>;
  if (!product) return <main className="p-6">Not found.</main>;

  return (
    <main className="min-h-screen bg-[#F5F1EC] relative">
      {/* 顶部左上角返回 */}
      <button
        onClick={() => router.back()}
        className="absolute left-3 top-3 z-50 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center"
        aria-label="Close"
      >
        ×
      </button>

      {/* Figma 外观的壳（由 props 驱动） */}
      <FigmaProductShell
        imageUrl={hero}
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
          // MVP 先打个日志；后续可写入 supabase.user_saves
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

      {/* InputOrb：保持你原来的组件即可，这里用显隐控制 */}
      {/* 你也可以改成弹窗 / 抽屉样式；onSubmit 调用 /api/styletalk 保持不变 */}
      {showInput && (
        <div className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm">
          <div className="absolute inset-x-0 bottom-0">
            <InputOrb
              onClose={() => setShowInput(false)}
              onSubmit={async (text: string) => {
                // 例子：把当前产品上下文传到后端
                const res = await fetch('/api/styletalk', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ text, productContextId: product.id }),
                });
                const data = await res.json();
                console.log('styletalk result', data);
                setShowInput(false);
              }}
            />
          </div>
        </div>
      )}
    </main>
  );
}