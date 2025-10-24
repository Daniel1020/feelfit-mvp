'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InputOrb({ onSubmit }: { onSubmit: (text: string) => Promise<void> }) {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState('');

  return (
    <>
      <button
        aria-label="AI Input"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-gradient-to-br from-gold1 to-gold2 shadow-glass"
      />
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/35 backdrop-blur-xl flex items-end md:items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 250 }}
              className="w-full max-w-md rounded-2xl bg-white/20 text-white p-5 shadow-glass"
            >
              <div className="text-center text-lg font-semibold">Hi! I’m your style companion</div>
              <div className="text-center opacity-80 mt-1">How does this piece make you feel?</div>
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {['Minimalist','Comfort','Autumn','Versatile','Elegant','Modern'].map(tag => (
                  <button key={tag} onClick={() => setText(prev => (prev ? prev + ' ' : '') + tag)}
                    className="px-3 py-1 rounded-full bg-white/30 hover:bg-white/40">{tag}</button>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type your style…" className="flex-1 rounded-lg px-3 py-2 text-black" />
                <button
                  onClick={async () => { await onSubmit(text || ''); setOpen(false); setText(''); }}
                  className="px-4 py-2 rounded-lg bg-black text-white">Send</button>
              </div>
              <button onClick={() => setOpen(false)} className="mt-3 w-full text-center opacity-80">Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
