// components/InputOrbFab.tsx
'use client';
import * as React from 'react';

export default function InputOrbFab(props: {
  onSubmit: (text: string) => Promise<void> | void;
  productId?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState('');

  async function handleSubmit() {
    const t = text.trim();
    if (!t) return;
    setOpen(false);
    setText('');
    await props.onSubmit(t);
  }

  return (
    <>
      {/* FAB */}
      <button
        aria-label="StyleTalk"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-5 z-40 w-14 h-14 rounded-full bg-black text-white shadow-lg grid place-items-center"
      >
        ✦
      </button>

      {/* Sheet */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setOpen(false)}>
          <div
            className="absolute bottom-0 inset-x-0 bg-white rounded-t-2xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-sm text-neutral-600 mb-2">Ask FeelFit</div>
            <div className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. show me black wool coats under $150"
                className="flex-1 h-12 px-3 rounded-xl border border-neutral-300"
              />
              <button
                onClick={handleSubmit}
                className="h-12 px-4 rounded-xl bg-black text-white"
              >
                Go
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}