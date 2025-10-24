import React from 'react';

type Props = {
  imageUrl: string | null;
  brand: string;
  name: string;
  priceCents: number | null;
  onShop: () => void;
  onSave: () => void;
  onCollect: () => void;
  onShare: () => void;
  onOpenInput: () => void;
};

export default function FigmaProductShell({
  imageUrl, brand, name, priceCents,
  onShop, onSave, onCollect, onShare, onOpenInput
}: Props) {
  return (
    <div className="min-h-screen bg-[#F5F1EC]">
      {/* HERO */}
      <div className="mx-auto max-w-[420px] p-4">
        <div className="rounded-2xl overflow-hidden shadow">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-full h-auto object-cover" />
          ) : (
            <div className="w-full h-[360px] bg-neutral-200" />
          )}
        </div>
      </div>

      {/* TEXT */}
      <div className="mx-auto max-w-[420px] px-6">
        <div className="text-[12px] tracking-[0.2em] text-neutral-500 mt-3">{brand}</div>
        <h1 className="text-[28px] font-semibold leading-tight mt-1">{name}</h1>
        {typeof priceCents === 'number' && (
          <div className="text-[18px] text-neutral-700 mt-1">${(priceCents/100).toFixed(2)}</div>
        )}
      </div>

      {/* ACTION BAR */}
      <div className="fixed left-0 right-0 bottom-0">
        <div className="mx-auto w-full max-w-[480px] px-4 pb-[env(safe-area-inset-bottom)]">
          <div className="rounded-2xl bg-white/80 backdrop-blur shadow-lg p-3 flex items-center gap-3">
            <button onClick={onSave} className="flex-1 h-12 rounded-xl bg-neutral-100 flex items-center justify-center">Save</button>
            <button onClick={onCollect} className="flex-1 h-12 rounded-xl bg-neutral-100 flex items-center justify-center">Collect</button>
            <button onClick={onShare} className="flex-1 h-12 rounded-xl bg-neutral-100 flex items-center justify-center">Share</button>
          </div>
          <button onClick={onShop} className="mt-3 w-full h-14 rounded-2xl bg-black text-white font-semibold">
            Shop Now
          </button>
        </div>

        {/* Floating Input trigger */}
        <button
          onClick={onOpenInput}
          className="absolute right-6 -top-8 w-12 h-12 rounded-full bg-black text-white grid place-items-center shadow-lg"
          aria-label="Open style input"
        >✦</button>
      </div>
    </div>
  );
}