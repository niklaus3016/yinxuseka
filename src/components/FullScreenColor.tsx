import React, { useState } from 'react';
import { ColorCard } from '../types';
import { useColorContext } from '../context/ColorContext';
import { isLightColor } from '../utils/colorUtils';
import { X, Copy, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FullScreenColorProps {
  card: ColorCard;
  onClose: () => void;
}

export const FullScreenColor: React.FC<FullScreenColorProps> = ({ card, onClose }) => {
  const { copyColor } = useColorContext();
  const [showControls, setShowControls] = useState(true);

  const isLight = isLightColor(card.hex);
  const textColor = isLight ? 'text-neutral-900' : 'text-white';
  const controlBg = isLight ? 'bg-black/15 text-neutral-900 hover:bg-black/25' : 'bg-white/20 text-white hover:bg-white/30';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={() => setShowControls(!showControls)}
      className="fixed inset-0 z-50 flex flex-col justify-between cursor-pointer select-none"
      style={{ backgroundColor: card.hex }}
    >
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className={`p-3 rounded-full backdrop-blur-md transition-all active:scale-90 ${controlBg}`}
              >
                <X className="w-5 h-5" />
              </button>
              <div>
                <h1 className={`text-xl font-bold tracking-tight ${textColor}`}>
                  {card.cnName}
                </h1>
                <p className={`text-xs font-mono uppercase tracking-widest opacity-80 ${textColor}`}>
                  {card.enName} · {card.hex}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => copyColor(card, 'hex')}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full font-mono text-xs font-semibold backdrop-blur-md active:scale-95 transition-all ${controlBg}`}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>复制色号</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="p-6 flex items-center justify-center pointer-events-none"
          >
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md text-xs font-medium opacity-75 ${controlBg}`}>
              <Info className="w-3.5 h-3.5" />
              <span>轻触屏幕任意位置隐藏/唤醒浮层</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
