import axios from 'axios'
import { logger } from '../configs/logger'

export const makeApiCall = async (
    url: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
      params?: Record<string, any>
      data?: any
      headers?: Record<string, string>
    } = {}
  ) => {
    try {
      const res = await axios({
        url,
        method: options.method || 'GET',
        params: options.params,
        data: options.data,
        headers: options.headers,
        timeout: 10000,
      })
  
      return res.data
    } catch (error: any) {
      logger.error('API Error:', error)
      throw error.message
    }
  }