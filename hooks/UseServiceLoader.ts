import { useCallback, useState } from "react";

export function useServiceLoader<T extends (...args: any[]) => Promise<any>>(serviceFn: T) {
  const [loading, setLoading] = useState(false)

  const wrappedFn = useCallback(async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      setLoading(true)
      const result = await serviceFn(...args)
      return result as ReturnType<T>
    } finally {
      setLoading(false)
    }
  }, [serviceFn])

  return { loading, call: wrappedFn }
}
