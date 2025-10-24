import { motion } from 'motion/react';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

interface RecommendationGridProps {
  onBack: () => void;
  onBackToDiscovery: () => void;
  onProductClick: (productId: number) => void;
}

const recommendations = [
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1587971731870-f8199bc8fc32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZmFzaGlvbiUyMGNvYXR8ZW58MXx8fHwxNzYxMTY2MDk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    brand: 'NORDIC STUDIO',
    name: 'Wool Overcoat',
    price: '$525',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1758171692659-024183c2c272?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGhhbmRiYWclMjBsdXh1cnl8ZW58MXx8fHwxNzYxMDc5OTQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    brand: 'MAISON NOIR',
    name: 'Leather Tote',
    price: '$385',
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1759542890353-35f5568c1c90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc25lYWtlcnMlMjB3aGl0ZXxlbnwxfHx8fDE3NjEwNzc0Njl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    brand: 'URBAN LUXE',
    name: 'Classic Sneakers',
    price: '$195',
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1742631193849-acc045ea5890?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMGVsZWdhbnR8ZW58MXx8fHwxNzYxMTY2MDk4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    brand: 'CHRONO ELITE',
    name: 'Minimalist Watch',
    price: '$650',
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1677847208228-fe3c52feb441?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXNobWVyZSUyMHN3ZWF0ZXIlMjBtaW5pbWFsfGVufDF8fHx8MTc2MTE2NjA5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    brand: 'PURE CASHMERE',
    name: 'Ribbed Sweater',
    price: '$295',
  },
  {
    id: 10,
    image: 'https://images.unsplash.com/photo-1760446031507-ed534e0f9605?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHN1bmdsYXNzZXMlMjBmYXNoaW9ufGVufDF8fHx8MTc2MTEyOTEyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    brand: 'VISION ATELIER',
    name: 'Aviator Sunglasses',
    price: '$245',
  },
];

export function RecommendationGrid({
  onBack,
  onBackToDiscovery,
  onProductClick,
}: RecommendationGridProps) {
  return (
    <div className="relative h-full w-full bg-[#F6F1EB] overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-[#F6F1EB] px-6 py-6 border-b border-black/5">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-10 w-10 text-black hover:bg-black/5"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-black tracking-[0.1em]">SIMILAR STYLES</h2>
            <p className="text-black/50 text-xs tracking-wider">Curated for you</p>
          </div>
        </div>
      </div>

      {/* Scrollable Grid */}
      <div className="h-full overflow-y-auto pt-24 pb-32 px-6">
        {/* More from this brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h3 className="text-black/60 tracking-[0.15em] mb-4 text-xs">
            MORE FROM THIS BRAND
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {recommendations.slice(0, 2).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onProductClick(item.id)}
                className="cursor-pointer group"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-3 shadow-lg shadow-black/10">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <p className="text-[#D8BFAF] tracking-[0.15em] mb-1 text-xs">
                  {item.brand}
                </p>
                <h4 className="text-black mb-1 text-sm">{item.name}</h4>
                <p className="text-black">{item.price}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Similar Styles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-black/60 tracking-[0.15em] mb-4 text-xs">
            YOU MIGHT ALSO LIKE
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {recommendations.slice(2).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                onClick={() => onProductClick(item.id)}
                className="cursor-pointer group"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-3 shadow-lg shadow-black/10">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <p className="text-[#D8BFAF] tracking-[0.15em] mb-1 text-xs">
                  {item.brand}
                </p>
                <h4 className="text-black mb-1 text-sm">{item.name}</h4>
                <p className="text-black">{item.price}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Back to Discovery Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Button
            onClick={onBackToDiscovery}
            variant="outline"
            className="w-full h-14 border-black/20 text-black hover:bg-white rounded-full transition-all duration-300"
          >
            Back to Discovery Feed
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
