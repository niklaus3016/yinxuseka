import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { triggerImageDownload } from './canvasExport';

export type SaveResult = 'shared' | 'downloaded';

/**
 * 跨平台保存图片：
 * - Web/浏览器：走 <a download> 直接下载
 * - 安卓原生（Capacitor WebView 不支持 <a download>）：
 *   先写入应用缓存目录，再通过系统分享面板让用户保存到相册
 */
export async function saveImageFile(dataUrl: string, rawFilename: string): Promise<SaveResult> {
  const filename = sanitizeFilename(rawFilename);

  if (!Capacitor.isNativePlatform()) {
    triggerImageDownload(dataUrl, filename);
    return 'downloaded';
  }

  const base64 = dataUrl.split(',')[1] ?? '';
  const result = await Filesystem.writeFile({
    path: `exports/${filename}`,
    data: base64,
    directory: Directory.Cache,
    recursive: true,
  });

  try {
    await Share.share({
      files: [result.uri],
      title: filename,
    });
  } catch {
    // 用户取消分享面板不视为失败
  }

  return 'shared';
}

function sanitizeFilename(name: string): string {
  const cleaned = name.replace(/[\\/:*?"<>|\s]+/g, '_').replace(/_+/g, '_');
  return cleaned.endsWith('.png') ? cleaned : `${cleaned}.png`;
}

/** 供调用方统一提示文案 */
export function saveResultToast(result: SaveResult, downloadedText: string): string {
  return result === 'shared'
    ? '已生成图片，可在分享面板选择「保存到相册」'
    : downloadedText;
}
