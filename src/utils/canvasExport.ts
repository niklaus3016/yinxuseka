import { CardTemplate, ColorCard } from '../types';
import { isLightColor } from './colorUtils';

// Helper to draw rounded rectangle on canvas
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Helper to draw a heart shape
function drawHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(x, y + topCurveHeight);
  // top left curve
  ctx.bezierCurveTo(
    x, y, 
    x - size / 2, y, 
    x - size / 2, y + topCurveHeight
  );
  // bottom left curve
  ctx.bezierCurveTo(
    x - size / 2, y + (size + topCurveHeight) / 2, 
    x, y + (size + topCurveHeight) / 2, 
    x, y + size
  );
  // bottom right curve
  ctx.bezierCurveTo(
    x, y + (size + topCurveHeight) / 2, 
    x + size / 2, y + (size + topCurveHeight) / 2, 
    x + size / 2, y + topCurveHeight
  );
  // top right curve
  ctx.bezierCurveTo(
    x + size / 2, y, 
    x, y, 
    x, y + topCurveHeight
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export async function exportCardToImage(card: ColorCard, template: CardTemplate = 'classic'): Promise<string> {
  const canvas = document.createElement('canvas');
  const scale = 3; // high DPI for mobile save
  const width = 420 * scale;
  const height = 540 * scale;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  // Background canvas (dark outer frame as in reference photos with subtle vignette or pure transparent)
  ctx.fillStyle = '#0f1115';
  ctx.fillRect(0, 0, width, height);

  // Outer white card container
  const marginX = 26 * scale;
  const marginY = 32 * scale;
  const cardW = width - marginX * 2;
  const cardH = height - marginY * 2;
  const outerRadius = 34 * scale;

  ctx.save();
  // Drop shadow for card
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 30 * scale;
  ctx.shadowOffsetY = 12 * scale;
  ctx.fillStyle = '#FFFFFF';
  roundRect(ctx, marginX, marginY, cardW, cardH, outerRadius);
  ctx.fill();
  ctx.restore();

  if (template === 'classic') {
    // 1. Classic Style (Exact reference look)
    const blockPad = 18 * scale;
    const blockX = marginX + blockPad;
    const blockY = marginY + blockPad;
    const blockW = cardW - blockPad * 2;
    const blockH = cardH * 0.72;
    const blockRadius = 24 * scale;

    // Color block
    ctx.save();
    roundRect(ctx, blockX, blockY, blockW, blockH, blockRadius);
    ctx.clip();
    ctx.fillStyle = card.hex;
    ctx.fillRect(blockX, blockY, blockW, blockH);

    // Text on color block (always white as in reference images)
    const textIsDark = isLightColor(card.hex);
    ctx.fillStyle = textIsDark ? 'rgba(20,20,20,0.92)' : '#FFFFFF';
    
    // Chinese name
    ctx.font = `bold ${32 * scale}px "Plus Jakarta Sans", "Noto Serif SC", sans-serif`;
    ctx.fillText(card.cnName, blockX + 22 * scale, blockY + 54 * scale);

    // English name
    ctx.font = `500 ${14 * scale}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = textIsDark ? 'rgba(20,20,20,0.75)' : 'rgba(255,255,255,0.85)';
    ctx.fillText(card.enName, blockX + 22 * scale, blockY + 84 * scale);

    // Tags
    if (card.tags && card.tags.length > 0) {
      let tagX = blockX + 22 * scale;
      const tagY = blockY + 104 * scale;
      ctx.font = `500 ${11 * scale}px "Plus Jakarta Sans", "Noto Serif SC", sans-serif`;
      
      card.tags.slice(0, 4).forEach((tag) => {
        const tagText = tag;
        const textMetrics = ctx.measureText(tagText);
        const tagW = textMetrics.width + 16 * scale;
        const tagH = 22 * scale;

        // Draw tag border
        ctx.strokeStyle = textIsDark ? 'rgba(20,20,20,0.45)' : 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 1 * scale;
        ctx.strokeRect(tagX, tagY, tagW, tagH);

        // Draw tag text
        ctx.fillStyle = textIsDark ? 'rgba(20,20,20,0.85)' : 'rgba(255,255,255,0.95)';
        ctx.fillText(tagText, tagX + 8 * scale, tagY + 15 * scale);

        tagX += tagW + 8 * scale;
      });
    }
    ctx.restore();

    // Bottom White area: Hex & CMYK & Heart
    const bottomY = blockY + blockH + 34 * scale;
    // Hex
    ctx.font = `bold ${24 * scale}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = card.hex;
    ctx.fillText(card.hex, blockX + 8 * scale, bottomY);

    // CMYK parameter
    ctx.font = `500 ${14 * scale}px "JetBrains Mono", sans-serif`;
    ctx.fillStyle = '#6b7280';
    const cmykText = `${card.cmyk.c}/${card.cmyk.m}/${card.cmyk.y}/${card.cmyk.k}`;
    ctx.fillText(cmykText, blockX + 8 * scale, bottomY + 24 * scale);

    // Heart icon
    drawHeart(
      ctx,
      blockX + blockW - 32 * scale,
      bottomY - 20 * scale,
      30 * scale,
      card.hex
    );
  } else if (template === 'minimal') {
    // 2. Minimalist Layout
    const pad = 24 * scale;
    const blockX = marginX + pad;
    const blockY = marginY + pad;
    const blockW = cardW - pad * 2;
    const blockH = cardH * 0.65;
    const blockRadius = 16 * scale;

    ctx.save();
    roundRect(ctx, blockX, blockY, blockW, blockH, blockRadius);
    ctx.clip();
    ctx.fillStyle = card.hex;
    ctx.fillRect(blockX, blockY, blockW, blockH);
    ctx.restore();

    const textY = blockY + blockH + 36 * scale;
    ctx.font = `bold ${26 * scale}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = '#111827';
    ctx.fillText(card.cnName, blockX, textY);

    ctx.font = `500 ${13 * scale}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = '#9ca3af';
    ctx.fillText(card.enName, blockX, textY + 22 * scale);

    ctx.font = `600 ${20 * scale}px "JetBrains Mono", sans-serif`;
    ctx.fillStyle = card.hex;
    ctx.fillText(card.hex, blockX, textY + 54 * scale);

    drawHeart(
      ctx,
      blockX + blockW - 24 * scale,
      textY + 10 * scale,
      28 * scale,
      card.hex
    );
  } else {
    // 3. Oriental / Traditional Style
    const pad = 20 * scale;
    const blockX = marginX + pad;
    const blockY = marginY + pad;
    const blockW = cardW - pad * 2;
    const blockH = cardH * 0.68;

    ctx.save();
    roundRect(ctx, blockX, blockY, blockW, blockH, 20 * scale);
    ctx.clip();
    ctx.fillStyle = card.hex;
    ctx.fillRect(blockX, blockY, blockW, blockH);

    // Oriental seal stamp top right
    ctx.fillStyle = '#991B1B';
    const stampX = blockX + blockW - 46 * scale;
    const stampY = blockY + 20 * scale;
    const stampSize = 28 * scale;
    roundRect(ctx, stampX, stampY, stampSize, stampSize, 4 * scale);
    ctx.fill();
    ctx.font = `bold ${14 * scale}px "Noto Serif SC", serif`;
    ctx.fillStyle = '#ffffff';
    ctx.fillText('印', stampX + 7 * scale, stampY + 20 * scale);

    // Vertical or calligraphy font for title
    ctx.font = `bold ${30 * scale}px "Noto Serif SC", serif`;
    ctx.fillStyle = isLightColor(card.hex) ? '#1f2937' : '#ffffff';
    ctx.fillText(card.cnName, blockX + 22 * scale, blockY + 56 * scale);

    ctx.font = `500 ${13 * scale}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = isLightColor(card.hex) ? 'rgba(31,41,55,0.7)' : 'rgba(255,255,255,0.75)';
    ctx.fillText(card.enName, blockX + 22 * scale, blockY + 82 * scale);
    ctx.restore();

    const botY = blockY + blockH + 34 * scale;
    ctx.font = `bold ${22 * scale}px "JetBrains Mono", sans-serif`;
    ctx.fillStyle = card.hex;
    ctx.fillText(card.hex, blockX + 8 * scale, botY);

    ctx.font = `500 ${13 * scale}px "Noto Serif SC", serif`;
    ctx.fillStyle = '#6b7280';
    ctx.fillText(`色律 · ${card.category}`, blockX + 8 * scale, botY + 24 * scale);

    drawHeart(
      ctx,
      blockX + blockW - 28 * scale,
      botY - 14 * scale,
      26 * scale,
      card.hex
    );
  }

  return canvas.toDataURL('image/png');
}

// Multi-card poster stitcher
export async function exportPoster(
  title: string,
  cards: ColorCard[]
): Promise<string> {
  const canvas = document.createElement('canvas');
  const scale = 2;
  const cols = 2;
  const rows = Math.ceil(cards.length / cols);
  const cardW = 340 * scale;
  const cardH = 440 * scale;
  const gap = 24 * scale;
  const padX = 36 * scale;
  const headerH = 140 * scale;
  const footerH = 80 * scale;

  const totalW = padX * 2 + cols * cardW + (cols - 1) * gap;
  const totalH = headerH + rows * cardH + (rows - 1) * gap + footerH;

  canvas.width = totalW;
  canvas.height = totalH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  // Background
  ctx.fillStyle = '#12141a';
  ctx.fillRect(0, 0, totalW, totalH);

  // Poster Header
  ctx.font = `bold ${34 * scale}px "Noto Serif SC", "Plus Jakarta Sans", serif`;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(title || '印序色卡 · 精选色彩集', padX, 60 * scale);

  ctx.font = `400 ${15 * scale}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillText('YINXU COLOR HARMONY PALETTE · OFFLINE INSPIRATION', padX, 88 * scale);

  // Divider line
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1 * scale;
  ctx.beginPath();
  ctx.moveTo(padX, 108 * scale);
  ctx.lineTo(totalW - padX, 108 * scale);
  ctx.stroke();

  // Draw cards
  cards.forEach((card, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x = padX + col * (cardW + gap);
    const y = headerH + row * (cardH + gap);

    // Card white background
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 18 * scale;
    ctx.shadowOffsetY = 8 * scale;
    roundRect(ctx, x, y, cardW, cardH, 24 * scale);
    ctx.fill();
    ctx.restore();

    // Card inner color block
    const innerPad = 14 * scale;
    const blockW = cardW - innerPad * 2;
    const blockH = cardH * 0.72;
    const blockX = x + innerPad;
    const blockY = y + innerPad;

    ctx.save();
    roundRect(ctx, blockX, blockY, blockW, blockH, 18 * scale);
    ctx.clip();
    ctx.fillStyle = card.hex;
    ctx.fillRect(blockX, blockY, blockW, blockH);

    // Text on color block
    const isLight = isLightColor(card.hex);
    ctx.fillStyle = isLight ? '#111827' : '#FFFFFF';
    ctx.font = `bold ${24 * scale}px "Noto Serif SC", sans-serif`;
    ctx.fillText(card.cnName, blockX + 16 * scale, blockY + 40 * scale);

    ctx.font = `500 ${11 * scale}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = isLight ? 'rgba(17,24,39,0.7)' : 'rgba(255,255,255,0.8)';
    ctx.fillText(card.enName, blockX + 16 * scale, blockY + 62 * scale);
    ctx.restore();

    // Bottom info
    const bottomY = blockY + blockH + 28 * scale;
    ctx.font = `bold ${20 * scale}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = card.hex;
    ctx.fillText(card.hex, blockX + 6 * scale, bottomY);

    ctx.font = `500 ${11 * scale}px "JetBrains Mono", sans-serif`;
    ctx.fillStyle = '#6b7280';
    ctx.fillText(`${card.cmyk.c}/${card.cmyk.m}/${card.cmyk.y}/${card.cmyk.k}`, blockX + 6 * scale, bottomY + 18 * scale);

    drawHeart(
      ctx,
      blockX + blockW - 24 * scale,
      bottomY - 14 * scale,
      24 * scale,
      card.hex
    );
  });

  // Footer
  ctx.font = `400 ${13 * scale}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.fillText('Created with 印序色卡 (Yinxu Palette) · 纯本地色彩工具', padX, totalH - 30 * scale);

  return canvas.toDataURL('image/png');
}

// Download helper
export function triggerImageDownload(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
