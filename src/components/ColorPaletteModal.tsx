import React, { useMemo, useState } from 'react';
import { ColorCard, PaletteScheme } from '../types';
import { useColorContext } from '../context/ColorContext';
import { generateColorHarmonies } from '../utils/colorUtils';
import { exportPoster } from '../utils/canvasExport';
import { saveImageFile } from '../utils/saveImage';
import { X, Copy, Heart, Download } from 'lucide-react';
import { motion } from 'motion/react';

interface ColorPaletteModalProps {
  baseCard: ColorCard;
  onClose: () => void;
  onSelectColor: (card: ColorCard) => void;
}

export const ColorPaletteModal: React.FC<ColorPaletteModalProps> = ({
  baseCard,
  onClose,
  onSelectColor,
}) => {
  const { copyColor, toggleFavorite, isFavorite, showToast, addCustomColor, getColorById } =
    useColorContext();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isExporting, setIsExporting] = useState(false);

  const schemes: PaletteScheme[] = useMemo(() => generateColorHarmonies(baseCard), [baseCard]);

  const currentScheme = schemes[activeTab] || schemes[0];

  // 生成色需先入库再收藏，避免悬空收藏 id；内置色不重复入库
  const ensureInLibrary = (c: ColorCard) => {
    if (!getColorById(c.id)) addCustomColor(c, true);
  };

  const handleToggleFav = (c: ColorCard) => {
    if (!isFavorite(c.id)) ensureInLibrary(c);
    toggleFavorite(c.id);
  };

  const handleCopyAll = () => {
    const hexList = currentScheme.colors.map((c) => `${c.cnName}: ${c.hex}`).join('\n');
    navigator.clipboard.writeText(hexList).then(() => {
      showToast(`已复制整套配色共 ${currentScheme.colors.length} 个色号`);
    });
  };

  const handleCollectAll = () => {
    // 先确保生成色全部入库（内置色自动跳过），再静默批量收藏
    currentScheme.colors.forEach((c) => ensureInLibrary(c));
    currentScheme.colors.forEach((c) => {
      if (!isFavorite(c.id)) toggleFavorite(c.id, true);
    });
    showToast('已将整套配色存入收藏夹 ❤️');
  };

  const handleExportSchemePoster = async () => {
    try {
      setIsExporting(true);
      showToast('正在合成配色方案海报...');
      const posterTitle = `印序色卡 · ${baseCard.cnName} ${currentScheme.title}`;
      const dataUrl = await exportPoster(posterTitle, currentScheme.colors);
      const result = await saveImageFile(dataUrl, `印序配色_${baseCard.cnName}_${currentScheme.enTitle}.png`);
      showToast(
        result === 'shared'
          ? '已生成海报，可在分享面板选择「保存到相册」🎉'
          : '配色海报已保存至本地 🎉'
      );
    } catch (err) {
      console.error(err);
      showToast('导出海报失败');
    } finally {
      setIsExporting(false);
    }
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
        className="relative w-full max-w-xl h-[92vh] sm:h-auto sm:max-h-[88vh] bg-white dark:bg-neutral-900 rounded-t-4xl sm:rounded-4xl flex flex-col overflow-hidden shadow-2xl border border-black/10 dark:border-white/10"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className="w-4 h-4 rounded-full shadow-inner ring-2 ring-white/50 dark:ring-black/50"
              style={{ backgroundColor: baseCard.hex }}
            />
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                <span>{baseCard.cnName} · 智能配色方案</span>
              </h3>
              <p className="text-[10px] font-mono text-neutral-400">
                基准主色 {baseCard.hex}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: 4 Schemes */}
        <div className="px-5 pt-3 pb-2 flex gap-1.5 overflow-x-auto no-scrollbar border-b border-neutral-100 dark:border-neutral-800 shrink-0">
          {schemes.map((sch, idx) => (
            <button
              key={sch.id}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === idx
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
              }`}
            >
              {sch.title}
            </button>
          ))}
        </div>

        {/* Scheme Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Scheme Banner */}
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-black/5 dark:border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900 dark:text-white">
                {currentScheme.title} ({currentScheme.enTitle})
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                {currentScheme.colors.length} 色组合
              </span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {currentScheme.description}
            </p>

            {/* Seamless Palette Bar */}
            <div className="h-8 rounded-xl flex overflow-hidden shadow-inner mt-2">
              {currentScheme.colors.map((c, i) => (
                <div
                  key={i}
                  className="flex-1 h-full cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: c.hex }}
                  title={`${c.cnName} (${c.hex})`}
                  onClick={() => copyColor(c, 'hex')}
                />
              ))}
            </div>
          </div>

          {/* Color Cards in Scheme */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              配色组色卡清单
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentScheme.colors.map((cardItem) => {
                const fav = isFavorite(cardItem.id);
                return (
                  <div
                    key={cardItem.id}
                    className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-black/5 dark:border-white/5 flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                  >
                    <div
                      className="flex items-center gap-3 cursor-pointer flex-1 overflow-hidden mr-2"
                      onClick={() => onSelectColor(cardItem)}
                    >
                      <div
                        className="w-12 h-12 rounded-xl shadow-inner shrink-0"
                        style={{ backgroundColor: cardItem.hex }}
                      />
                      <div className="truncate">
                        <div className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                          {cardItem.cnName}
                        </div>
                        <div className="text-[10px] font-mono text-neutral-400">
                          {cardItem.hex}
                        </div>
                        <div className="text-[9px] text-neutral-500 font-mono">
                          {cardItem.cmyk.c}/{cardItem.cmyk.m}/{cardItem.cmyk.y}/{cardItem.cmyk.k}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => copyColor(cardItem, 'hex')}
                        className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 transition-colors"
                        title="复制 Hex"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleFav(cardItem)}
                        className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 transition-colors"
                        title={fav ? '已收藏' : '收藏'}
                      >
                        <Heart
                          className="w-3.5 h-3.5"
                          style={{
                            fill: fav ? '#EF4444' : 'none',
                            stroke: fav ? '#EF4444' : 'currentColor',
                          }}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scheme Actions: Copy all, collect all, export poster */}
          <div className="pt-2 grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={handleCopyAll}
              className="flex items-center justify-center gap-1.5 py-3 px-2 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-white text-xs font-semibold transition-all active:scale-95"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>复制全色号</span>
            </button>

            <button
              type="button"
              onClick={handleCollectAll}
              className="flex items-center justify-center gap-1.5 py-3 px-2 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-white text-xs font-semibold transition-all active:scale-95"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>整套收藏</span>
            </button>

            <button
              type="button"
              onClick={handleExportSchemePoster}
              disabled={isExporting}
              className="flex items-center justify-center gap-1.5 py-3 px-2 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold shadow-md hover:opacity-90 transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? '生成中...' : '整套导出海报'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
