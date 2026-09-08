import React, { useRef, useState, useEffect } from 'react';
import { useColorContext } from '../context/ColorContext';
import { ColorCategory } from '../types';
import { createColorCardFromHex, rgbToHex } from '../utils/colorUtils';
import { Upload, Sparkles, Check, Image as ImageIcon } from 'lucide-react';

const CATEGORY_OPTIONS: ColorCategory[] = [
  '大牌流行色',
  '国风传统色',
  '莫兰迪色系',
  '马卡龙色系',
  '复古油画色',
  '高饱和亮色',
];

interface PhotoColorPickerProps {
  onCardCreated: () => void;
}

export const PhotoColorPicker: React.FC<PhotoColorPickerProps> = ({ onCardCreated }) => {
  const { addCustomColor, showToast } = useColorContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [pickedHex, setPickedHex] = useState<string>('#6ECC54');
  const [extractedPalette, setExtractedPalette] = useState<string[]>([]);
  const [customName, setCustomName] = useState('');
  const [customTag, setCustomTag] = useState('摄影灵感');
  const [pickCategory, setPickCategory] = useState<ColorCategory>('大牌流行色');
  const [magnifierPos, setMagnifierPos] = useState<{ x: number; y: number } | null>(null);

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Render image to canvas when loaded and extract dominant colors
  useEffect(() => {
    if (!imageSrc || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Scale canvas to fit nicely
      const maxWidth = 600;
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Extract 6 dominant distinct colors
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const sampleGap = 16;
      const colorBucket: Record<string, number> = {};

      for (let i = 0; i < imgData.length; i += 4 * sampleGap) {
        const r = Math.round(imgData[i] / 24) * 24;
        const g = Math.round(imgData[i + 1] / 24) * 24;
        const b = Math.round(imgData[i + 2] / 24) * 24;
        const hex = rgbToHex(r, g, b);
        colorBucket[hex] = (colorBucket[hex] || 0) + 1;
      }

      const sorted = Object.entries(colorBucket)
        .sort((a, b) => b[1] - a[1])
        .map(([hex]) => hex)
        .slice(0, 6);

      setExtractedPalette(sorted);
      if (sorted[0]) {
        setPickedHex(sorted[0]);
      }
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Touch / mouse picking on canvas
  const handleCanvasPointer = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let clientX = 0;
    let clientY = 0;
    if ('touches' in e) {
      if (!e.touches[0]) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = Math.floor(((clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((clientY - rect.top) / rect.height) * canvas.height);

    if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
      setPickedHex(hex);
      setMagnifierPos({ x: clientX - rect.left, y: clientY - rect.top });
    }
  };

  const handleSaveAsCard = () => {
    const newCard = createColorCardFromHex(
      pickedHex,
      customName || '自定义色卡',
      'CUSTOM COLOR',
      [customTag || '相册提取', '原创'],
      pickCategory,
      '从本地相册图片中汲取的色彩灵感。'
    );
    addCustomColor(newCard);
    onCardCreated();
  };

  return (
    <div className="space-y-4">
      {/* File upload prompt */}
      {!imageSrc ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500 transition-colors bg-neutral-50/50 dark:bg-neutral-800/30"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
            <Upload className="w-7 h-7" />
          </div>
          <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
            点击或拖拽相册图片取色
          </h4>
          <p className="text-xs text-neutral-400 mt-1 max-w-xs">
            支持 JPG、PNG 等格式，纯本地在手机内存中取色，绝不上载任何隐私数据
          </p>
          <button
            type="button"
            className="mt-4 px-4 py-2 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold shadow-xs"
          >
            打开本地相册
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Canvas container */}
          <div className="relative rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 flex items-center justify-center max-h-[320px]">
            <canvas
              ref={canvasRef}
              onMouseDown={handleCanvasPointer}
              onMouseMove={(e) => {
                if (e.buttons === 1) handleCanvasPointer(e);
              }}
              onMouseLeave={() => setMagnifierPos(null)}
              onTouchStart={handleCanvasPointer}
              onTouchMove={handleCanvasPointer}
              onTouchEnd={() => setMagnifierPos(null)}
              className="max-h-[320px] object-contain cursor-crosshair touch-none"
            />

            {/* 取色位置放大镜指示 */}
            {magnifierPos && (
              <div
                className="absolute pointer-events-none z-20 w-12 h-12 rounded-full border-[3px] border-white/90 shadow-lg"
                style={{
                  backgroundColor: pickedHex,
                  left: (canvasRef.current?.offsetLeft ?? 0) + magnifierPos.x - 24,
                  top: (canvasRef.current?.offsetTop ?? 0) + magnifierPos.y - 24,
                }}
              />
            )}

            {/* Change photo button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1.5 hover:bg-black/80"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>更换图片</span>
            </button>
          </div>

          {/* Extracted dominant palette */}
          {extractedPalette.length > 0 && (
            <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-black/5 dark:border-white/5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 dark:text-neutral-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>画面主体提取色</span>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {extractedPalette.map((hex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPickedHex(hex)}
                    className={`aspect-square rounded-xl transition-all relative ${
                      pickedHex === hex ? 'scale-110 ring-2 ring-emerald-500' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: hex }}
                    title={hex}
                  >
                    {pickedHex === hex && (
                      <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow-md">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 选择色卡分类 */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {CATEGORY_OPTIONS.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setPickCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                  pickCategory === cat
                    ? 'bg-emerald-500 text-neutral-950'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-black/5 dark:border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Current selected color card generator */}
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-black/5 dark:border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div
                className="w-14 h-14 rounded-2xl shadow-inner shrink-0 ring-2 ring-white/20"
                style={{ backgroundColor: pickedHex }}
              />
              <div className="space-y-1 flex-1">
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="色卡名称（可选）"
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 w-full focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <div className="flex gap-2">
                  <span className="text-xs font-mono font-bold text-neutral-600 dark:text-neutral-300">
                    {pickedHex}
                  </span>
                  <input
                    type="text"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    placeholder="标签，如: 极简"
                    className="px-2 py-0.5 text-[10px] rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 w-24 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveAsCard}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold shadow-md hover:opacity-90 active:scale-95 transition-all whitespace-nowrap"
            >
              保存为色卡
            </button>
          </div>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
