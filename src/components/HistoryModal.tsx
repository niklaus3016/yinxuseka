import React from 'react';
import { useColorContext } from '../context/ColorContext';
import { ColorCard } from '../types';
import { X, Trash2, Clock, Copy } from 'lucide-react';
import { motion } from 'motion/react';

interface HistoryModalProps {
  onClose: () => void;
  onSelectColor: (card: ColorCard) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ onClose, onSelectColor }) => {
  const { history, getColorById, clearHistory, copyColor } = useColorContext();

  const historyCards = history
    .map((id) => getColorById(id))
    .filter((c): c is ColorCard => c !== undefined);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm overflow-hidden"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[85vh] bg-white dark:bg-neutral-900 rounded-t-4xl sm:rounded-4xl overflow-hidden flex flex-col shadow-2xl border border-black/10 dark:border-white/10"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              最近浏览足迹 ({historyCards.length})
            </h3>
          </div>

          <div className="flex items-center gap-1">
            {historyCards.length > 0 && (
              <button
                type="button"
                onClick={clearHistory}
                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-rose-500 transition-colors"
                title="清空足迹"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {historyCards.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 space-y-2">
              <Clock className="w-10 h-10 mx-auto opacity-30" />
              <p className="text-xs">暂无浏览足迹，去色卡库探索新灵感吧</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {historyCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => {
                    onSelectColor(card);
                    onClose();
                  }}
                  className="p-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-black/5 dark:border-white/5 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer flex flex-col justify-between transition-all"
                >
                  <span
                    className="w-full h-12 rounded-xl shadow-xs mb-2 block"
                    style={{ backgroundColor: card.hex }}
                  />
                  <div className="flex items-center justify-between">
                    <div className="truncate">
                      <div className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                        {card.cnName}
                      </div>
                      <div className="text-[10px] font-mono text-neutral-400">
                        {card.hex}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyColor(card, 'hex');
                      }}
                      className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-400"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
