import { useState } from 'react'
import { ToolHeader, Card, Chip, Textarea, Label, CopyBtn } from '../components/ui'
import { useAutoProcess } from '../hooks/useAutoProcess'

const MORSE: Record<string, string> = { A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..', ' ': '/' }
const REVERSE: Record<string, string> = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]))

function toMorse(text: string) { return text.toUpperCase().split('').map(c => MORSE[c] || c).join(' ') }
function fromMorse(morse: string) { return morse.split(' ').map(s => REVERSE[s] || s).join('') }

export default function MorseTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'to' | 'from'>('to')
  const convert = () => { try { setOutput(mode === 'to' ? toMorse(input) : fromMorse(input)) } catch { setOutput('') } }
  useAutoProcess(input, convert, [mode])
  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp"><ToolHeader name="莫尔斯" accent="电码" desc="摩尔斯电码编码与解码" /><Card>
      <div className="flex gap-2"><Chip active={mode === 'to'} onClick={() => setMode('to')}>编码</Chip><Chip active={mode === 'from'} onClick={() => setMode('from')}>解码</Chip></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="space-y-2"><Label>输入</Label><Textarea value={input} onChange={e => setInput(e.target.value)} rows={8} placeholder={mode === 'to' ? 'HELLO WORLD' : '.... . .-.. .-.. --- / .-- --- .-. .-.. -..'} /></div>
      <div className="space-y-2"><div className="flex justify-between"><Label>输出</Label><CopyBtn copied={false} onCopy={async () => { await navigator.clipboard.writeText(output) }} /></div><Textarea value={output} readOnly rows={8} className="text-neon-green result-flash" /></div></div>
    </Card></div>)
}
