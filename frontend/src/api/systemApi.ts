import { useQuery } from '@tanstack/react-query';
import { apiClient } from './client';

export interface SystemHealth {
  status: string;
  version: string;
  environment: string;
  duckdb_connected: boolean;
  ml_model_loaded: boolean;
}

export const fetchSystemHealth = async (): Promise<SystemHealth> => {
  const { data } = await apiClient.get<SystemHealth>('/health');
  return data;
};

export const useSystemHealth = () => {
  return useQuery({
    queryKey: ['system-health'],
    queryFn: fetchSystemHealth,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};
