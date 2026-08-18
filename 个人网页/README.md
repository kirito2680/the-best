# 方昱 · 个人作品集网站

视觉设计师 / AI 设计师 / 品牌设计师个人作品集。暗色、克制、有科技感，PC 端优先，版心 1700px。

## 运行

```bash
pnpm install
pnpm dev        # 本地预览 http://localhost:5173
pnpm build      # 生产构建
pnpm preview    # 预览构建产物
```

## 目录

```
src/
  data/site.js        # 全部文案与数据（姓名、联系方式、项目、优势）
  components/         # 导航 / Hero / 经历 / 项目 / 优势 / 联系
  hooks/useReveal.js  # 滚动进场动画
  styles/global.css   # 设计变量、基础样式、通用组件
public/assets/        # hero-bg.webp（动画背景占位）
```

## 待替换内容

- `src/data/site.js`：真实邮箱、微信/站酷/Behance 等社交链接、真实项目与数据。
- `src/components/Hero.jsx` 顶部的 `HERO_VIDEO_URL`：首屏全屏视频背景（当前使用 CloudFront
  视频地址，替换地址即可更换视频；加载前自动回退到 `public/assets/hero-bg.webp` 动画占位）。
- 项目卡片视觉：当前为程序化生成的抽象占位（`ProjectVisual`），后续用真实作品截图替换。
- 个人头像：当前为文字 Monogram 占位，后续替换为真实照片。
