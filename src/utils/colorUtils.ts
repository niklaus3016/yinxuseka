import { CMYK, ColorCard, HSB, PaletteScheme, RGB } from '../types';

export function hexToRgb(hex: string): RGB {
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  if (isNaN(num) || cleanHex.length !== 6) {
    return { r: 0, g: 0, b: 0 };
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToHsb(r: number, g: number, b: number): HSB {
  const rf = r / 255;
  const gf = g / 255;
  const bf = b / 255;
  const max = Math.max(rf, gf, bf);
  const min = Math.min(rf, gf, bf);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rf) {
      h = ((gf - bf) / delta) % 6;
    } else if (max === gf) {
      h = (bf - rf) / delta + 2;
    } else {
      h = (rf - gf) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : Math.round((delta / max) * 100);
  const bright = Math.round(max * 100);

  return { h, s, b: bright };
}

export function hsbToRgb(h: number, s: number, b: number): RGB {
  const sDec = s / 100;
  const bDec = b / 100;
  const c = bDec * sDec;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = bDec - c;

  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;

  if (h >= 0 && h < 60) {
    rPrime = c; gPrime = x; bPrime = 0;
  } else if (h >= 60 && h < 120) {
    rPrime = x; gPrime = c; bPrime = 0;
  } else if (h >= 120 && h < 180) {
    rPrime = 0; gPrime = c; bPrime = x;
  } else if (h >= 180 && h < 240) {
    rPrime = 0; gPrime = x; bPrime = c;
  } else if (h >= 240 && h < 300) {
    rPrime = x; gPrime = 0; bPrime = c;
  } else {
    rPrime = c; gPrime = 0; bPrime = x;
  }

  return {
    r: Math.round((rPrime + m) * 255),
    g: Math.round((gPrime + m) * 255),
    b: Math.round((bPrime + m) * 255),
  };
}

export function rgbToCmyk(r: number, g: number, b: number): CMYK {
  const rf = r / 255;
  const gf = g / 255;
  const bf = b / 255;
  const k = 1 - Math.max(rf, gf, bf);
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }
  const c = (1 - rf - k) / (1 - k);
  const m = (1 - gf - k) / (1 - k);
  const y = (1 - bf - k) / (1 - k);
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

export function isLightColor(hex: string): boolean {
  const { r, g, b } = hexToRgb(hex);
  // Perceived luminance
  const luma = 0.299 * r + 0.587 * g + 0.114 * b;
  return luma > 175;
}

export function formatColorValue(card: ColorCard, format: 'hex' | 'rgb' | 'hsb' | 'cmyk'): string {
  switch (format) {
    case 'hex':
      return card.hex;
    case 'rgb':
      return `rgb(${card.rgb.r}, ${card.rgb.g}, ${card.rgb.b})`;
    case 'hsb':
      return `hsb(${card.hsb.h}°, ${card.hsb.s}%, ${card.hsb.b}%)`;
    case 'cmyk':
      return `${card.cmyk.c}/${card.cmyk.m}/${card.cmyk.y}/${card.cmyk.k}`;
  }
}

// Helper to make a color card from hex and names
export function createColorCardFromHex(
  hex: string,
  cnName: string,
  enName: string,
  tags: string[],
  category: ColorCard['category'] = '大牌流行色',
  story?: string,
  idPrefix = 'custom'
): ColorCard {
  const cleanHex = hex.startsWith('#') ? hex.toUpperCase() : `#${hex.toUpperCase()}`;
  const rgb = hexToRgb(cleanHex);
  const hsb = rgbToHsb(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

  return {
    id: `${idPrefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    cnName,
    enName: enName.toUpperCase(),
    hex: cleanHex,
    hsb,
    rgb,
    cmyk,
    tags,
    category,
    story,
    isCustom: true,
    createdAt: Date.now(),
  };
}

// Generate 4 color harmonies based on standard color theory
export function generateColorHarmonies(baseCard: ColorCard): PaletteScheme[] {
  const { h, s, b } = baseCard.hsb;

  const makeCard = (
    hue: number,
    sat: number,
    bri: number,
    cnName: string,
    enName: string,
    tag: string
  ): ColorCard => {
    const validH = ((hue % 360) + 360) % 360;
    const validS = Math.max(10, Math.min(100, sat));
    const validB = Math.max(15, Math.min(100, bri));
    const rgb = hsbToRgb(validH, validS, validB);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

    return {
      id: `harmony_${Math.random().toString(36).substring(2, 9)}`,
      cnName,
      enName,
      hex,
      hsb: { h: validH, s: validS, b: validB },
      rgb,
      cmyk,
      tags: [tag, '配色推荐'],
      category: baseCard.category,
    };
  };

  // 1. 互补色方案 (Complementary)
  const compHue = (h + 180) % 360;
  const complementary: PaletteScheme = {
    id: 'scheme_comp',
    title: '互补对撞方案',
    enTitle: 'COMPLEMENTARY',
    description: '180°强烈对比，营造吸睛张力与鲜明视觉反差，适合视觉焦点设计',
    colors: [
      baseCard,
      makeCard(compHue, s, b, `${baseCard.cnName}·对色`, 'COMPLEMENT', '对撞主色'),
      makeCard(compHue, Math.max(20, s - 30), Math.min(95, b + 15), '柔和补色', 'SOFT COMP', '平衡调和'),
      makeCard(h, Math.max(15, s - 40), Math.min(98, b + 20), '底蕴浅韵', 'TINT BASE', '底色呼应'),
      makeCard(compHue, Math.min(100, s + 10), Math.max(20, b - 30), '深邃重影', 'DEEP ACCENT', '重点点缀'),
    ],
  };

  // 2. 邻近色方案 (Analogous)
  const analogous: PaletteScheme = {
    id: 'scheme_analogous',
    title: '邻近调和方案',
    enTitle: 'ANALOGOUS',
    description: '色相环相差30°~60°，色彩自然过渡，和谐优雅，富有舒适律动感',
    colors: [
      makeCard((h - 35 + 360) % 360, s, Math.min(95, b + 5), '前序过渡', 'LEFT ANALOG', '前调'),
      baseCard,
      makeCard((h + 35) % 360, s, b, '后序伴奏', 'RIGHT ANALOG', '副调'),
      makeCard((h + 60) % 360, Math.max(25, s - 15), Math.max(30, b - 10), '延展共鸣', 'EXTENDED', '共鸣色'),
      makeCard((h - 20 + 360) % 360, Math.max(15, s - 35), 92, '晨曦柔光', 'SOFT GLOW', '高光衬托'),
    ],
  };

  // 3. 三分色方案 (Triadic)
  const triad1 = (h + 120) % 360;
  const triad2 = (h + 240) % 360;
  const triadic: PaletteScheme = {
    id: 'scheme_triadic',
    title: '三合平衡方案',
    enTitle: 'TRIADIC BALANCE',
    description: '在色相环上构成等边三角，活泼丰富而饱满，具有高级艺术表现力',
    colors: [
      baseCard,
      makeCard(triad1, s, b, '三合辅色 A', 'TRIAD ALPHA', '平衡辅色'),
      makeCard(triad2, s, b, '三合辅色 B', 'TRIAD BETA', '律动点睛'),
      makeCard(triad1, Math.max(20, s - 25), Math.min(96, b + 15), '浅调调和', 'LIGHT TRIAD', '氛围烘托'),
      makeCard(triad2, Math.min(100, s + 10), Math.max(25, b - 25), '凝练深色', 'DARK TRIAD', '轮廓强化'),
    ],
  };

  // 4. 单色渐变方案 (Monochromatic)
  const monochromatic: PaletteScheme = {
    id: 'scheme_mono',
    title: '同色阶进方案',
    enTitle: 'MONOCHROMATIC',
    description: '同色相在明度与纯度上的优雅层级变化，极具高级统一质感与纵深感',
    colors: [
      makeCard(h, Math.max(10, s - 55), 96, `${baseCard.cnName}·微光`, 'PALE TINT', '高光层'),
      makeCard(h, Math.max(25, s - 30), 85, `${baseCard.cnName}·浅韵`, 'LIGHT TINT', '浅色阶'),
      baseCard,
      makeCard(h, Math.min(100, s + 10), Math.max(35, b - 25), `${baseCard.cnName}·浓萃`, 'MEDIUM SHADE', '主调深阶'),
      makeCard(h, Math.min(100, s + 15), Math.max(15, b - 50), `${baseCard.cnName}·渊墨`, 'DEEP SHADE', '深邃底色'),
    ],
  };

  return [complementary, analogous, triadic, monochromatic];
}
