import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { toolCategories } from '../utils/tools.ts'
import { useRipple } from '../hooks/useRipple'

function ToolCard({ tool }: { tool: (typeof toolCategories)[number]['tools'][number] }) {
  const { setRef, createRipple } = useRipple(800, 1.5)
  const Icon = tool.icon

  return (
    <div
      ref={setRef}
      onClick={(e) => createRipple(e.clientX, e.clientY)}
      className="relative"
    >
      <Link
        to={tool.path}
        className="group flex flex-col items-center justify-center gap-1.5 rounded-xl border transition-all duration-200"
        style={{
          padding: '15px 10px',
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderColor: 'rgba(255,255,255,0.06)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = tool.color || '#00f2ff'
          e.currentTarget.style.transform = 'scale(1.04)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        <Icon size={24} style={{ color: tool.color || '#00f0ff' }} />
        <span
          className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors whitespace-nowrap"
          style={{ fontSize: '12px' }}
        >
          {tool.name}
        </span>
      </Link>
    </div>
  )
}

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>()
  const category = toolCategories.find((c) => c.id === id)

  if (!category) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 animate-fadeInUp">
        <h2 className="text-xl text-white font-display mb-2">分类未找到</h2>
        <Link to="/" className="text-neon-cyan text-sm hover:text-white transition-colors">返回首页</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fadeInUp">
      {/* Back + Title */}
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6">
        <ArrowLeft size={16} />
        返回首页
      </Link>
      <h2 className="text-2xl font-bold font-display text-white mb-2">
        {category.name}
      </h2>
      <p className="text-sm text-gray-400 mb-8">
        {category.tools.length} 个工具
      </p>

      {/* Tool grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: '12px',
        }}
      >
        {category.tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {category.tools.length === 0 && (
        <div className="text-center py-12 text-gray-500">该分类暂无工具</div>
      )}
    </div>
  )
}
