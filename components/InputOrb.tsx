'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

type Props = {
  onSubmit: (text: string) => Promise<void>;
  onClose?: () => void;          // optional
  autoFocus?: boolean;           // optional
};

const EASE = [0.2, 0, 0, 1];     // crisp, premium
const DURATION = 0.28;           // 280ms

export default function InputOrb({ onSubmit, onClose, autoFocus = true }: Props) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    try {
      await onSubmit(input.trim());
      setInput('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      className="relative w-full bg-white rounded-t-2xl shadow-2xl p-5"
      initial={{ y: 32, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { duration: DURATION, ease: EASE } }}
      exit={{ y: 28, opacity: 0, transition: { duration: 0.2, ease: EASE } }}
    >
      {/* Grab-handle */}
      <div className="absolute left-1/2 -top-2 h-1.5 w-16 -translate-x-1/2 rounded-full bg-black/15" />

      {/* Optional close */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-4 top-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 text-gray-600 hover:bg-black/10"
          aria-label="Close"
        >
          ×
        </button>
      )}

      {/* Hint */}
      <div className="text-center text-sm text-gray-500 mb-3">
        ✦ Style Talk — describe your style, image, or mood
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. show me soft minimal streetwear"
          className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          disabled={loading}
        />
        <button
          type="submit"
          className="px-4 h-11 rounded-xl bg-black text-white text-sm font-semibold disabled:opacity-60"
          disabled={loading}
        >
          {loading ? '…' : 'Send'}
        </button>
      </form>

      {/* Quick modes (mock) */}
      <div className="flex justify-center gap-8 mt-4 text-gray-500">
        <button
          type="button"
          className="text-xs hover:text-black"
          onClick={() => alert('Voice input coming soon')}
        >
          🎙️ Voice
        </button>
        <button
          type="button"
          className="text-xs hover:text-black"
          onClick={() => alert('Image input coming soon')}
        >
          📸 Image
        </button>
      </div>
    </motion.div>
  );
}