import { lazy, Suspense, useMemo } from 'react'
import { Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import HomeWrapper from './components/HomeWrapper'
import { LoadingSpinner } from './components/ui'
import { allTools } from './utils/tools'

/* ─── Lazy-loaded pages ─── */
const CategoryPage = lazy(() => import('./pages/CategoryPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))

const PdfSplitter = lazy(() => import('./pages/PdfSplitter'))
const PdfMergeTool = lazy(() => import('./pages/PdfMergeTool'))
const PdfInfoTool = lazy(() => import('./pages/PdfInfoTool'))
const DateCalculatorTool = lazy(() => import('./pages/DateCalculatorTool'))
const TextSorterTool = lazy(() => import('./pages/TextSorterTool'))
const JsonTreeViewer = lazy(() => import('./pages/JsonTreeViewer'))
const Md5Tool = lazy(() => import('./pages/Md5Tool'))
const Crc32Tool = lazy(() => import('./pages/Crc32Tool'))
const EcdsaTool = lazy(() => import('./pages/EcdsaTool'))
const HkdfTool = lazy(() => import('./pages/HkdfTool'))
const Base32Tool = lazy(() => import('./pages/Base32Tool'))
const Base58Tool = lazy(() => import('./pages/Base58Tool'))
const ImageCompressorTool = lazy(() => import('./pages/ImageCompressorTool'))
const JsonToTSTool = lazy(() => import('./pages/JsonToTSTool'))
const HttpHeadersTool = lazy(() => import('./pages/HttpHeadersTool'))
const PdfRotateTool = lazy(() => import('./pages/PdfRotateTool'))
const PdfReorderTool = lazy(() => import('./pages/PdfReorderTool'))
const PdfPageRemoverTool = lazy(() => import('./pages/PdfPageRemoverTool'))
const PdfViewerTool = lazy(() => import('./pages/PdfViewerTool'))
const PluginManager = lazy(() => import('./pages/PluginManager'))
const PluginPage = lazy(() => import('./pages/PluginPage'))
const MorseTool = lazy(() => import('./pages/MorseTool'))
const BinaryTextTool = lazy(() => import('./pages/BinaryTextTool'))
const ReverseTextTool = lazy(() => import('./pages/ReverseTextTool'))
const SlugTool = lazy(() => import('./pages/SlugTool'))
const LineNumberTool = lazy(() => import('./pages/LineNumberTool'))
const RemoveEmptyTool = lazy(() => import('./pages/RemoveEmptyTool'))
const TextRepeatTool = lazy(() => import('./pages/TextRepeatTool'))
const CharCountTool = lazy(() => import('./pages/CharCountTool'))
const PercentageTool = lazy(() => import('./pages/PercentageTool'))
const AspectRatioTool = lazy(() => import('./pages/AspectRatioTool'))
const UnitConverterTool = lazy(() => import('./pages/UnitConverterTool'))
const RandomColorTool = lazy(() => import('./pages/RandomColorTool'))
const RandomStringTool = lazy(() => import('./pages/RandomStringTool'))
const MetaTagTool = lazy(() => import('./pages/MetaTagTool'))
const RobotsTool = lazy(() => import('./pages/RobotsTool'))
const IpValidatorTool = lazy(() => import('./pages/IpValidatorTool'))
const EmojiPickerTool = lazy(() => import('./pages/EmojiPickerTool'))
const StopwatchTool = lazy(() => import('./pages/StopwatchTool'))
const ColorPickerTool = lazy(() => import('./pages/ColorPickerTool'))
const DrawTool = lazy(() => import('./pages/DrawTool'))
const ScreenRecorderTool = lazy(() => import('./pages/ScreenRecorderTool'))
const WhiteNoiseTool = lazy(() => import('./pages/WhiteNoiseTool'))
const FontPreviewTool = lazy(() => import('./pages/FontPreviewTool'))
const ColorBlindTool = lazy(() => import('./pages/ColorBlindTool'))
const ScreenInfoTool = lazy(() => import('./pages/ScreenInfoTool'))
const SoundMeterTool = lazy(() => import('./pages/SoundMeterTool'))
const Base64Tool = lazy(() => import('./pages/Base64Tool'))
const UrlTool = lazy(() => import('./pages/UrlTool'))
const JsonTool = lazy(() => import('./pages/JsonTool'))
const TextDiff = lazy(() => import('./pages/TextDiff'))
const ColorTool = lazy(() => import('./pages/ColorTool'))
const QrTool = lazy(() => import('./pages/QrTool'))
const PasswordTool = lazy(() => import('./pages/PasswordTool'))
const TimestampTool = lazy(() => import('./pages/TimestampTool'))
const RegexTool = lazy(() => import('./pages/RegexTool'))
const HashTool = lazy(() => import('./pages/HashTool'))
const RadixTool = lazy(() => import('./pages/RadixTool'))
const UuidTool = lazy(() => import('./pages/UuidTool'))
const CodeFormatter = lazy(() => import('./pages/CodeFormatter'))
const LoremTool = lazy(() => import('./pages/LoremTool'))
const CronTool = lazy(() => import('./pages/CronTool'))
const JwtTool = lazy(() => import('./pages/JwtTool'))
const HtmlEntityTool = lazy(() => import('./pages/HtmlEntityTool'))
const MarkdownTool = lazy(() => import('./pages/MarkdownTool'))
const IpLookupTool = lazy(() => import('./pages/IpLookupTool'))
const UserAgentTool = lazy(() => import('./pages/UserAgentTool'))
const UrlParserTool = lazy(() => import('./pages/UrlParserTool'))
const MimeTool = lazy(() => import('./pages/MimeTool'))
const TextStatsTool = lazy(() => import('./pages/TextStatsTool'))
const CaseConvertTool = lazy(() => import('./pages/CaseConvertTool'))
const KeycodeTool = lazy(() => import('./pages/KeycodeTool'))
const ImageToBase64Tool = lazy(() => import('./pages/ImageToBase64Tool'))
const QrDecodeTool = lazy(() => import('./pages/QrDecodeTool'))
const RandomTool = lazy(() => import('./pages/RandomTool'))
const PaletteTool = lazy(() => import('./pages/PaletteTool'))
const UnicodeTool = lazy(() => import('./pages/UnicodeTool'))
const DataUnitsTool = lazy(() => import('./pages/DataUnitsTool'))
const YamlJsonTool = lazy(() => import('./pages/YamlJsonTool'))
const AesTool = lazy(() => import('./pages/AesTool'))
const NanoIdTool = lazy(() => import('./pages/NanoIdTool'))
const WcagTool = lazy(() => import('./pages/WcagTool'))
const HttpStatusTool = lazy(() => import('./pages/HttpStatusTool'))
const EscapeTool = lazy(() => import('./pages/EscapeTool'))
const HtmlPreviewTool = lazy(() => import('./pages/HtmlPreviewTool'))
const SvgPreviewTool = lazy(() => import('./pages/SvgPreviewTool'))
const JsonSchemaTool = lazy(() => import('./pages/JsonSchemaTool'))
const Base64ImageTool = lazy(() => import('./pages/Base64ImageTool'))
const CurlTool = lazy(() => import('./pages/CurlTool'))
const DbConnTool = lazy(() => import('./pages/DbConnTool'))
const CsvJsonTool = lazy(() => import('./pages/CsvJsonTool'))
const AsciiTableTool = lazy(() => import('./pages/AsciiTableTool'))
const CssUnitsTool = lazy(() => import('./pages/CssUnitsTool'))
const HmacTool = lazy(() => import('./pages/HmacTool'))
const RsaTool = lazy(() => import('./pages/RsaTool'))
const Pbkdf2Tool = lazy(() => import('./pages/Pbkdf2Tool'))
const HexTool = lazy(() => import('./pages/HexTool'))
const Rot13Tool = lazy(() => import('./pages/Rot13Tool'))
const StripHtmlTool = lazy(() => import('./pages/StripHtmlTool'))
const GradientTool = lazy(() => import('./pages/GradientTool'))
const FindReplaceTool = lazy(() => import('./pages/FindReplaceTool'))

/* ─── Tool id → lazy component mapping ─── */
const TOOL_COMPONENTS: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'pdf-splitter': PdfSplitter,
  'pdf-merge': PdfMergeTool,
  'pdf-info': PdfInfoTool,
  base64: Base64Tool,
  url: UrlTool,
  json: JsonTool,
  'text-diff': TextDiff,
  color: ColorTool,
  'qr-code': QrTool,
  password: PasswordTool,
  timestamp: TimestampTool,
  regex: RegexTool,
  hash: HashTool,
  radix: RadixTool,
  uuid: UuidTool,
  'code-formatter': CodeFormatter,
  lorem: LoremTool,
  cron: CronTool,
  jwt: JwtTool,
  'html-entity': HtmlEntityTool,
  markdown: MarkdownTool,
  'ip-lookup': IpLookupTool,
  'user-agent': UserAgentTool,
  'url-parser': UrlParserTool,
  mime: MimeTool,
  'text-stats': TextStatsTool,
  'case-convert': CaseConvertTool,
  keycode: KeycodeTool,
  'image-to-base64': ImageToBase64Tool,
  'qr-decode': QrDecodeTool,
  random: RandomTool,
  palette: PaletteTool,
  unicode: UnicodeTool,
  'data-units': DataUnitsTool,
  'yaml-json': YamlJsonTool,
  aes: AesTool,
  nanoid: NanoIdTool,
  wcag: WcagTool,
  'http-status': HttpStatusTool,
  escape: EscapeTool,
  'html-preview': HtmlPreviewTool,
  'svg-preview': SvgPreviewTool,
  'json-schema': JsonSchemaTool,
  'base64-image': Base64ImageTool,
  curl: CurlTool,
  'db-conn': DbConnTool,
  'csv-json': CsvJsonTool,
  'ascii-table': AsciiTableTool,
  'css-units': CssUnitsTool,
  hmac: HmacTool,
  rsa: RsaTool,
  pbkdf2: Pbkdf2Tool,
  hex: HexTool,
  rot13: Rot13Tool,
  'strip-html': StripHtmlTool,
  gradient: GradientTool,
  'find-replace': FindReplaceTool,
  'date-calculator': DateCalculatorTool,
  'text-sorter': TextSorterTool,
  'json-tree': JsonTreeViewer,
  md5: Md5Tool,
  crc32: Crc32Tool,
  ecdsa: EcdsaTool,
  hkdf: HkdfTool,
  base32: Base32Tool,
  base58: Base58Tool,
  'image-compress': ImageCompressorTool,
  'json-to-ts': JsonToTSTool,
  'http-headers': HttpHeadersTool,
  'pdf-rotate': PdfRotateTool,
  'pdf-reorder': PdfReorderTool,
  'pdf-remove': PdfPageRemoverTool,
  'pdf-viewer': PdfViewerTool,
  'plugin-manager': PluginManager,
  morse: MorseTool,
  'binary-text': BinaryTextTool,
  'reverse-text': ReverseTextTool,
  slug: SlugTool,
  'line-number': LineNumberTool,
  'remove-empty': RemoveEmptyTool,
  'text-repeat': TextRepeatTool,
  'char-count': CharCountTool,
  percentage: PercentageTool,
  'aspect-ratio': AspectRatioTool,
  'unit-converter': UnitConverterTool,
  'random-color': RandomColorTool,
  'random-string': RandomStringTool,
  'meta-tag': MetaTagTool,
  robots: RobotsTool,
  'ip-validator': IpValidatorTool,
  'emoji-picker': EmojiPickerTool,
  stopwatch: StopwatchTool,
  'color-picker': ColorPickerTool,
  draw: DrawTool,
  'screen-recorder': ScreenRecorderTool,
  'white-noise': WhiteNoiseTool,
  'font-preview': FontPreviewTool,
  'color-blind': ColorBlindTool,
  'screen-info': ScreenInfoTool,
  'sound-meter': SoundMeterTool,
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-32">
      <LoadingSpinner />
    </div>
  )
}

function App() {
  /* Derive tool routes from the single source of truth (tools.ts) */
  const toolRoutes = useMemo(
    () =>
      allTools
        .filter(t => TOOL_COMPONENTS[t.id])
        .map(t => ({ id: t.id, path: t.path, Comp: TOOL_COMPONENTS[t.id]! })),
    []
  )

  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Home: full viewport, no Layout wrapper */}
        <Route path="/" element={<HomeWrapper />} />
        {/* All other pages: inside Layout with sidebar+header */}
        <Route element={<Layout />}>
          <Route path="category/:id" element={<CategoryPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="plugins/:id" element={<PluginPage />} />
          {toolRoutes.map(({ id, path, Comp }) => (
            <Route key={id} path={path} element={<Comp />} />
          ))}
        </Route>
      </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
