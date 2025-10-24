'use client';
import Image from 'next/image';

export default function MoreGrid({
  items,
  onPick,
}: {
  items: { id: string; name: string; price_cents: number | null; image_url: string }[];
  onPick: (it: any) => void;
}) {
  if (!items?.length) return null;
  return (
    <section className="mt-6 pb-24">
      <div className="grid grid-cols-2 gap-3">
        {items.map((it) => (
          <button key={it.id} onClick={() => onPick(it)} className="text-left">
            <div className="w-full overflow-hidden rounded-lg bg-[#eee]">
              <Image
                src={it.image_url}         // ⬅️ 外部 URL
                alt={it.name}
                width={720}
                height={900}
                className="w-full h-[200px] object-cover"
              />
            </div>
            <div className="mt-2 text-sm">{it.name}</div>
            <div className="text-sm text-neutral-600">
              {it.price_cents != null ? `$${(it.price_cents / 100).toFixed(2)}` : ''}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
