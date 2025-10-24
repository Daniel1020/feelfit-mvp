import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { X, Heart, Folder, Share2, ShoppingBag, Sparkles, Mic, Image as ImageIcon, Type } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner@2.0.3';

interface ProductDetailProps {
  productId: number;
  onBack: () => void;
  onProductClick?: (productId: number) => void;
}

const productData: Record<number, any> = {
  1: {
    image: 'https://images.unsplash.com/photo-1719518411339-5158cea86caf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwZWRpdG9yaWFsfGVufDF8fHx8MTc2MTA3NzExN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    brand: 'MAISON RIVIERA',
    name: 'Minimal Tailored Blazer',
    price: '$495',
    description: 'Crafted from premium Italian wool with contemporary oversized silhouette.',
    styleNote: 'Pair it with our Atelier Noir trousers for a complete look.',
    brandTagline: 'Timeless essentials crafted with quiet confidence.',
    color: '#D8BFAF',
    aspectRatio: 'portrait',
  },
  2: {
    image: 'https://images.unsplash.com/photo-1643387848945-da63360662f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwZmFzaGlvbiUyMG1vZGVsfGVufDF8fHx8MTc2MTEyMzYxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    brand: 'URBAN ESSENCE',
    name: 'Oversized Street Jacket',
    price: '$325',
    description: 'Bold street style meets luxury craftsmanship in this statement piece.',
    styleNote: 'Perfect for layering over minimalist basics.',
    brandTagline: 'Contemporary streetwear with luxury DNA.',
    color: '#A8B5C1',
    aspectRatio: 'portrait',
  },
  3: {
    image: 'https://images.unsplash.com/photo-1761001311816-b2a0481e3577?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZmFzaGlvbiUyMHN0dWRpb3xlbnwxfHx8fDE3NjExNjU5NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    brand: 'ATELIER NOIR',
    name: 'Sculptural Dress',
    price: '$680',
    description: 'An architectural masterpiece blending minimalist aesthetics with draping.',
    styleNote: 'A statement piece that needs no accessories.',
    brandTagline: 'Where architecture meets fashion.',
    color: '#C8C0B8',
    aspectRatio: 'portrait',
  },
  4: {
    image: 'https://images.unsplash.com/photo-1717944105945-669b3dd77bfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdmFudCUyMGdhcmRlJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjExMDMzODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    brand: 'AVANT COLLECTIVE',
    name: 'Experimental Silhouette',
    price: '$850',
    description: 'Pushing boundaries with deconstructed forms and unexpected volumes.',
    styleNote: 'For the bold and fearless fashion explorer.',
    brandTagline: 'Redefining fashion\'s future.',
    color: '#B8A89F',
    aspectRatio: 'square',
  },
  5: {
    image: 'https://images.unsplash.com/photo-1587971731870-f8199bc8fc32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZmFzaGlvbiUyMGNvYXR8ZW58MXx8fHwxNzYxMTY2MDk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    brand: 'NORDIC STUDIO',
    name: 'Wool Overcoat',
    price: '$525',
    description: 'A timeless wool overcoat with clean lines and sophisticated tailoring.',
    styleNote: 'Essential layering piece for any wardrobe.',
    brandTagline: 'Scandinavian minimalism meets warmth.',
    color: '#C8C0B8',
    aspectRatio: 'portrait',
  },
  6: {
    image: 'https://images.unsplash.com/photo-1758171692659-024183c2c272?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGhhbmRiYWclMjBsdXh1cnl8ZW58MXx8fHwxNzYxMDc5OTQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    brand: 'MAISON NOIR',
    name: 'Leather Tote',
    price: '$385',
    description: 'Premium leather tote with minimalist design and exceptional craftsmanship.',
    styleNote: 'The everyday luxury you deserve.',
    brandTagline: 'French elegance in every detail.',
    color: '#8B7D6B',
    aspectRatio: 'landscape',
  },
  7: {
    image: 'https://images.unsplash.com/photo-1759542890353-35f5568c1c90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc25lYWtlcnMlMjB3aGl0ZXxlbnwxfHx8fDE3NjEwNzc0Njl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    brand: 'URBAN LUXE',
    name: 'Classic Sneakers',
    price: '$195',
    description: 'Versatile white sneakers combining comfort with refined aesthetics.',
    styleNote: 'From street to chic in one step.',
    brandTagline: 'Luxury comfort for everyday.',
    color: '#E8E4E1',
    aspectRatio: 'landscape',
  },
  8: {
    image: 'https://images.unsplash.com/photo-1742631193849-acc045ea5890?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMGVsZWdhbnR8ZW58MXx8fHwxNzYxMTY2MDk4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    brand: 'CHRONO ELITE',
    name: 'Minimalist Watch',
    price: '$650',
    description: 'Elegant timepiece with clean dial and Swiss movement.',
    styleNote: 'Time becomes art on your wrist.',
    brandTagline: 'Precision meets elegance.',
    color: '#B8A89F',
    aspectRatio: 'square',
  },
  9: {
    image: 'https://images.unsplash.com/photo-1677847208228-fe3c52feb441?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXNobWVyZSUyMHN3ZWF0ZXIlMjBtaW5pbWFsfGVufDF8fHx8MTc2MTE2NjA5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    brand: 'PURE CASHMERE',
    name: 'Ribbed Sweater',
    price: '$295',
    description: 'Luxuriously soft cashmere sweater with ribbed texture.',
    styleNote: 'Wrap yourself in cloud-like comfort.',
    brandTagline: 'Pure indulgence, pure cashmere.',
    color: '#D4C5B9',
    aspectRatio: 'portrait',
  },
  10: {
    image: 'https://images.unsplash.com/photo-1760446031507-ed534e0f9605?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHN1bmdsYXNzZXMlMjBmYXNoaW9ufGVufDF8fHx8MTc2MTEyOTEyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    brand: 'VISION ATELIER',
    name: 'Aviator Sunglasses',
    price: '$245',
    description: 'Classic aviator design with modern materials and UV protection.',
    styleNote: 'See the world through style.',
    brandTagline: 'Vision refined.',
    color: '#8B7D6B',
    aspectRatio: 'landscape',
  },
};

