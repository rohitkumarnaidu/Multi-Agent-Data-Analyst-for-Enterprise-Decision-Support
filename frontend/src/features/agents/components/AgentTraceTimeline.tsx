import React from 'react';
import { TraceStep } from '@/types/chat';
import { CheckCircle2, Clock, Terminal } from 'lucide-react';

interface AgentTraceTimelineProps {
  trace: TraceStep[];
}

export const AgentTraceTimeline: React.FC<AgentTraceTimelineProps> = ({ trace }) => {
  if (!trace || trace.length === 0) return null;

  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700 text-sm">
      <div className="flex items-center gap-2 mb-3 text-gray-700 dark:text-gray-300 font-medium">
        <Terminal className="w-4 h-4" />
        <span>Execution Trace</span>
      </div>
      <div className="space-y-3 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
        {trace.map((step, index) => (
          <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            {/* Icon */}
            <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white dark:border-gray-900 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            </div>
            {/* Content */}
            <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 shadow">
              <div className="flex flex-col sm:flex-row justify-between mb-1">
                <span className="font-semibold text-slate-800 dark:text-slate-100">{step.agent}</span>
                <span className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                  <Clock className="w-3 h-3" />
                  {step.duration_sec.toFixed(2)}s
                </span>
              </div>
              <div className="text-slate-600 dark:text-slate-300 text-xs">
                {step.action}
              </div>
              {step.details && Object.keys(step.details).length > 0 && (
                <pre className="mt-2 text-[10px] bg-slate-50 dark:bg-slate-900 p-2 rounded overflow-x-auto text-slate-600 dark:text-slate-400 font-mono">
                  {JSON.stringify(step.details, null, 2)}
                </pre>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
