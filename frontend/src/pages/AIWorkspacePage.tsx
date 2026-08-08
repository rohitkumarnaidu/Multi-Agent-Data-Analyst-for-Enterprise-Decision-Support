import React from 'react';
import { ChatInterface } from '@/features/chat/components/ChatInterface';
import { SessionSidebar } from '@/features/memory/components/SessionSidebar';

const AIWorkspacePage: React.FC = () => {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden">
      <SessionSidebar />
      <div className="flex-1">
        <ChatInterface />
      </div>
    </div>
  );
};

export default AIWorkspacePage;
