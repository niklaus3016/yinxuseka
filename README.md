# 印序色卡（YINXU Color Cards）

一款面向设计师的高颜值色卡灵感工具：收录经典流行色、国风传统色、莫兰迪、马卡龙、油画与高饱和色系，支持取色、智能配色、收藏、高清卡片/海报导出。数据全部保存在本地，纯离线运行。

## 技术栈

- React 19 + TypeScript + Vite 6
- Tailwind CSS v4 + Framer Motion（motion）+ lucide-react
- Capacitor 8（打包 Android APK）
- 数据持久化：localStorage；图片保存：`@capacitor/filesystem` + `@capacitor/share`（原生端通过系统分享保存到相册，Web 端直接下载）

## 本地开发

```bash
npm install
npm run dev      # 启动开发服务器（默认 3000 端口）
npm run lint     # TypeScript 类型检查（tsc --noEmit）
npm run build    # 生产构建，输出到 dist/
```

## 打包 Android

```bash
npm run cap:sync   # 构建并同步 Web 产物到 Android 工程
npm run cap:open   # 在 Android Studio 中打开并出包
```

## 目录结构

- `src/data/colors.ts` — 内置色卡数据（HEX/RGB/HSB/CMYK 由统一换算函数核算）
- `src/context/ColorContext.tsx` — 全局状态（收藏、自定义色卡、历史、设置、Toast）
- `src/utils/colorUtils.ts` — 色彩换算与配色生成
- `src/utils/canvasExport.ts` — Canvas 高清卡片/海报绘制
- `src/utils/saveImage.ts` — 跨平台图片保存（Web 下载 / 原生分享）
- `src/components/` — 各页面与弹窗组件
- `android/` — Capacitor Android 原生工程（包名 `com.yinxuseka.app`）

## 隐私说明

应用不包含任何服务端接口，不收集、不上传任何数据；相册取色在本地 Canvas 中完成。
