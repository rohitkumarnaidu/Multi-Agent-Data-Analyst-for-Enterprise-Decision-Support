import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { DashboardKPIs, DashboardAlerts, DashboardCharts } from '@/types/dashboard';
import type {
  ColumnSchema,
  DataPreview,
  ColumnStatistic,
  DataQuality,
  QueryResult,
} from '@/types/dataExplorer';
import type {
  AgentInfo,
  ChampionModel,
  ModelComparison,
  KnowledgeDocument,
  KnowledgeStats,
  SearchResult,
  MemoryThread,
  MemoryUsage,
  SystemTelemetry,
} from '@/types/enterprise';
import type {
  DatasetDiscovery,
  DomainInsightsResponse,
} from '@/types/discovery';

// ─── Dataset Discovery API ───

export const useDatasetDiscovery = () =>
  useQuery<DatasetDiscovery>({
    queryKey: ['dataset-discovery'],
    queryFn: async () => (await apiClient.get('/dataset/discover')).data,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

export const useComputeKPI = () =>
  useMutation<{ value: number }, Error, { sql: string }>({
    mutationFn: async (kpi) => (await apiClient.post('/dataset/compute-kpi', kpi)).data,
  });

export const useComputeChart = () =>
  useMutation<{ data: Record<string, any>[]; columns: string[] }, Error, { sql: string }>({
    mutationFn: async (chart) => (await apiClient.post('/dataset/compute-chart', chart)).data,
  });

export const useDomainInsights = () =>
  useMutation<DomainInsightsResponse, Error, { domain_id: string }>({
    mutationFn: async (req) => (await apiClient.post('/dataset/domain-insights', req)).data,
  });

// ─── Dashboard API ───

export const useDashboardKPIs = () =>
  useQuery<DashboardKPIs>({
    queryKey: ['dashboard-kpis'],
    queryFn: async () => (await apiClient.get('/dashboard/kpis')).data,
    refetchInterval: 60000,
  });

export const useDashboardAlerts = () =>
  useQuery<DashboardAlerts>({
    queryKey: ['dashboard-alerts'],
    queryFn: async () => (await apiClient.get('/dashboard/alerts')).data,
    refetchInterval: 30000,
  });

export const useDashboardCharts = () =>
  useQuery<DashboardCharts>({
    queryKey: ['dashboard-charts'],
    queryFn: async () => (await apiClient.get('/dashboard/charts')).data,
    refetchInterval: 120000,
  });

// ─── Data Explorer API ───

export const useDataSchema = () =>
  useQuery<ColumnSchema[]>({
    queryKey: ['data-schema'],
    queryFn: async () => (await apiClient.get('/data/schema')).data,
  });

export const useDataPreview = (limit = 50, offset = 0) =>
  useQuery<DataPreview>({
    queryKey: ['data-preview', limit, offset],
    queryFn: async () =>
      (await apiClient.get('/data/preview', { params: { limit, offset } })).data,
  });

export const useDataStatistics = () =>
  useQuery<ColumnStatistic[]>({
    queryKey: ['data-statistics'],
    queryFn: async () => (await apiClient.get('/data/statistics')).data,
  });

export const useDataQuality = () =>
  useQuery<DataQuality>({
    queryKey: ['data-quality'],
    queryFn: async () => (await apiClient.get('/data/quality')).data,
  });

export const useExecuteQuery = () =>
  useMutation<QueryResult, Error, { sql: string }>({
    mutationFn: async (body) => (await apiClient.post('/data/query', body)).data,
  });

// ─── Agents API ───

export const useAgentsList = () =>
  useQuery<AgentInfo[]>({
    queryKey: ['agents-list'],
    queryFn: async () => (await apiClient.get('/agents')).data,
    refetchInterval: 15000,
  });

// ─── Models API ───

export const useChampionModel = () =>
  useQuery<ChampionModel>({
    queryKey: ['champion-model'],
    queryFn: async () => (await apiClient.get('/models/champion')).data,
  });

export const useModelComparison = () =>
  useQuery<ModelComparison>({
    queryKey: ['model-comparison'],
    queryFn: async () => (await apiClient.get('/models/comparison')).data,
  });

// ─── Knowledge API ───

export const useKnowledgeDocuments = () =>
  useQuery<KnowledgeDocument[]>({
    queryKey: ['knowledge-documents'],
    queryFn: async () => (await apiClient.get('/knowledge/documents')).data,
  });

export const useKnowledgeStats = () =>
  useQuery<KnowledgeStats>({
    queryKey: ['knowledge-stats'],
    queryFn: async () => (await apiClient.get('/knowledge/stats')).data,
  });

export const useKnowledgeSearch = () =>
  useMutation<SearchResult[], Error, { query: string }>({
    mutationFn: async (body) =>
      (await apiClient.post('/knowledge/search', body)).data,
  });

// ─── Memory API ───

export const useMemoryThreads = () =>
  useQuery<MemoryThread[]>({
    queryKey: ['memory-threads'],
    queryFn: async () => (await apiClient.get('/memory/threads')).data,
  });

export const useMemoryUsage = () =>
  useQuery<MemoryUsage>({
    queryKey: ['memory-usage'],
    queryFn: async () => (await apiClient.get('/memory/usage')).data,
  });

// ─── System Telemetry API ───

export const useSystemTelemetry = () =>
  useQuery<SystemTelemetry>({
    queryKey: ['system-telemetry'],
    queryFn: async () => (await apiClient.get('/system/telemetry')).data,
    refetchInterval: 10000,
  });
