import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export interface SessionHistory {
  session_id: string;
  created_at: string;
  feedback?: any[];
  // Other session metadata
}

export const useSessionHistory = (sessionId: string) => {
  return useQuery({
    queryKey: ['session', sessionId],
    queryFn: async (): Promise<SessionHistory> => {
      const response = await apiClient.get(`/session/${sessionId}/history`);
      return response.data;
    },
    enabled: !!sessionId,
  });
};

export const useSubmitFeedback = (sessionId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (feedback: Record<string, any>) => {
      const response = await apiClient.post(`/session/${sessionId}/feedback`, feedback);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
    },
  });
};
