import type { ReactNode, ButtonHTMLAttributes, TextareaHTMLAttributes, InputHTMLAttributes } from 'react'
import { useRipple } from '../hooks/useRipple'
import { Star } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'

/* ─── Tool Page Header ─── */
export function ToolHeader({ name, accent, accentColor = 'text-neon-cyan', glowClass = 'text-glow-cyan', desc }: {
  name: string
  accent: string
  accentColor?: string
  glowClass?: string
  desc: string
}) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold font-display text-white mb-1.5">
        {name} <span className={`${accentColor} ${glowClass}`}>{accent}</span>
      </h2>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>
  )
}

/* ─── Glass Card Container with ripple ─── */
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { setRef, createRipple } = useRipple()

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    const tag = target.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON' || tag === 'SELECT' || tag === 'A') return
    if (target.closest('button, a, label[for]')) return
    createRipple(e.clientX, e.clientY)
  }

  return (
    <div
      ref={setRef}
      onClick={handleClick}
      className={`card-glass corner-brackets p-6 space-y-5 relative ${className}`}
    >
      {children}
    </div>
  )
}

/* ─── Modern Primary Button with ripple ─── */
export function Button({
  children, onClick, disabled, variant = 'primary', className = '', ...props
}: {
  children: ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>) {
  const { setRef, createRipple } = useRipple()

  const base = 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.97] hover:scale-[1.02] relative overflow-hidden'
  const variants = {
    primary: 'bg-gradient-to-r from-neon-cyan to-neon-green text-cyber-bg-deep hover:shadow-lg hover:shadow-neon-cyan/25',
    secondary: 'bg-white/[0.04] border border-white/[0.08] text-white hover:border-white/20 hover:bg-white/[0.06]',
    ghost: 'text-gray-400 hover:text-white hover:bg-white/[0.04]',
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return
    createRipple(e.clientX, e.clientY)
    onClick?.(e)
  }

  return (
    <span ref={setRef} className="relative inline-flex">
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`${base} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    </span>
  )
}

/* ─── Tag / Chip Button ─── */
export function Chip({ active, onClick, children }: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
        active
          ? 'bg-neon-cyan/12 text-neon-cyan border border-neon-cyan/25 shadow-sm shadow-neon-cyan/8'
          : 'text-gray-400 hover:text-white border border-transparent hover:border-white/[0.06] hover:bg-white/[0.03]'
      }`}
    >
      {children}
    </button>
  )
}

/* ─── Modern Textarea ─── */
export function Textarea({ className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full px-4 py-3.5 rounded-xl bg-[rgba(0,0,0,.25)] border border-white/[0.06] text-[#d0d8e0] text-sm placeholder:text-gray-600 focus:outline-none focus:border-[rgba(0,255,65,0.4)] focus:ring-2 focus:ring-[rgba(0,255,65,0.15)] focus:bg-[rgba(0,0,0,.35)] input-data-stream transition-all duration-200 resize-none font-mono ${className}`}
      style={{ caretColor: '#00ff41', textShadow: '0 0 1px rgba(0,255,65,.1)' }}
      {...props}
    />
  )
}

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full px-4 py-3 rounded-xl bg-[rgba(0,0,0,.25)] border border-white/[0.06] text-[#d0d8e0] text-sm placeholder:text-gray-600 focus:outline-none focus:border-[rgba(0,255,65,0.4)] focus:ring-2 focus:ring-[rgba(0,255,65,0.15)] focus:bg-[rgba(0,0,0,.35)] input-data-stream transition-all duration-200 font-mono ${className}`}
      style={{ caretColor: '#00ff41', textShadow: '0 0 1px rgba(0,255,65,.1)' }}
      {...props}
    />
  )
}

/* ─── Section Label ─── */
export function Label({ children }: { children: ReactNode }) {
  return (
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
      {children}
    </label>
  )
}

/* ─── Copy Button ─── */
export function CopyBtn({ copied, onCopy }: { copied: boolean; onCopy: () => void }) {
  return (
    <button
      onClick={onCopy}
      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-neon-cyan transition-colors"
    >
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
      )}
      {copied ? '已复制' : '复制'}
    </button>
  )
}

/* ─── Output Display ─── */
export function Output({ value, placeholder }: { value: string; placeholder?: string }) {
  return (
    <textarea
      readOnly
      value={value}
      placeholder={placeholder}
      className="w-full px-4 py-3.5 rounded-xl bg-cyber-bg-deep border border-white/10 text-neon-green text-sm placeholder:text-gray-600 focus:outline-none resize-none font-mono"
      style={{ caretColor: 'transparent' }}
    />
  )
}

/* ─── Error Alert ─── */
export function Alert({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
      {children}
    </div>
  )
}

/* ─── Suspense Loading Fallback ─── */
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-8 h-8 rounded-full border-2 border-neon-cyan/20 border-t-neon-cyan animate-spin"
          style={{ boxShadow: '0 0 12px rgba(0,240,255,0.3)' }}
        />
        <span className="text-xs font-mono text-gray-600 tracking-widest uppercase">加载中...</span>
      </div>
    </div>
  )
}

/* ─── ToolHeader with favorite toggle ─── */
export function ToolHeaderFav({ name, accent, accentColor = 'text-neon-cyan', glowClass = 'text-glow-cyan', desc, toolId }: {
  name: string
  accent: string
  accentColor?: string
  glowClass?: string
  desc: string
  toolId: string
}) {
  const { isFavorite, toggle } = useFavorites()
  const fav = isFavorite(toolId)
  return (
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold font-display text-white mb-1.5">
          {name} <span className={`${accentColor} ${glowClass}`}>{accent}</span>
        </h2>
        <p className="text-sm text-gray-400">{desc}</p>
      </div>
      <button
        onClick={() => toggle(toolId)}
        className={`p-2 rounded-xl transition-all shrink-0 ${
          fav
            ? 'text-neon-yellow bg-neon-yellow/10 border border-neon-yellow/20'
            : 'text-gray-500 hover:text-neon-yellow hover:bg-neon-yellow/5 border border-transparent'
        }`}
        title={fav ? '取消收藏' : '收藏此工具'}
      >
        <Star size={18} className={fav ? 'fill-current' : ''} />
      </button>
    </div>
  )
}

/* ─── Pipeline: Send output to another tool ─── */
import { useNavigate } from 'react-router-dom'
import { Send } from 'lucide-react'
import { usePipeline } from '../hooks/usePipeline.tsx'
import { allTools } from '../utils/tools'

export function PipeButton({ value, toolId, toolName }: { value: string; toolId: string; toolName: string }) {
  const { push } = usePipeline()
  const navigate = useNavigate()

  if (!value) return null

  /* Show quick-send targets: related tools */
  const targets = allTools.filter(t => t.id !== toolId).slice(0, 5)

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {targets.map(t => (
        <button key={t.id} onClick={() => { push(value, toolId, toolName); navigate(t.path) }}
          className="text-[10px] px-2 py-1 rounded-lg bg-cyber-bg-deep border border-white/10 text-gray-500 hover:text-white hover:border-white/20 transition-all flex items-center gap-1">
          <Send size={9} />{t.name}
        </button>
      ))}
    </div>
  )
}

/* ─── Pipeline receiver hook ─── */
export function usePipeInput(toolId: string): string | null {
  const { entry, consume } = usePipeline()
  if (entry && entry.fromTool !== toolId) {
    const data = entry.data
    consume()
    return data
  }
  return null
}
