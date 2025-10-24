import { useState } from 'react';
import { SplashLogin } from './components/SplashLogin';
import { DiscoveryFeed } from './components/DiscoveryFeed';
import { StyleTalkOverlay } from './components/StyleTalkOverlay';
import { ProductDetail } from './components/ProductDetail';
import { Toaster } from './components/ui/sonner';

type Screen = 'splash' | 'discovery' | 'product';

const productData = {
  1: {
    image: 'https://images.unsplash.com/photo-1719518411339-5158cea86caf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwZWRpdG9yaWFsfGVufDF8fHx8MTc2MTA3NzExN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    color: '#D8BFAF',
  },
  2: {
    image: 'https://images.unsplash.com/photo-1643387848945-da63360662f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwZmFzaGlvbiUyMG1vZGVsfGVufDF8fHx8MTc2MTEyMzYxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    color: '#A8B5C1',
  },
  3: {
    image: 'https://images.unsplash.com/photo-1761001311816-b2a0481e3577?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZmFzaGlvbiUyMHN0dWRpb3xlbnwxfHx8fDE3NjExNjU5NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    color: '#C8C0B8',
  },
  4: {
    image: 'https://images.unsplash.com/photo-1717944105945-669b3dd77bfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdmFudCUyMGdhcmRlJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjExMDMzODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    color: '#B8A89F',
  },
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [isStyleTalkOpen, setIsStyleTalkOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number>(1);
  const [currentViewProductId, setCurrentViewProductId] = useState<number>(1);

  const handleLogin = () => {
    setCurrentScreen('discovery');
  };

  const handleProductClick = (productId: number) => {
    setSelectedProductId(productId);
    setCurrentScreen('product');
  };

  const handleStyleTalkOpen = (productId: number) => {
    setCurrentViewProductId(productId);
    setIsStyleTalkOpen(true);
  };

  const handleBackFromProduct = () => {
    setCurrentScreen('discovery');
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="relative h-screen w-screen overflow-hidden bg-black">
        {/* Mobile Prototype Container - 1080×1920 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[1920px] w-[1080px] max-h-screen max-w-full shadow-2xl overflow-hidden" style={{ aspectRatio: '1080/1920' }}>
        {/* Screens */}
        {currentScreen === 'splash' && <SplashLogin onLogin={handleLogin} />}
        
        {currentScreen === 'discovery' && (
          <DiscoveryFeed
            onStyleTalkClick={handleStyleTalkOpen}
            onProductClick={handleProductClick}
          />
        )}
        
        {currentScreen === 'product' && (
          <ProductDetail
            productId={selectedProductId}
            onBack={handleBackFromProduct}
            onProductClick={handleProductClick}
          />
        )}

        {/* Style Talk Overlay - Can appear over discovery screen */}
        {currentScreen === 'discovery' && (
          <StyleTalkOverlay
            isOpen={isStyleTalkOpen}
            onClose={() => setIsStyleTalkOpen(false)}
            productImage={productData[currentViewProductId]?.image}
            productColor={productData[currentViewProductId]?.color}
          />
        )}
        </div>
      </div>
    </>
  );
}
