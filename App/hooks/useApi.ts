import { useState, useCallback } from "react"
import axios, { AxiosError, type AxiosRequestConfig, AxiosResponse } from "axios"

interface UseApiOptions extends AxiosRequestConfig {
  maxRetries?: number
  retryDelay?: number
}

const useApi = <T>() => {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<AxiosError | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const callApi = useCallback(async (
    url: string,
    options: UseApiOptions = {}
  ): Promise<AxiosResponse<T> | null> => {
    const { maxRetries = 3, retryDelay = 1000, ...axiosOptions } = options
    let retries = 0

    const executeRequest = async (): Promise<AxiosResponse<T>> => {
      try {
        setLoading(true)
        const response = await axios(url, axiosOptions)
        setData(response.data)
        setError(null)
        return response
      } catch (err) {
        if (retries < maxRetries && axios.isAxiosError(err)) {
          retries++
          await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, retries)))
          return executeRequest()
        }
        setError(err as AxiosError)
        throw err
      } finally {
        setLoading(false)
      }
    }

    try {
      return await executeRequest()
    } catch (err) {
      return null
    }
  }, [])

  return { data, error, loading, callApi }
}

export default useApi

