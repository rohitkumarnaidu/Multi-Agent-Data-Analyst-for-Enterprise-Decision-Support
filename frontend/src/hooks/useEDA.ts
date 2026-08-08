import { useQuery } from '@tanstack/react-query'
import { edaService } from '@/services/edaService'

export const useEDAVariableStats = () => {
  return useQuery({
    queryKey: ['eda-variable-stats'],
    queryFn: () => edaService.getVariableStats(),
  })
}

export const useCorrelationMatrix = (method: 'pearson' | 'spearman' = 'pearson') => {
  return useQuery({
    queryKey: ['eda-correlation-matrix', method],
    queryFn: () => edaService.getCorrelationMatrix(method),
  })
}

export const useDistribution = (variableName: string) => {
  return useQuery({
    queryKey: ['eda-distribution', variableName],
    queryFn: () => edaService.getDistribution(variableName),
    enabled: !!variableName,
  })
}

export const useBoxPlotData = (variableName: string, groupBy = 'department') => {
  return useQuery({
    queryKey: ['eda-boxplot', variableName, groupBy],
    queryFn: () => edaService.getBoxPlotData(variableName, groupBy),
    enabled: !!variableName,
  })
}

export const useHypothesisTests = () => {
  return useQuery({
    queryKey: ['eda-hypothesis-tests'],
    queryFn: () => edaService.getHypothesisTests(),
  })
}

export const useMultivariateScatter = () => {
  return useQuery({
    queryKey: ['eda-multivariate-scatter'],
    queryFn: () => edaService.getMultivariateScatter(),
  })
}
