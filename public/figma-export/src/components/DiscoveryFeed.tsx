import { motion, useMotionValue, useTransform, AnimatePresence, PanInfo } from 'motion/react';
import { Heart, Share2, Bookmark, ShoppingBag, Sparkles } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface DiscoveryFeedProps {
  onStyleTalkClick: (productId: number) => void;
  onProductClick: (productId: number) => void;
}

const products = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1719518411339-5158cea86caf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwZWRpdG9yaWFsfGVufDF8fHx8MTc2MTA3NzExN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    brand: 'MAISON RIVIERA',
    name: 'Minimal Tailored Blazer',
    price: '$495',
    color: '#D8BFAF',
    textPosition: 'bottom-left',
    textColor: 'white',
    gradientOpacity: 0.45,
    orbPosition: { x: '75%', y: '35%' },
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1643387848945-da63360662f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwZmFzaGlvbiUyMG1vZGVsfGVufDF8fHx8MTc2MTEyMzYxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    brand: 'URBAN ESSENCE',
    name: 'Oversized Street Jacket',
    price: '$325',
    color: '#A8B5C1',
    textPosition: 'bottom-left',
    textColor: 'white',
    gradientOpacity: 0.5,
    orbPosition: { x: '20%', y: '25%' },
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1761001311816-b2a0481e3577?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZmFzaGlvbiUyMHN0dWRpb3xlbnwxfHx8fDE3NjExNjU5NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    brand: 'ATELIER NOIR',
    name: 'Sculptural Dress',
    price: '$680',
    color: '#C8C0B8',
    textPosition: 'bottom-right',
    textColor: 'white',
    gradientOpacity: 0.4,
    orbPosition: { x: '80%', y: '40%' },
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1717944105945-669b3dd77bfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdmFudCUyMGdhcmRlJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjExMDMzODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    brand: 'AVANT COLLECTIVE',
    name: 'Experimental Silhouette',
    price: '$850',
    color: '#B8A89F',
    textPosition: 'bottom-left',
    textColor: 'white',
    gradientOpacity: 0.35,
    orbPosition: { x: '25%', y: '30%' },
  },
];

