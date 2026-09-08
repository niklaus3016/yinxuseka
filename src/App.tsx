import React, { useState, useMemo } from 'react';
import { ColorProvider, useColorContext } from './context/ColorContext';
import { ColorCard, ColorCategory } from './types';
import { Navbar } from './components/Navbar';
import { TabBar, ActiveTab } from './components/TabBar';
import { ColorCardItem } from './components/ColorCardItem';
import { ColorDetailModal } from './components/ColorDetailModal';
import { FullScreenColor } from './components/FullScreenColor';
import { ColorPaletteModal } from './components/ColorPaletteModal';
import { PhotoColorPicker } from './components/PhotoColorPicker';
import { CreateColorModal } from './components/CreateColorModal';
import { BatchExportModal } from './components/BatchExportModal';
import { HistoryModal } from './components/HistoryModal';
import { RandomColorModal } from './components/RandomColorModal';
import { SettingsView } from './components/SettingsView';
import { PrivacyConsentGate } from './components/PrivacyConsentModal';
import { Toast } from './components/Toast';
import {
  Search,
  X,
  Heart,
  Image as ImageIcon,
  PenTool,
  Trash2,
  CheckCircle2,
  Palette,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES: (ColorCategory | '全部')[] = [
  '全部',
  '大牌流行色',
  '国风传统色',
  '莫兰迪色系',
  '马卡龙色系',
  '复古油画色',
  '高饱和亮色',
];

// 用户协议与隐私政策同意标记（版本化，政策更新后可升级 key 重新征求同意）
const PRIVACY_CONSENT_KEY = 'yinxu_privacy_consent_v1';

const MainContent: React.FC = () => {
  const { allColors, favorites, getColorById, addToHistory, batchRemoveFavorites } =
    useColorContext();

  // Navigation & Modals state
  const [activeTab, setActiveTab] = useState<ActiveTab>('library');
  const [selectedCategory, setSelectedCategory] = useState<ColorCategory | '全部'>('全部');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [activeDetailCard, setActiveDetailCard] = useState<ColorCard | null>(null);
  const [fullScreenCard, setFullScreenCard] = useState<ColorCard | null>(null);
  const [harmonyBaseCard, setHarmonyBaseCard] = useState<ColorCard | null>(null);
  const [showRandomModal, setShowRandomModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showBatchExportModal, setShowBatchExportModal] = useState(false);

  // Multi-select mode for poster export
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);

  // Creation tab sub-view: 'photo' | 'manual'
  const [creationSubTab, setCreationSubTab] = useState<'photo' | 'manual'>('photo');

  // 隐私政策同意门控：未同意时启动页弹出协议弹窗
  const [privacyConsented, setPrivacyConsented] = useState<boolean>(() => {
    try {
      return localStorage.getItem(PRIVACY_CONSENT_KEY) === '1';
    } catch {
      return false;
    }
  });

  const handleAcceptPrivacy = () => {
    try {
      localStorage.setItem(PRIVACY_CONSENT_KEY, '1');
    } catch {
      // 隐私模式等场景写入失败时仅本次会话放行
    }
    setPrivacyConsented(true);
  };

  // Filtered colors for library
  const filteredColors = useMemo(() => {
    return allColors.filter((card) => {
      // Category filter
      if (selectedCategory !== '全部' && card.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchCn = card.cnName.toLowerCase().includes(query);
        const matchEn = card.enName.toLowerCase().includes(query);
        const matchHex = card.hex.toLowerCase().includes(query);
        const matchTag = card.tags.some((t) => t.toLowerCase().includes(query));
        return matchCn || matchEn || matchHex || matchTag;
      }
      return true;
    });
  }, [allColors, selectedCategory, searchQuery]);

  // Favorited cards list
  const favoriteCards = useMemo(() => {
    return favorites
      .map((id) => getColorById(id))
      .filter((c): c is ColorCard => c !== undefined);
  }, [favorites, getColorById]);

  // Open detail handler
  const handleOpenDetail = (card: ColorCard) => {
    addToHistory(card.id);
    setActiveDetailCard(card);
  };

  // Toggle multi-select card
  const handleToggleCardSelection = (id: string) => {
    setSelectedCardIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBatchRemoveFavs = () => {
    if (selectedCardIds.length === 0) return;
    batchRemoveFavorites(selectedCardIds);
    setSelectedCardIds([]);
  };

  const selectedCardsForExport = useMemo(() => {
    return selectedCardIds
      .map((id) => getColorById(id))
      .filter((c): c is ColorCard => c !== undefined);
  }, [selectedCardIds, getColorById]);

  // 切换 Tab 时退出多选模式，避免状态跨页残留
  const handleChangeTab = (tab: ActiveTab) => {
    setIsMultiSelectMode(false);
    setSelectedCardIds([]);
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      <Toast />

      {/* Top Navigation */}
      <Navbar
        isMultiSelect={isMultiSelectMode}
        onToggleMultiSelect={() => {
          setIsMultiSelectMode(!isMultiSelectMode);
          if (isMultiSelectMode) setSelectedCardIds([]);
        }}
        onOpenHistory={() => setShowHistoryModal(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 pt-3 pb-28">
        {/* TAB 1: 色卡库 (Library) */}
        {activeTab === 'library' && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索色彩名（如克莱因蓝）、英文名、Hex色号（#002FA7）..."
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-neutral-800/80 border border-white/10 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 backdrop-blur-md transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-white text-neutral-900 shadow-md scale-102'
                      : 'bg-neutral-800/60 text-neutral-300 hover:bg-neutral-800 border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Multi-Select Toolbar (if active) */}
            {isMultiSelectMode && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>已勾选 {selectedCardIds.length} 张色卡</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedCardIds.length === filteredColors.length) {
                        setSelectedCardIds([]);
                      } else {
                        setSelectedCardIds(filteredColors.map((c) => c.id));
                      }
                    }}
                    className="px-3 py-1 rounded-xl bg-neutral-800 text-neutral-200 text-xs font-medium hover:bg-neutral-700"
                  >
                    {selectedCardIds.length === filteredColors.length ? '取消全选' : '全选当前'}
                  </button>
                  <button
                    type="button"
                    disabled={selectedCardIds.length === 0}
                    onClick={() => setShowBatchExportModal(true)}
                    className="px-3 py-1 rounded-xl bg-emerald-500 text-neutral-950 text-xs font-bold disabled:opacity-40 hover:bg-emerald-400"
                  >
                    生成海报
                  </button>
                </div>
              </motion.div>
            )}

            {/* Colors Grid (Double column on mobile as requested in PRD) */}
            {filteredColors.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <Palette className="w-12 h-12 text-neutral-600 mx-auto opacity-50" />
                <h4 className="text-sm font-bold text-neutral-300">未找到匹配的色彩</h4>
                <p className="text-xs text-neutral-500">
                  试着调整搜索关键词，或前往「创作」生成专属色卡
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('全部');
                  }}
                  className="px-4 py-2 rounded-full bg-neutral-800 text-xs font-medium hover:bg-neutral-700"
                >
                  重置筛选条件
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {filteredColors.map((card) => (
                  <ColorCardItem
                    key={card.id}
                    card={card}
                    onSelect={() => handleOpenDetail(card)}
                    isMultiSelectMode={isMultiSelectMode}
                    isSelected={selectedCardIds.includes(card.id)}
                    onToggleSelect={() => handleToggleCardSelection(card.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: 收藏夹 (Favorites) */}
        {activeTab === 'favorites' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>我的灵感收藏</span>
                  <span className="text-xs font-mono text-neutral-400 px-2 py-0.5 rounded-full bg-neutral-800">
                    {favoriteCards.length}
                  </span>
                </h2>
                <p className="text-xs text-neutral-400">已沉淀的挚爱色彩，随时提取与搭配</p>
              </div>

              {favoriteCards.length > 0 && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMultiSelectMode(!isMultiSelectMode);
                      if (isMultiSelectMode) setSelectedCardIds([]);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isMultiSelectMode
                        ? 'bg-rose-500 text-white'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {isMultiSelectMode ? '完成管理' : '批量管理'}
                  </button>
                </div>
              )}
            </div>

            {/* Multi-select batch bar in favorites */}
            {isMultiSelectMode && favoriteCards.length > 0 && (
              <div className="p-3 rounded-2xl bg-neutral-800 border border-white/10 flex items-center justify-between">
                <span className="text-xs text-neutral-300">
                  已选择 {selectedCardIds.length} 个收藏
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={selectedCardIds.length === 0}
                    onClick={() => setShowBatchExportModal(true)}
                    className="px-3 py-1 rounded-xl bg-white text-neutral-900 text-xs font-bold disabled:opacity-40"
                  >
                    拼图导出
                  </button>
                  <button
                    type="button"
                    disabled={selectedCardIds.length === 0}
                    onClick={handleBatchRemoveFavs}
                    className="px-3 py-1 rounded-xl bg-rose-500 text-white text-xs font-bold disabled:opacity-40 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>批量移除</span>
                  </button>
                </div>
              </div>
            )}

            {/* Empty state or Grid */}
            {favoriteCards.length === 0 ? (
              <div className="text-center py-20 px-4 space-y-3 bg-neutral-800/30 rounded-3xl border border-white/5">
                <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-neutral-200">
                  还没有收藏颜色
                </h3>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                  点击任意色卡右下角的爱心，即可收藏进你的私属色彩库，随时汲取设计灵感
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('library')}
                  className="mt-2 px-5 py-2.5 rounded-full bg-white text-neutral-900 text-xs font-bold shadow-md hover:bg-neutral-200 transition-all active:scale-95"
                >
                  前往色卡库探索
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {favoriteCards.map((card) => (
                  <ColorCardItem
                    key={card.id}
                    card={card}
                    onSelect={() => handleOpenDetail(card)}
                    isMultiSelectMode={isMultiSelectMode}
                    isSelected={selectedCardIds.includes(card.id)}
                    onToggleSelect={() => handleToggleCardSelection(card.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: 创作 (Creation: Photo Eyedropper + Custom) */}
        {activeTab === 'create' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-white">灵感创作工房</h2>
              <p className="text-xs text-neutral-400">
                支持相册取色与参数自定，所有数据仅存储在手机本地
              </p>
            </div>

            {/* Sub-tab segmented control */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-neutral-800 border border-white/5">
              <button
                type="button"
                onClick={() => setCreationSubTab('photo')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  creationSubTab === 'photo'
                    ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>📷 相册图片取色</span>
              </button>

              <button
                type="button"
                onClick={() => setCreationSubTab('manual')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  creationSubTab === 'manual'
                    ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <PenTool className="w-4 h-4" />
                <span>✏ 手动创建色卡</span>
              </button>
            </div>

            {/* Content for active sub-tab */}
            <div className="p-4 sm:p-5 rounded-3xl bg-neutral-800/50 border border-white/5 shadow-xl">
              {creationSubTab === 'photo' ? (
                <PhotoColorPicker
                  onCardCreated={() => {
                    setActiveTab('library');
                  }}
                />
              ) : (
                <CreateColorModal
                  onSuccess={() => {
                    setActiveTab('library');
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* TAB 4: 设置 (Settings & Software Info) */}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Docked Tab Bar */}
      <TabBar
        activeTab={activeTab}
        onChangeTab={handleChangeTab}
        onRandomPick={() => setShowRandomModal(true)}
        favoritesCount={favorites?.length ?? 0}
      />

      <AnimatePresence>
        {/* 1. Color Detail Modal */}
        {activeDetailCard && (
          <ColorDetailModal
            key="detail"
            card={activeDetailCard}
            onClose={() => setActiveDetailCard(null)}
            onOpenHarmonies={(card) => {
              setActiveDetailCard(null);
              setHarmonyBaseCard(card);
            }}
            onOpenFullScreen={(card) => {
              setFullScreenCard(card);
            }}
            onSelectRelatedCard={(related) => {
              handleOpenDetail(related);
            }}
          />
        )}

        {/* 2. Fullscreen Pure Color Preview */}
        {fullScreenCard && (
          <FullScreenColor
            key="fullscreen"
            card={fullScreenCard}
            onClose={() => setFullScreenCard(null)}
          />
        )}

        {/* 3. Color Harmony Scheme Generator */}
        {harmonyBaseCard && (
          <ColorPaletteModal
            key="palette"
            baseCard={harmonyBaseCard}
            onClose={() => setHarmonyBaseCard(null)}
            onSelectColor={(card) => {
              setHarmonyBaseCard(null);
              handleOpenDetail(card);
            }}
          />
        )}

        {/* 4. Batch Export Poster Modal */}
        {showBatchExportModal && (
          <BatchExportModal
            key="batch"
            selectedCards={selectedCardsForExport}
            onClose={() => setShowBatchExportModal(false)}
            onClearSelection={() => {
              setSelectedCardIds([]);
              setIsMultiSelectMode(false);
            }}
          />
        )}

        {/* 5. Random Color Inspiration Modal */}
        {showRandomModal && (
          <RandomColorModal
            key="random"
            onClose={() => setShowRandomModal(false)}
            onOpenDetail={(card) => {
              setShowRandomModal(false);
              handleOpenDetail(card);
            }}
          />
        )}

        {/* 6. History Modal */}
        {showHistoryModal && (
          <HistoryModal
            key="history"
            onClose={() => setShowHistoryModal(false)}
            onSelectColor={(card) => {
              handleOpenDetail(card);
            }}
          />
        )}
      </AnimatePresence>

      {/* 7. 启动隐私合规门控：未同意用户协议与隐私政策前阻断应用 */}
      <AnimatePresence>
        {!privacyConsented && (
          <PrivacyConsentGate key="privacy-gate" onAccept={handleAcceptPrivacy} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <ColorProvider>
      <MainContent />
    </ColorProvider>
  );
}
