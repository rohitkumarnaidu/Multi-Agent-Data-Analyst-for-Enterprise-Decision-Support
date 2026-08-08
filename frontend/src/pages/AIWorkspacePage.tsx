import React, { useState } from 'react';
import { ChatInterface } from '@/features/chat/components/ChatInterface';
import { SessionSidebar } from '@/features/memory/components/SessionSidebar';
import InspectorPanel from '@/features/ai/components/InspectorPanel';
import { AskResponse } from '@/types/chat';

const AIWorkspacePage: React.FC = () => {
  const [latestResponse, setLatestResponse] = useState<AskResponse | undefined>(undefined);
  const [activeSessionId, setActiveSessionId] = useState<string>('default-session');

  return (
    <div className="absolute inset-0 flex overflow-hidden bg-slate-950 text-slate-200">
      {/* Left Pane: Sessions */}
      <div className="w-64 border-r border-slate-800/80 bg-slate-900/50 flex-shrink-0 hidden md:block">
        <SessionSidebar 
          onSelectSession={setActiveSessionId} 
          activeSessionId={activeSessionId} 
        />
      </div>

      {/* Center Pane: Chat Interface */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatInterface 
          sessionId={activeSessionId}
          onLatestResponse={(resp) => setLatestResponse(resp)} 
        />
      </div>

      {/* Right Pane: AI Inspector */}
      <div className="hidden xl:block">
        <InspectorPanel latestResponse={latestResponse} />
      </div>
    </div>
  );
};

export default AIWorkspacePage;