// Brand collections
const brandCollections: Record<string, number[]> = {
  'MAISON RIVIERA': [1, 5, 6, 9],
  'URBAN ESSENCE': [2, 7],
  'ATELIER NOIR': [3],
  'AVANT COLLECTIVE': [4, 8],
  'NORDIC STUDIO': [5],
  'MAISON NOIR': [6],
  'URBAN LUXE': [7],
  'CHRONO ELITE': [8],
  'PURE CASHMERE': [9],
  'VISION ATELIER': [10],
};

const emotionTags = ['Minimalist', 'Comfort', 'Autumn', 'Versatile', 'Elegant', 'Modern'];

// AI Companion Overlay - Emotional Companion Mode (v15: Unified Emotion Flow)
function AICompanionOverlay({ 
  isOpen, 
  onClose, 
  color 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  color: string;
}) {
  const [isListening, setIsListening] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (selectedTags.length > 0) {
      toast('Style preferences updated', {
        description: `Finding items that match: ${selectedTags.join(', ')}`,
      });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Full-screen Gaussian Blur Backdrop */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(25px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{
              background: 'rgba(0, 0, 0, 0.35)',
            }}
          />

          {/* AI Companion Content - Centered Layout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center px-8 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-md">
              {/* Close Button */}
              <motion.button
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute top-8 right-8 w-11 h-11 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>

              {/* FEELFIT Icon Header - Morphed from Orb */}
              <motion.div
                className="flex items-center justify-center mb-8"
                initial={{ scale: 0.3, y: 200 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
              >
                <motion.div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${color}FF, ${color}CC)`,
                    boxShadow: `0 8px 32px ${color}60, inset 0 1px 6px rgba(255, 255, 255, 0.3)`,
                  }}
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Sparkles className="w-10 h-10 text-white" style={{ opacity: 0.85 }} />
                </motion.div>
              </motion.div>

              {/* Primary Greeting - Sequential Reveal */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3, ease: 'easeOut' }}
                className="text-center mb-3"
                style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  color: '#FFF',
                  lineHeight: '1.3',
                }}
              >
                Hi! I'm your personal style companion.
              </motion.h2>

              {/* Secondary Prompt */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3, ease: 'easeOut' }}
                className="text-center mb-8"
                style={{
                  fontSize: '18px',
                  color: 'rgba(255, 255, 255, 0.85)',
                  lineHeight: '1.5',
                }}
              >
                How does this piece make you feel?
              </motion.p>

              {/* Emotion Tags - Pill Buttons with Hover Glow */}
              <motion.div
                className="flex flex-wrap justify-center gap-3 mb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {emotionTags.map((tag, index) => (
                  <motion.button
                    key={tag}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.5 + index * 0.12,
                      duration: 0.4,
                      ease: [0.33, 1, 0.68, 1],
                    }}
                    onClick={() => handleTagToggle(tag)}
                    className="px-6 py-3 rounded-full transition-all"
                    style={{
                      background: selectedTags.includes(tag)
                        ? '#F5F2ED'
                        : 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(12px)',
                      color: selectedTags.includes(tag) ? '#222' : '#EDEDED',
                      fontSize: '15px',
                      fontWeight: 500,
                      border: selectedTags.includes(tag)
                        ? 'none'
                        : '1px solid rgba(255, 255, 255, 0.25)',
                      boxShadow: selectedTags.includes(tag)
                        ? '0 4px 16px rgba(255, 255, 255, 0.2)'
                        : 'none',
                    }}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: selectedTags.includes(tag)
                        ? '0 6px 24px rgba(255, 255, 255, 0.3)'
                        : '0 4px 16px rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    {tag}
                  </motion.button>
                ))}
              </motion.div>

              {/* Input Options - Frosted Glass 3-Button Stack */}
              <motion.div
                className="flex flex-col gap-3"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
              >
                {/* Voice Input - Hold to Speak */}
                <motion.button
                  onMouseDown={() => setIsListening(true)}
                  onMouseUp={() => setIsListening(false)}
                  onTouchStart={() => setIsListening(true)}
                  onTouchEnd={() => setIsListening(false)}
                  className="w-full py-5 rounded-3xl flex items-center justify-center gap-3"
                  style={{
                    background: isListening
                      ? `linear-gradient(135deg, ${color}FF, ${color}DD)`
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15))',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: isListening
                      ? `0 8px 32px ${color}60, inset 0 1px 4px rgba(255, 255, 255, 0.3)`
                      : '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  animate={isListening ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ duration: 0.6, repeat: isListening ? Infinity : 0 }}
                >
                  <motion.div
                    animate={isListening ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.6, repeat: isListening ? Infinity : 0 }}
                  >
                    <Mic className="w-6 h-6 text-white" />
                  </motion.div>
                  <span style={{ fontSize: '16px', fontWeight: 600, color: '#FFF' }}>
                    {isListening ? 'Listening...' : 'Hold to speak'}
                  </span>
                </motion.button>

                {/* Image Upload */}
                <motion.button
                  onClick={() => {
                    toast('Image Input', { description: 'Upload or take a photo to find similar styles.' });
                    onClose();
                  }}
                  className="w-full py-4 rounded-3xl flex items-center justify-center gap-3"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  whileHover={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15))',
                  }}
                >
                  <ImageIcon className="w-5 h-5 text-white" />
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#FFF' }}>
                    Upload Image
                  </span>
                </motion.button>

                {/* Type Description */}
                <motion.button
                  onClick={() => {
                    toast('Text Input', { description: 'Type what you\'re looking for.' });
                    onClose();
                  }}
                  className="w-full py-4 rounded-3xl flex items-center justify-center gap-3"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  whileHover={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15))',
                  }}
                >
                  <Type className="w-5 h-5 text-white" />
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#FFF' }}>
                    Type Description
                  </span>
                </motion.button>
              </motion.div>

              {/* Submit Button (if tags selected) */}
              {selectedTags.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleSubmit}
                  className="w-full mt-6 py-4 rounded-full"
                  style={{
                    background: '#FFF',
                    color: '#111',
                    fontSize: '16px',
                    fontWeight: 600,
                    boxShadow: '0 8px 24px rgba(255, 255, 255, 0.3)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  whileHover={{
                    boxShadow: '0 12px 32px rgba(255, 255, 255, 0.4)',
                  }}
                >
                  Find Similar Styles
                </motion.button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// AI Orb
function AIOrb({ 
  color, 
  onTap 
}: { 
  color: string; 
  onTap: () => void;
}) {
  const [driftX, setDriftX] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDriftX(Math.sin(Date.now() / 1000) * 12);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed z-40"
      style={{
        bottom: '24px',
        right: '24px',
      }}
      animate={{ x: driftX }}
      transition={{ duration: 0.05 }}
    >
      {/* Orb Core */}
      <motion.div
        onClick={onTap}
        className="relative cursor-pointer rounded-full flex items-center justify-center"
        style={{
          width: '64px',
          height: '64px',
          background: `radial-gradient(circle at 30% 30%, ${color}FF, ${color}CC)`,
          boxShadow: `0 8px 32px ${color}60, inset 0 1px 4px rgba(255,255,255,0.3)`,
        }}
        whileTap={{ scale: 0.9 }}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          scale: {
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
      >
        {/* Breathing Halo */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${color}60, transparent)`,
            filter: 'blur(20px)',
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.6, 0.9, 0.6],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <Sparkles className="w-7 h-7 text-white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
      </motion.div>
    </motion.div>
  );
}

