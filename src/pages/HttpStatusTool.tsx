const STATUS: {code:number;name:string;desc:string}[] = [
  {code:100,name:'Continue',desc:'继续'},{code:101,name:'Switching Protocols',desc:'切换协议'},
  {code:200,name:'OK',desc:'成功'},{code:201,name:'Created',desc:'已创建'},{code:204,name:'No Content',desc:'无内容'},
  {code:301,name:'Moved Permanently',desc:'永久移动'},{code:302,name:'Found',desc:'临时移动'},{code:304,name:'Not Modified',desc:'未修改'},
  {code:400,name:'Bad Request',desc:'错误请求'},{code:401,name:'Unauthorized',desc:'未授权'},{code:403,name:'Forbidden',desc:'禁止'},{code:404,name:'Not Found',desc:'未找到'},
  {code:405,name:'Method Not Allowed',desc:'方法不允许'},{code:429,name:'Too Many Requests',desc:'请求过多'},
  {code:500,name:'Internal Server Error',desc:'服务器错误'},{code:502,name:'Bad Gateway',desc:'网关错误'},{code:503,name:'Service Unavailable',desc:'服务不可用'},
]

export default function HttpStatusTool() {
  return (
    <div className="max-w-3xl mx-auto animate-fadeInUp">
      <h2 className="text-2xl font-bold font-display text-white mb-1.5">HTTP <span className="text-neon-cyan">状态码</span></h2>
      <p className="text-sm text-gray-400 mb-6">HTTP 状态码速查表</p>
      <div className="space-y-4">
        {[1,2,3,4,5].map(cat => {
          const items = STATUS.filter(s=>Math.floor(s.code/100)===cat)
          if(!items.length) return null
          return <div key={cat} className="rounded-2xl border border-white/10 bg-cyber-bg-surface/80 p-5">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">{cat}xx</h3>
            <div className="space-y-1.5">{items.map(s=><div key={s.code} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-cyber-bg-deep border border-white/10"><span className="text-neon-cyan font-mono text-sm w-12">{s.code}</span><span className="text-white text-sm">{s.name}</span><span className="text-gray-500 text-xs ml-auto">{s.desc}</span></div>)}</div>
          </div>
        })}
      </div>
    </div>
  )
}
