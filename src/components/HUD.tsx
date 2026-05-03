/* ─── HUD Components ─── */

/** Horizontal scanning bar that sweeps across */
export function ScanBar() {
  return (
    <div className="relative w-full h-px overflow-hidden" style={{ background: 'rgba(0,242,255,0.08)' }}>
      <div
        className="absolute inset-y-0 w-1/3"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0,242,255,0.6), transparent)',
          animation: 'scan-slide 3s linear infinite',
        }}
      />
    </div>
  )
}

/** Pulsing breathing dot indicator */
export function BreathingDot({ color = '#00f2ff', size = 8 }: { color?: string; size?: number }) {
  return (
    <span
      className="inline-block rounded-full"
      style={{
        width: size, height: size, background: color,
        boxShadow: `0 0 ${size}px ${color}, 0 0 ${size*2}px ${color}`,
        animation: 'breathe 2s ease-in-out infinite',
      }}
    />
  )
}

/** SVG circular progress ring */
export function CircularProgress({ percent, size = 80, stroke = 3, color = '#00f2ff' }: {
  percent: number; size?: number; stroke?: number; color?: string
}) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (percent / 100) * circ
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: 'stroke-dashoffset 0.8s ease-out' }}
      />
    </svg>
  )
}

/** SVG waveform visualization */
export function Waveform({ bars = 20, color = '#00f2ff' }: { bars?: number; color?: string }) {
  return (
    <div className="flex items-end gap-px" style={{ height: 40 }}>
      {Array.from({ length: bars }, (_, i) => {
        const h = 20 + Math.abs(Math.sin(i * 0.5) * 18) + Math.random() * 4
        return (
          <div
            key={i}
            className="w-1 rounded-full"
            style={{
              height: h,
              background: color,
              boxShadow: `0 0 4px ${color}`,
              animation: `wave-bar 1.5s ease-in-out ${i * 0.08}s infinite alternate`,
              opacity: 0.7,
            }}
          />
        )
      })}
    </div>
  )
}

/** Glowing border card */
export function HUDCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md p-5 transition-all duration-300 ${className}`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
    >
      {children}
    </div>
  )
}

/** Blinking status text */
export function StatusText({ text, blink = true }: { text: string; blink?: boolean }) {
  return (
    <span className="font-mono text-xs tracking-wider" style={{ color: '#666' }}>
      {text}
      {blink && <span className="ml-2 inline-block w-1.5 h-3 bg-neon-cyan align-middle" style={{ animation: 'breathe 1s step-end infinite' }} />}
    </span>
  )
}
