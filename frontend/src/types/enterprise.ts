// Agent Monitor Types

export interface AgentInfo {
  name: string;
  type: string;
  status: 'idle' | 'running' | 'completed' | 'failed' | 'waiting';
  description: string;
  capabilities: string[];
  last_task?: string;
  execution_time_ms?: number;
  health: 'healthy' | 'degraded' | 'offline';
  queue_depth: number;
  memory_used_mb?: number;
}

// Model Center Types

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  training_time_sec: number;
  prediction_time_ms: number;
  threshold: number;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface ChampionModel {
  name: string;
  type: string;
  version: string;
  training_date: string;
  dataset_size: number;
  metrics: ModelMetrics;
  feature_importance: FeatureImportance[];
  confusion_matrix?: number[][];
  roc_curve?: Array<{ fpr: number; tpr: number }>;
  business_score?: number;
}

export interface ModelComparison {
  models: Array<{
    name: string;
    type: string;
    metrics: ModelMetrics;
    is_champion: boolean;
  }>;
}

// Knowledge Center Types

export interface KnowledgeDocument {
  filename: string;
  file_type: string;
  size_bytes: number;
  indexed_at?: string;
  chunk_count?: number;
}

export interface KnowledgeStats {
  vector_count: number;
  chunk_count: number;
  bm25_index_size: number;
  embedding_model: string;
  documents_indexed: number;
}

export interface SearchResult {
  content: string;
  source: string;
  similarity_score: number;
  chunk_id?: string;
}

// Memory Center Types

export interface MemoryThread {
  thread_id: string;
  created_at: string;
  last_active: string;
  message_count: number;
  summary?: string;
}

export interface MemoryUsage {
  total_threads: number;
  total_checkpoints: number;
  db_size_mb: number;
  compression_ratio?: number;
}

// System Monitor Types

export interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  version?: string;
  response_time_ms?: number;
  details?: string;
}

export interface SystemTelemetry {
  cpu_percent: number;
  memory_percent: number;
  memory_used_mb: number;
  memory_total_mb: number;
  disk_used_gb: number;
  disk_total_gb: number;
  python_version: string;
  platform: string;
  services: ServiceStatus[];
  llm_provider: string;
  llm_model: string;
  tokens_per_sec?: number;
  uptime_sec: number;
}
