import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { X, Mic, Image as ImageIcon, Type, Send } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';

interface StyleTalkOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  productImage?: string;
  productColor?: string;
}

type InputMode = 'voice' | 'image' | 'text';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const suggestedTags = [
  'Minimalist',
  'Comfort',
  'Autumn',
  'Versatile',
  'Elegant',
  'Modern',
];

export function StyleTalkOverlay({ isOpen, onClose, productImage, productColor = '#D8BFAF' }: StyleTalkOverlayProps) {
  const [inputMode, setInputMode] = useState<InputMode>('voice');
  const [isRecording, setIsRecording] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hi! I\'m your personal style companion. How does this piece make you feel?',
      timestamp: new Date(),
    },
  ]);
  const [waveformAmplitude, setWaveformAmplitude] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Simulate waveform animation during recording
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setWaveformAmplitude(Math.random() * 0.6 + 0.4);
      }, 100);
    } else {
      setWaveformAmplitude(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleModeSwipe = (event: any, info: PanInfo) => {
    const threshold = 50;
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        // Swipe right
        if (inputMode === 'voice') setInputMode('text');
        else if (inputMode === 'image') setInputMode('voice');
        else if (inputMode === 'text') setInputMode('image');
      } else {
        // Swipe left
        if (inputMode === 'voice') setInputMode('image');
        else if (inputMode === 'image') setInputMode('text');
        else if (inputMode === 'text') setInputMode('voice');
      }
    }
  };

  const handleVoiceRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate recording for 2 seconds
      setTimeout(() => {
        setIsRecording(false);
        handleSendMessage('This blazer looks perfect for fall layering!');
      }, 2000);
    } else {
      setIsRecording(false);
    }
  };

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setTextInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I love your eye for detail! This piece has a timeless silhouette that works beautifully for both professional and casual settings. Would you like to see similar styles?",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1200);
  };

  const handleTextSubmit = () => {
    handleSendMessage(textInput);
  };

  const handleTagClick = (tag: string) => {
    handleSendMessage(`Tell me more about the ${tag.toLowerCase()} style`);
  };

  const handleClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
        >
          {/* Background Product Image with Dimming */}
          <div className="absolute inset-0">
            {productImage && (
              <img
                src={productImage}
                alt="Product"
                className="w-full h-full object-cover"
                style={{
                  filter: 'brightness(0.65)',
                }}
              />
            )}
          </div>

          {/* Glass Curtain Chat Overlay */}
          <motion.div
            ref={containerRef}
            className="relative w-full overflow-hidden"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              duration: 0.6,
              ease: [0.33, 1, 0.68, 1],
            }}
            style={{
              height: '75%',
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.45) 100%)',
              backdropFilter: 'blur(24px)',
              borderTopLeftRadius: '40px',
              borderTopRightRadius: '40px',
              boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Handle Bar */}
            <div className="flex items-center justify-center py-4">
              <div
                className="w-12 h-1 rounded-full"
                style={{
                  background: 'rgba(0, 0, 0, 0.2)',
                }}
              />
            </div>

            {/* Close Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <X className="w-5 h-5 text-black opacity-60" />
            </motion.button>

            {/* Messages Container */}
            <div className="px-6 pb-4 overflow-y-auto" style={{ height: 'calc(100% - 240px)' }}>
              <div className="flex flex-col gap-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.7,
                      delay: index * 0.1,
                      ease: [0.33, 1, 0.68, 1],
                    }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className="max-w-[80%] px-5 py-3 rounded-3xl"
                      style={{
                        background:
                          message.type === 'user'
                            ? `linear-gradient(135deg, ${productColor}, ${productColor}DD)`
                            : 'rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '15px',
                          lineHeight: '1.5',
                          color: message.type === 'user' ? '#FFF' : '#111',
                        }}
                      >
                        {message.content}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Suggested Tags */}
              {messages.length <= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="flex flex-wrap gap-2 mt-6"
                >
                  {suggestedTags.map((tag, index) => (
                    <motion.button
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: 0.5 + index * 0.1,
                        duration: 0.4,
                        ease: 'easeOut',
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTagClick(tag)}
                      className="px-4 py-2 rounded-full"
                      style={{
                        background: 'rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        fontSize: '13px',
                        color: '#333',
                      }}
                    >
                      {tag}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-8">
              {/* Mode Indicator */}
              <div className="flex items-center justify-center gap-2 mb-4">
                {(['voice', 'image', 'text'] as InputMode[]).map((mode) => (
                  <motion.div
                    key={mode}
                    animate={{
                      scale: inputMode === mode ? 1 : 0.7,
                      opacity: inputMode === mode ? 1 : 0.3,
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: productColor,
                    }}
                  />
                ))}
              </div>

              {/* Input Container */}
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleModeSwipe}
                className="relative"
                style={{
                  background: 'rgba(255, 255, 255, 0.4)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '28px',
                  padding: '16px 20px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Voice Mode */}
                  {inputMode === 'voice' && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="flex-1 flex items-center gap-4"
                    >
                      {/* Mic Button */}
                      <motion.button
                        onMouseDown={handleVoiceRecord}
                        onMouseUp={handleVoiceRecord}
                        onTouchStart={handleVoiceRecord}
                        onTouchEnd={handleVoiceRecord}
                        className="w-12 h-12 rounded-full flex items-center justify-center relative"
                        style={{
                          background: isRecording
                            ? `linear-gradient(135deg, ${productColor}, ${productColor}DD)`
                            : 'rgba(0, 0, 0, 0.06)',
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {/* Breathing Glow */}
                        {!isRecording && (
                          <motion.div
                            className="absolute inset-0 rounded-full"
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                            style={{
                              background: `radial-gradient(circle, ${productColor}80, transparent)`,
                            }}
                          />
                        )}
                        <Mic
                          className={isRecording ? 'text-white' : 'text-black opacity-60'}
                          style={{ width: '20px', height: '20px' }}
                        />
                      </motion.button>

                      {/* Waveform Visualization */}
                      {isRecording ? (
                        <div className="flex-1 flex items-center gap-1 h-12">
                          {[...Array(20)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="flex-1 rounded-full"
                              style={{
                                background: productColor,
                                minWidth: '3px',
                              }}
                              animate={{
                                height: `${(Math.sin(i * 0.5 + Date.now() * 0.01) * 0.5 + 0.5) * waveformAmplitude * 40}px`,
                              }}
                              transition={{
                                duration: 0.1,
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <p
                          className="flex-1 opacity-60"
                          style={{
                            fontSize: '15px',
                            color: '#333',
                          }}
                        >
                          Hold to speak...
                        </p>
                      )}
                    </motion.div>
                  )}

                  {/* Image Mode */}
                  {inputMode === 'image' && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="flex-1 flex items-center gap-4"
                    >
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                          background: 'rgba(0, 0, 0, 0.06)',
                        }}
                        onClick={() => alert('Image upload functionality')}
                      >
                        <ImageIcon className="text-black opacity-60" style={{ width: '20px', height: '20px' }} />
                      </motion.button>
                      <p
                        className="flex-1 opacity-60"
                        style={{
                          fontSize: '15px',
                          color: '#333',
                        }}
                      >
                        Upload or take a photo...
                      </p>
                    </motion.div>
                  )}

                  {/* Text Mode */}
                  {inputMode === 'text' && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="flex-1 flex items-center gap-3"
                    >
                      <textarea
                        ref={textareaRef}
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Type your thoughts..."
                        rows={1}
                        className="flex-1 bg-transparent outline-none resize-none"
                        style={{
                          fontSize: '15px',
                          color: '#111',
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleTextSubmit();
                          }
                        }}
                      />
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleTextSubmit}
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                          background: textInput.trim()
                            ? `linear-gradient(135deg, ${productColor}, ${productColor}DD)`
                            : 'rgba(0, 0, 0, 0.06)',
                        }}
                        disabled={!textInput.trim()}
                      >
                        <Send
                          className={textInput.trim() ? 'text-white' : 'text-black opacity-40'}
                          style={{ width: '18px', height: '18px' }}
                        />
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Mode Switch Indicator */}
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      const modes: InputMode[] = ['voice', 'image', 'text'];
                      const currentIndex = modes.indexOf(inputMode);
                      setInputMode(modes[(currentIndex + 1) % modes.length]);
                    }}
                    className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
                    style={{
                      background: 'rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      {inputMode === 'voice' && <Mic className="text-black opacity-40" style={{ width: '16px', height: '16px' }} />}
                      {inputMode === 'image' && <ImageIcon className="text-black opacity-40" style={{ width: '16px', height: '16px' }} />}
                      {inputMode === 'text' && <Type className="text-black opacity-40" style={{ width: '16px', height: '16px' }} />}
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Swipe Hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 1 }}
                className="text-center mt-3"
                style={{
                  fontSize: '12px',
                  color: '#666',
                }}
              >
                Swipe or tap to switch input mode
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
