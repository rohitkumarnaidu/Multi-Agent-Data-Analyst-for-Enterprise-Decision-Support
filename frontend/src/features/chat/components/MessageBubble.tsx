import React from 'react';
import { AskResponse } from '@/types/chat';
import { AgentTraceTimeline } from '@/features/agents/components/AgentTraceTimeline';
import { ChartRenderer } from '@/features/analytics/components/ChartRenderer';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AlertTriangle, CheckCircle, ShieldAlert, Cpu } from 'lucide-react';
import clsx from 'clsx';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content?: string; // For simple user messages
  response?: AskResponse; // For complex assistant responses
  isLoading?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content, response, isLoading }) => {
  const isUser = role === 'user';

  if (isUser) {
    return (
      <div className="flex w-full justify-end mb-6">
        <div className="max-w-[80%] bg-blue-600 text-white px-5 py-3 rounded-2xl rounded-tr-sm shadow-sm">
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex w-full justify-start mb-6">
        <div className="max-w-[80%] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-3">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          </div>
          <span className="text-sm text-gray-500 font-medium">Orchestrating agents...</span>
        </div>
      </div>
    );
  }

  if (!response) return null;

  const {
    answer, confidence, confidence_label, confidence_reason,
    chart_spec, trace, recommended_action, approval_required,
    low_sample_size, is_degraded, is_out_of_scope
  } = response;

  const getConfidenceColor = (level?: string) => {
    const safeLevel = level ? String(level).toUpperCase() : '';
    switch (safeLevel) {
      case 'HIGH': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800';
      case 'MEDIUM': return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800';
      case 'LOW': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const safeConfidenceLabel = confidence_label ? String(confidence_label) : 'UNKNOWN';
  const safeConfidence = confidence || 0;
  const upperLabel = safeConfidenceLabel.toUpperCase();

  return (
    <div className="flex w-full justify-start mb-8">
      <div className="max-w-[85%] w-full bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 px-6 py-5 rounded-2xl rounded-tl-sm shadow-md">
        
        {/* Header Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {/* Confidence Badge */}
          <div className={clsx("flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold", getConfidenceColor(safeConfidenceLabel))}>
            {upperLabel === 'HIGH' && <CheckCircle className="w-3.5 h-3.5" />}
            {upperLabel === 'MEDIUM' && <AlertTriangle className="w-3.5 h-3.5" />}
            {upperLabel === 'LOW' && <ShieldAlert className="w-3.5 h-3.5" />}
            <span>{safeConfidenceLabel} Confidence ({(safeConfidence * 100).toFixed(0)}%)</span>
          </div>
          
          {/* Flags */}
          {low_sample_size && (
            <div className="flex items-center gap-1 px-2 py-1 rounded border border-amber-200 bg-amber-50 text-amber-700 text-xs">
              <AlertTriangle className="w-3 h-3" /> Low Sample Size
            </div>
          )}
          {is_degraded && (
            <div className="flex items-center gap-1 px-2 py-1 rounded border border-red-200 bg-red-50 text-red-700 text-xs">
              <Cpu className="w-3 h-3" /> Degraded Mode
            </div>
          )}
          {is_out_of_scope && (
            <div className="flex items-center gap-1 px-2 py-1 rounded border border-purple-200 bg-purple-50 text-purple-700 text-xs">
              Out of Scope
            </div>
          )}
        </div>

        {/* Answer Content */}
        <div className="prose prose-sm dark:prose-invert max-w-none text-[15px] leading-relaxed mb-4 text-slate-800 dark:text-slate-200 prose-p:leading-relaxed prose-pre:bg-slate-50 dark:prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-200 dark:prose-pre:border-slate-800">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{answer}</ReactMarkdown>
        </div>

        {/* Chart (if any) */}
        {chart_spec && (
          <div className="my-6">
            <ChartRenderer spec={chart_spec} />
          </div>
        )}

        {/* Recommendation & Approval */}
        {(recommended_action || approval_required) && (
          <div className={clsx(
            "mt-5 p-4 rounded-lg border",
            approval_required 
              ? "bg-amber-50/50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800" 
              : "bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
          )}>
            <h4 className={clsx("text-sm font-semibold mb-1", approval_required ? "text-amber-800 dark:text-amber-300" : "text-blue-800 dark:text-blue-300")}>
              {approval_required ? "Action Requires Approval" : "Recommendation"}
            </h4>
            <p className={clsx("text-sm", approval_required ? "text-amber-700 dark:text-amber-400" : "text-blue-700 dark:text-blue-400")}>
              {recommended_action || "Approval required to proceed with system action."}
            </p>
            {approval_required && (
              <div className="mt-3 flex gap-2">
                <button className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded shadow-sm transition-colors">
                  Approve Action
                </button>
                <button className="px-4 py-1.5 bg-white dark:bg-gray-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded shadow-sm hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors">
                  Modify
                </button>
              </div>
            )}
          </div>
        )}

        {/* Trace Timeline */}
        {trace && trace.length > 0 && (
          <details className="mt-4 group">
            <summary className="text-xs text-slate-500 font-medium cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 list-none flex items-center gap-1 select-none">
              <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-open:rotate-90 transition-transform">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </span>
              View Processing Trace
            </summary>
            <div className="mt-2">
              <AgentTraceTimeline trace={trace} />
            </div>
          </details>
        )}
      </div>
    </div>
  );
};
