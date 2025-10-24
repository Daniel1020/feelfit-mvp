import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Mail, Apple, MessageCircle } from 'lucide-react';

interface SplashLoginProps {
  onLogin: () => void;
}

export function SplashLogin({ onLogin }: SplashLoginProps) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      {/* Fullscreen Background with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1685527645763-2cd1b47a2cd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2FtcGFpZ24lMjBtaW5pbWFsaXN0fGVufDF8fHx8MTc2MTE2NTk3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Fashion Campaign"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="relative z-10 flex h-full flex-col items-center justify-between px-8 py-16"
      >
        {/* Logo & Tagline */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-24 flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <h1 className="text-[#F6F1EB] tracking-[0.2em] text-5xl">FEELFIT</h1>
          </motion.div>
          <p className="text-[#D8BFAF] tracking-wider opacity-90 text-sm">
            Discover your fashion instinct
          </p>
        </motion.div>

        {/* Login Buttons */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="w-full max-w-sm space-y-3 mb-8"
        >
          <Button
            onClick={onLogin}
            className="w-full h-14 bg-[#F6F1EB] text-black hover:bg-[#F6F1EB]/90 rounded-full transition-all duration-300 shadow-lg shadow-[#D8BFAF]/20"
          >
            <Mail className="mr-2 h-5 w-5" />
            Continue with Email
          </Button>
          
          <Button
            onClick={onLogin}
            className="w-full h-14 bg-black/40 text-[#F6F1EB] hover:bg-black/60 border border-[#D8BFAF]/30 rounded-full backdrop-blur-sm transition-all duration-300"
          >
            <Apple className="mr-2 h-5 w-5" />
            Continue with Apple
          </Button>
          
          <Button
            onClick={onLogin}
            className="w-full h-14 bg-black/40 text-[#F6F1EB] hover:bg-black/60 border border-[#D8BFAF]/30 rounded-full backdrop-blur-sm transition-all duration-300"
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </Button>
          
          <Button
            onClick={onLogin}
            className="w-full h-14 bg-black/40 text-[#F6F1EB] hover:bg-black/60 border border-[#D8BFAF]/30 rounded-full backdrop-blur-sm transition-all duration-300"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Continue with ChatGPT
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
