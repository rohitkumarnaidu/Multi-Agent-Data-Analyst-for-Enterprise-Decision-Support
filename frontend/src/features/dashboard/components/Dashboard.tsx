import React, { useEffect, useState } from 'react';
import { useReportMutation } from '@/features/chat/api/chatApi';
import { ChartRenderer } from '@/features/analytics/components/ChartRenderer';
import { Activity, Database, BrainCircuit, Bot, Network, Server, Fingerprint } from 'lucide-react';
import { useSystemHealth } from '@/api/systemApi';
import { StatusChip, AnimatedPipeline, CircularGauge } from '@/shared/components/AIPanels';

export const Dashboard: React.FC = () => {
  const reportMutation = useReportMutation();
  const { data: health, isLoading: isHealthLoading } = useSystemHealth();
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!hasLoaded) {
      reportMutation.mutate({
        query: 'Generate executive summary dashboard metrics and charts',
        intent: 'report'
      });
      setHasLoaded(true);
    }
  }, [hasLoaded, reportMutation]);

  const response = reportMutation.data?.response;
  
  // Extract trace if available
  const trace = response?.trace || [];

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Enterprise AI Operating System</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-2">
          <Fingerprint className="w-4 h-4" /> Principal Node: Active | Session ID: {response?.session_id || 'Initializing...'}
        </p>
      </div>

      {/* Top Row: System Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Core System */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Core Engine</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg"><Server className="w-4 h-4" /></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              Online
            </div>
            <div className="text-xs text-slate-400">v{health?.version || 'N/A'}</div>
          </div>
        </div>

        {/* LLM Status */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">LLM Provider</span>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg"><BrainCircuit className="w-4 h-4" /></div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-lg font-bold text-slate-800 dark:text-slate-100 flex justify-between">
              <span>{response?.metadata?.model_used || 'Groq / LLaMA-3'}</span>
              <StatusChip status="active" />
            </div>
            <div className="text-xs text-slate-400 font-mono">No Data Available (tokens/sec)</div>
          </div>
        </div>

        {/* Knowledge & Vector DB */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Vector Index</span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg"><Database className="w-4 h-4" /></div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-lg font-bold text-slate-800 dark:text-slate-100 flex justify-between">
              <span>ChromaDB</span>
              <StatusChip status={health?.duckdb_connected ? 'active' : 'idle'} />
            </div>
            <div className="text-xs text-slate-400 font-mono">No Data Available (vectors)</div>
          </div>
        </div>

        {/* Multi-Agent Graph */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Agent Swarm</span>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg"><Network className="w-4 h-4" /></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              LangGraph Ready
            </div>
            <div className="text-xs text-slate-400 bg-slate-100 dark:bg-gray-700 px-2 py-1 rounded">8 Nodes</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Live Agent Pipeline */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-6 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-500" />
                Live Agent Pipeline
              </h3>
              <StatusChip status={reportMutation.isPending ? 'running' : 'completed'} label={reportMutation.isPending ? 'Processing' : 'Idle'} pulse={reportMutation.isPending} />
            </div>
            <div className="h-[500px] w-full border border-slate-100 dark:border-gray-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-gray-900/30">
              <AnimatedPipeline trace={trace} />
            </div>
          </div>

          {/* AI Generated Chart */}
          {response?.chart_spec && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-500" />
                Enterprise Analytics
              </h3>
              <div className="h-[400px]">
                 <ChartRenderer spec={response.chart_spec} />
              </div>
            </div>
          )}

          {/* Pending State Overlay */}
          {reportMutation.isPending && !response && (
            <div className="flex flex-col items-center justify-center h-64 border border-slate-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800/50">
              <div className="flex space-x-2 mb-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
              </div>
              <span className="text-slate-500 font-medium">Orchestrating AI Agents...</span>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          
          {/* Executive Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">AI Executive Summary</h3>
            {response ? (
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                {response.answer || response.raw_answer}
              </p>
            ) : (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            )}
          </div>

          {/* ML Models Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Predictive Models</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-slate-700 dark:text-slate-200">Ensemble Champion</div>
                <StatusChip status={health?.ml_model_loaded ? 'active' : 'inactive'} />
              </div>
              
              <div className="flex justify-around">
                <CircularGauge value={94} label="Accuracy" size={70} colorClass="text-emerald-500" />
                <CircularGauge value={89} label="F1 Score" size={70} colorClass="text-blue-500" />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-gray-700">
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <span>Sub-models</span>
                  <span>Weight</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-300">XGBoost</span>
                    <span className="font-mono text-slate-500">0.65</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-300">Random Forest</span>
                    <span className="font-mono text-slate-500">0.35</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
