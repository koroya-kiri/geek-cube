import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-cyber-bg-deep p-6">
          <div className="max-w-md w-full rounded-2xl border border-white/10 bg-cyber-bg-surface p-8 text-center space-y-4 shadow-lg">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertTriangle size={28} className="text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-white">出了点问题</h2>
              <p className="text-sm text-gray-400 mt-2">
                应用遇到了未预期的错误。这通常不是你的问题，试试刷新页面。
              </p>
            </div>
            {this.state.error && (
              <div className="p-3 rounded-lg bg-cyber-bg-deep border border-white/10 text-left">
                <code className="text-xs text-red-400 font-mono break-all">
                  {this.state.error.message}
                </code>
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan font-medium text-sm hover:bg-neon-cyan/20 transition-all"
            >
              <RefreshCw size={16} />
              重试
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
