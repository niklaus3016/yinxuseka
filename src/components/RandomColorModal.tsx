import React, { useState } from 'react';
import { ColorCard } from '../types';
import { useColorContext } from '../context/ColorContext';
import { ColorCardItem } from './ColorCardItem';
import { X, Dices, Eye, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface RandomColorModalProps {
  onClose: () => void;
  onOpenDetail: (card: ColorCard) => void;
}

export const RandomColorModal: React.FC<RandomColorModalProps> = ({
  onClose,
  onOpenDetail,
}) => {
  const { allColors, showToast } = useColorContext();

  const getRandomCard = () => {
    const randomIndex = Math.floor(Math.random() * allColors.length);
    return allColors[randomIndex];
  };

  const [currentCard, setCurrentCard] = useState<ColorCard>(() => getRandomCard());

  const handleReroll = () => {
    let next = getRandomCard();
    while (allColors.length > 1 && next.id === currentCard.id) {
      next = getRandomCard();
    }
    setCurrentCard(next);
    showToast('已唤醒新的灵感色彩 ✨');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm bg-neutral-900 rounded-4xl p-5 shadow-2xl border border-white/10 text-white flex flex-col space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold tracking-tight">
              灵感盲盒 · 今日邂逅
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Component */}
        <div className="max-w-70 mx-auto w-full">
          <ColorCardItem card={currentCard} onSelect={() => onOpenDetail(currentCard)} />
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleReroll}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-all active:scale-95 border border-white/10"
          >
            <Dices className="w-4 h-4 text-emerald-400" />
            <span>换一换灵感</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenDetail(currentCard);
            }}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white text-neutral-900 text-xs font-bold transition-all active:scale-95 shadow-md"
          >
            <Eye className="w-4 h-4" />
            <span>查看完整详情</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
