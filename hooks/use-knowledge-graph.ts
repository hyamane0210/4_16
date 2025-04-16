"use client"

import { useState, useEffect } from "react"
import type { RecommendationsData } from "@/components/recommendations"

export function useKnowledgeGraph(query: string) {
  const [data, setData] = useState<RecommendationsData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (!query) return

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/knowledge-graph?query=${encodeURIComponent(query)}`)

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }

        const result = await response.json()
        setData(result.data)
      } catch (err) {
        console.error("Error fetching knowledge graph data:", err)
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [query])

  return { data, loading, error }
}
