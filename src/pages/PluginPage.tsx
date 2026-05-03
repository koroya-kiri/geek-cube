import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Puzzle } from 'lucide-react'
import { usePlugins } from '../hooks/usePlugins'
import { DynamicComponent } from '../components/DynamicComponent'
import { Card } from '../components/ui'

export default function PluginPage() {
  const { id } = useParams<{ id: string }>()
  const { plugins } = usePlugins()
  const plugin = plugins.find(p => p.id === id)

  if (!plugin) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 animate-fadeInUp">
        <Puzzle size={32} className="mx-auto mb-4 text-gray-600" />
        <h2 className="text-xl text-white font-display mb-2">插件未找到</h2>
        <p className="text-sm text-gray-500 mb-4">ID: {id}</p>
        <Link to="/tools/plugin-manager" className="text-neon-purple text-sm hover:text-white transition-colors">返回插件工坊</Link>
      </div>
    )
  }

  if (!plugin.enabled) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 animate-fadeInUp">
        <h2 className="text-xl text-white font-display mb-2">{plugin.name}</h2>
        <p className="text-sm text-gray-500">此插件已禁用</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto animate-fadeInUp">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6">
        <ArrowLeft size={16} />返回
      </Link>
      <div className="mb-6">
        <h2 className="text-xl font-bold font-display text-white mb-1">{plugin.name}</h2>
        <p className="text-sm text-gray-500">v{plugin.version} · {plugin.author || '未知作者'}</p>
      </div>
      <Card>
        <DynamicComponent code={plugin.code} />
      </Card>
    </div>
  )
}
