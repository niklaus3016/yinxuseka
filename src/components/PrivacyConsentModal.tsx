import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, X, FileText, ScrollText, ShieldAlert } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { PrivacyPolicyContent, UserAgreementContent } from './LegalDocuments';

export type LegalDocType = 'privacy' | 'agreement';

const DOC_META: Record<LegalDocType, { title: string; icon: React.ReactNode }> = {
  privacy: { title: '隐私政策', icon: <ShieldCheck className="w-4 h-4" /> },
  agreement: { title: '用户服务协议', icon: <ScrollText className="w-4 h-4" /> },
};

/**
 * 法律文书全文阅读器（《隐私政策》/《用户服务协议》共用）
 * 启动同意流程与设置页均使用本组件，保证全文内容单一来源。
 */
export const LegalDocumentModal: React.FC<{
  doc: LegalDocType;
  onClose: () => void;
}> = ({ doc, onClose }) => {
  const meta = DOC_META[doc];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl h-[85vh] bg-neutral-900 border border-white/10 rounded-3xl flex flex-col shadow-2xl overflow-hidden text-neutral-200"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-neutral-950/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              {meta.icon}
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">{meta.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            title="关闭"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-neutral-950/40 px-5 sm:px-7 py-5">
          {doc === 'privacy' ? <PrivacyPolicyContent /> : <UserAgreementContent />}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-neutral-950/60 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-colors shadow-lg shadow-emerald-500/20"
          >
            我已阅读，返回
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

type GateView = 'consent' | 'decline' | 'blocked';

/**
 * 启动隐私合规门控：未同意用户协议与隐私政策前，阻断应用使用。
 * - 同意：写入本地标记并放行
 * - 拒绝：二次确认；原生端退出 App，Web 端展示阻断页
 */
export const PrivacyConsentGate: React.FC<{ onAccept: () => void }> = ({ onAccept }) => {
  const [view, setView] = useState<GateView>('consent');
  const [docOpen, setDocOpen] = useState<LegalDocType | null>(null);

  const handleDeclineConfirm = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await CapacitorApp.exitApp();
        // 部分平台 exitApp 可能不生效，兜底进入阻断页
        setView('blocked');
      } catch {
        setView('blocked');
      }
    } else {
      setView('blocked');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <AnimatePresence mode="wait">
        {/* 视图一：同意提示 */}
        {view === 'consent' && (
          <motion.div
            key="consent"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="w-full max-w-sm bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
            role="dialog"
            aria-modal="true"
          >
            <div className="p-6 overflow-y-auto">
              {/* Brand */}
              <div className="flex flex-col items-center text-center mb-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-300 flex items-center justify-center shadow-lg shadow-emerald-500/25 mb-3">
                  <ShieldCheck className="w-7 h-7 text-neutral-950" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">用户协议与隐私政策</h3>
                <p className="text-[11px] text-neutral-500 mt-1">欢迎使用「印序色卡」</p>
              </div>

              {/* 合规要点摘要 */}
              <div className="space-y-2.5 mb-5">
                <p className="text-xs text-neutral-300 leading-relaxed flex gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">(1)</span>
                  《隐私政策》中关于个人设备用户信息的收集和使用的说明。
                </p>
                <p className="text-xs text-neutral-300 leading-relaxed flex gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">(2)</span>
                  《隐私政策》中与第三方 SDK 类服务商数据共享、相关信息收集和使用说明。
                </p>
              </div>

              {/* 零采集提示 */}
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300/90 leading-relaxed mb-5">
                本应用为纯本地色彩工具：无需注册登录、不收集个人信息、图片取色不上传服务器，色卡数据仅存于您的设备。
              </div>

              {/* 全文入口 */}
              <p className="text-xs text-neutral-400 leading-relaxed">
                阅读完整的
                <button
                  type="button"
                  onClick={() => setDocOpen('agreement')}
                  className="text-emerald-400 hover:underline font-medium mx-0.5 inline-flex items-center gap-0.5"
                >
                  <ScrollText className="w-3 h-3" />
                  《用户服务协议》
                </button>
                和
                <button
                  type="button"
                  onClick={() => setDocOpen('privacy')}
                  className="text-emerald-400 hover:underline font-medium mx-0.5 inline-flex items-center gap-0.5"
                >
                  <FileText className="w-3 h-3" />
                  《隐私政策》
                </button>
                了解详细内容。
              </p>
            </div>

            {/* 操作按钮 */}
            <div className="flex border-t border-white/10 shrink-0">
              <button
                type="button"
                onClick={() => setView('decline')}
                className="flex-1 py-4 text-sm font-medium text-neutral-400 hover:text-white bg-neutral-900 border-r border-white/10 hover:bg-white/5 transition-colors"
              >
                不同意
              </button>
              <button
                type="button"
                onClick={onAccept}
                className="flex-1 py-4 text-sm font-bold text-neutral-950 bg-emerald-500 hover:bg-emerald-400 transition-colors"
              >
                同意并继续
              </button>
            </div>
          </motion.div>
        )}

        {/* 视图二：拒绝二次确认 */}
        {view === 'decline' && (
          <motion.div
            key="decline"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="w-full max-w-xs bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
            role="alertdialog"
            aria-modal="true"
          >
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-3">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-white mb-2">确认拒绝？</h2>
              <p className="text-xs text-neutral-400 leading-relaxed">
                拒绝后您将无法使用「印序色卡」的全部功能。您可返回重新阅读并同意，或退出应用。
              </p>
            </div>
            <div className="flex border-t border-white/10">
              <button
                type="button"
                onClick={() => setView('consent')}
                className="flex-1 py-3.5 text-sm font-medium text-neutral-300 border-r border-white/10 hover:bg-white/5 transition-colors"
              >
                再看看
              </button>
              <button
                type="button"
                onClick={handleDeclineConfirm}
                className="flex-1 py-3.5 text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                仍要拒绝
              </button>
            </div>
          </motion.div>
        )}

        {/* 视图三：Web 端阻断页（原生端已退出 App） */}
        {view === 'blocked' && (
          <motion.div
            key="blocked"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-xs bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden text-center"
            role="alertdialog"
            aria-modal="true"
          >
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-neutral-800 text-neutral-500 flex items-center justify-center mx-auto mb-3">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-white mb-2">暂无法使用本应用</h2>
              <p className="text-xs text-neutral-400 leading-relaxed mb-5">
                您尚未同意《用户服务协议》与《隐私政策》。请阅读并同意后继续使用。
              </p>
              <button
                type="button"
                onClick={() => setView('consent')}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-colors"
              >
                重新阅读并选择
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 全文阅读器（叠加在任意视图之上） */}
      <AnimatePresence>
        {docOpen && <LegalDocumentModal doc={docOpen} onClose={() => setDocOpen(null)} />}
      </AnimatePresence>
    </motion.div>
  );
};