function AIOrb({ color, position, onTap, isScrolling }: any) {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const orbX = useMotionValue(0);
  const orbY = useMotionValue(0);

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
      style={{
        x: orbX,
        y: orbY,
        position: 'absolute',
        left: position.x,
        top: position.y,
        zIndex: 50,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isScrolling ? 0.7 : 1,
        opacity: isScrolling ? 0.5 : 1,
      }}
      transition={{ 
        delay: 0.6,
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
      onHoverStart={() => {
        setIsHovered(true);
        setTimeout(() => setShowTooltip(true), 100);
      }}
      onHoverEnd={() => {
        setIsHovered(false);
        setShowTooltip(false);
      }}
      onTap={onTap}
      className="cursor-pointer"
    >
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 rounded-full"
            style={{
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(12px)',
              pointerEvents: 'none',
            }}
          >
            <span className="text-white text-xs tracking-wide">Ask FEELFIT…</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breathing Halo */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          width: '64px',
          height: '64px',
          left: '50%',
          top: '50%',
          x: '-50%',
          y: '-50%',
          background: `radial-gradient(circle, ${color}80, transparent)`,
          filter: 'blur(20px)',
        }}
        animate={{
          scale: isHovered ? [1.5, 1.8, 1.5] : [1, 1.3, 1],
          opacity: isHovered ? [0.6, 0.8, 0.6] : [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Core Orb */}
      <motion.div
        className="relative rounded-full flex items-center justify-center"
        style={{
          width: '48px',
          height: '48px',
          background: `radial-gradient(circle, ${color}, ${color}DD)`,
          boxShadow: `0 4px 16px ${color}60, 0 0 24px ${color}40`,
        }}
        animate={{
          scale: isHovered ? 1.5 : 1,
        }}
        transition={{
          duration: 0.3,
          type: 'spring',
          stiffness: 300,
        }}
      >
        <Sparkles 
          className="text-white"
          style={{
            width: '20px',
            height: '20px',
          }}
        />
      </motion.div>
    </motion.div>
  );
}

function ProductCard({ product, index, isScrolling, onSwipeToDetail }: any) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0.3, 1, 0.3]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      onSwipeToDetail(product.id);
    }
  };

  // Adaptive text positioning
  const getTextPositionClasses = () => {
    switch (product.textPosition) {
      case 'bottom-left':
        return 'bottom-32 left-6 right-20 items-start text-left';
      case 'bottom-right':
        return 'bottom-32 left-20 right-6 items-end text-right';
      case 'top-left':
        return 'top-24 left-6 right-20 items-start text-left';
      default:
        return 'bottom-32 left-6 right-20 items-start text-left';
    }
  };

  const textColor = product.textColor === 'white' ? '#FFFFFF' : '#111111';
  const brandColor = product.textColor === 'white' ? '#BCA996' : '#8B7B6F';

  return (
    <motion.div
      ref={cardRef}
      className="h-screen w-full snap-center flex items-center justify-center relative"
      style={{ opacity }}
    >
      {/* Swipeable Card Container */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="relative w-full h-full cursor-grab active:cursor-grabbing"
      >
        {/* Minimal Ivory Frame (4-6% margin) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            margin: '5%',
            borderRadius: '12px',
            background: '#F6F1EB',
            padding: '6px',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.08)',
          }}
        >
          {/* Inner Image Container */}
          <div className="relative w-full h-full overflow-hidden rounded-lg">
            {/* Product Image - Full Frame, Breathing Composition */}
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: index * 0.08, 
                duration: 0.8, 
                ease: [0.33, 1, 0.68, 1] 
              }}
            />

            {/* Adaptive Gradient Mask */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 
                  product.textPosition === 'top-left' || product.textPosition === 'top-right'
                    ? `linear-gradient(to bottom, rgba(0,0,0,${product.gradientOpacity}) 0%, transparent 40%)`
                    : `linear-gradient(to top, rgba(0,0,0,${product.gradientOpacity}) 0%, transparent 50%)`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                delay: index * 0.08 + 0.2, 
                duration: 0.5,
                ease: 'easeInOut',
              }}
            />

            {/* Adaptive Product Info */}
            <motion.div
              className={`absolute flex flex-col z-10 ${getTextPositionClasses()}`}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                delay: index * 0.08 + 0.3, 
                duration: 0.5, 
                ease: [0.33, 1, 0.68, 1] 
              }}
            >
              <p
                className="tracking-[0.25em] mb-2 uppercase"
                style={{ 
                  color: brandColor,
                  fontSize: '11px',
                  fontWeight: 500,
                  fontVariant: 'small-caps',
                }}
              >
                {product.brand}
              </p>
              <h3 
                className="mb-1.5 tracking-wide leading-tight"
                style={{
                  fontSize: '26px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  color: textColor,
                  textShadow: product.textColor === 'white' 
                    ? '0 2px 12px rgba(0,0,0,0.3)' 
                    : '0 2px 12px rgba(255,255,255,0.5)',
                }}
              >
                {product.name}
              </h3>
              <p 
                style={{
                  fontSize: '16px',
                  fontWeight: 400,
                  color: product.textColor === 'white' ? 'rgba(255,255,255,0.75)' : '#666',
                  textShadow: product.textColor === 'white' 
                    ? '0 2px 8px rgba(0,0,0,0.2)' 
                    : '0 2px 8px rgba(255,255,255,0.3)',
                }}
              >
                {product.price}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function DiscoveryFeed({ onStyleTalkClick, onProductClick }: DiscoveryFeedProps) {
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());
  const [savedProducts, setSavedProducts] = useState<Set<number>>(new Set());
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showSwipeTutorial, setShowSwipeTutorial] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // Check if we should show swipe tutorial
  useEffect(() => {
    const tutorialCount = parseInt(localStorage.getItem('feelfit_swipe_tutorial_count') || '0');
    if (tutorialCount < 3) {
      setTimeout(() => {
        setShowSwipeTutorial(true);
      }, 800);
      
      setTimeout(() => {
        setShowSwipeTutorial(false);
        localStorage.setItem('feelfit_swipe_tutorial_count', String(tutorialCount + 1));
      }, 3800);
    }
  }, []);

  const handleLike = () => {
    const productId = products[currentProductIndex].id;
    setLikedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleSave = () => {
    const productId = products[currentProductIndex].id;
    setSavedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleShare = () => {
    alert('Share functionality');
  };

  const handleShopNow = () => {
    alert('Redirecting to brand website...');
  };

  const handleSwipeToDetail = (productId: number) => {
    onProductClick(productId);
  };

  // Handle scroll state
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setIsScrolling(true);
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);

    const scrollPosition = e.currentTarget.scrollTop;
    const index = Math.round(scrollPosition / window.innerHeight);
    setCurrentProductIndex(Math.min(index, products.length - 1));
  };

  const currentProduct = products[currentProductIndex];
  const currentProductId = currentProduct?.id;

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background: '#F6F1EB',
      }}
    >
      {/* FEELFIT Logo - Fades to 40% on Scroll */}
      <motion.div
        className="fixed top-8 left-0 right-0 z-30 flex items-center justify-center pointer-events-none"
        animate={{
          opacity: isScrolling ? 0.4 : 1,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeOut',
        }}
      >
        <h2
          className="text-black tracking-[0.15em]"
          style={{
            fontSize: '20px',
            fontWeight: 500,
          }}
        >
          FEELFIT
        </h2>
      </motion.div>

      {/* Swipe Tutorial Overlay */}
      <AnimatePresence>
        {showSwipeTutorial && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed top-1/2 left-0 right-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div
              className="px-8 py-4 rounded-full"
              style={{
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
              }}
            >
              <p
                className="text-white tracking-wide"
                style={{
                  fontSize: '14px',
                }}
              >
                ← Swipe to explore →
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-Screen Scrollable Feed */}
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto snap-y snap-mandatory scroll-smooth"
        onScroll={handleScroll}
        style={{
          scrollBehavior: 'smooth',
        }}
      >
        {products.map((product, index) => (
          <div key={product.id} className="relative">
            <ProductCard
              product={product}
              index={index}
              isScrolling={isScrolling}
              onSwipeToDetail={handleSwipeToDetail}
            />
            
            {/* AI Orb - Contextually Positioned */}
            {currentProductIndex === index && (
              <AIOrb
                color={product.color}
                position={product.orbPosition}
                onTap={() => onStyleTalkClick(product.id)}
                isScrolling={isScrolling}
              />
            )}
          </div>
        ))}
      </div>

      {/* Floating Interaction Bar - Tactile Calm */}
      <motion.div
        className="fixed left-6 right-6 z-40"
        style={{
          bottom: '18px',
        }}
        animate={{
          opacity: isScrolling ? 0.4 : 1,
          y: isScrolling ? 8 : 0,
        }}
        transition={{
          duration: 0.4,
          ease: [0.33, 1, 0.68, 1],
        }}
      >
        <div
          className="relative w-full px-5 py-3 flex items-center justify-between gap-3"
          style={{
            height: '65px',
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(16px)',
            borderRadius: '22px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06), inset 0 -1px 2px rgba(255, 255, 255, 0.15)',
          }}
        >
          {/* Like */}
          <motion.button
            whileTap={{ scale: 1.1 }}
            onClick={handleLike}
            className="flex items-center justify-center transition-all"
            style={{
              width: '38px',
              height: '38px',
            }}
            transition={{
              duration: 0.12,
              ease: 'easeOut',
            }}
          >
            <Heart
              className={`transition-all ${
                likedProducts.has(currentProductId)
                  ? 'fill-white text-white'
                  : 'text-white'
              }`}
              style={{
                width: '22px',
                height: '22px',
                strokeWidth: 1.5,
                opacity: likedProducts.has(currentProductId) ? 1 : 0.7,
              }}
            />
          </motion.button>

          {/* Share */}
          <motion.button
            whileTap={{ scale: 1.1 }}
            onClick={handleShare}
            className="flex items-center justify-center"
            style={{
              width: '38px',
              height: '38px',
            }}
            transition={{
              duration: 0.12,
              ease: 'easeOut',
            }}
          >
            <Share2
              className="text-white"
              style={{
                width: '22px',
                height: '22px',
                strokeWidth: 1.5,
                opacity: 0.7,
              }}
            />
          </motion.button>

          {/* Save */}
          <motion.button
            whileTap={{ scale: 1.1 }}
            onClick={handleSave}
            className="flex items-center justify-center"
            style={{
              width: '38px',
              height: '38px',
            }}
            transition={{
              duration: 0.12,
              ease: 'easeOut',
            }}
          >
            <Bookmark
              className={`transition-all ${
                savedProducts.has(currentProductId)
                  ? 'fill-white text-white'
                  : 'text-white'
              }`}
              style={{
                width: '22px',
                height: '22px',
                strokeWidth: 1.5,
                opacity: savedProducts.has(currentProductId) ? 1 : 0.7,
              }}
            />
          </motion.button>

          {/* Shop Button - Blush Gold Pill */}
          <motion.button
            onClick={handleShopNow}
            whileTap={{ scale: 0.95, y: 5 }}
            whileHover={{ scale: 1.05 }}
            className="relative px-7 py-3 rounded-full flex items-center gap-2 overflow-hidden"
            style={{
              height: '54px',
              background: 'linear-gradient(135deg, #E8CDBA 0%, #D8BFAF 100%)',
              boxShadow: '0 6px 16px rgba(216, 191, 175, 0.4)',
            }}
            transition={{
              duration: 0.2,
              ease: 'easeOut',
            }}
          >
            {/* Subtle Glow */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6), transparent)',
              }}
            />

            <ShoppingBag 
              className="relative z-10"
              style={{
                width: '19px',
                height: '19px',
                color: '#FFF',
              }}
            />
            <span 
              className="text-white tracking-wider relative z-10"
              style={{ 
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              SHOP
            </span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
