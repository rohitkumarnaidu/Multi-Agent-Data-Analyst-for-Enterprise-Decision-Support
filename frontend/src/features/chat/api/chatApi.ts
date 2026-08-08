import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { ChatResponse, ChatRequest } from '@/types/chat';

const sendChatRequest = async (
  endpoint: '/chat' | '/ask' | '/simulate' | '/report' | '/anomaly',
  data: ChatRequest
): Promise<ChatResponse> => {
  const response = await apiClient.post(endpoint, data);
  return response.data;
};

export const useChatMutation = () => {
  return useMutation({
    mutationFn: (data: ChatRequest) => sendChatRequest('/ask', data),
  });
};

export const useSimulateMutation = () => {
  return useMutation({
    mutationFn: (data: ChatRequest) => sendChatRequest('/simulate', data),
  });
};

export const useReportMutation = () => {
  return useMutation({
    mutationFn: (data: ChatRequest) => sendChatRequest('/report', data),
  });
};

export const useAnomalyMutation = () => {
  return useMutation({
    mutationFn: (data: ChatRequest) => sendChatRequest('/anomaly', data),
  });
};
