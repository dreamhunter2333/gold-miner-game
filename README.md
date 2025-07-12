# 黄金矿工 - Gold Miner Game

> 🤖 **本项目完全由 AI 生成** - 展示了现代AI在游戏开发中的强大能力

一个经典的黄金矿工手机网页游戏，采用现代Web技术构建，具有精致的画面和传统的游戏玩法。

## 🎮 游戏特色

- **经典玩法**：传统的黄金矿工游戏机制，控制钩子挖掘各种宝物
- **精致画面**：使用Canvas API绘制的高质量2D图形，支持粒子效果
- **移动优化**：专为移动设备设计，支持触摸操作和全屏体验
- **渐进式难度**：指数级增长的目标分数系统，挑战性十足
- **PWA支持**：可安装到主屏幕，支持离线游戏和自动更新
- **音效系统**：丰富的游戏音效，增强游戏体验

## 🎯 游戏玩法

1. **开始游戏**：点击开始按钮进入游戏
2. **控制钩子**：点击屏幕发射钩子，钩子会自动摆动
3. **收集物品**：
   - 💰 **金块**：高价值，中等重量
   - 💎 **钻石**：最高价值，重量轻
   - 🪨 **石头**：低价值，重量大
   - 🦴 **骨头**：中等价值和重量
   - 💰 **钱袋**：随机价值

4. **关卡目标**：在时间限制内达到目标分数
5. **自动升级**：收集完所有物品后自动进入下一关

## 🛠️ 技术栈

### 前端框架
- **React 18** - 现代化的用户界面库
- **TypeScript** - 类型安全的JavaScript超集
- **Vite** - 快速的构建工具和开发服务器

### 游戏引擎
- **HTML5 Canvas** - 2D图形渲染
- **Web Audio API** - 游戏音效系统
- **RequestAnimationFrame** - 流畅的游戏循环

### PWA技术
- **Vite PWA Plugin** - PWA功能集成
- **Workbox** - 服务工作者和缓存策略
- **Web App Manifest** - 应用安装配置

### 移动端优化
- **Responsive Design** - 响应式布局设计
- **Touch Events** - 触摸事件处理
- **iOS Safari 兼容** - 专门的iOS适配

## 📁 项目结构

```
src/
├── components/           # React组件
│   ├── renderers/       # Canvas渲染器
│   ├── GameCanvas.tsx   # 游戏画布组件
│   └── GameUI.tsx       # 游戏界面组件
├── hooks/               # 自定义React Hooks
│   ├── useGameLogic.ts  # 游戏逻辑Hook
│   ├── useGameState.ts  # 游戏状态Hook
│   └── useGameTimer.ts  # 游戏计时器Hook
├── types/               # TypeScript类型定义
├── utils/               # 工具函数
│   ├── audioManager.ts  # 音频管理器
│   ├── particleSystem.ts # 粒子系统
│   ├── itemGenerator.ts # 物品生成器
│   └── difficultySystem.ts # 难度系统
├── config/              # 配置文件
│   └── itemConfigs.ts   # 物品配置
└── assets/              # 静态资源
```

## 🚀 快速开始

### 环境要求
- Node.js >= 16
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

### 代码检查
```bash
npm run lint
```

## 🎨 设计特色

### 视觉设计
- **写实风格**：物品采用渐变和阴影效果，具有3D立体感
- **粒子效果**：收集物品时的星光粒子动画
- **流畅动画**：60FPS的流畅游戏体验

### 音效设计
- 钩子发射音效
- 不同物品的收集音效
- 背景环境音效

### 移动端适配
- 支持iOS Safari的安全区域
- 防止页面滚动和缩放
- 优化的触摸响应

## 🔧 核心算法

### 物理引擎
- **钩子摆动**：基于三角函数的摆动动画
- **碰撞检测**：圆形碰撞检测算法
- **重力模拟**：物品重量影响收钩速度

### 难度系统
```typescript
// 指数级增长的目标分数
targetScore = 1000 * Math.pow(1.5, level - 1)
```

### 物品生成
- 配置驱动的物品系统
- 基于稀有度的随机生成
- 防重叠的位置算法

## 📱 PWA功能

- **离线缓存**：支持完全离线游戏
- **自动更新**：新版本自动推送和安装
- **桌面安装**：可添加到设备主屏幕
- **原生体验**：类似原生应用的用户体验

## 🔍 浏览器兼容性

- ✅ Chrome/Edge (推荐)
- ✅ Safari (包括iOS Safari)
- ✅ Firefox
- ✅ 现代移动浏览器

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request来改进游戏！

---

🎮 享受挖矿的乐趣！祝你游戏愉快！