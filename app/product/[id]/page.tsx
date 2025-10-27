// app/product/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import MoreWithOrb from "@/components/MoreWithOrb";

/** Data shape from public.feelfit_products_api */
type Product = {
  id: string;
  name: string;
  brand_name: string | null;
  price_dollars: number | null;
  primary_image_url: string | null;
  product_source_link: string | null;
};

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SB_HEADERS = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` };

async function getProduct(id: string): Promise<Product | null> {
  const url =
    `${SB_URL}/rest/v1/feelfit_products_api` +
    `?id=eq.${encodeURIComponent(id)}&select=*`;
  const res = await fetch(url, { headers: SB_HEADERS, cache: "no-store" });
  if (!res.ok) throw new Error(`Product fetch failed: ${res.status}`);
  const rows = (await res.json()) as Product[];
  return rows?.[0] ?? null;
}

async function getMore(brand: string | null, excludeId: string): Promise<Product[]> {
  if (!brand) return [];
  const url =
    `${SB_URL}/rest/v1/feelfit_products_api` +
    `?brand_name=eq.${encodeURIComponent(brand)}` +
    `&id=neq.${encodeURIComponent(excludeId)}` +
    `&select=id,name,brand_name,price_dollars,primary_image_url,product_source_link` +
    `&limit=12`;
  const res = await fetch(url, { headers: SB_HEADERS, cache: "no-store" });
  if (!res.ok) throw new Error(`More fetch failed: ${res.status}`);
  return (await res.json()) as Product[];
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) return notFound();

  const more = await getMore(product.brand_name, product.id);

  return (
    <main className="px-4 py-4 pb-14">
      {/* Top bar */}
      <div className="flex items-center gap-3">
        <Link href="/" className="text-sm text-neutral-600">
          ← Back
        </Link>
      </div>

      {/* Meta */}
      <div className="mt-3">
        <div className="text-xs tracking-widest text-neutral-500">
          {product.brand_name ?? ""}
        </div>
        <h1 className="text-xl md:text-2xl font-semibold mt-1">{product.name}</h1>
        <div className="text-neutral-600 mt-1">
          {product.price_dollars != null ? `$${product.price_dollars.toFixed(2)}` : ""}
        </div>
      </div>

      {/* Hero image (single) */}
      <section className="mt-4">
        {product.primary_image_url ? (
          <Image
            src={product.primary_image_url}
            alt={product.name}
            width={1400}
            height={1800}
            className="w-full h-auto rounded-xl"
            unoptimized
          />
        ) : (
          <div className="w-full h-[320px] rounded-xl bg-neutral-200 grid place-items-center text-sm text-neutral-600">
            No image available
          </div>
        )}
      </section>

      {/* Shop */}
      {product.product_source_link && (
        <div className="mt-5">
          <a
            href={product.product_source_link}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center justify-center rounded-full px-5 py-3 bg-black text-white w-full md:w-auto"
          >
            Shop Now
          </a>
        </div>
      )}

      {/* Dynamic “More” + Input Orb */}
      <MoreWithOrb
        productId={product.id}
        brandName={product.brand_name}
        initial={more}
      />
    </main>
  );
}