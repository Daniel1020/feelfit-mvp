// app/product/[id]/page.tsx (server component version)
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Product = {
  id: string; name: string; brand_name: string | null;
  price_dollars: number | null; primary_image_url: string | null;
  product_source_link: string | null;
};
type Img = { image_url: string; sort_order: number };

async function getProduct(id: string): Promise<Product | null> {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/feelfit_products_api?id=eq.${encodeURIComponent(id)}&select=*`;
  const res = await fetch(url, {
    headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}` },
    cache: 'no-store',
  });
  const rows = await res.json();
  return rows?.[0] ?? null;
}

async function getImages(id: string): Promise<Img[]> {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/feelfit_product_images_api?product_id=eq.${encodeURIComponent(id)}&select=image_url,sort_order&order=sort_order.asc`;
  const res = await fetch(url, {
    headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}` },
    cache: 'no-store',
  });
  return await res.json();
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const [product, images] = await Promise.all([getProduct(params.id), getImages(params.id)]);
  if (!product) return notFound();
  const gallery = images?.length ? images : (product.primary_image_url ? [{ image_url: product.primary_image_url, sort_order: 1 }] : []);

  return (
    <main className="px-4 py-4">
      <Link href="/" className="text-sm text-neutral-600">← Back</Link>
      <div className="mt-3 text-lg font-medium">{product.name}</div>
      <div className="text-sm text-neutral-600">
        {product.brand_name} {product.price_dollars != null ? `· $${product.price_dollars.toFixed(2)}` : ''}
      </div>

      <div className="mt-4 space-y-3">
        {gallery.map((g, i) => (
          <Image key={i} src={g.image_url} alt={`${product.name} ${i+1}`} width={1200} height={1600} className="w-full h-auto rounded-xl" unoptimized />
        ))}
      </div>

      {product.product_source_link && (
        <a href={product.product_source_link} target="_blank" className="mt-5 inline-block rounded-full px-4 py-2 bg-black text-white">
          Shop Now
        </a>
      )}
    </main>
  );
}