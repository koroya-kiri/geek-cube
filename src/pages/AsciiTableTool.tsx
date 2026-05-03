export default function AsciiTableTool() {
  const chars = Array.from({length:95},(_,i)=>String.fromCharCode(i+32))
  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      <h2 className="text-2xl font-bold font-display text-white mb-1.5">ASCII <span className="text-neon-yellow">码表</span></h2>
      <p className="text-sm text-gray-400 mb-6">ASCII 字符编码查询表 (32-126)</p>
      <div className="rounded-2xl border border-white/10 bg-cyber-bg-surface/80 p-5">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-1.5">
          {chars.map(c => (
            <div key={c} className="p-3 rounded-xl bg-cyber-bg-deep border border-white/10 text-center hover:border-neon-cyan/30 transition-colors">
              <div className="text-lg text-white font-mono">{c === ' ' ? '␣' : c}</div>
              <div className="text-[10px] text-gray-500 mt-1">{c.charCodeAt(0)}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 mt-6 text-xs text-gray-500 justify-center">
          {[{r:'0-9',s:48,e:57},{r:'A-Z',s:65,e:90},{r:'a-z',s:97,e:122}].map(({r,s,e}) => <span key={r}>{r}: <span className="text-neon-cyan">{s}-{e}</span></span>)}
        </div>
      </div>
    </div>
  )
}
