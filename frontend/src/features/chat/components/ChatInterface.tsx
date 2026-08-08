import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { useChatMutation, useSessionHistory } from '@/features/chat/api/chatApi';
import { MessageBubble } from './MessageBubble';
import { AskResponse, ChatRequest } from '@/types/chat';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content?: string;
  response?: AskResponse;
}

interface ChatInterfaceProps {
  onLatestResponse?: (response: AskResponse) => void;
  sessionId?: string;
}

const DEFAULT_WELCOME_MSG: Message = {
  id: 'welcome',
  role: 'assistant',
  response: {
    answer: 'Welcome to Datasphere Enterprise AI. How can I assist you with your data today?',
    confidence: 1.0,
    confidence_label: 'HIGH',
    confidence_reason: 'System initialization',
    trace: [],
    approval_required: false,
    low_sample_size: false,
    is_out_of_scope: false,
    is_degraded: false,
    metadata: {
      records_analyzed: 0,
      processing_time_sec: 0,
      agents_invoked: [],
      steps_taken: 0,
      llm_provider: 'system',
      model_used: 'system'
    },
    timestamp: new Date().toISOString(),
    reference_date: new Date().toISOString().split('T')[0]
  }
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onLatestResponse, sessionId = 'default-session' }) => {
  const [messages, setMessages] = useState<Message[]>([DEFAULT_WELCOME_MSG]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const chatMutation = useChatMutation();
  const { data: history } = useSessionHistory(sessionId);

  useEffect(() => {
    if (history?.messages && history.messages.length > 0) {
      // Assuming backend history has similar shape or mapping is needed.
      // We will map them to our UI Message type.
      const mappedMessages = history.messages.map((m: any, i: number) => ({
        id: `hist-${i}`,
        role: m.role,
        content: m.content,
        // Since we are mocking response structure for user messages, 
        // we might not have 'response' object for assistant if it's plain text, 
        // but for now let's just populate content.
        response: m.role === 'assistant' ? m.response || { answer: m.content } : undefined,
      }));
      setMessages(mappedMessages);
    } else {
      setMessages([DEFAULT_WELCOME_MSG]);
    }
  }, [history, sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatMutation.isPending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatMutation.isPending) return;

    const query = input.trim();
    setInput('');

    // Add user message immediately
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query
    };
    setMessages(prev => [...prev, userMsg]);

    // Construct request
    const request: ChatRequest = {
      query,
      intent: 'data', // Default intent
      session_id: sessionId 
    };

    chatMutation.mutate(request, {
      onSuccess: (data) => {
        const assistantMsg: Message = {
          id: Date.now().toString() + '-resp',
          role: 'assistant',
          response: data.response
        };
        setMessages(prev => [...prev, assistantMsg]);
        onLatestResponse?.(data.response);
      },
      onError: (error) => {
        const errorMsg: Message = {
          id: Date.now().toString() + '-err',
          role: 'assistant',
          response: {
            answer: `**Error processing request**: ${error.message || 'Unknown error occurred.'}\n\nPlease try again or contact support if the issue persists.`,
            confidence: 0,
            confidence_label: 'LOW',
            confidence_reason: 'System Error',
            trace: [],
            approval_required: false,
            low_sample_size: false,
            is_out_of_scope: true,
            is_degraded: true,
            metadata: {
              records_analyzed: 0,
              processing_time_sec: 0,
              agents_invoked: [],
              steps_taken: 0,
              llm_provider: 'none',
              model_used: 'none'
            },
            timestamp: new Date().toISOString(),
            reference_date: new Date().toISOString().split('T')[0]
          }
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700 flex justify-between items-center shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-slate-800 dark:text-slate-100 leading-none">Enterprise Data Analyst</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Multi-Agent System Online</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
        <div className="max-w-4xl mx-auto">
          {messages.map(msg => (
            <MessageBubble 
              key={msg.id} 
              role={msg.role} 
              content={msg.content} 
              response={msg.response} 
            />
          ))}
          {chatMutation.isPending && (
            <MessageBubble role="assistant" isLoading={true} />
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-slate-200 dark:border-gray-700 shrink-0">
        <div className="max-w-4xl mx-auto relative">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a data question... (e.g. 'What were the sales for Q3?')"
              className="w-full pl-5 pr-14 py-3.5 bg-slate-50 dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-800 dark:text-slate-200 shadow-sm transition-all"
              disabled={chatMutation.isPending}
            />
            <button
              type="submit"
              disabled={!input.trim() || chatMutation.isPending}
              className="absolute right-2 p-2 rounded-lg bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-center mt-2">
            <span className="text-[11px] text-slate-400">AI-generated content may be inaccurate or incomplete. Review metrics before making decisions.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
