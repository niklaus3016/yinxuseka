import React from 'react';
import { Palette, Heart, PlusCircle, Settings, Dices } from 'lucide-react';
import { motion } from 'motion/react';

export type ActiveTab = 'library' | 'favorites' | 'create' | 'settings';

interface TabBarProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  onRandomPick: () => void;
  favoritesCount: number;
}

export const TabBar: React.FC<TabBarProps> = ({
  activeTab,
  onChangeTab,
  onRandomPick,
  favoritesCount,
}) => {
  return (
    <>
      {/* Floating Random Pick Button (Right side, slightly above tab bar) - hide in settings tab */}
      {activeTab !== 'settings' && (
        <div className="fixed right-5 bottom-22 z-30">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            type="button"
            onClick={onRandomPick}
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs shadow-xl hover:shadow-emerald-500/25 active:scale-95 transition-all border border-white/20"
            title="随机探索色彩灵感"
          >
            <Dices className="w-4 h-4 animate-spin-slow" />
            <span className="tracking-wide">随机灵感</span>
          </motion.button>
        </div>
      )}

      {/* Docked Android Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-neutral-900/95 backdrop-blur-xl border-t border-white/10 px-2 py-2">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {/* Tab 1: Library */}
          <button
            type="button"
            onClick={() => onChangeTab('library')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              activeTab === 'library'
                ? 'text-emerald-400 font-bold scale-105'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Palette className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] tracking-tight">色卡库</span>
          </button>

          {/* Tab 2: Favorites */}
          <button
            type="button"
            onClick={() => onChangeTab('favorites')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl relative transition-all ${
              activeTab === 'favorites'
                ? 'text-rose-400 font-bold scale-105'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Heart
              className="w-5 h-5 stroke-[2.2]"
              style={{
                fill: activeTab === 'favorites' ? '#F43F5E' : 'none',
              }}
            />
            <span className="text-[11px] tracking-tight">收藏夹</span>
            {favoritesCount > 0 && (
              <span className="absolute top-0 right-2 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-mono font-bold leading-none">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Tab 3: Create */}
          <button
            type="button"
            onClick={() => onChangeTab('create')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              activeTab === 'create'
                ? 'text-amber-400 font-bold scale-105'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <PlusCircle className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] tracking-tight">灵感创作</span>
          </button>

          {/* Tab 4: Settings */}
          <button
            type="button"
            onClick={() => onChangeTab('settings')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              activeTab === 'settings'
                ? 'text-cyan-400 font-bold scale-105'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Settings className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] tracking-tight">设置</span>
          </button>
        </div>
      </nav>
    </>
  );
};
