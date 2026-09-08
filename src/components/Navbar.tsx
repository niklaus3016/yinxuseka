import React, { useState } from 'react';
import { useColorContext } from '../context/ColorContext';
import { CardTemplate } from '../types';
import {
  LayoutGrid,
  CheckSquare,
  Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  isMultiSelect: boolean;
  onToggleMultiSelect: () => void;
  onOpenHistory: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isMultiSelect,
  onToggleMultiSelect,
  onOpenHistory,
}) => {
  const { settings, updateSettings, showToast } = useColorContext();
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);

  const handleSelectTemplate = (tpl: CardTemplate) => {
    updateSettings({ template: tpl });
    setShowTemplateMenu(false);
    const names = {
      classic: '经典原版卡片',
      minimal: '简约流光卡片',
      oriental: '国风雅韵卡片',
    };
    showToast(`已切换外观为「${names[tpl]}」`);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-neutral-900/80 dark:bg-neutral-900/85 backdrop-blur-xl border-b border-white/10 dark:border-white/10 text-white px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-300 flex items-center justify-center shadow-md">
            <span className="text-neutral-950 font-black text-sm font-serif">印</span>
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white">
              印序色卡
            </h1>
            <p className="text-[10px] text-neutral-400 font-medium tracking-wide">
              全球名贵流行色
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Multi-select toggle */}
          <button
            type="button"
            onClick={onToggleMultiSelect}
            className={`p-2 rounded-full transition-all ${
              isMultiSelect
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'hover:bg-white/10 text-neutral-300'
            }`}
            title="多选拼接海报"
          >
            <CheckSquare className="w-4 h-4" />
          </button>

          {/* History button */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="p-2 rounded-full hover:bg-white/10 text-neutral-300 transition-colors"
            title="浏览足迹"
          >
            <Clock className="w-4 h-4" />
          </button>

          {/* Template Switcher Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowTemplateMenu(!showTemplateMenu)}
              className="p-2 rounded-full hover:bg-white/10 text-neutral-300 transition-colors"
              title="切换卡片模板样式"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>

            {showTemplateMenu && (
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowTemplateMenu(false)}
              />
            )}
            <AnimatePresence>
              {showTemplateMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 top-11 w-44 bg-neutral-800 border border-white/15 rounded-2xl p-1.5 shadow-2xl z-40 space-y-1"
                >
                  <div className="px-2.5 py-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                    卡片排版模板
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectTemplate('classic')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      settings.template === 'classic'
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                        : 'text-neutral-200 hover:bg-white/5'
                    }`}
                  >
                    经典原版 (样图复刻)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectTemplate('minimal')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      settings.template === 'minimal'
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                        : 'text-neutral-200 hover:bg-white/5'
                    }`}
                  >
                    极简流光 (纯净现代)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectTemplate('oriental')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      settings.template === 'oriental'
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                        : 'text-neutral-200 hover:bg-white/5'
                    }`}
                  >
                    国风雅韵 (印章古朴)
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
