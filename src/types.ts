export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSB {
  h: number; // 0 - 360
  s: number; // 0 - 100
  b: number; // 0 - 100
}

export interface CMYK {
  c: number; // 0 - 100
  m: number; // 0 - 100
  y: number; // 0 - 100
  k: number; // 0 - 100
}

export type ColorCategory = 
  | '大牌流行色'
  | '国风传统色'
  | '莫兰迪色系'
  | '马卡龙色系'
  | '复古油画色'
  | '高饱和亮色';

export interface ColorCard {
  id: string;
  cnName: string;
  enName: string;
  hex: string;
  hsb: HSB;
  rgb: RGB;
  cmyk: CMYK;
  tags: string[];
  category: ColorCategory;
  story?: string;
  isCustom?: boolean;
  createdAt?: number;
}

export type CardTemplate = 'classic' | 'minimal' | 'oriental';

export type CopyFormat = 'hex' | 'rgb' | 'hsb' | 'cmyk';

export interface PaletteScheme {
  id: string;
  title: string;
  enTitle: string;
  description: string;
  colors: ColorCard[];
}

export interface AppSettings {
  template: CardTemplate;
  defaultCopyFormat: CopyFormat;
}
