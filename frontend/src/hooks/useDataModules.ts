import { useQuery } from '@tanstack/react-query'
import { dataService } from '@/services/dataService'

export const useDatasets = () => {
  return useQuery({
    queryKey: ['datasets'],
    queryFn: () => dataService.getDatasets(),
  })
}

export const useDatasetSchema = (datasetId: string) => {
  return useQuery({
    queryKey: ['dataset-schema', datasetId],
    queryFn: () => dataService.getDatasetSchema(datasetId),
    enabled: !!datasetId,
  })
}

export const useDatasetSample = (datasetId: string, limit = 10) => {
  return useQuery({
    queryKey: ['dataset-sample', datasetId, limit],
    queryFn: () => dataService.getSampleRows(datasetId, limit),
    enabled: !!datasetId,
  })
}

export const useSemanticMetrics = () => {
  return useQuery({
    queryKey: ['semantic-metrics'],
    queryFn: () => dataService.getSemanticMetrics(),
  })
}

export const useFeatures = () => {
  return useQuery({
    queryKey: ['features'],
    queryFn: () => dataService.getFeatures(),
  })
}

export const useDriftReports = () => {
  return useQuery({
    queryKey: ['drift-reports'],
    queryFn: () => dataService.getDriftReports(),
  })
}

export const useDataLineage = () => {
  return useQuery({
    queryKey: ['data-lineage'],
    queryFn: () => dataService.getDataLineage(),
  })
}
