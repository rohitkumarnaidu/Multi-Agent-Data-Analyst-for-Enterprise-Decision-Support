import React from 'react';
import { History, MessageSquare, Pin } from 'lucide-react';

export const SessionSidebar: React.FC = () => {
  // In a real implementation, this would fetch the list of sessions
  // Since our backend /session/{id}/history only fetches a single session,
  // we will mock the list for the UI layout.

  const recentSessions = [
    { id: '1', title: 'Q3 Sales Analysis', date: '2 hours ago', pinned: true },
    { id: '2', title: 'Customer Churn Prediction', date: 'Yesterday', pinned: false },
    { id: '3', title: 'Marketing ROI 2025', date: 'Aug 5', pinned: false },
  ];

  return (
    <div className="w-64 border-r border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 h-full flex flex-col shrink-0">
      <div className="p-4 border-b border-slate-200 dark:border-gray-800">
        <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium flex items-center justify-center gap-2 shadow-sm transition-colors">
          <MessageSquare className="w-4 h-4" />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {/* Pinned */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-2">
            <Pin className="w-3 h-3" /> Pinned
          </h3>
          <div className="space-y-1">
            {recentSessions.filter(s => s.pinned).map(session => (
              <button key={session.id} className="w-full text-left px-3 py-2 rounded text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors truncate">
                {session.title}
              </button>
            ))}
          </div>
        </div>

        {/* Recent */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-2">
            <History className="w-3 h-3" /> Recent
          </h3>
          <div className="space-y-1">
            {recentSessions.filter(s => !s.pinned).map(session => (
              <button key={session.id} className="w-full text-left px-3 py-2 rounded text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors truncate flex justify-between items-center group">
                <span className="truncate pr-2">{session.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
