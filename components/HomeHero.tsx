'use client';
import Image from 'next/image';
import Link from 'next/link';

type Item = {
  id: string;
  name: string;
  brand_name: string | null;
  price_dollars: number | null;
  primary_image_url: string | null;
};

export default function HomeHero({ item }: { item: Item }) {
  const img = item.primary_image_url ?? '';
  return (
    <div className="min-h-screen bg-[#f3efe9] flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl overflow-hidden shadow-lg bg-white/70 backdrop-blur">
        {/* FEELFIT heading */}
        <div className="pt-5 pb-2 text-center tracking-[0.3em] text-sm text-black/70">
          FEELFIT
        </div>

        {/* Hero image */}
        <div className="px-4">
          <div className="rounded-2xl overflow-hidden">
            {img ? (
              <Image
                src={img}
                alt={item.name}
                width={1200}
                height={1600}
                className="w-full h-[520px] object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-[520px] bg-neutral-200" />
            )}
          </div>
        </div>

        {/* Title + price (on image bottom-left in Figma; here kept readable) */}
        <div className="px-6 pt-5 pb-4">
          <div className="text-[11px] tracking-[0.25em] text-black/50 uppercase">
            {item.brand_name ?? ''}
          </div>
          <div className="mt-1 text-[22px] leading-tight font-semibold text-black">
            {item.name}
          </div>
          {item.price_dollars != null && (
            <div className="mt-1 text-[15px] text-black/70">${item.price_dollars.toFixed(2)}</div>
          )}
        </div>

        {/* Bottom action bar */}
        <div className="px-5 pb-6">
          <div className="flex items-center gap-4 justify-between bg-black/5 rounded-2xl p-3">
            <button className="w-10 h-10 rounded-xl bg-white shadow flex items-center justify-center" aria-label="Save">♡</button>
            <button className="w-10 h-10 rounded-xl bg-white shadow flex items-center justify-center" aria-label="Share">⇪</button>
            <button className="w-10 h-10 rounded-xl bg-white shadow flex items-center justify-center" aria-label="Collect">▢</button>
            <Link
              href={`/product/${item.id}`}
              className="flex-1 h-10 rounded-xl bg-[#e9d2c2] text-black font-medium grid place-items-center"
            >
              SHOP
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}