// Collect Modal
function CollectModal({ isOpen, onClose, productName }: { isOpen: boolean; onClose: () => void; productName: string }) {
  const collections = ['My Closet', 'Summer Essentials', 'Work Wardrobe', 'Favorites'];

  const handleSelect = (collection: string) => {
    toast(`Added to ${collection}`, {
      description: `${productName} has been saved.`,
    });
    setTimeout(() => onClose(), 800);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50"
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(40px)',
        }}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.9 }}
        transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[85%] max-w-[480px] rounded-3xl p-8"
        style={{
          background: '#F5F2ED',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
      >
        <h3 className="mb-2" style={{ fontSize: '24px', fontWeight: 600, color: '#111' }}>
          Add to Collection
        </h3>
        <p className="mb-6" style={{ fontSize: '14px', color: '#666' }}>
          Choose where to save this item
        </p>

        <div className="space-y-3">
          {collections.map((collection) => (
            <motion.button
              key={collection}
              onClick={() => handleSelect(collection)}
              className="w-full text-left px-5 py-4 rounded-2xl transition-all"
              style={{
                background: 'rgba(255, 255, 255, 0.5)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <span style={{ fontSize: '16px', fontWeight: 500, color: '#111' }}>
                  {collection}
                </span>
                <Folder className="w-5 h-5" style={{ color: '#666' }} />
              </div>
            </motion.button>
          ))}
        </div>

        <motion.button
          onClick={onClose}
          className="w-full mt-6 py-4 rounded-full"
          style={{
            background: 'rgba(0, 0, 0, 0.05)',
            fontSize: '16px',
            fontWeight: 500,
            color: '#666',
          }}
          whileTap={{ scale: 0.98 }}
        >
          Cancel
        </motion.button>
      </motion.div>
    </>
  );
}

export function ProductDetail({ productId, onBack, onProductClick }: ProductDetailProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(productId);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [showAICompanion, setShowAICompanion] = useState(false);
  const [selectedMoreProduct, setSelectedMoreProduct] = useState<number | null>(null);
  const [viewportHeight, setViewportHeight] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scrollRef });
  
  // Parallax and opacity effects
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0.6]);
  
  const product = productData[currentProductId];

  // Get viewport height
  useEffect(() => {
    const updateHeight = () => setViewportHeight(window.innerHeight);
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Get brand products (excluding current)
  const brandProducts = product
    ? brandCollections[product.brand]
        ?.filter(id => id !== currentProductId)
        .slice(0, 8)
        .map(id => ({ ...productData[id], id }))
        .filter(item => item && item.image) || []
    : [];

  // Entry grid: first 2 products
  const entryProducts = brandProducts.slice(0, 2);
  // Scroll grid: remaining products
  const scrollProducts = brandProducts.slice(2);

  // Smart hero height calculation
  // Estimate: header (80px) + hero (X) + section title (60px) + 2 cards (aspect 1:1.1) + text (80px) + padding (60px)
  // Total needed for 2 cards: ~280px per card = 560px + 280px overhead = 840px
  // Available for hero = viewportHeight - 840px
  const calculateSmartHeroHeight = (): string => {
    if (!viewportHeight) return '68vh'; // Default
    
    const overhead = 840; // Space needed for title + 2 complete cards with text
    const availableForHero = viewportHeight - overhead;
    
    // Convert to vh
    const heroVh = (availableForHero / viewportHeight) * 100;
    
    // Clamp between 50vh and 75vh
    const clampedVh = Math.max(50, Math.min(75, heroVh));
    
    return `${clampedVh}vh`;
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    if (!isSaved) {
      toast('Saved to Closet', {
        description: 'You can find this item in your saved collection.',
      });
    }
  };

  const handleCollect = () => {
    setShowCollectModal(true);
  };

  const handleShare = async () => {
    const shareUrl = `https://feelfit.app/product/${currentProductId}`;
    
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        toast('Link Copied', {
          description: 'Product link has been copied to clipboard.',
        });
      } else {
        toast('Share Link', {
          description: shareUrl,
        });
      }
    } catch (error) {
      toast('Share Link', {
        description: shareUrl,
      });
    }
  };

  const handleShopNow = () => {
    const targetProduct = selectedMoreProduct ? productData[selectedMoreProduct] : product;
    toast('Opening brand website...', {
      description: `Connecting you to ${targetProduct.brand}`,
    });
    setTimeout(() => {
      alert(`Redirecting to ${targetProduct.brand} website...`);
    }, 500);
  };

  const handleMoreProductTap = (productId: number) => {
    setSelectedMoreProduct(productId);
    setIsSaved(false);
    // Scroll to top smoothly
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!product) {
    return (
      <div className="relative h-full w-full flex items-center justify-center" style={{ background: '#F5F2ED' }}>
        <p style={{ color: '#666' }}>Product not found</p>
      </div>
    );
  }

  const displayProduct = selectedMoreProduct ? productData[selectedMoreProduct] : product;
  const heroHeight = selectedMoreProduct ? '68vh' : calculateSmartHeroHeight();

  return (
    <motion.div
      className="relative h-full w-full overflow-hidden"
      style={{ background: '#F5F2ED' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Background Dim when product is selected */}
      {selectedMoreProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          className="fixed inset-0 bg-black pointer-events-none z-10"
        />
      )}

      {/* Close Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        onClick={onBack}
        className="fixed top-4 left-4 z-50 w-11 h-11 rounded-full flex items-center justify-center"
        style={{
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(12px)',
        }}
        whileTap={{ scale: 0.9 }}
      >
        <X className="w-5 h-5 text-white" />
      </motion.button>

      {/* AI Orb */}
      <AIOrb
        color={displayProduct.color}
        onTap={() => setShowAICompanion(true)}
      />

      {/* AI Companion Overlay */}
      <AICompanionOverlay
        isOpen={showAICompanion}
        onClose={() => setShowAICompanion(false)}
        color={displayProduct.color}
      />

      {/* Scrollable Content */}
      <div ref={scrollRef} className="h-full overflow-y-auto pb-48" style={{ scrollBehavior: 'smooth' }}>
        {/* A. SMART ADAPTIVE HERO FRAME */}
        <motion.div
          className="relative mx-auto overflow-hidden"
          style={{
            width: '88%',
            height: heroHeight,
            borderRadius: '16px',
            marginTop: selectedMoreProduct ? '100px' : '80px',
            marginBottom: '28px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            opacity: heroOpacity,
          }}
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
        >
          {/* Dynamic Aspect Mask - Gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.1) 100%)',
              borderRadius: '16px',
            }}
          />

          <motion.img
            key={displayProduct.id}
            src={displayProduct.image}
            alt={displayProduct.name}
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{ borderRadius: '16px' }}
          />
        </motion.div>

        {/* Product Info (Only when selectedMoreProduct is active) */}
        {selectedMoreProduct && (
          <motion.div
            className="px-10 pb-6 relative z-20"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4, staggerChildren: 0.1 }}
          >
            <motion.p
              className="tracking-[0.2em] mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              style={{
                fontSize: '11px',
                fontWeight: 500,
                textTransform: 'uppercase',
                color: '#BCA996',
                letterSpacing: '0.2em',
              }}
            >
              {displayProduct.brand}
            </motion.p>
            <motion.h2
              className="mb-2 tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                fontSize: '32px',
                fontWeight: 700,
                color: '#111',
                lineHeight: '1.1',
              }}
            >
              {displayProduct.name}
            </motion.h2>
            <motion.p
              className="mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                fontSize: '24px',
                fontWeight: 500,
                color: '#333',
              }}
            >
              {displayProduct.price}
            </motion.p>
          </motion.div>
        )}

        {/* B. "MORE FROM THIS BRAND" SECTION - Entry Grid (Two Complete Cards) */}
        {entryProducts.length > 0 && !selectedMoreProduct && (
          <motion.div
            className="px-10 pb-8 relative z-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {/* Subtle Divider Line */}
            <div
              className="w-full h-px mb-6"
              style={{
                background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.1), transparent)',
              }}
            />

            <p
              className="mb-5 tracking-[0.15em]"
              style={{
                fontSize: '11px',
                fontWeight: 500,
                textTransform: 'uppercase',
                color: '#BCA996',
                letterSpacing: '0.2em',
              }}
            >
              More from {product.brand}
            </p>

            <div className="grid grid-cols-2 gap-4">
              {entryProducts.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.6 + index * 0.2,
                    duration: 0.4,
                  }}
                  onClick={() => handleMoreProductTap(item.id)}
                  className="cursor-pointer group"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className="relative overflow-hidden mb-3"
                    style={{
                      aspectRatio: '1/1.1',
                      borderRadius: '12px',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                      background: `linear-gradient(135deg, ${product.color}08, transparent)`,
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      style={{ borderRadius: '12px' }}
                    />
                    {/* Hover Overlay */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
                        borderRadius: '12px',
                      }}
                    />
                  </div>
                  {/* Product Name + Price */}
                  <p
                    className="mb-1"
                    style={{
                      fontSize: '13px',
                      color: '#111',
                      fontWeight: 500,
                      lineHeight: '1.3',
                    }}
                  >
                    {item.name}
                  </p>
                  <p
                    style={{
                      fontSize: '14px',
                      color: '#333',
                      fontWeight: 400,
                    }}
                  >
                    {item.price}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* C. SCROLL GRID - Full Brand Discovery */}
        {scrollProducts.length > 0 && !selectedMoreProduct && (
          <motion.div
            className="px-10 py-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="grid grid-cols-2 gap-4">
              {scrollProducts.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 1.0 + index * 0.1,
                    duration: 0.4,
                    ease: 'easeOut',
                  }}
                  onClick={() => handleMoreProductTap(item.id)}
                  className="cursor-pointer group"
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className="relative overflow-hidden mb-3"
                    style={{
                      aspectRatio: '1/1.1',
                      borderRadius: '12px',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                      background: `linear-gradient(135deg, ${product.color}10, transparent)`,
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      style={{ borderRadius: '12px' }}
                    />
                    {/* Hover Glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                      style={{
                        background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                        borderRadius: '12px',
                      }}
                    />
                  </div>
                  {/* Product Name + Price */}
                  <p
                    className="mb-1"
                    style={{
                      fontSize: '13px',
                      color: '#111',
                      fontWeight: 500,
                      lineHeight: '1.3',
                    }}
                  >
                    {item.name}
                  </p>
                  <p
                    style={{
                      fontSize: '14px',
                      color: '#333',
                      fontWeight: 400,
                    }}
                  >
                    {item.price}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* New Grid for selected product context */}
        {selectedMoreProduct && brandProducts.length > 0 && (
          <motion.div
            className="px-10 py-8 relative z-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p
              className="mb-5 tracking-[0.15em]"
              style={{
                fontSize: '11px',
                fontWeight: 500,
                textTransform: 'uppercase',
                color: '#BCA996',
                letterSpacing: '0.2em',
              }}
            >
              More from {displayProduct.brand}
            </p>

            <div className="grid grid-cols-2 gap-4">
              {brandProducts.slice(0, 6).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.6 + index * 0.1,
                    duration: 0.4,
                    ease: 'easeOut',
                  }}
                  onClick={() => handleMoreProductTap(item.id)}
                  className="cursor-pointer group"
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className="relative overflow-hidden mb-3"
                    style={{
                      aspectRatio: '1/1.1',
                      borderRadius: '12px',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                      background: `linear-gradient(135deg, ${displayProduct.color}10, transparent)`,
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      style={{ borderRadius: '12px' }}
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                      style={{
                        background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                        borderRadius: '12px',
                      }}
                    />
                  </div>
                  <p
                    className="mb-1"
                    style={{
                      fontSize: '13px',
                      color: '#111',
                      fontWeight: 500,
                      lineHeight: '1.3',
                    }}
                  >
                    {item.name}
                  </p>
                  <p
                    style={{
                      fontSize: '14px',
                      color: '#333',
                      fontWeight: 400,
                    }}
                  >
                    {item.price}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* D. FOOTER INTERACTION BAR - Floating Minimalism (Only shows after tapping more product) */}
      {selectedMoreProduct && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-40 px-8 pb-8 pt-4"
          style={{
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(12px)',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            boxShadow: '0 -1px 6px rgba(0, 0, 0, 0.15)',
          }}
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
        >
          {/* Icon Actions */}
          <div className="flex items-center justify-center gap-6 mb-4">
            {/* Save */}
            <motion.button
              onClick={handleSave}
              className="flex flex-col items-center"
              whileTap={{ scale: 0.9 }}
              animate={isSaved ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.15 }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center mb-1"
                style={{
                  background: isSaved ? `${displayProduct.color}40` : 'transparent',
                }}
              >
                <Heart
                  className={`w-6 h-6 transition-all ${isSaved ? 'fill-current' : ''}`}
                  style={{ color: isSaved ? displayProduct.color : '#111' }}
                />
              </div>
            </motion.button>

            {/* Collect */}
            <motion.button
              onClick={handleCollect}
              className="flex flex-col items-center"
              whileTap={{ scale: 0.9 }}
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center mb-1">
                <Folder className="w-6 h-6" style={{ color: '#111' }} />
              </div>
            </motion.button>

            {/* Share */}
            <motion.button
              onClick={handleShare}
              className="flex flex-col items-center"
              whileTap={{ scale: 0.9 }}
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center mb-1">
                <Share2 className="w-6 h-6" style={{ color: '#111' }} />
              </div>
            </motion.button>
          </div>

          {/* Shop Now CTA */}
          <motion.button
            onClick={handleShopNow}
            className="w-full flex items-center justify-center gap-3 rounded-full"
            style={{
              height: '64px',
              background: '#000',
              color: '#F5F2ED',
              fontSize: '18px',
              fontWeight: 600,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
            whileHover={{
              boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4)',
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <ShoppingBag className="w-6 h-6" />
            <span>Shop Now</span>
          </motion.button>
        </motion.div>
      )}

      {/* Collect Modal */}
      <CollectModal
        isOpen={showCollectModal}
        onClose={() => setShowCollectModal(false)}
        productName={displayProduct.name}
      />
    </motion.div>
  );
}
