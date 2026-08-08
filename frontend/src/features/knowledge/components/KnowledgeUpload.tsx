import React, { useCallback, useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useUploadDocument } from '@/features/knowledge/api/knowledgeApi';

export const KnowledgeUpload: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const uploadMutation = useUploadDocument();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    uploadMutation.mutate(file);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-blue-500" />
        Knowledge Base
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Upload documents, CSVs, or PDFs to augment the enterprise knowledge base. The Data Agent will automatically parse and index them for RAG.
      </p>

      <form 
        onDragEnter={handleDrag} 
        onSubmit={(e) => e.preventDefault()}
        className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-slate-300 dark:border-gray-600 hover:bg-slate-50 dark:hover:bg-gray-700'
        }`}
      >
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
          onChange={handleChange}
          disabled={uploadMutation.isPending}
        />
        
        <div className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
          <UploadCloud className={`w-10 h-10 mb-3 ${dragActive ? 'text-blue-500' : 'text-slate-400'}`} />
          <p className="mb-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate-500">CSV, PDF, TXT, DOCX (MAX. 50MB)</p>
        </div>
      </form>

      {uploadMutation.isPending && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded border border-blue-200 dark:border-blue-800 flex items-center gap-2 text-sm">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          Uploading and indexing document...
        </div>
      )}

      {uploadMutation.isSuccess && (
        <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4" />
          Document indexed successfully. Available for queries.
        </div>
      )}

      {uploadMutation.isError && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded border border-red-200 dark:border-red-800 flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4" />
          Failed to upload document. Please try again.
        </div>
      )}
    </div>
  );
};
