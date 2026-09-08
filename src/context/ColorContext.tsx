import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { INITIAL_COLORS } from '../data/colors';
import { AppSettings, ColorCard, CopyFormat } from '../types';
import { formatColorValue } from '../utils/colorUtils';

export interface ToastNotification {
  id: number;
  text: string;
}

interface ColorContextType {
  allColors: ColorCard[];
  customColors: ColorCard[];
  favorites: string[];
  history: string[];
  settings: AppSettings;
  toastNotification: ToastNotification | null;
  toggleFavorite: (id: string, silent?: boolean) => void;
  isFavorite: (id: string) => boolean;
  batchRemoveFavorites: (ids: string[]) => void;
  addCustomColor: (card: ColorCard, silent?: boolean) => void;
  deleteCustomColor: (id: string) => void;
  addToHistory: (id: string) => void;
  clearHistory: () => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  copyColor: (card: ColorCard, format?: CopyFormat) => void;
  showToast: (msg: string) => void;
  getColorById: (id: string) => ColorCard | undefined;
}

const STORAGE_KEYS = {
  FAVORITES: 'yinxu_favorites_v1',
  CUSTOM: 'yinxu_custom_colors_v1',
  HISTORY: 'yinxu_history_v1',
  SETTINGS: 'yinxu_settings_v1',
};

const DEFAULT_SETTINGS: AppSettings = {
  template: 'classic',
  defaultCopyFormat: 'hex',
};

const ColorContext = createContext<ColorContextType | null>(null);

export const ColorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customColors, setCustomColors] = useState<ColorCard[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return stored ? JSON.parse(stored) : ['c_marrs_green', 'c_klein_blue', 'c_hermes_orange'];
    } catch {
      return ['c_marrs_green', 'c_klein_blue', 'c_hermes_orange'];
    }
  });

  const [history, setHistory] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [toastNotification, setToastNotification] = useState<ToastNotification | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM, JSON.stringify(customColors));
    } catch (e) {
      console.error(e);
    }
  }, [customColors]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  // Enforce dark theme permanently on root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    root.classList.remove('light');
  }, []);

  const allColors = useMemo(() => {
    return [...customColors, ...INITIAL_COLORS];
  }, [customColors]);

  const showToast = (msg: string) => {
    // 每次都生成新对象，保证相同文案连续触发也能弹出
    setToastNotification({ id: Date.now() + Math.random(), text: msg });
  };

  const isFavorite = (id: string) => {
    return favorites.includes(id);
  };

  const toggleFavorite = (id: string, silent = false) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      if (!silent) {
        showToast(exists ? '已取消收藏' : '已加入收藏夹 ❤️');
      }
      if (exists) {
        return prev.filter((item) => item !== id);
      }
      return [id, ...prev];
    });
  };

  const batchRemoveFavorites = (ids: string[]) => {
    setFavorites((prev) => prev.filter((id) => !ids.includes(id)));
    showToast(`已批量移除 ${ids.length} 个收藏`);
  };

  const addCustomColor = (card: ColorCard) => {
    setCustomColors((prev) => [card, ...prev]);
    showToast(`已创建色卡「${card.cnName}」`);
  };

  const deleteCustomColor = (id: string) => {
    setCustomColors((prev) => prev.filter((c) => c.id !== id));
    setFavorites((prev) => prev.filter((fId) => fId !== id));
    showToast('已删除自定义色卡');
  };

  const addToHistory = (id: string) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item !== id);
      return [id, ...filtered].slice(0, 50);
    });
  };

  const clearHistory = () => {
    setHistory([]);
    showToast('已清空浏览历史');
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const copyColor = (card: ColorCard, format?: CopyFormat) => {
    const fmt = format || settings.defaultCopyFormat;
    const value = formatColorValue(card, fmt);

    navigator.clipboard
      .writeText(value)
      .then(() => {
        showToast(`已复制 ${fmt.toUpperCase()}: ${value}`);
      })
      .catch(() => {
        // 兜底：部分 Android WebView 非安全上下文没有 Clipboard API，用 execCommand 复制
        const textarea = document.createElement('textarea');
        textarea.value = value;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`已复制 ${fmt.toUpperCase()}: ${value}`);
      });
  };

  const getColorById = (id: string): ColorCard | undefined => {
    return allColors.find((c) => c.id === id);
  };

  return (
    <ColorContext.Provider
      value={{
        allColors,
        customColors,
        favorites,
        history,
        settings,
        toastNotification,
        toggleFavorite,
        isFavorite,
        batchRemoveFavorites,
        addCustomColor,
        deleteCustomColor,
        addToHistory,
        clearHistory,
        updateSettings,
        copyColor,
        showToast,
        getColorById,
      }}
    >
      {children}
    </ColorContext.Provider>
  );
};

export const useColorContext = () => {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error('useColorContext must be used within a ColorProvider');
  }
  return context;
};
