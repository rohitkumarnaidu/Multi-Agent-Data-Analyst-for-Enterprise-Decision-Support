import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SessionSidebar } from '@/features/ai/components/SessionSidebar'
import { AgentGraphCanvas } from '@/features/ai/flow/AgentGraphCanvas'
import { PromptInputBar } from '@/features/ai/components/PromptInputBar'
import { ChatMessageItem, ChatMessage } from '@/features/ai/components/ChatMessageItem'
import { InspectorPanel } from '@/features/ai/components/InspectorPanel'
import { GoldenPromptsModal } from '@/features/ai/components/GoldenPromptsModal'
import { Badge } from '@/shared/ui/Badge'
import {
  aiWorkspaceService,
  INITIAL_AGENT_NODES,
} from '@/services/aiWorkspaceService'
import { GOLDEN_QUESTIONS } from '@/features/ai/goldenQuestions'
import type { ChatSession, AskResponse, AgentNodeData } from '@/shared/types'
import {
  Bot,
  Layers,
  Sparkles,
  Columns2,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react'
import { useToast } from '@/shared/ui/Toast'

export const AIWorkspacePage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const { showToast } = useToast()

  // View state: 'split' | 'chat' | 'graph'
  const [viewMode, setViewMode] = useState<'split' | 'chat' | 'graph'>('split')
  const [isGoldenModalOpen, setIsGoldenModalOpen] = useState(false)
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>()

  // Sessions state
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: 'sess-1',
      title: 'Carrier Margin & Freight Leakage',
      createdAt: 'Today, 11:20 AM',
      updatedAt: '12 mins ago',
      lastQuestion: 'Identify shipments with high variance in freight billing margin',
      tags: ['Carrier', 'Margin'],
      category: 'revenue',
      isPinned: true,
    },
    {
      id: 'sess-2',
      title: 'Supply Chain Surcharge Sim',
      createdAt: 'Yesterday',
      updatedAt: '1 day ago',
      lastQuestion: 'Simulate scenario where fuel surcharges increase 12% across Apex & Swift',
      tags: ['Simulation', 'Monte Carlo'],
      category: 'simulation',
    },
    {
      id: 'sess-3',
      title: 'Logistics Anomaly Detection',
      createdAt: 'Aug 04, 2026',
      updatedAt: '3 days ago',
      lastQuestion: 'Identify shipments flagged with anomaly confidence > 0.85',
      tags: ['Anomalies', 'XGBoost'],
      category: 'risk',
    },
  ])
  const [activeSessionId, setActiveSessionId] = useState<string>('sess-1')

  // Agent graph execution state
  const [agentNodes, setAgentNodes] = useState<AgentNodeData[]>(INITIAL_AGENT_NODES)
  const [isLoading, setIsLoading] = useState(false)

  // Messages in current session
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      role: 'assistant',
      content: `### Enterprise Multi-Agent Decision Intelligence

I am your **LangGraph Supervisor Engine**, coordinating 10 specialized intelligence agents over **50,000 carrier shipment records** and DuckDB semantic views.

**Select a Golden Question preset (GT-01 to GT-20)** or enter a query to run Root Cause Analysis, Monte Carlo Forecasting, or AST Guardrail Verification.`,
      timestamp: '11:20 AM',
    },
  ])

  const [latestResponse, setLatestResponse] = useState<AskResponse | undefined>()
  const [presetPrompt, setPresetPrompt] = useState<string>('')

  // Handle URL search params on mount (e.g. from Dashboard deep-link ?prompt=GT-01)
  useEffect(() => {
    const promptParam = searchParams.get('prompt')
    if (promptParam) {
      const matchedGolden = GOLDEN_QUESTIONS.find(
        g => g.id.toLowerCase() === promptParam.toLowerCase()
      )
      const promptToRun = matchedGolden ? matchedGolden.prompt : promptParam
      setPresetPrompt(promptToRun)
      handleSendMessage(promptToRun, false, 1)
    }
  }, [searchParams])

  // Execute Question across Multi-Agent Graph
  const handleSendMessage = async (
    prompt: string,
    includeSimulation: boolean,
    simTier: 1 | 2
  ) => {
    if (!prompt.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Animated node transitions in LangGraph
    setAgentNodes(prev =>
      prev.map(n =>
        n.id === 'orchestrator'
          ? { ...n, status: 'running', activeTool: 'intent_router' }
          : { ...n, status: 'idle' }
      )
    )

    try {
      setTimeout(() => {
        setAgentNodes(prev =>
          prev.map(n =>
            n.id === 'orchestrator'
              ? { ...n, status: 'completed' }
              : n.id === 'data' || n.id === 'knowledge'
              ? { ...n, status: 'running', activeTool: 'duckdb_sql_query' }
              : n
          )
        )
      }, 400)

      setTimeout(() => {
        setAgentNodes(prev =>
          prev.map(n =>
            n.id === 'data' || n.id === 'knowledge'
              ? { ...n, status: 'completed' }
              : n.id === 'analysis' || (includeSimulation && n.id === 'simulation') || n.id === 'anomaly'
              ? { ...n, status: 'running', activeTool: 'xgboost_isolation_scorer' }
              : n
          )
        )
      }, 900)

      const response = await aiWorkspaceService.askQuestion({
        question: prompt,
        session_id: activeSessionId,
        include_simulation: includeSimulation,
        simulation_tier: simTier,
      })

      setTimeout(() => {
        setAgentNodes(prev =>
          prev.map(n =>
            n.id === 'narrative' || n.id === 'validator'
              ? { ...n, status: 'running', activeTool: 'ast_policy_evaluator' }
              : { ...n, status: 'completed' }
          )
        )
      }, 1400)

      setTimeout(() => {
        setAgentNodes(prev =>
          prev.map(n => ({
            ...n,
            status: 'completed',
            activeTool: undefined,
            executionTimeSec: 0.12,
          }))
        )

        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: response.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          responsePayload: response,
        }

        setMessages(prev => [...prev, assistantMsg])
        setLatestResponse(response)
        setIsLoading(false)

        showToast({
          title: 'Intelligence Synthesized',
          message: `Query resolved with ${response.confidence_label} confidence.`,
          type: 'success',
        })
      }, 1900)
    } catch (err: any) {
      setIsLoading(false)
      setAgentNodes(prev => prev.map(n => ({ ...n, status: 'idle' })))
      showToast({
        title: 'Query Failed',
        message: err.message || 'Error communicating with LangGraph agent service.',
        type: 'error',
      })
    }
  }

  const handleApproveAction = async () => {
    await aiWorkspaceService.submitApproval({
      session_id: activeSessionId,
      approved: true,
    })
    setAgentNodes(prev =>
      prev.map(n => (n.id === 'validator' ? { ...n, status: 'completed' } : n))
    )
  }

  const handleRejectAction = async (reason?: string) => {
    await aiWorkspaceService.submitApproval({
      session_id: activeSessionId,
      approved: false,
      reason,
    })
  }

  const handleNewSession = () => {
    const newSess: ChatSession = {
      id: `sess-${Date.now()}`,
      title: 'New Analytical Session',
      createdAt: 'Just now',
      updatedAt: 'Just now',
      lastQuestion: '',
      tags: ['Multi-Agent'],
      category: 'general',
    }
    setSessions([newSess, ...sessions])
    setActiveSessionId(newSess.id)
    setMessages([
      {
        id: 'msg-init',
        role: 'assistant',
        content:
          'New analysis session initialized. Enter your query or launch a Golden Question preset.',
        timestamp: 'Just now',
      },
    ])
    setLatestResponse(undefined)
    setAgentNodes(INITIAL_AGENT_NODES)
  }

  const selectedNodeData = agentNodes.find(n => n.id === selectedNodeId)

  return (
    <div className="flex h-[calc(100vh-5.5rem)] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
      {/* 1. Left Panel: Session Sidebar */}
      <SessionSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewSession={handleNewSession}
        onOpenGoldenPrompts={() => setIsGoldenModalOpen(true)}
      />

      {/* 2. Center Panel: LangGraph Flow + Chat Stream */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50 dark:bg-slate-900/50">
        {/* Top Control Bar */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Bot className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              LangGraph Orchestrator
            </span>
            <Badge variant="primary" size="sm">
              llama-3.3-70b
            </Badge>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              DuckDB RAG
            </span>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded text-xs flex items-center gap-1 transition-all ${
                viewMode === 'split'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Split View (Chat + Graph)"
            >
              <Columns2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Split</span>
            </button>

            <button
              onClick={() => setViewMode('chat')}
              className={`px-2.5 py-1 rounded text-xs flex items-center gap-1 transition-all ${
                viewMode === 'chat'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Chat Only"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Chat</span>
            </button>

            <button
              onClick={() => setViewMode('graph')}
              className={`px-2.5 py-1 rounded text-xs flex items-center gap-1 transition-all ${
                viewMode === 'graph'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Graph Flow Only"
            >
              <Layers className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Graph</span>
            </button>
          </div>
        </div>

        {/* Dynamic Center Body based on ViewMode */}
        <div className="flex-1 min-h-0 relative overflow-hidden flex">
          {/* Chat Stream Panel */}
          {(viewMode === 'split' || viewMode === 'chat') && (
            <div
              className={`flex-1 flex flex-col h-full overflow-y-auto p-4 space-y-4 ${
                viewMode === 'split' ? 'lg:border-r lg:border-slate-200 lg:dark:border-slate-800' : ''
              }`}
            >
              {messages.map(msg => (
                <ChatMessageItem key={msg.id} message={msg} />
              ))}

              {isLoading && (
                <div className="flex items-center gap-3 text-xs text-sky-600 dark:text-sky-400 p-3 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80">
                  <Sparkles className="h-4 w-4 animate-spin shrink-0" />
                  <span>
                    LangGraph multi-agent traversal in progress (Querying DuckDB lakehouse & scoring anomalies)...
                  </span>
                </div>
              )}
            </div>
          )}

          {/* React Flow Graph Visualizer Panel */}
          {(viewMode === 'split' || viewMode === 'graph') && (
            <div className={`${viewMode === 'split' ? 'hidden lg:block lg:w-[48%]' : 'w-full'} h-full p-2`}>
              <AgentGraphCanvas
                nodesData={agentNodes}
                onNodeClick={setSelectedNodeId}
                activeNodeId={selectedNodeId}
              />
            </div>
          )}
        </div>

        {/* Bottom Input Area */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <PromptInputBar
            onSend={handleSendMessage}
            isLoading={isLoading}
            initialPrompt={presetPrompt}
          />
        </div>
      </div>

      {/* 3. Right Panel: Dynamic Inspector / SQL & Verification Panel */}
      <InspectorPanel
        selectedNode={selectedNodeData}
        latestResponse={latestResponse}
        onApproveAction={handleApproveAction}
        onRejectAction={handleRejectAction}
      />

      {/* Golden Questions Modal */}
      <GoldenPromptsModal
        isOpen={isGoldenModalOpen}
        onClose={() => setIsGoldenModalOpen(false)}
        onSelectPrompt={p => {
          setIsGoldenModalOpen(false)
          handleSendMessage(p, false, 1)
        }}
      />
    </div>
  )
}

export default AIWorkspacePage
