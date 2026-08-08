import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { settingsService } from '@/services/settingsService'
import type { LLMConfig } from '@/shared/types'

export const useLLMConfig = () => {
  return useQuery({
    queryKey: ['llm-config'],
    queryFn: () => settingsService.getLLMConfig(),
  })
}

export const useUpdateLLMConfig = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (newConfig: Partial<LLMConfig>) => settingsService.updateLLMConfig(newConfig),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['llm-config'] })
    },
  })
}

export const useHITLPolicies = () => {
  return useQuery({
    queryKey: ['hitl-policies'],
    queryFn: () => settingsService.getHITLPolicies(),
  })
}

export const useToggleHITLPolicy = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ policyId, enabled }: { policyId: string; enabled: boolean }) =>
      settingsService.toggleHITLPolicy(policyId, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hitl-policies'] })
    },
  })
}

export const useTokenUsage = () => {
  return useQuery({
    queryKey: ['token-usage'],
    queryFn: () => settingsService.getTokenUsage(),
  })
}

export const useAuditLogs = () => {
  return useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => settingsService.getAuditLogs(),
  })
}
