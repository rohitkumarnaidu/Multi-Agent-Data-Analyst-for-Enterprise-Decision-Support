import React, { useState } from 'react';
import { useReportMutation } from '@/features/chat/api/chatApi';
import { FileText, Download, Share2, Printer, Activity, Search, LineChart, Network } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChartRenderer } from '@/features/analytics/components/ChartRenderer';
import { StatusChip } from '@/shared/components/AIPanels';

export const ReportViewer: React.FC = () => {
  const [topic, setTopic] = useState('');
  const reportMutation = useReportMutation();

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || reportMutation.isPending) return;
    reportMutation.mutate({
      query: `Generate a detailed report about: ${topic}`,
      intent: 'report'
    });
  };

  const response = reportMutation.data?.response;
  const trace = response?.trace || [];

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-500" /> 
            Enterprise Reports
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Generate comprehensive AI-driven business reports.</p>
        </div>
        {response && (
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors shadow-sm font-medium">
              <Download className="w-4 h-4" /> Export PDF
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors font-medium">
              <Share2 className="w-4 h-4" /> Share
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors font-medium">
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Col: Controls & Agent Trace */}
        <div className="lg:col-span-1 space-y-6">
          <form onSubmit={handleGenerate} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm flex flex-col gap-4">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Report Topic</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input 
                type="text" 
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g. Q4 Risk Assessment" 
                className="w-full pl-9 pr-4 py-2 border border-slate-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <button 
              type="submit" 
              disabled={reportMutation.isPending || !topic.trim()}
              className="w-full py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {reportMutation.isPending ? 'Generating...' : 'Run Generation'}
            </button>
          </form>

          {/* Execution Trace */}
          {trace.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
                <Network className="w-4 h-4 text-purple-500" /> Execution Trace
              </h3>
              <div className="space-y-4">
                {trace.map((step: any, idx: number) => (
                  <div key={idx} className="relative pl-4 border-l border-slate-200 dark:border-gray-700">
                    <div className="absolute w-2 h-2 bg-blue-500 rounded-full -left-[4.5px] top-1"></div>
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{step.agent}</div>
                    <div className="text-[11px] text-slate-500">{step.action}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: The Report Document */}
        <div className="lg:col-span-3">
          {reportMutation.isPending ? (
            <div className="flex flex-col items-center justify-center h-[600px] bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm">
              <div className="flex space-x-2 mb-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-3 h-3 bg-blue-700 rounded-full animate-bounce"></div>
              </div>
              <span className="text-slate-500 font-medium">Orchestrating Report Agents...</span>
            </div>
          ) : response ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
              {/* Document Toolbar */}
              <div className="px-8 py-4 border-b border-slate-100 dark:border-gray-700 bg-slate-50 dark:bg-gray-900/50 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <StatusChip status="completed" label="Report Ready" />
                  <span className="text-xs text-slate-400 font-mono">ID: {response.session_id.substring(0, 8)}</span>
                </div>
                <div className="flex gap-4 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5" /> High Confidence</span>
                  <span className="flex items-center gap-1"><LineChart className="w-3.5 h-3.5" /> 1 Chart Included</span>
                </div>
              </div>

              {/* Document Body */}
              <div className="p-8 overflow-y-auto flex-1">
                <div className="prose dark:prose-invert max-w-none prose-headings:text-slate-800 dark:prose-headings:text-slate-100 prose-p:text-slate-600 dark:prose-p:text-slate-300">
                  <ReactMarkdown>{response.answer}</ReactMarkdown>
                </div>
                
                {response.chart_spec && (
                  <div className="mt-12 pt-8 border-t border-slate-200 dark:border-gray-700 break-inside-avoid">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6">Generated Visualizations</h3>
                    <div className="h-[400px]">
                      <ChartRenderer spec={response.chart_spec} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[600px] bg-slate-50 dark:bg-gray-900/30 rounded-xl border border-dashed border-slate-300 dark:border-gray-700">
              <FileText className="w-12 h-12 text-slate-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-slate-500 dark:text-slate-400">No Report Generated</h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Enter a topic on the left to start the multi-agent generation pipeline.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
