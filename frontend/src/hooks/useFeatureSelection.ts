import { useQuery } from '@tanstack/react-query'
import { featureSelectionService } from '@/services/featureSelectionService'

export const useFeatureRankings = (targetMetric = 'gross_margin_pct') => {
  return useQuery({
    queryKey: ['feature-rankings', targetMetric],
    queryFn: () => featureSelectionService.getFeatureRankings(targetMetric),
  })
}

export const useSubsetImpact = (targetMetric: string, selectedFeatures: string[]) => {
  return useQuery({
    queryKey: ['subset-impact', targetMetric, selectedFeatures.sort().join(',')],
    queryFn: () => featureSelectionService.getSubsetImpact(targetMetric, selectedFeatures),
  })
}
