import { useBg } from '../hooks/useBg.tsx'
import GlowOrbs from './GlowOrbs'
import ParticleBackground from './ParticleBackground'
import MatrixRain from './MatrixRain'
import Home from '../pages/Home'

export default function HomeWrapper() {
  const { settings } = useBg()

  return (
    <div className={`min-h-screen bg-transparent relative ${
      settings.crtScanlines ? 'scanlines-enhanced' : ''
    } ${settings.binaryRain ? 'bg-binary-rain' : ''} ${
      settings.starfield ? 'bg-starfield' : ''
    } ${settings.circuit ? 'bg-circuit' : ''}`}>
      <GlowOrbs />
      {settings.particles && <ParticleBackground />}
      {settings.matrixRain && <MatrixRain />}
      {settings.matrixBg && <div className="fixed inset-0 pointer-events-none bg-matrix" style={{ zIndex: 0 }} />}
      <Home />
    </div>
  )
}
