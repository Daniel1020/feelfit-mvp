'use client';

import React from 'react';
import { useState } from 'react';

type Props = {
  onSubmit: (text: string) => Promise<void>;
  onClose?: () => void; // optional close button
};

export default function InputOrb({ onSubmit, onClose }: Props) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="relative w-full bg-white rounded-t-2xl shadow-lg p-5">
      {/* Optional close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-4 top-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
          aria-label="Close"
        >
          ×
        </button>
      )}

      {/* Title / hint */}
      <div className="text-center text-sm text-gray-500 mb-2">
        ✦ Style Talk — Describe your style, image, or mood
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. show me soft minimal streetwear"
          className="flex-1 rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          disabled={loading}
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-black text-white text-sm font-semibold disabled:opacity-60"
          disabled={loading}
        >
          {loading ? '…' : 'Send'}
        </button>
      </form>

      {/* Voice / camera input buttons — placeholders for future AI modes */}
      <div className="flex justify-center gap-6 mt-3">
        <button
          type="button"
          className="text-gray-500 hover:text-black text-xs flex flex-col items-center"
          onClick={() => alert('Voice input coming soon')}
        >
          🎙️
          <span className="mt-1">Voice</span>
        </button>
        <button
          type="button"
          className="text-gray-500 hover:text-black text-xs flex flex-col items-center"
          onClick={() => alert('Image input coming soon')}
        >
          📸
          <span className="mt-1">Image</span>
        </button>
      </div>
    </div>
  );
}