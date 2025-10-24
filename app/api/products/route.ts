// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic'; // no caching

export async function GET() {
  const { data, error } = await supabase
    .from('feelfit_products')
    .select('id, name, brand_name, price_cents, primary_image_url')
    .order('id', { ascending: true });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, count: data?.length ?? 0, items: data ?? [] });
}