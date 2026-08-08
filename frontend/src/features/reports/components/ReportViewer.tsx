import React, { useState } from 'react';
import { useReportMutation } from '@/features/chat/api/chatApi';
import { FileText, Download, Share2, Printer } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChartRenderer } from '@/features/analytics/components/ChartRenderer';

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

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-500" /> Enterprise Reports
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Generate comprehensive AI-driven business reports.</p>
        </div>
        {response && (
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-gray-700 rounded text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors">
              <Download className="w-4 h-4" /> PDF
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-gray-700 rounded text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors">
              <Share2 className="w-4 h-4" /> Share
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-gray-700 rounded text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors">
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleGenerate} className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Report Topic</label>
        <div className="flex gap-4">
          <input 
            type="text" 
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="e.g. Q4 Financial Risk Assessment" 
            className="flex-1 px-4 py-2 border border-slate-300 dark:border-gray-600 rounded bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit" 
            disabled={reportMutation.isPending || !topic.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {reportMutation.isPending ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </form>

      {reportMutation.isPending && (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-slate-500">Compiling report data...</span>
        </div>
      )}

      {response && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-8 shadow-sm print:shadow-none print:border-none">
          <div className="prose dark:prose-invert max-w-none prose-headings:text-slate-800 dark:prose-headings:text-slate-100 prose-p:text-slate-600 dark:prose-p:text-slate-300">
            <ReactMarkdown>{response.answer}</ReactMarkdown>
          </div>
          
          {response.chart_spec && (
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-gray-700 break-inside-avoid">
              <ChartRenderer spec={response.chart_spec} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
