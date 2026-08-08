import React from 'react';
import { History, MessageSquare, Pin, Loader2 } from 'lucide-react';
import { useMemoryThreads } from '@/api/enterpriseApi';

interface SessionSidebarProps {
  onSelectSession?: (sessionId: string) => void;
  activeSessionId?: string;
}

export const SessionSidebar: React.FC<SessionSidebarProps> = ({ onSelectSession, activeSessionId }) => {
  const { data: threads, isLoading } = useMemoryThreads();

  const recentSessions = threads?.map((t, index) => ({
    id: t.thread_id,
    title: t.summary || `Session ${t.thread_id.substring(0, 8)}`,
    date: t.last_active || 'Unknown date',
    pinned: index === 0, // Mocking pinned state for the first item
  })) || [];

  return (
    <div className="w-64 border-r border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 h-full flex flex-col shrink-0">
      <div className="p-4 border-b border-slate-200 dark:border-gray-800">
        <button 
          onClick={() => onSelectSession?.('new')}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium flex items-center justify-center gap-2 shadow-sm transition-colors">
          <MessageSquare className="w-4 h-4" />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
          </div>
        ) : (
          <>
            {/* Pinned */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-2">
                <Pin className="w-3 h-3" /> Pinned
              </h3>
              <div className="space-y-1">
                {recentSessions.filter(s => s.pinned).map(session => (
                  <button 
                    key={session.id} 
                    onClick={() => onSelectSession?.(session.id)}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors truncate ${
                      activeSessionId === session.id 
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium' 
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {session.title}
                  </button>
                ))}
                {recentSessions.filter(s => s.pinned).length === 0 && (
                  <div className="px-3 py-2 text-xs text-slate-400">No pinned sessions</div>
                )}
              </div>
            </div>

            {/* Recent */}
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-2">
                <History className="w-3 h-3" /> Recent
              </h3>
              <div className="space-y-1">
                {recentSessions.filter(s => !s.pinned).map(session => (
                  <button 
                    key={session.id} 
                    onClick={() => onSelectSession?.(session.id)}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors truncate flex justify-between items-center group ${
                      activeSessionId === session.id 
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium' 
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span className="truncate pr-2">{session.title}</span>
                  </button>
                ))}
                {recentSessions.filter(s => !s.pinned).length === 0 && (
                  <div className="px-3 py-2 text-xs text-slate-400">No recent sessions</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
