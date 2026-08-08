export interface TraceStep {
  agent: string;
  action: string;
  duration_sec: number;
  details?: Record<string, any>;
}

export interface ChartSpec {
  chart_type: string;
  title: string;
  data: Record<string, any>;
  layout?: Record<string, any>;
}

export interface ResponseMetadata {
  query_used?: string;
  records_analyzed: number;
  processing_time_sec: number;
  agents_invoked: string[];
  steps_taken: number;
  llm_provider: string;
  model_used: string;
}

export interface AskResponse {
  answer: string;
  confidence: number;
  confidence_label: string;
  confidence_reason: string;
  chart_spec?: ChartSpec;
  trace: TraceStep[];
  recommended_action?: string;
  approval_required: boolean;
  low_sample_size: boolean;
  is_out_of_scope: boolean;
  is_degraded: boolean;
  metadata: ResponseMetadata;
  timestamp: string;
  reference_date: string;
}

export interface ChatRequest {
  query: string;
  intent?: string;
  session_id?: string;
}

export interface ChatResponse {
  session_id: string;
  response: AskResponse;
}
