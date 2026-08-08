import React, { useState } from 'react';
import { BookOpen, Upload, Search, FileText, File, Database, Hash, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { useKnowledgeDocuments, useKnowledgeStats, useKnowledgeSearch } from '@/api/enterpriseApi';
import { KnowledgeUpload } from '@/features/knowledge/components/KnowledgeUpload';
import { Skeleton } from '@/shared/ui/Skeleton';

const FILE_ICONS: Record<string, React.ElementType> = {
  pdf: FileText, csv: Database, excel: Database, text: File, markdown: FileText, json: File, word: FileText, unknown: File,
};

const KnowledgePage: React.FC = () => {
  const { data: docs, isLoading: docsLoading } = useKnowledgeDocuments();
  const { data: stats, isLoading: statsLoading } = useKnowledgeStats();
  const searchMutation = useKnowledgeSearch();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) searchMutation.mutate({ query: searchQuery.trim() });
  };

  if (docsLoading || statsLoading) {
    return <div className="p-6 space-y-4 max-w-[1800px] mx-auto"><Skeleton className="h-10 w-64" /><Skeleton className="h-96 rounded-xl" /></div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-[1800px] mx-auto w-full overflow-y-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-sky-400" /> Knowledge Center
        </h1>
        <p className="text-sm text-slate-400 mt-1">Enterprise Knowledge Base — Document Ingestion & Hybrid RAG Search</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Documents', value: stats?.documents_indexed ?? 0, icon: FileText, color: 'text-sky-400' },
          { label: 'Vectors', value: stats?.vector_count ?? 0, icon: Layers, color: 'text-violet-400' },
          { label: 'Chunks', value: stats?.chunk_count ?? 0, icon: Hash, color: 'text-emerald-400' },
          { label: 'BM25 Index', value: stats?.bm25_index_size ?? 0, icon: Database, color: 'text-amber-400' },
          { label: 'Embedding Model', value: stats?.embedding_model ?? 'N/A', icon: BookOpen, color: 'text-pink-400' },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-slate-800/60 bg-slate-900/70 p-4">
            <div className="flex items-center gap-2">
              <s.icon className={`h-4 w-4 ${s.color}`} />
              <span className="text-[10px] text-slate-400 uppercase">{s.label}</span>
            </div>
            <p className="text-lg font-bold text-white font-mono mt-1">{typeof s.value === 'number' ? s.value.toLocaleString() : s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-slate-800/60 bg-slate-900/70 backdrop-blur-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Upload className="h-4 w-4 text-sky-400" /> Ingest Documents
          </h3>
          <KnowledgeUpload />
        </motion.div>

        {/* Hybrid Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-xl border border-slate-800/60 bg-slate-900/70 backdrop-blur-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Search className="h-4 w-4 text-emerald-400" /> Hybrid Search
          </h3>
          <div className="flex gap-2">
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Search knowledge base..."
              className="flex-1 px-3 py-2 text-sm bg-slate-800/80 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50" />
            <button onClick={handleSearch} disabled={searchMutation.isPending}
              className="px-4 py-2 text-xs font-medium text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors disabled:opacity-50">
              {searchMutation.isPending ? '...' : 'Search'}
            </button>
          </div>
          {searchMutation.data && searchMutation.data.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {searchMutation.data.map((r, i) => (
                <div key={i} className="rounded-lg bg-slate-800/50 border border-slate-700/30 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">{r.source}</span>
                    <span className="text-[10px] font-semibold text-emerald-400 font-mono">{(r.similarity_score * 100).toFixed(1)}%</span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-3">{r.content}</p>
                </div>
              ))}
            </div>
          ) : searchMutation.data && searchMutation.data.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">No results found</p>
          ) : null}
        </motion.div>
      </div>

      {/* Document List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-xl border border-slate-800/60 bg-slate-900/70 backdrop-blur-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800/60">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <FileText className="h-4 w-4 text-amber-400" /> Indexed Documents
          </h3>
        </div>
        {docs && docs.length > 0 ? (
          <div className="divide-y divide-slate-800/40">
            {docs.map((doc, i) => {
              const Icon = FILE_ICONS[doc.file_type] || File;
              return (
                <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800/30 transition-colors">
                  <Icon className="h-5 w-5 text-slate-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200 truncate">{doc.filename}</p>
                    <p className="text-[10px] text-slate-500">{doc.file_type.toUpperCase()} · {(doc.size_bytes / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 text-sm">No documents indexed yet. Upload files above to get started.</div>
        )}
      </motion.div>
    </div>
  );
};

export default KnowledgePage;
