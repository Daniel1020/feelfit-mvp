'use client';
import { motion } from 'framer-motion';
export default function DecisionBar({ onShop }: { onShop: () => void }) {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
      className="fixed bottom-4 left-0 right-0 mx-auto w-[92%] max-w-md h-16 rounded-2xl bg-white/30 backdrop-blur-md shadow-glass flex items-center justify-evenly z-40">
      {/* Icons only (star/folder/share/bag) */}
      <button aria-label="Save" className="w-9 h-9 rounded-full bg-white/50">★</button>
      <button aria-label="Collect" className="w-9 h-9 rounded-full bg-white/50">📁</button>
      <button aria-label="Share" className="w-9 h-9 rounded-full bg-white/50">🔗</button>
      <button aria-label="Shop" className="px-4 h-10 rounded-full bg-black text-white" onClick={onShop}>Shop</button>
    </motion.div>
  );
}
