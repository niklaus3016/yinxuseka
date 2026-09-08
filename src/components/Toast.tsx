import React, { useEffect, useState } from 'react';
import { useColorContext } from '../context/ColorContext';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastNotification } = useColorContext();
  const [visible, setVisible] = useState(false);
  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    if (toastNotification) {
      setCurrentText(toastNotification.text);
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [toastNotification]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-900/90 dark:bg-white/95 text-white dark:text-neutral-900 shadow-2xl backdrop-blur-md border border-white/15 dark:border-black/10 text-xs font-semibold tracking-wide">
            <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Check className="w-3 h-3" />
            </span>
            <span>{currentText}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
