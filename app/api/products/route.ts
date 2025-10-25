// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic'; // disable caching

type Row = {
  id: string;
  name: string | null;
  brand_name: string | null;
  price_cents: number | null;
  primary_image_url: string | null;
  product_source_link: string | null;
};

export async function GET() {
  const [hm, zara] = await Promise.all([
    supabase
      .from('hm_products_norm')
      .select('id, name, brand_name, price_cents, primary_image_url, product_source_link'),
    supabase
      .from('zara_products_norm')
      .select('id, name, brand_name, price_cents, primary_image_url, product_source_link'),
  ]);

  if (hm.error) return NextResponse.json({ ok: false, error: hm.error.message }, { status: 500 });
  if (zara.error) return NextResponse.json({ ok: false, error: zara.error.message }, { status: 500 });

  const items: Row[] = [
    ...((hm.data ?? []) as Row[]),
    ...((zara.data ?? []) as Row[]),
  ].map((r) => ({
    id: r.id,
    name: r.name ?? '',
    brand_name: r.brand_name ?? '',
    price_cents:
      typeof r.price_cents === 'number' ? r.price_cents : Number(r.price_cents) || null,
    primary_image_url: r.primary_image_url ?? null,
    product_source_link: r.product_source_link ?? null,
  }));

  return NextResponse.json({ ok: true, count: items.length, items }, { status: 200 });
}
