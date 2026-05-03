import { useState, useEffect } from 'react'
import { ToolHeader, Card, Input, Chip } from '../components/ui'

const CATEGORIES: Record<string, [string, number][]> = {
  length: [['毫米 mm', 0.001], ['厘米 cm', 0.01], ['米 m', 1], ['千米 km', 1000], ['英寸 in', 0.0254], ['英尺 ft', 0.3048], ['码 yd', 0.9144], ['英里 mi', 1609.344]],
  weight: [['毫克 mg', 0.000001], ['克 g', 0.001], ['千克 kg', 1], ['吨 t', 1000], ['盎司 oz', 0.0283495], ['磅 lb', 0.453592]],
  temp: [['Celsius', 0], ['Fahrenheit', 32], ['Kelvin', 273.15]],
}

export default function UnitConverterTool() {
  const [cat, setCat] = useState('length')
  const [value, setValue] = useState('1')
  const [from, setFrom] = useState('meter')
  const [results, setResults] = useState<Record<string, string>>({})

  useEffect(() => {
    const units = CATEGORIES[cat]; const n = parseFloat(value)
    if (isNaN(n)) { setResults({}); return }
    if (cat === 'temp') {
      const celsius = from === 'Celsius' ? n : from === 'Fahrenheit' ? (n - 32) * 5 / 9 : n - 273.15
      setResults(Object.fromEntries(CATEGORIES[cat].map(([name]) => {
        if (name === 'Celsius') return [name, celsius.toFixed(2) + '°C']
        if (name === 'Fahrenheit') return [name, (celsius * 9 / 5 + 32).toFixed(2) + '°F']
        return [name, (celsius + 273.15).toFixed(2) + 'K']
      })))
    } else {
      const factor = units.find(([n]) => n === from)?.[1] || 1
      const base = n * factor
      setResults(Object.fromEntries(units.map(([name, f]) => [name, (base / f).toFixed(4).replace(/\.?0+$/, '')])))
    }
  }, [cat, value, from])

  return (<div className="max-w-md mx-auto animate-fadeInUp"><ToolHeader name="单位" accent="换算" desc="长度/重量/温度单位换算"/><Card>
    <div className="flex gap-2">{Object.keys(CATEGORIES).map(k => <Chip key={k} active={cat===k} onClick={()=>{setCat(k);setValue('1');setFrom(CATEGORIES[k][0][0])}}>{k==='length'?'长度':k==='weight'?'重量':'温度'}</Chip>)}</div>
    <div className="flex gap-2"><Input value={value} onChange={e=>setValue(e.target.value)} placeholder="1" className="flex-1"/><select value={from} onChange={e=>setFrom(e.target.value)} className="px-3 py-2 rounded-xl bg-cyber-bg-deep border border-white/10 text-white text-sm">{CATEGORIES[cat].map(([n])=><option key={n} value={n}>{n}</option>)}</select></div>
    {Object.keys(results).length > 0 && <div className="space-y-1.5">{Object.entries(results).filter(([n])=>n!==from).map(([k,v])=><div key={k} className="flex justify-between p-2.5 rounded-lg bg-cyber-bg-deep border border-white/10"><span className="text-sm text-gray-400">{k}</span><span className="text-sm text-white font-mono">{v}</span></div>)}</div>}
  </Card></div>)
}
