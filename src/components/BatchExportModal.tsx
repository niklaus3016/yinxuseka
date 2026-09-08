import React, { useState } from 'react';
import { ColorCard } from '../types';
import { exportPoster } from '../utils/canvasExport';
import { saveImageFile } from '../utils/saveImage';
import { useColorContext } from '../context/ColorContext';
import { X, Download, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface BatchExportModalProps {
  selectedCards: ColorCard[];
  onClose: () => void;
  onClearSelection: () => void;
}

export const BatchExportModal: React.FC<BatchExportModalProps> = ({
  selectedCards,
  onClose,
  onClearSelection,
}) => {
  const { showToast } = useColorContext();
  const [posterTitle, setPosterTitle] = useState('印序色卡 · 精选色彩集');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      showToast('正在拼接导出高清色彩海报...');
      const dataUrl = await exportPoster(posterTitle, selectedCards);
      const result = await saveImageFile(dataUrl, `${posterTitle}.png`);
      showToast(
        result === 'shared'
          ? '已生成海报，可在分享面板选择「保存到相册」🎉'
          : '海报已保存到本地 🎉'
      );
      onClearSelection();
      onClose();
    } catch (err) {
      console.error(err);
      showToast('导出海报失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
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
        className="relative w-full max-w-lg max-h-[90vh] bg-white dark:bg-neutral-900 rounded-t-4xl sm:rounded-4xl flex flex-col overflow-hidden shadow-2xl border border-black/10 dark:border-white/10"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              多色卡拼接海报导出 ({selectedCards.length} 个色彩)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
              海报主标题
            </label>
            <input
              type="text"
              value={posterTitle}
              onChange={(e) => setPosterTitle(e.target.value)}
              placeholder="海报标题"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
              已选颜色列表
            </label>
            <div className="grid grid-cols-4 gap-2">
              {selectedCards.map((c) => (
                <div
                  key={c.id}
                  className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-black/5 dark:border-white/5 flex flex-col items-center text-center"
                >
                  <span
                    className="w-full h-9 rounded-lg shadow-xs mb-1"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 truncate w-full">
                    {c.cnName}
                  </span>
                  <span className="text-[9px] font-mono text-neutral-400 truncate w-full">
                    {c.hex}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 flex gap-3">
          <button
            type="button"
            onClick={onClearSelection}
            className="px-4 py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs font-semibold hover:bg-neutral-200 active:scale-95 transition-all"
          >
            清空已选
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold shadow-md hover:opacity-90 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? '合成海报中...' : '一键导出至相册'}</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
