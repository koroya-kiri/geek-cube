import type { ReactNode } from 'react'

const CYAN = '#00f2ff'
const RED = '#ff0055'

/* ─── L-shaped corner decoration ─── */
function CornerTL() {
  return <span className="absolute top-0 left-0 w-3 h-3 border-t border-l pointer-events-none" style={{ borderColor: `${CYAN}60` }} />
}
function CornerTR() {
  return <span className="absolute top-0 right-0 w-3 h-3 border-t border-r pointer-events-none" style={{ borderColor: `${CYAN}60` }} />
}
function CornerBL() {
  return <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l pointer-events-none" style={{ borderColor: `${CYAN}60` }} />
}
function CornerBR() {
  return <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r pointer-events-none" style={{ borderColor: `${CYAN}60` }} />
}

/* ─── Code Pod (glass input/output panel) ─── */
export function LabPod({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div
      className="relative rounded-xl p-5 space-y-3"
      style={{
        background: 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${CYAN}20`,
        boxShadow: `inset 0 0 30px ${CYAN}05`,
      }}
    >
      <CornerTL /><CornerTR /><CornerBL /><CornerBR />
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: CYAN, boxShadow: `0 0 6px ${CYAN}` }} />
        <span className="font-mono text-[10px] tracking-[0.15em] uppercase" style={{ color: `${CYAN}80` }}>{label}</span>
      </div>
      {children}
    </div>
  )
}

/* ─── Encryption Key Input ─── */
export function LabKeyInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-mono text-[10px] tracking-[0.15em] uppercase neon-blink" style={{ color: `${CYAN}90` }}>
          [ ENCRYPTION KEY REQUIRED ]
        </span>
      </div>
      <div
        className="relative rounded-lg overflow-hidden"
        style={{ border: `1px solid ${CYAN}25` }}
      >
        <CornerTL /><CornerTR /><CornerBL /><CornerBR />
        <input
          type="password"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="················"
          className="w-full px-4 py-3 bg-transparent text-white text-sm font-mono placeholder-gray-700 focus:outline-none focus:border-[rgba(0,240,255,0.4)] transition-colors"
          style={{ background: 'rgba(0,0,0,0.3)', caretColor: '#00f0ff' }}
        />
      </div>
    </div>
  )
}

/* ─── Core Button (geometric center) ─── */
export function CoreButton({ onClick, disabled, children }: {
  onClick: () => void; disabled?: boolean; children: ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="relative px-8 py-3 font-mono text-xs tracking-[0.2em] uppercase transition-all duration-300 disabled:opacity-30"
      style={{
        background: disabled ? 'transparent' : `linear-gradient(135deg, ${CYAN}20, ${CYAN}05)`,
        border: `1px solid ${CYAN}${disabled ? '20' : '40'}`,
        color: disabled ? '#555' : CYAN,
        clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
        textShadow: disabled ? 'none' : `0 0 10px ${CYAN}40`,
      }}
    >
      {children}
    </button>
  )
}

/* ─── Error display ─── */
export function LabError({ children }: { children: ReactNode }) {
  return (
    <div className="px-4 py-3 rounded-lg font-mono text-xs" style={{ background: `${RED}10`, border: `1px solid ${RED}25`, color: RED }}>
      <span className="mr-2">⚠</span>{children}
    </div>
  )
}

/* ─── Chromatic aberration heading ─── */
export function LabHeading({ children }: { children: ReactNode }) {
  return (
    <h2
      className="text-xl font-bold font-display tracking-[0.15em] uppercase mb-1"
      style={{
        color: CYAN,
        textShadow: `
          1px 0 0 rgba(255,0,85,0.4),
          -1px 0 0 rgba(0,242,255,0.4),
          0 0 20px ${CYAN}30
        `,
      }}
    >
      {children}
    </h2>
  )
}

/* ─── Data flow animation bar ─── */
export function DataFlow({ active }: { active: boolean }) {
  return (
    <div className="flex items-center justify-center gap-1 py-2">
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className="w-1 rounded-full"
          style={{
            height: 4 + (i % 3) * 2,
            background: CYAN,
            opacity: active ? 0.8 : 0.15,
            animation: active ? `data-flow-bar 0.6s ease-in-out ${i * 0.1}s infinite alternate` : 'none',
            boxShadow: active ? `0 0 4px ${CYAN}` : 'none',
          }}
        />
      ))}
    </div>
  )
}
