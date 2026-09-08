import React from 'react';
import { ColorCard, CardTemplate } from '../types';
import { useColorContext } from '../context/ColorContext';
import { isLightColor } from '../utils/colorUtils';
import { Heart, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface ColorCardItemProps {
  card: ColorCard;
  onSelect?: () => void;
  isMultiSelectMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  templateOverride?: CardTemplate;
  showFavoriteButton?: boolean;
}

export const ColorCardItem: React.FC<ColorCardItemProps> = ({
  card,
  onSelect,
  isMultiSelectMode = false,
  isSelected = false,
  onToggleSelect,
  templateOverride,
  showFavoriteButton = true,
}) => {
  const { isFavorite, toggleFavorite, copyColor, settings } = useColorContext();
  const favorited = isFavorite(card.id);
  const currentTemplate = templateOverride || settings.template;
  const isLight = isLightColor(card.hex);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(card.id);
  };

  const handleHexClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyColor(card, settings.defaultCopyFormat);
  };

  const handleCardClick = () => {
    if (isMultiSelectMode && onToggleSelect) {
      onToggleSelect();
    } else if (onSelect) {
      onSelect();
    }
  };

  // Render Template 1: Classic (Exact reference recreation)
  if (currentTemplate === 'classic') {
    return (
      <motion.div
        whileTap={{ scale: 0.97 }}
        onClick={handleCardClick}
        id={`card-${card.id}`}
        className={`group relative flex flex-col bg-white dark:bg-neutral-800/95 rounded-[26px] p-2.5 sm:p-3 shadow-md hover:shadow-xl transition-all duration-300 border border-black/5 dark:border-white/10 cursor-pointer overflow-hidden ${
          isSelected ? 'ring-2 ring-emerald-500 shadow-emerald-500/20' : ''
        }`}
      >
        {/* Multi-select check overlay */}
        {isMultiSelectMode && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect?.();
            }}
            className={`absolute top-4 right-4 z-20 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
              isSelected
                ? 'bg-emerald-500 text-white shadow-md'
                : 'bg-black/30 backdrop-blur-md border border-white/60 text-transparent'
            }`}
          >
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
        )}

        {/* Top Rounded Color Block */}
        <div
          className="relative w-full aspect-[4/4.4] rounded-[20px] p-3.5 flex flex-col justify-between overflow-hidden shadow-inner transition-transform group-hover:scale-[1.01]"
          style={{ backgroundColor: card.hex }}
        >
          {/* Subtle sheen highlight */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent pointer-events-none" />

          {/* Color Info inside block */}
          <div className="relative z-10 space-y-1">
            <h3
              className={`text-lg sm:text-xl font-bold tracking-tight leading-tight ${
                isLight ? 'text-neutral-900' : 'text-white'
              }`}
            >
              {card.cnName}
            </h3>
            <p
              className={`text-[10px] sm:text-[11px] font-medium tracking-wider uppercase font-mono ${
                isLight ? 'text-neutral-900/80' : 'text-white/80'
              }`}
            >
              {card.enName}
            </p>

            {/* Meaning Tags */}
            <div className="flex flex-wrap gap-1 pt-1.5">
              {card.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-[3px] border tracking-wider font-normal backdrop-blur-xs ${
                    isLight
                      ? 'border-neutral-900/40 text-neutral-900/90'
                      : 'border-white/60 text-white/95'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Info Bar: Hex + CMYK + Heart */}
        <div className="px-1.5 pt-2.5 pb-1 flex items-center justify-between">
          <div className="flex flex-col">
            <button
              type="button"
              onClick={handleHexClick}
              title="点击复制色号（按设置的默认格式）"
              className="text-left font-black tracking-tight text-sm sm:text-base hover:opacity-80 transition-opacity font-mono cursor-pointer"
              style={{ color: card.hex }}
            >
              {card.hex}
            </button>
            <span className="text-[10px] sm:text-[11px] font-mono text-neutral-400 dark:text-neutral-400 tracking-tight">
              {card.cmyk.c}/{card.cmyk.m}/{card.cmyk.y}/{card.cmyk.k}
            </span>
          </div>

          {/* Heart Button */}
          <button
            type="button"
            onClick={handleHeartClick}
            aria-label={favorited ? '取消收藏' : '收藏'}
            className={`p-1 rounded-full hover:scale-110 active:scale-95 transition-transform${showFavoriteButton ? '' : ' hidden'}`}
          >
            <Heart
              className={`w-5 h-5 transition-all ${
                favorited
                  ? 'scale-110 drop-shadow-sm'
                  : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                fill: favorited ? card.hex : 'transparent',
                stroke: card.hex,
                strokeWidth: favorited ? 0 : 2.2,
              }}
            />
          </button>
        </div>
      </motion.div>
    );
  }

  // Render Template 2: Minimalist
  if (currentTemplate === 'minimal') {
    return (
      <motion.div
        whileTap={{ scale: 0.97 }}
        onClick={handleCardClick}
        id={`card-${card.id}`}
        className={`group relative flex flex-col bg-white dark:bg-neutral-800/90 rounded-[20px] p-3 shadow-sm hover:shadow-md border border-black/5 dark:border-white/5 transition-all cursor-pointer ${
          isSelected ? 'ring-2 ring-emerald-500' : ''
        }`}
      >
        <div
          className="relative w-full aspect-[4/3.8] rounded-[14px] overflow-hidden"
          style={{ backgroundColor: card.hex }}
        />
        <div className="pt-2.5 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-neutral-800 dark:text-neutral-100">
              {card.cnName}
            </div>
            <button
              onClick={handleHexClick}
              className="text-[11px] font-mono font-medium hover:underline"
              style={{ color: card.hex }}
            >
              {card.hex}
            </button>
          </div>
          <button
            type="button"
            onClick={handleHeartClick}
            className={`p-1 hover:scale-110 transition-transform${showFavoriteButton ? '' : ' hidden'}`}
          >
            <Heart
              className="w-4 h-4"
              style={{
                fill: favorited ? card.hex : 'none',
                stroke: card.hex,
                strokeWidth: 2,
              }}
            />
          </button>
        </div>
      </motion.div>
    );
  }

  // Render Template 3: Oriental Traditional Style
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={handleCardClick}
      id={`card-${card.id}`}
      className={`group relative flex flex-col bg-[#F9F7F2] dark:bg-neutral-800 rounded-[22px] p-3 shadow-md border border-[#E7E2D8] dark:border-neutral-700 cursor-pointer ${
        isSelected ? 'ring-2 ring-emerald-500' : ''
      }`}
    >
      <div
        className="relative w-full aspect-[4/4.2] rounded-[16px] p-3 flex flex-col justify-between overflow-hidden"
        style={{ backgroundColor: card.hex }}
      >
        {/* Seal stamp top right */}
        <div className="self-end bg-rose-700 text-white w-6 h-6 rounded-sm flex items-center justify-center text-[10px] font-serif shadow-xs">
          印
        </div>

        <div className="relative z-10">
          <h3
            className={`font-serif text-lg font-bold tracking-widest ${
              isLight ? 'text-neutral-900' : 'text-white'
            }`}
          >
            {card.cnName}
          </h3>
          <p
            className={`text-[9px] font-mono tracking-wider uppercase ${
              isLight ? 'text-neutral-900/70' : 'text-white/70'
            }`}
          >
            {card.enName}
          </p>
        </div>
      </div>

      <div className="pt-2 px-1 flex items-center justify-between">
        <div>
          <button
            onClick={handleHexClick}
            className="text-xs font-mono font-bold hover:opacity-80"
            style={{ color: card.hex }}
          >
            {card.hex}
          </button>
          <div className="text-[10px] text-neutral-500 font-serif">
            {card.category}
          </div>
        </div>
        <button
          type="button"
          onClick={handleHeartClick}
          className={`p-1 hover:scale-110 transition-transform${showFavoriteButton ? '' : ' hidden'}`}
        >
          <Heart
            className="w-4 h-4"
            style={{
              fill: favorited ? card.hex : 'none',
              stroke: card.hex,
              strokeWidth: 2,
            }}
          />
        </button>
      </div>
    </motion.div>
  );
};
