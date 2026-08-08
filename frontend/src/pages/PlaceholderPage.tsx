import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { useNavigate } from 'react-router-dom'
import { Bot, ArrowRight, Construction } from 'lucide-react'

interface PlaceholderPageProps {
  title: string
  subtitle: string
  sprintTarget: string
  description: string
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  subtitle,
  sprintTarget,
  description,
}) => {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">{title}</h1>
            <span className="rounded-full bg-cyan-500/20 border border-cyan-500/30 px-2.5 py-0.5 text-xs font-mono text-cyan-300">
              {sprintTarget}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        </div>
        <Button
          variant="cyber"
          size="sm"
          leftIcon={<Bot className="h-4 w-4" />}
          rightIcon={<ArrowRight className="h-4 w-4" />}
          onClick={() => navigate('/workspace/ai')}
        >
          Launch AI Workspace
        </Button>
      </div>

      <Card glow="cyan" className="p-8">
        <div className="flex flex-col items-center justify-center text-center space-y-4 py-12">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/80 border border-cyan-500/30 text-cyan-400 shadow-glow-cyan">
            <Construction className="h-7 w-7 animate-pulse" />
          </div>
          <div className="max-w-md space-y-2">
            <h3 className="text-lg font-semibold text-slate-100">{title} Architecture Loaded</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
          </div>
          <div className="pt-4 flex gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/workspace/dashboard')}>
              Go to Executive Dashboard
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/workspace/ai')}>
              Execute Golden Prompts in AI Workspace
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
