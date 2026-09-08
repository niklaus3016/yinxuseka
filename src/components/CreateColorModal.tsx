import React, { useState } from 'react';
import { ColorCard, ColorCategory } from '../types';
import { useColorContext } from '../context/ColorContext';
import { createColorCardFromHex } from '../utils/colorUtils';
import { ColorCardItem } from './ColorCardItem';
import { Sparkles } from 'lucide-react';

interface CreateColorModalProps {
  onSuccess: (card: ColorCard) => void;
}

const CATEGORIES: ColorCategory[] = [
  '大牌流行色',
  '国风传统色',
  '莫兰迪色系',
  '马卡龙色系',
  '复古油画色',
  '高饱和亮色',
];

export const CreateColorModal: React.FC<CreateColorModalProps> = ({ onSuccess }) => {
  const { addCustomColor, showToast } = useColorContext();
  const [hex, setHex] = useState('#002FA7');
  const [cnName, setCnName] = useState('自定义深蓝');
  const [enName, setEnName] = useState('CUSTOM NAVY');
  const [tagInput, setTagInput] = useState('深邃, 理智, 高级');
  const [category, setCategory] = useState<ColorCategory>('大牌流行色');
  const [story, setStory] = useState('');

  // Generate preview card
  const tags = tagInput
    .split(/[,，\s]+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const previewCard = createColorCardFromHex(
    hex,
    cnName || '未命名颜色',
    enName || 'COLOR',
    tags.length > 0 ? tags : ['原创', '自定义'],
    category,
    story || '用户在本地创建的灵感色彩。'
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hex.match(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)) {
      showToast('请输入有效的 Hex 色号，如 #002FA7');
      return;
    }
    if (!cnName.trim()) {
      showToast('请输入中文色名');
      return;
    }

    addCustomColor(previewCard);
    onSuccess(previewCard);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      {/* Form Fields */}
      <form onSubmit={handleSave} className="space-y-4">
        {/* Color picker & Hex input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
            色彩与十六进制码 (HEX)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={hex.startsWith('#') ? hex : `#${hex}`}
              onChange={(e) => setHex(e.target.value.toUpperCase())}
              className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-0"
            />
            <input
              type="text"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              placeholder="#002FA7"
              className="flex-1 px-4 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Names */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
              中文色名
            </label>
            <input
              type="text"
              value={cnName}
              onChange={(e) => setCnName(e.target.value)}
              placeholder="如：琥珀琉璃"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
              英文名称
            </label>
            <input
              type="text"
              value={enName}
              onChange={(e) => setEnName(e.target.value)}
              placeholder="如：AMBER GOLD"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
            寓意标签（逗号或空格分隔）
          </label>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="如：自然, 生机, 平衡"
            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
            所属色系分类
          </label>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  category === cat
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold shadow-xs'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Story */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
            色彩小故事 / 创作灵感（可选）
          </label>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            rows={2}
            placeholder="记录这个色彩背后的故事或使用场景灵感..."
            className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold shadow-md hover:opacity-90 active:scale-95 transition-all"
        >
          保存至本地色库
        </button>
      </form>

      {/* Live Card Preview */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>卡片外观实时预览</span>
        </div>
        <div className="max-w-xs mx-auto">
          <ColorCardItem card={previewCard} showFavoriteButton={false} />
        </div>
      </div>
    </div>
  );
};
