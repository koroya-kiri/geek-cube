# Geek Cube 全面改造方案

## 一、项目现状分析

### 1.1 技术栈
- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite 8
- **样式方案**: Tailwind CSS 3.4 + CSS Variables
- **路由**: React Router DOM 7
- **图标**: Lucide React
- **其他**: pdf-lib (PDF处理), js-base64

### 1.2 现有设计系统 (tokens.css)
已具备赛博朋克风格基础：
- **霓虹色彩**: cyan (#00f0ff), magenta (#ff00aa), green (#00ff88), yellow (#ffee00), purple (#aa00ff)
- **发光效果**: glow-cyan, glow-magenta, glow-green, glow-yellow
- **动画系统**: pulse-neon, glitch, shimmer, float, glow-pulse, border-glow
- **玻璃态效果**: glass, glass-strong
- **背景图案**: bg-grid, bg-grid-small, scanlines

### 1.3 现有工具模块 (10个)
| 分类 | 工具 | 路径 |
|------|------|------|
| PDF工具 | PDF拆分 | /tools/pdf-splitter |
| 编解码 | Base64编解码 | /tools/base64 |
| 编解码 | URL编解码 | /tools/url |
| 格式化 | JSON格式化 | /tools/json |
| 格式化 | 文本对比 | /tools/text-diff |
| 生成器 | 密码生成器 | /tools/password |
| 生成器 | 二维码生成 | /tools/qr-code |
| 其他 | 颜色转换 | /tools/color |
| 其他 | 时间戳转换 | /tools/timestamp |
| 其他 | 正则测试 | /tools/regex |

### 1.4 现有问题
1. Base64工具仅支持文本，不支持图片
2. 首页仅有网格视图，缺乏多样性
3. 缺少常用开发工具（哈希、UUID、进制转换等）
4. 缺少搜索和快捷访问功能
5. 动画效果可以更丰富

---

## 二、改造方案详细设计

### 2.1 Base64工具增强

#### 功能需求
- [x] 文本编解码（已有）
- [ ] 图片上传转Base64
- [ ] 拖拽上传支持
- [ ] 剪贴板粘贴图片
- [ ] 图片预览
- [ ] Base64转图片下载
- [ ] 文件大小限制提示

#### 文件修改
```
src/pages/Base64Tool.tsx     # 重构，添加Tab切换
src/components/ImageUploader.tsx  # 新增：图片上传组件
src/hooks/useImagePaste.ts   # 新增：粘贴图片Hook
```

---

### 2.2 UI极客风格重新设计

#### 设计方向
**风格定位**: 赛博朋克 + 全息投影 + 故障艺术

#### 新增设计元素
1. **粒子背景**: 动态粒子连线效果
2. **故障艺术**: 标题和按钮的glitch效果增强
3. **全息边框**: 彩虹渐变边框动画
4. **数据流动画**: 背景二进制数据流
5. **霓虹按钮**: 更强烈的发光效果
6. **扫描线增强**: 可选的CRT显示器效果

#### 文件修改
```
src/styles/tokens.css        # 扩展设计令牌
src/styles/effects.css       # 新增：特效样式
src/components/ParticleBackground.tsx  # 新增：粒子背景
src/components/GlitchText.tsx   # 新增：故障文字组件
src/components/HologramCard.tsx # 新增：全息卡片组件
src/components/CyberButton.tsx  # 新增：赛博按钮组件
```

---

### 2.3 多种视图模式

#### 视图类型
1. **网格视图** (Grid): 当前样式，卡片网格布局
2. **列表视图** (List): 紧凑列表，显示更多信息
3. **Dock视图** (macOS风格): 底部程序坞，悬停放大效果

#### 文件修改
```
src/pages/Home.tsx           # 重构，添加视图切换
src/components/ViewSwitcher.tsx   # 新增：视图切换器
src/components/ToolGrid.tsx       # 新增：网格视图组件
src/components/ToolList.tsx       # 新增：列表视图组件
src/components/ToolDock.tsx       # 新增：Dock视图组件
src/hooks/useViewMode.ts    # 新增：视图模式状态管理
```

---

### 2.4 新增功能模块

#### 2.4.1 哈希计算工具
- 支持算法: MD5, SHA-1, SHA-256, SHA-512
- 输入方式: 文本输入、文件上传
- 输出: 十六进制、Base64

#### 2.4.2 进制转换工具
- 支持: 二进制、八进制、十进制、十六进制
- 实时转换
- 位运算可视化

#### 2.4.3 UUID生成器
- UUID v1 (时间戳)
- UUID v4 (随机)
- 批量生成
- 格式选项（带/不带连字符）

#### 2.4.4 代码格式化工具
- JSON (已有)
- XML
- SQL
- CSS/SCSS
- JavaScript/TypeScript

#### 2.4.5 Lorem Ipsum生成器
- 段落生成
- 句子生成
- 单词生成
- 中文假文支持

#### 2.4.6 Cron表达式生成器
- 可视化Cron构建
- 表达式解析
- 下次执行时间预览

#### 文件新增
```
src/pages/HashTool.tsx       # 哈希计算
src/pages/RadixTool.tsx      # 进制转换
src/pages/UuidTool.tsx       # UUID生成
src/pages/CodeFormatter.tsx  # 代码格式化
src/pages/LoremTool.tsx      # Lorem生成
src/pages/CronTool.tsx       # Cron表达式
src/utils/hash.ts            # 哈希计算工具函数
src/utils/formatters.ts      # 格式化工具函数
```

---

### 2.5 布局优化

#### 新增功能
1. **全局搜索**: 快捷键 `/` 或 `Ctrl+K`
2. **工具收藏**: 常用工具置顶
3. **快捷键系统**: 快速访问工具
4. **最近使用**: 记录最近使用的工具
5. **工具分类优化**: 重新组织分类结构

#### 文件修改
```
src/components/Layout.tsx    # 添加搜索模态框
src/components/Header.tsx    # 添加搜索按钮
src/components/SearchModal.tsx    # 新增：搜索模态框
src/components/Sidebar.tsx   # 添加收藏和最近使用
src/hooks/useShortcuts.ts    # 新增：快捷键Hook
src/hooks/useFavorites.ts    # 新增：收藏Hook
src/hooks/useRecentTools.ts  # 新增：最近使用Hook
src/utils/tools.ts           # 更新工具分类
```

---

## 三、文件修改清单

### 3.1 需要修改的文件

| 文件路径 | 修改内容 |
|----------|----------|
| `src/App.tsx` | 添加新路由 |
| `src/pages/Home.tsx` | 重构为多视图模式 |
| `src/pages/Base64Tool.tsx` | 增强图片功能 |
| `src/components/Layout.tsx` | 添加搜索模态框入口 |
| `src/components/Header.tsx` | 添加搜索按钮、视图切换 |
| `src/components/Sidebar.tsx` | 添加收藏、最近使用区域 |
| `src/styles/tokens.css` | 扩展设计令牌 |
| `src/utils/tools.ts` | 更新工具分类和定义 |
| `index.html` | 添加Orbitron字体 |
| `tailwind.config.js` | 扩展主题配置 |

### 3.2 需要新增的文件

#### 页面组件
| 文件路径 | 说明 |
|----------|------|
| `src/pages/HashTool.tsx` | 哈希计算工具 |
| `src/pages/RadixTool.tsx` | 进制转换工具 |
| `src/pages/UuidTool.tsx` | UUID生成器 |
| `src/pages/CodeFormatter.tsx` | 代码格式化工具 |
| `src/pages/LoremTool.tsx` | Lorem Ipsum生成器 |
| `src/pages/CronTool.tsx` | Cron表达式生成器 |

#### 通用组件
| 文件路径 | 说明 |
|----------|------|
| `src/components/ViewSwitcher.tsx` | 视图切换器 |
| `src/components/ToolGrid.tsx` | 网格视图 |
| `src/components/ToolList.tsx` | 列表视图 |
| `src/components/ToolDock.tsx` | Dock视图 |
| `src/components/SearchModal.tsx` | 搜索模态框 |
| `src/components/ImageUploader.tsx` | 图片上传组件 |
| `src/components/ParticleBackground.tsx` | 粒子背景 |
| `src/components/GlitchText.tsx` | 故障文字 |
| `src/components/HologramCard.tsx` | 全息卡片 |
| `src/components/CyberButton.tsx` | 赛博按钮 |

#### Hooks
| 文件路径 | 说明 |
|----------|------|
| `src/hooks/useViewMode.ts` | 视图模式管理 |
| `src/hooks/useShortcuts.ts` | 快捷键系统 |
| `src/hooks/useFavorites.ts` | 收藏功能 |
| `src/hooks/useRecentTools.ts` | 最近使用 |
| `src/hooks/useImagePaste.ts` | 图片粘贴 |
| `src/hooks/useLocalStorage.ts` | 本地存储 |

#### 工具函数
| 文件路径 | 说明 |
|----------|------|
| `src/utils/hash.ts` | 哈希计算 |
| `src/utils/formatters.ts` | 代码格式化 |
| `src/utils/cron.ts` | Cron解析 |

#### 样式文件
| 文件路径 | 说明 |
|----------|------|
| `src/styles/effects.css` | 特效样式 |

---

## 四、依赖清单

### 4.1 需要新增的依赖

```json
{
  "dependencies": {
    "prettier": "^3.2.5",
    "sql-formatter": "^15.0.0",
    "xml-formatter": "^3.6.2",
    "uuid": "^9.0.0",
    "cronstrue": "^2.50.0",
    "crypto-js": "^4.2.0"
  },
  "devDependencies": {
    "@types/uuid": "^9.0.0",
    "@types/crypto-js": "^4.2.0"
  }
}
```

### 4.2 安装命令

```bash
npm install prettier sql-formatter xml-formatter uuid cronstrue crypto-js
npm install -D @types/uuid @types/crypto-js
```

---

## 五、设计规范

### 5.1 色彩系统

```css
/* 主色调 - 霓虹青 */
--color-primary: var(--color-neon-cyan);    /* #00f0ff */

/* 强调色 - 霓虹品红 */
--color-accent: var(--color-neon-magenta);  /* #ff00aa */

/* 成功/警告/错误 */
--color-success: var(--color-neon-green);   /* #00ff88 */
--color-warning: var(--color-neon-yellow);  /* #ffee00 */
--color-error: var(--color-neon-red);       /* #ff3366 */

/* 背景层级 */
--bg-level-1: var(--color-bg-deep);      /* #050508 - 最深 */
--bg-level-2: var(--color-bg-base);      /* #0a0a0f */
--bg-level-3: var(--color-bg-elevated);  /* #0f0f18 */
--bg-level-4: var(--color-bg-surface);   /* #14141f */
--bg-level-5: var(--color-bg-hover);     /* #1a1a28 - 最浅 */
```

### 5.2 间距系统 (8px基础)

```css
--space-1: 4px;
--space-2: 8px;   /* 基础单位 */
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

### 5.3 字体系统

```css
/* 字体族 */
--font-display: 'Orbitron', 'Rajdhani', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
--font-body: 'DM Sans', system-ui, sans-serif;

/* 字号 */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

### 5.4 圆角系统

```css
--radius-sm: 4px;    /* 小元素 */
--radius-md: 8px;    /* 按钮、输入框 */
--radius-lg: 12px;   /* 卡片 */
--radius-xl: 16px;   /* 模态框 */
--radius-2xl: 20px;  /* 容器 */
```

### 5.5 阴影系统

```css
/* 基础阴影 */
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.4);
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.5);
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.6);

/* 霓虹发光 */
--glow-cyan: 0 0 20px rgba(0, 240, 255, 0.5), 0 0 40px rgba(0, 240, 255, 0.2);
--glow-magenta: 0 0 20px rgba(255, 0, 170, 0.5), 0 0 40px rgba(255, 0, 170, 0.2);
--glow-green: 0 0 20px rgba(0, 255, 136, 0.5), 0 0 40px rgba(0, 255, 136, 0.2);
```

### 5.6 动画系统

```css
/* 持续时间 */
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 400ms;

/* 缓动函数 */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

---

## 六、实施计划

### Phase 1: 基础设施 (1-2天)
1. 扩展设计令牌系统
2. 创建通用组件库
3. 实现Hooks基础设施

### Phase 2: 核心功能增强 (2-3天)
1. Base64工具图片功能
2. 多视图模式实现
3. 搜索和快捷键系统

### Phase 3: 新工具开发 (3-4天)
1. 哈希计算工具
2. 进制转换工具
3. UUID生成器
4. 代码格式化工具
5. Lorem生成器
6. Cron表达式工具

### Phase 4: 视觉增强 (1-2天)
1. 粒子背景
2. 故障艺术效果
3. 全息卡片效果
4. 动画优化

### Phase 5: 测试与优化 (1天)
1. 功能测试
2. 性能优化
3. 响应式适配

---

## 七、验收标准

### 功能验收
- [ ] Base64工具支持图片上传、粘贴、预览、下载
- [ ] 首页支持网格、列表、Dock三种视图
- [ ] 全局搜索功能正常，支持快捷键
- [ ] 收藏和最近使用功能正常
- [ ] 6个新工具功能完整

### 视觉验收
- [ ] 赛博朋克风格统一
- [ ] 动画流畅无卡顿
- [ ] 响应式布局正确
- [ ] 无明显性能问题

### 代码验收
- [ ] TypeScript无类型错误
- [ ] ESLint无警告
- [ ] 组件复用性良好
