import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Simulated latency helper for realistic mock responses
export const simulateLatency = (ms = 350): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function apiClient<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await axiosInstance(config)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message || 'API Request failed')
    }
    throw error
  }
}
