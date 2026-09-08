import React, { useState } from 'react';
import { ColorCard } from '../types';
import { useColorContext } from '../context/ColorContext';
import { isLightColor } from '../utils/colorUtils';
import { exportCardToImage } from '../utils/canvasExport';
import { saveImageFile } from '../utils/saveImage';
import {
  X,
  Heart,
  Copy,
  Download,
  Sparkles,
  Maximize2,
  BookOpen,
  Palette,
  Trash2,
} from 'lucide-react';
import { motion } from 'motion/react';

interface ColorDetailModalProps {
  card: ColorCard;
  onClose: () => void;
  onOpenHarmonies: (card: ColorCard) => void;
  onOpenFullScreen: (card: ColorCard) => void;
  onSelectRelatedCard: (card: ColorCard) => void;
}

export const ColorDetailModal: React.FC<ColorDetailModalProps> = ({
  card,
  onClose,
  onOpenHarmonies,
  onOpenFullScreen,
  onSelectRelatedCard,
}) => {
  const { isFavorite, toggleFavorite, copyColor, settings, allColors, showToast, deleteCustomColor } =
    useColorContext();
  const [isExporting, setIsExporting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const favorited = isFavorite(card.id);
  const isLight = isLightColor(card.hex);

  const relatedColors = allColors
    .filter((c) => c.id !== card.id && (c.category === card.category || Math.abs(c.hsb.h - card.hsb.h) < 40))
    .slice(0, 6);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      showToast('正在生成高清色卡...');
      const dataUrl = await exportCardToImage(card, settings.template);
      const result = await saveImageFile(dataUrl, `印序色卡_${card.cnName}_${card.hex}.png`);
      showToast(
        result === 'shared'
          ? '已生成图片，可在分享面板选择「保存到相册」🎉'
          : '色卡已导出至本地 🎉'
      );
    } catch (err) {
      console.error(err);
      showToast('导出失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteCustom = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    deleteCustomColor(card.id);
    showToast('已删除自定义色卡');
    onClose();
  };

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
        className="relative w-full max-w-lg h-[92vh] sm:h-auto sm:max-h-[88vh] bg-white dark:bg-neutral-900 rounded-t-4xl sm:rounded-4xl overflow-hidden flex flex-col shadow-2xl border border-black/10 dark:border-white/10"
      >
          {/* Top Bar with actions */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: card.hex }} />
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
                {card.category}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Favorite Button */}
              <button
                type="button"
                onClick={() => toggleFavorite(card.id)}
                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <Heart
                  className="w-5 h-5 transition-transform active:scale-90"
                  style={{
                    fill: favorited ? '#EF4444' : 'transparent',
                    stroke: favorited ? '#EF4444' : 'currentColor',
                  }}
                />
              </button>

              {/* Delete custom card button */}
              {card.isCustom && (
                <button
                  type="button"
                  onClick={handleDeleteCustom}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-semibold transition-colors ${
                    confirmDelete
                      ? 'bg-rose-500 text-white'
                      : 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10'
                  }`}
                  title="删除该自定义色卡"
                >
                  <Trash2 className="w-4 h-4" />
                  {confirmDelete && <span>确认删除</span>}
                </button>
              )}

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
            {/* Color block preview card */}
            <div
              className="relative rounded-[28px] p-6 transition-colors duration-300 flex flex-col justify-between aspect-4/3 overflow-hidden shadow-inner bg-neutral-950"
            >
              {/* Actual Color Card Canvas */}
              <div
                className="absolute inset-4 rounded-[22px] p-5 flex flex-col justify-between shadow-xl transition-all"
                style={{ backgroundColor: card.hex }}
              >
                {/* Fullscreen button */}
                <button
                  type="button"
                  onClick={() => onOpenFullScreen(card)}
                  className={`self-end p-2 rounded-full backdrop-blur-md transition-all active:scale-90 ${
                    isLight
                      ? 'bg-black/15 text-neutral-900 hover:bg-black/25'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                  title="全屏沉浸纯色预览"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                <div>
                  <h2
                    className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                      isLight ? 'text-neutral-900' : 'text-white'
                    }`}
                  >
                    {card.cnName}
                  </h2>
                  <p
                    className={`text-xs sm:text-sm font-mono tracking-widest uppercase mt-0.5 ${
                      isLight ? 'text-neutral-900/75' : 'text-white/80'
                    }`}
                  >
                    {card.enName}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {card.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`text-[11px] px-2 py-0.5 border rounded-sm ${
                          isLight
                            ? 'border-neutral-900/35 text-neutral-900 font-medium'
                            : 'border-white/50 text-white font-normal'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Parameter grid: HEX, CMYK, HSB, RGB */}
            <div>
              <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2.5">
                色彩参数值 · 点击一键复制
              </h4>
              <div className="grid grid-cols-2 gap-2.5">
                {/* Hex */}
                <button
                  type="button"
                  onClick={() => copyColor(card, 'hex')}
                  className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-black/5 dark:border-white/5 transition-all text-left group"
                >
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 block">HEX 色码</span>
                    <span className="text-base font-bold font-mono text-neutral-800 dark:text-neutral-100">
                      {card.hex}
                    </span>
                  </div>
                  <Copy className="w-4 h-4 text-neutral-400 group-hover:text-emerald-500 transition-colors" />
                </button>

                {/* CMYK */}
                <button
                  type="button"
                  onClick={() => copyColor(card, 'cmyk')}
                  className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-black/5 dark:border-white/5 transition-all text-left group"
                >
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 block">CMYK 印刷参数</span>
                    <span className="text-sm font-semibold font-mono text-neutral-800 dark:text-neutral-100">
                      {card.cmyk.c}/{card.cmyk.m}/{card.cmyk.y}/{card.cmyk.k}
                    </span>
                  </div>
                  <Copy className="w-4 h-4 text-neutral-400 group-hover:text-emerald-500 transition-colors" />
                </button>

                {/* HSB */}
                <button
                  type="button"
                  onClick={() => copyColor(card, 'hsb')}
                  className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-black/5 dark:border-white/5 transition-all text-left group"
                >
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 block">HSB 色相/饱和/明度</span>
                    <span className="text-xs font-semibold font-mono text-neutral-800 dark:text-neutral-100">
                      {card.hsb.h}° · {card.hsb.s}% · {card.hsb.b}%
                    </span>
                  </div>
                  <Copy className="w-4 h-4 text-neutral-400 group-hover:text-emerald-500 transition-colors" />
                </button>

                {/* RGB */}
                <button
                  type="button"
                  onClick={() => copyColor(card, 'rgb')}
                  className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-black/5 dark:border-white/5 transition-all text-left group"
                >
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 block">RGB 光学原色</span>
                    <span className="text-xs font-semibold font-mono text-neutral-800 dark:text-neutral-100">
                      {card.rgb.r}, {card.rgb.g}, {card.rgb.b}
                    </span>
                  </div>
                  <Copy className="w-4 h-4 text-neutral-400 group-hover:text-emerald-500 transition-colors" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onOpenHarmonies(card)}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold text-xs shadow-md hover:opacity-90 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>生成配套配色</span>
              </button>

              <button
                type="button"
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-white font-semibold text-xs border border-black/5 dark:border-white/5 active:scale-95 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? '导出中...' : '导出高清卡片'}</span>
              </button>
            </div>

            {/* Color Story Section */}
            {card.story && (
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-black/5 dark:border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-700 dark:text-neutral-200">
                  <BookOpen className="w-4 h-4 text-emerald-500" />
                  <span>色彩人文典故与来源</span>
                </div>
                <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {card.story}
                </p>
              </div>
            )}

            {/* Related Colors Recommendation */}
            {relatedColors.length > 0 && (
              <div className="space-y-2.5 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5" />
                    <span>相关同系灵感色</span>
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {relatedColors.map((rel) => (
                    <button
                      key={rel.id}
                      type="button"
                      onClick={() => onSelectRelatedCard(rel)}
                      className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-black/5 dark:border-white/5 flex flex-col items-start transition-all text-left"
                    >
                      <span
                        className="w-full h-8 rounded-lg mb-1.5 shadow-xs"
                        style={{ backgroundColor: rel.hex }}
                      />
                      <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate w-full">
                        {rel.cnName}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {rel.hex}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
      </motion.div>
    </motion.div>
  );
};
