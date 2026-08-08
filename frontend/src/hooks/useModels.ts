import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { modelService } from '@/services/modelService'

export const useModels = () => {
  return useQuery({
    queryKey: ['models'],
    queryFn: () => modelService.getModels(),
  })
}

export const useModelDetail = (modelId: string) => {
  return useQuery({
    queryKey: ['model-detail', modelId],
    queryFn: () => modelService.getModelById(modelId),
    enabled: !!modelId,
  })
}

export const useModelPredict = () => {
  return useMutation({
    mutationFn: ({ modelId, features }: { modelId: string; features: Record<string, number> }) =>
      modelService.predict(modelId, features),
  })
}

export const usePromoteModel = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (modelId: string) => modelService.promoteModel(modelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['models'] })
    },
  })
}
