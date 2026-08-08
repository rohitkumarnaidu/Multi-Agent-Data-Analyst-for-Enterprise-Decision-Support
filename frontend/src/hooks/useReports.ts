import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reportService } from '@/services/reportService'
import type { ReportType } from '@/shared/types'

export const useReports = () => {
  return useQuery({
    queryKey: ['reports'],
    queryFn: () => reportService.getReports(),
  })
}

export const useReportDetail = (reportId: string) => {
  return useQuery({
    queryKey: ['report-detail', reportId],
    queryFn: () => reportService.getReportById(reportId),
    enabled: !!reportId,
  })
}

export const useGenerateReport = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: {
      title: string
      type: ReportType
      targetScope: string
      depth: 'executive' | 'technical'
    }) => reportService.generateReport(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
    },
  })
}
