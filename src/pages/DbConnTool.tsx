import { useState } from 'react'
import { ToolHeader, Card, Chip, Input, Label, CopyBtn } from '../components/ui'
import { useAutoProcess } from '../hooks/useAutoProcess'

export default function DbConnTool() {
  const [type, setType] = useState('mysql')
  const [user, setUser] = useState('root')
  const [pass, setPass] = useState('')
  const [host, setHost] = useState('localhost')
  const [port, setPort] = useState('3306')
  const [db, setDb] = useState('mydb')
  const [conn, setConn] = useState('')
  const [copied, setCopied] = useState(false)

  const build = () => {
    const pwd = pass || 'password'
    const schemes: Record<string, string> = {
      mysql: `mysql://${user}:${pwd}@${host}:${port}/${db}`,
      postgres: `postgresql://${user}:${pwd}@${host}:${port}/${db}`,
      mongodb: `mongodb://${user}:${pwd}@${host}:${port}/${db}`,
      redis: `redis://:${pass}@${host}:${port}/0`,
      sqlite: `sqlite:///path/to/${db}.db`,
    }
    setConn(schemes[type] || schemes.mysql)
  }

  useAutoProcess(user, build, [type, pass, host, port, db])

  return (
    <div className="max-w-sm mx-auto animate-fadeInUp">
      <ToolHeader name="数据库" accent="连接串" accentColor="text-neon-green" desc="MySQL/PostgreSQL/MongoDB 等连接字符串生成 · 实时生成" />
      <Card>
        <div className="flex flex-wrap gap-2">{(['mysql','postgres','mongodb','redis','sqlite'] as const).map(k=><Chip key={k} active={type===k} onClick={()=>{setType(k);setPort(k==='mysql'?'3306':k==='postgres'?'5432':k==='mongodb'?'27017':k==='redis'?'6379':'')}}>{k}</Chip>)}
          <span className="ml-auto text-[10px] text-gray-500 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" /> 实时
          </span>
        </div>
        <div className="space-y-3">
          {[{l:'用户名',v:user,s:setUser},{l:'密码',v:pass,s:setPass},{l:'主机',v:host,s:setHost},{l:'端口',v:port,s:setPort},{l:'数据库',v:db,s:setDb}].map(({l,v,s})=><div key={l} className="space-y-1"><Label>{l}</Label><Input value={v} onChange={e=>s(e.target.value)} /></div>)}
        </div>
        {conn && <div className="flex items-center justify-between p-3 rounded-xl bg-cyber-bg-deep border border-white/10 result-flash"><code className="text-xs text-neon-cyan font-mono break-all">{conn}</code><CopyBtn copied={copied} onCopy={async()=>{await navigator.clipboard.writeText(conn);setCopied(true);setTimeout(()=>setCopied(false),1500)}} /></div>}
      </Card>
    </div>
  )
}
