import type { ReactNode, CSSProperties } from 'react'
import { useState, useEffect } from 'react'

const CYAN = '#00f2ff'
const GREEN = '#00ff41'

/* ─── System time display ─── */
export function SysClock() {
  const [t, setT] = useState('')
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setT(now.toLocaleTimeString('en-US', { hour12: false }) + '.' + String(now.getMilliseconds()).padStart(3,'0'))
    }
    tick(); const id = setInterval(tick, 100); return () => clearInterval(id)
  }, [])
  return <span className="font-mono text-[10px] tracking-[0.15em]" style={{ color: `${GREEN}80` }}>{t}</span>
}

/* ─── Pseudo-random data traffic ─── */
export function DataTraffic() {
  const [val, setVal] = useState('0x0000')
  useEffect(() => {
    const id = setInterval(() => setVal('0x' + Math.floor(Math.random()*65536).toString(16).toUpperCase().padStart(4,'0')), 800)
    return () => clearInterval(id)
  }, [])
  return <span className="font-mono text-[10px] tracking-[0.1em]" style={{ color: `${GREEN}60` }}>{val}</span>
}

/* ─── Glitch title ─── */
export function GlitchTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-xl md:text-2xl tracking-[0.2em] uppercase relative" style={{ color: CYAN }}>
      <span className="glitch-text" data-text={typeof children === 'string' ? children : ''}>{children}</span>
    </h2>
  )
}

/* ─── Scan line decoration ─── */
function ScanLine() {
  return (
    <div className="absolute left-0 top-0 bottom-0 w-px" style={{ background: `linear-gradient(to bottom, transparent, ${CYAN}60 30%, ${CYAN}60 70%, transparent)` }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-1/3" style={{ background: CYAN, boxShadow: `0 0 8px ${CYAN}`, animation: 'scan-line-slide 2s ease-in-out infinite' }} />
    </div>
  )
}

/* ─── Input with left+bottom border only ─── */
export function ScanInput({
  value, onChange, placeholder, type = 'text', isPassword, label, style
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; isPassword?: boolean; label?: string; style?: CSSProperties
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <span className="font-mono text-[10px] tracking-[0.15em] uppercase" style={{ color: `${CYAN}70` }}>
          {label}
        </span>
      )}
      <div className="relative">
        <ScanLine />
        <input
          type={isPassword ? 'password' : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-6 pr-4 py-3 bg-transparent text-white text-sm font-mono placeholder-gray-700 focus:outline-none focus:border-[rgba(0,240,255,0.4)] transition-colors"
          style={{
            border: 'none',
            borderLeft: `2px solid ${CYAN}30`,
            borderBottom: `2px solid ${CYAN}30`,
            background: 'rgba(0,0,0,0.3)',
            caretColor: CYAN,
            ...style,
          }}
        />
      </div>
    </div>
  )
}

/* ─── Textarea with left+bottom border ─── */
export function ScanTextarea({
  value, onChange, placeholder, readOnly, label, rows = 6
}: {
  value: string; onChange?: (v: string) => void; placeholder?: string; readOnly?: boolean; label?: string; rows?: number
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <span className="font-mono text-[10px] tracking-[0.15em] uppercase" style={{ color: `${CYAN}70` }}>
          {label}
        </span>
      )}
      <div className="relative">
        <ScanLine />
        <textarea
          value={value}
          onChange={onChange ? (e => onChange(e.target.value)) : undefined}
          readOnly={readOnly}
          placeholder={placeholder}
          rows={rows}
          className="w-full pl-6 pr-4 py-3 bg-transparent text-sm font-mono placeholder-gray-700 focus:outline-none focus:border-[rgba(0,240,255,0.4)] resize-none"
          style={{
            border: 'none',
            borderLeft: `2px solid ${CYAN}30`,
            borderBottom: `2px solid ${CYAN}30`,
            background: 'rgba(0,0,0,0.3)',
            caretColor: readOnly ? 'transparent' : CYAN,
            color: readOnly ? CYAN : 'white',
          }}
        />
      </div>
    </div>
  )
}

/* ─── Central terminal card ─── */
export function TerminalCard({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-xl mx-auto">
      <div
        className="relative rounded-2xl p-8 space-y-6"
        style={{
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(30px) saturate(150%)',
          WebkitBackdropFilter: 'blur(30px) saturate(150%)',
          border: `1px solid ${CYAN}10`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${CYAN}05, inset 0 0 60px ${CYAN}02`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

/* ─── Pulse button (full-width glowing bar) ─── */
export function PulseButton({ onClick, disabled, children }: {
  onClick: () => void; disabled?: boolean; children: ReactNode
}) {
  const [ripple, setRipple] = useState(false)
  const handleClick = () => {
    if (disabled) return
    setRipple(true)
    setTimeout(() => setRipple(false), 600)
    onClick()
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className="relative w-full py-3 font-mono text-xs tracking-[0.3em] uppercase transition-all duration-300 overflow-hidden disabled:opacity-20"
      style={{
        background: disabled ? 'transparent' : `linear-gradient(90deg, ${CYAN}10, ${CYAN}05, ${CYAN}10)`,
        border: `1px solid ${CYAN}${disabled ? '10' : '25'}`,
        color: disabled ? '#444' : CYAN,
        textShadow: disabled ? 'none' : `0 0 8px ${CYAN}30`,
      }}
    >
      {children}
      {ripple && (
        <span
          className="absolute inset-0 rounded-full"
          style={{
            animation: 'pulse-ripple 0.6s ease-out',
            background: `radial-gradient(circle, ${CYAN}30, transparent 70%)`,
          }}
        />
      )}
    </button>
  )
}

/* ─── Error display ─── */
export function TerminalError({ children }: { children: ReactNode }) {
  return (
    <div className="px-4 py-3 font-mono text-xs" style={{ background: 'rgba(255,0,85,0.08)', borderLeft: `2px solid #ff0055`, color: '#ff0055' }}>
      <span className="mr-2">[!]</span>{children}
    </div>
  )
}
