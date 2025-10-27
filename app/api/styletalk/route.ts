// app/api/styletalk/route.ts
import { NextResponse } from "next/server";

type Row = {
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

function parseQuery(text: string) {
  const q = (text || "").toLowerCase();
  const terms = q.split(/[^a-z0-9$]+/i).filter(Boolean);

  // very light “intent” parsing
  const wantsCheap = /\b(cheap|under\s*\$\s*\d+|budget)\b/.test(q);
  const priceCapMatch = q.match(/under\s*\$\s*(\d+)/);
  const priceCap = priceCapMatch ? parseFloat(priceCapMatch[1]) : null;

  let brand: string | null = null;
  if (/\bzara\b/i.test(q)) brand = "ZARA";
  if (/\bh&?m\b/i.test(q)) brand = "H&M";

  const keywords = terms.filter(
    (t) => !["zara", "hm", "h", "m", "and", "under"].includes(t)
  );

  return { brand, keywords, wantsCheap, priceCap };
}

export async function POST(req: Request) {
  try {
    const { text, productContextId } = await req.json();
    const { brand, keywords, wantsCheap, priceCap } = parseQuery(text || "");

    // Build Supabase REST query
    const base = new URL(`${SB_URL}/rest/v1/feelfit_products_api`);
    // select minimal fields for cards
    base.searchParams.set(
      "select",
      "id,name,brand_name,price_dollars,primary_image_url,product_source_link"
    );
    base.searchParams.set("limit", "24");

    // brand filter
    if (brand) base.searchParams.set("brand_name", `eq.${brand}`);

    // keyword OR (name ilike)
    if (keywords.length) {
      // or=(name.ilike.*coat*,name.ilike.*wool*)
      const orExpr = keywords
        .slice(0, 5)
        .map((k) => `name.ilike.*${encodeURIComponent(k)}*`)
        .join(",");
      base.searchParams.set("or", `(${orExpr})`);
    }

    // price filters
    if (priceCap != null) {
      base.searchParams.set("price_dollars", `lt.${priceCap}`);
    } else if (wantsCheap) {
      base.searchParams.set("price_dollars", "lt.80");
    }

    // exclude current product if provided
    if (productContextId) {
      base.searchParams.set("id", `neq.${productContextId}`);
    }

    const res = await fetch(base.toString(), {
      headers: SB_HEADERS,
      cache: "no-store",
    });
    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json(
        { ok: false, error: `query failed ${res.status}: ${txt}` },
        { status: 500 }
      );
    }
    const items = (await res.json()) as Row[];

    return NextResponse.json({ ok: true, count: items.length, items });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}