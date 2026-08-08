import { useQuery } from '@tanstack/react-query'
import { explainabilityService } from '@/services/explainabilityService'

export const useGlobalSHAP = (modelId = 'model-xgb-margin-v24') => {
  return useQuery({
    queryKey: ['global-shap', modelId],
    queryFn: () => explainabilityService.getGlobalSHAP(modelId),
  })
}

export const useLocalExplanation = (
  transactionId = 'TX-89241',
  modelId = 'model-xgb-margin-v24'
) => {
  return useQuery({
    queryKey: ['local-explanation', transactionId, modelId],
    queryFn: () => explainabilityService.getLocalExplanation(transactionId, modelId),
    enabled: !!transactionId,
  })
}

export const useCounterfactuals = (transactionId = 'TX-89241') => {
  return useQuery({
    queryKey: ['counterfactuals', transactionId],
    queryFn: () => explainabilityService.getCounterfactuals(transactionId),
    enabled: !!transactionId,
  })
}
