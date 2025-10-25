// app/api/debug-products-base/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const hm = await supabase.from('hm_products_norm').select('id').limit(1);
  const zara = await supabase.from('zara_products_norm').select('id').limit(1);
  return NextResponse.json({
    hm_ok: !hm.error,
    hm_err: hm.error?.message ?? null,
    zara_ok: !zara.error,
    zara_err: zara.error?.message ?? null,
  });
}