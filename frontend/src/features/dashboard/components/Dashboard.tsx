import React, { useEffect, useState } from 'react';
import { useReportMutation } from '@/features/chat/api/chatApi';
import { ChartRenderer } from '@/features/analytics/components/ChartRenderer';
import { Activity, TrendingUp, AlertTriangle, Users } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const reportMutation = useReportMutation();
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

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Executive Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Enterprise Analytics Overview</p>
      </div>

      {reportMutation.isPending && (
        <div className="flex flex-col items-center justify-center h-64 border border-slate-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900/50">
          <div className="flex space-x-1 mb-4">
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce"></div>
          </div>
          <span className="text-slate-500 font-medium">Generating Executive Insights...</span>
        </div>
      )}

      {response && (
        <div className="space-y-6">
          {/* KPI Cards (Static layout for demonstration, would normally be parsed from response if needed) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Revenue</span>
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg"><TrendingUp className="w-4 h-4" /></div>
                </div>
                <div className="text-2xl font-semibold text-slate-800 dark:text-slate-100">$2.4M</div>
             </div>
             
             <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Users</span>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg"><Users className="w-4 h-4" /></div>
                </div>
                <div className="text-2xl font-semibold text-slate-800 dark:text-slate-100">14,205</div>
             </div>

             <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">System Uptime</span>
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg"><Activity className="w-4 h-4" /></div>
                </div>
                <div className="text-2xl font-semibold text-slate-800 dark:text-slate-100">99.9%</div>
             </div>

             <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Risk Alerts</span>
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg"><AlertTriangle className="w-4 h-4" /></div>
                </div>
                <div className="text-2xl font-semibold text-slate-800 dark:text-slate-100">3</div>
             </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-6 shadow-sm">
            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4">Executive Summary</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
              {response.answer}
            </p>
          </div>

          {response.chart_spec && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-6 shadow-sm">
              <ChartRenderer spec={response.chart_spec} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
