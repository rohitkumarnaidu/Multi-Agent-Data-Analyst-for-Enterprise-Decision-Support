import { useQuery, useMutation } from '@tanstack/react-query'
import { dashboardService } from '@/services/dashboardService'

export const useDashboardData = (timeframe = 'YTD 2026') => {
  return useQuery({
    queryKey: ['dashboardData', timeframe],
    queryFn: () => dashboardService.getDashboardData(timeframe),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useScenarioSimulation = () => {
  return useMutation({
    mutationFn: (params: {
      priceChangePct: number
      volumeChangePct: number
      costInflationPct: number
    }) => dashboardService.runScenarioSimulation(params),
  })
}
