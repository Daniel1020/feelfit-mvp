'use client';
import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Product = {
  id: string;
  name: string;
  brand_name: string | null;
  price_dollars: number | null;
  primary_image_url: string | null;
  product_source_link: string | null;
};

type Msg = { role: 'user' | 'assistant'; content: string };

export default function ChatOrb({ productId }: { productId?: string }) {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState<Msg[]>([
    { role: 'assistant', content: 'Hi! I’m your FeelFit stylist. Tell me what you’re after—brand, style, or budget.' }
  ]);
  const [items, setItems] = React.useState<Product[]>([]);
  const scRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => { scRef.current?.scrollTo({ top: 99999, behavior: 'smooth' }); }, [messages, items, open]);

  async function send() {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setInput('');

    const res = await fetch('/api/styletalk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [...messages, { role: 'user', content: text }], productContextId: productId ?? null })
    });
    const j = await res.json();
    if (j.ok) {
      if (j.assistant) setMessages((m) => [...m, { role: 'assistant', content: j.assistant }]);
      if (Array.isArray(j.items)) setItems(j.items);
    } else {
      setMessages((m) => [...m, { role: 'assistant', content: 'Sorry—something went wrong.' }]);
    }
  }

  return (
    <>
      {/* FAB */}
      <button
        aria-label="Chat with stylist"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-5 z-40 w-14 h-14 rounded-full bg-black text-white shadow-lg grid place-items-center"
      >
        💬
      </button>

      {/* Sheet */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setOpen(false)}>
          <div
            className="absolute bottom-0 inset-x-0 bg-white rounded-t-2xl p-4 max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-sm text-neutral-600 mb-2">FeelFit Stylist</div>

            <div ref={scRef} className="flex-1 overflow-y-auto space-y-3 pr-1">
              {messages.map((m, i) => (
                <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                  <div className={`inline-block px-3 py-2 rounded-2xl ${m.role === 'user' ? 'bg-black text-white' : 'bg-neutral-100'}`}>
                    {m.content}
                  </div>
                </div>
              ))}

              {items.length > 0 && (
                <div>
                  <div className="text-xs tracking-widest text-neutral-500 mb-2">SUGGESTIONS</div>
                  <div className="grid grid-cols-2 gap-3">
                    {items.slice(0, 8).map((p) => (
                      <Link key={p.id} href={`/product/${p.id}`} className="block">
                        <div className="w-full h-[140px] rounded-lg overflow-hidden bg-neutral-100">
                          {p.primary_image_url ? (
                            <Image
                              src={p.primary_image_url}
                              alt={p.name}
                              width={600}
                              height={800}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full grid place-items-center text-xs text-neutral-500">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="mt-1 text-xs line-clamp-2">{p.name}</div>
                        <div className="text-[11px] text-neutral-600">
                          {p.brand_name ?? ''} {p.price_dollars != null ? `· $${p.price_dollars.toFixed(2)}` : ''}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. zara black blazer under $120"
                className="flex-1 h-12 px-3 rounded-xl border border-neutral-300"
              />
              <button onClick={send} className="h-12 px-4 rounded-xl bg-black text-white">Send</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}