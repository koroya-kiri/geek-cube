export default function GlowOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Top-left – cyan-blue */}
      <div
        className="absolute rounded-full"
        style={{
          width: 500, height: 500,
          top: -150, left: -120,
          background: 'radial-gradient(circle, rgba(0,180,255,0.4) 0%, rgba(0,60,200,0.1) 50%, transparent 70%)',
          filter: 'blur(100px)',
          opacity: 0.35,
          animation: 'orb-move-1 15s infinite alternate',
        }}
      />
      {/* Center-right – deep blue */}
      <div
        className="absolute rounded-full"
        style={{
          width: 600, height: 600,
          top: '20%', right: -200,
          background: 'radial-gradient(circle, rgba(30,60,180,0.3) 0%, rgba(10,20,80,0.05) 60%, transparent 80%)',
          filter: 'blur(90px)',
          opacity: 0.25,
          animation: 'orb-move-2 18s infinite alternate',
        }}
      />
      {/* Bottom-left – purple-blue */}
      <div
        className="absolute rounded-full"
        style={{
          width: 400, height: 400,
          bottom: -100, left: '30%',
          background: 'radial-gradient(circle, rgba(120,40,220,0.3) 0%, rgba(60,20,120,0.1) 50%, transparent 70%)',
          filter: 'blur(80px)',
          opacity: 0.2,
          animation: 'orb-move-3 14s infinite alternate',
        }}
      />
      {/* Top-center – soft cyan glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: 300, height: 300,
          top: '8%', left: '50%',
          background: 'radial-gradient(circle, rgba(0,220,255,0.25) 0%, transparent 70%)',
          filter: 'blur(60px)',
          opacity: 0.2,
          animation: 'orb-move-2 11s infinite alternate',
        }}
      />
      {/* Far right mid – magenta accent */}
      <div
        className="absolute rounded-full"
        style={{
          width: 200, height: 200,
          top: '55%', right: '5%',
          background: 'radial-gradient(circle, rgba(180,20,140,0.2) 0%, transparent 70%)',
          filter: 'blur(50px)',
          opacity: 0.15,
          animation: 'orb-move-1 10s infinite alternate',
        }}
      />
    </div>
  )
}
