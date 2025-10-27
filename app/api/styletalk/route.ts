// app/api/styletalk/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

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

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/** Tool the model can call to fetch products */
async function searchProductsTool(args: {
  query?: string;
  brand?: "ZARA" | "H&M" | null;
  priceCap?: number | null;
  excludeId?: string | null;
  limit?: number;
}): Promise<Product[]> {
  const { query, brand, priceCap, excludeId, limit = 24 } = args || {};

  const base = new URL(`${SB_URL}/rest/v1/feelfit_products_api`);
  base.searchParams.set(
    "select",
    "id,name,brand_name,price_dollars,primary_image_url,product_source_link"
  );
  base.searchParams.set("limit", String(limit));
  // Require an image so cards always render
  base.searchParams.set("primary_image_url", "is.not.null");

  if (excludeId) base.searchParams.set("id", `neq.${excludeId}`);
  if (brand) base.searchParams.set("brand_name", `eq.${brand}`);
  if (priceCap != null) base.searchParams.set("price_dollars", `lt.${priceCap}`);

  // light query → OR over name
  if (query && query.trim()) {
    const words = Array.from(new Set(query.toLowerCase().split(/[^a-z0-9$]+/).filter(Boolean))).slice(0, 6);
    if (words.length) {
      const orExpr = words.map((w) => `name.ilike.*${encodeURIComponent(w)}*`).join(",");
      base.searchParams.set("or", `(${orExpr})`);
    }
  }

  const res = await fetch(base.toString(), { headers: SB_HEADERS, cache: "no-store" });
  if (!res.ok) return [];
  return (await res.json()) as Product[];
}

export async function POST(req: Request) {
  try {
    /** Client sends: { messages: [{role, content}], productContextId?: string } */
    const body = await req.json();
    const messages: Array<{ role: "user" | "assistant" | "system"; content: string }> = body?.messages ?? [];
    const productContextId: string | null = body?.productContextId ?? null;

    const systemPrompt = `
You are FeelFit's stylist. Be warm, concise, helpful. Ask one clarifying question when needed.
When user asks for items, call the tool "searchProducts". If results are sparse, relax filters.
Always explain briefly *why* you chose items (fit, fabric, vibe).
`;

    // Define the function (tool) the model can call
    const tools = [
      {
        type: "function" as const,
        function: {
          name: "searchProducts",
          description: "Search FeelFit catalog for products by query/brand/price, excluding current product if given.",
          parameters: {
            type: "object",
            properties: {
              query: { type: "string", description: "Free-text like 'black wool coat', 'summer dress'" },
              brand: { type: "string", enum: ["ZARA", "H&M"], nullable: true },
              priceCap: { type: "number", nullable: true, description: "Maximum price in USD" },
              excludeId: { type: "string", nullable: true },
              limit: { type: "number", nullable: true }
            }
          },
          strict: false
        }
      }
    ];

    // First LLM turn
    const first = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      tools
    });

    let assistantMsg = first.choices[0].message;

    // If the model wants to call a tool, execute it
    if (assistantMsg.tool_calls?.length) {
      const call = assistantMsg.tool_calls[0];
      if (call.function?.name === "searchProducts") {
        const args = JSON.parse(call.function.arguments || "{}") as {
          query?: string; brand?: "ZARA" | "H&M" | null; priceCap?: number | null; excludeId?: string | null; limit?: number;
        };
        // insert current product context
        if (productContextId && !args.excludeId) args.excludeId = productContextId;

        let items = await searchProductsTool(args);

        // Fallbacks: if empty, relax brand/price; if still empty, drop query
        if (items.length === 0 && (args.brand || args.priceCap)) {
          items = await searchProductsTool({ query: args.query, excludeId: args.excludeId, limit: args.limit ?? 24 });
        }
        if (items.length === 0 && args.query) {
          items = await searchProductsTool({ excludeId: args.excludeId, limit: args.limit ?? 24 });
        }

        // Second turn: give results back to the model so it can speak naturally
        const second = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
            assistantMsg,
            {
              role: "tool",
              tool_call_id: call.id,
              content: JSON.stringify({ ok: true, count: items.length, items })
            }
          ]
        });

        const finalMsg = second.choices[0].message;
        return NextResponse.json({
          ok: true,
          assistant: finalMsg.content,
          items
        });
      }
    }

    // If no tool call, just return the assistant text (e.g., chit-chat, clarifying Q)
    return NextResponse.json({ ok: true, assistant: assistantMsg.content ?? "", items: [] });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}