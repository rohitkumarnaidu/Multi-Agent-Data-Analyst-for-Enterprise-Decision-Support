import React from 'react';
import { KnowledgeUpload } from '@/features/knowledge/components/KnowledgeUpload';

const KnowledgePage: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Knowledge Base</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage documents available to the RAG system.</p>
      </div>
      <KnowledgeUpload />
    </div>
  );
};

export default KnowledgePage;
