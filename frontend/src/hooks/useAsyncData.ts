import { useEffect, useState } from "react"

export function useAsyncData<T>(loader: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    setLoading(true)
    setError(null)

    loader()
      .then((result) => {
        if (!active) {
          return
        }
        setData(result)
      })
      .catch(() => {
        if (!active) {
          return
        }
        setError("Unable to load data.")
      })
      .finally(() => {
        if (!active) {
          return
        }
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, deps)

  return { data, loading, error }
}
