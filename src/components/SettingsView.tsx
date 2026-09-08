import React, { useState } from 'react';
import { useColorContext } from '../context/ColorContext';
import { LegalDocumentModal, LegalDocType } from './PrivacyConsentModal';
import { CardTemplate, CopyFormat } from '../types';
import {
  ShieldCheck,
  FileText,
  ScrollText,
  Info,
  ChevronRight,
  Palette,
  LayoutGrid,
  Sparkles,
  Smartphone,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    showToast,
  } = useColorContext();

  const [legalDoc, setLegalDoc] = useState<LegalDocType | null>(null);

  const handleTemplateChange = (template: CardTemplate) => {
    updateSettings({ template });
    showToast('已更新色卡排版样式');
  };

  const handleFormatChange = (defaultCopyFormat: CopyFormat) => {
    updateSettings({ defaultCopyFormat });
    showToast(`默认复制格式已设置为 ${defaultCopyFormat.toUpperCase()}`);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6 pb-28 text-neutral-200">
      {/* App Header / Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-3xl bg-neutral-900 border border-white/10 shadow-xl flex flex-col items-center text-center relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-300 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-3">
          <span className="text-neutral-950 font-black text-2xl font-serif">印</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>印序色卡</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold uppercase">
            v1.0
          </span>
        </h2>
        <p className="text-xs text-neutral-400 mt-1 max-w-sm">
          全球名贵大牌流行色 · 国风传统雅色 · 移动端色彩美学灵感库
        </p>
      </motion.div>

      {/* 软件说明板块 (Software Description) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="p-5 rounded-3xl bg-neutral-900 border border-white/10 space-y-4"
      >
        <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-white/10 pb-3">
          <Info className="w-4 h-4 text-cyan-400" />
          <span>软件说明</span>
        </div>

        <div className="text-xs text-neutral-300 leading-relaxed space-y-3">
          <p>
            「印序色卡」专为平面设计师、UI/UX 设计师、插画师、时尚潮人及色彩美学探索者打造，精选全球名牌经典流行色与中国传统正色。
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="font-semibold text-emerald-400 mb-1 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                <span>四维工业色彩参数</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                支持精确 HEX、RGB、印刷 CMYK 及 HSB 数值换算，轻点即刻快捷复制。
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="font-semibold text-teal-400 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>四维智能配色引擎</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                互补对撞、同类调和、三元平衡与阶进衍生，快速激发设计调色灵感。
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="font-semibold text-cyan-400 mb-1 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" />
                <span>相册提取与创作</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                基于端侧 K-Means 聚类提取照片中的高级主色，支持自定义色彩卡片。
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="font-semibold text-amber-400 mb-1 flex items-center gap-1.5">
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>海报拼接与导出</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                多色卡一键排版，生成高分辨率移动端色彩海报无损保存至本地。
              </p>
            </div>
          </div>

          <p className="text-[11px] text-neutral-400 border-t border-white/5 pt-3">
            <strong>色彩使用声明：</strong>软件所收录之流行色名称及品牌历史典故仅作为文化鉴赏与设计审美参考；RGB 至 CMYK 转换采用行业标准色彩空间算法，实际印刷请以标准色票打样为准。
          </p>
        </div>
      </motion.div>

      {/* 隐私政策与安全合规按钮 (Privacy Policy Entry) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-5 rounded-3xl bg-neutral-900 border border-white/10 space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>隐私保护与权限</span>
          </div>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            端侧沙盒运行
          </span>
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed">
          我们高度重视您的隐私安全，本软件无需任何登录、不追踪用户轨迹、所有相册图像提取均在手机本地执行。
        </p>

        {/* 隐私政策按钮（点击弹窗） */}
        <button
          type="button"
          onClick={() => setLegalDoc('privacy')}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs transition-colors group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-white">隐私政策</div>
              <div className="text-[10px] text-neutral-400">了解权限使用原则与数据保护条例</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* 用户服务协议按钮（点击弹窗） */}
        <button
          type="button"
          onClick={() => setLegalDoc('agreement')}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs transition-colors group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center">
              <ScrollText className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-white">用户服务协议</div>
              <div className="text-[10px] text-neutral-400">服务内容、双方权利义务与免责条款</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
        </button>
      </motion.div>

      {/* 偏好与排版设置 */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-5 rounded-3xl bg-neutral-900 border border-white/10 space-y-4"
      >
        <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-white/10 pb-3">
          <LayoutGrid className="w-4 h-4 text-cyan-400" />
          <span>外观模板与格式偏好</span>
        </div>

        {/* 卡片模板选择 */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-300">色卡视觉风格</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'classic' as CardTemplate, name: '经典原版', desc: '样图复刻' },
              { id: 'minimal' as CardTemplate, name: '极简流光', desc: '纯粹现代' },
              { id: 'oriental' as CardTemplate, name: '国风雅韵', desc: '印章质感' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTemplateChange(item.id)}
                className={`p-2.5 rounded-2xl border text-center transition-all ${
                  settings.template === item.id
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    : 'bg-white/5 border-white/5 text-neutral-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold">{item.name}</div>
                <div className="text-[10px] opacity-75 mt-0.5">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 默认快速复制格式 */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold text-neutral-300">点击快捷复制格式</label>
          <div className="grid grid-cols-4 gap-2">
            {(['hex', 'rgb', 'cmyk', 'hsb'] as CopyFormat[]).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => handleFormatChange(fmt)}
                className={`py-2 rounded-xl border text-center transition-all ${
                  settings.defaultCopyFormat === fmt
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold'
                    : 'bg-white/5 border-white/5 text-neutral-400 hover:text-white font-medium'
                } text-xs font-mono`}
              >
                {fmt.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 法律文书全文弹窗（隐私政策 / 用户服务协议） */}
      <AnimatePresence>
        {legalDoc && (
          <LegalDocumentModal doc={legalDoc} onClose={() => setLegalDoc(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};
