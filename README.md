# 极客魔方 · Geek Cube

一站式开发者工具箱，涵盖编解码、格式化、生成器等实用工具。赛博朋克风格 UI，为极客而生。

## 功能概览

### 编解码工具
| 工具 | 说明 |
|------|------|
| **Base64 编解码** | 文本与 Base64 互转，支持图片上传、拖拽、剪贴板粘贴 |
| **URL 编解码** | URL 编码与解码 |
| **哈希计算** | SHA-1 / SHA-256 / SHA-384 / SHA-512，支持文本和文件上传 |
| **进制转换** | 二进制、八进制、十进制、十六进制实时互转 |

### 格式化工具
| 工具 | 说明 |
|------|------|
| **JSON 格式化** | JSON 美化、压缩与校验 |
| **文本对比** | 对比两段文本差异 |
| **代码格式化** | JS/TS/HTML/CSS/SQL/XML 格式化与压缩（基于 Prettier） |

### 生成器工具
| 工具 | 说明 |
|------|------|
| **密码生成器** | 高强度随机密码生成 |
| **二维码生成** | 文本转二维码 |
| **UUID 生成器** | RFC 4122 标准 UUID v1/v4/v7（基于 uuid 库） |
| **Lorem Ipsum** | 占位文本生成，支持中英文 |
| **Cron 表达式** | Cron 表达式生成与解析 |

### 其他工具
| 工具 | 说明 |
|------|------|
| **PDF 拆分** | 按页码范围提取 PDF 页面（基于 pdf-lib） |
| **颜色转换** | HEX、RGB、HSL 互转 |
| **时间戳转换** | 时间戳与日期时间互转 |
| **正则测试** | 实时测试正则表达式 |

## 技术栈

- **框架**: React 19 + TypeScript
- **构建**: Vite 8
- **样式**: Tailwind CSS 3.4 + CSS Variables（赛博朋克设计系统）
- **路由**: React Router DOM 7
- **图标**: Lucide React
- **格式化**: Prettier / SQL Formatter / XML Formatter
- **PDF**: pdf-lib
- **UUID**: uuid (RFC 4122)
- **测试**: Vitest + Testing Library

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查
npx tsc -b --noEmit

# 运行测试
npm test

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 设计系统

项目实现了完整的赛博朋克风格设计令牌系统：

- **霓虹色彩**: cyan / magenta / green / yellow / purple / orange
- **发光效果**: 4 种 box-shadow 预设 + text-shadow 工具类
- **动画系统**: pulse-neon / glitch / shimmer / float / glow-pulse / border-glow
- **玻璃态**: glass / glass-strong
- **背景**: grid 图案 / scanlines 扫描线
- **字体**: Orbitron（标题） + JetBrains Mono（代码） + DM Sans（正文）

## 项目结构

```
src/
├── components/     # 通用组件（Layout, Sidebar, Header, ErrorBoundary）
├── pages/          # 工具页面（17 个工具）
├── styles/         # 设计令牌（tokens.css）
├── utils/          # 工具定义（tools.ts）
├── test/           # 测试文件
├── App.tsx         # 路由配置
└── main.tsx        # 入口
```

## License

MIT
