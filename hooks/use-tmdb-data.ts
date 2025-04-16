"use client"

import { useState, useEffect } from "react"
import type { Movie, TVShow, Cast, SearchResult } from "@/services/tmdb-service"

interface TMDbData {
  media: Movie | TVShow | null
  type: "movie" | "tv" | null
  credits: Cast[]
  similar: SearchResult[]
  isLoading: boolean
  error: string | null
}

export function useTMDbData(mediaName: string | null): TMDbData {
  const [data, setData] = useState<TMDbData>({
    media: null,
    type: null,
    credits: [],
    similar: [],
    isLoading: false,
    error: null,
  })

  useEffect(() => {
    // メディア名がない場合は何もしない
    if (!mediaName) return

    const fetchData = async () => {
      setData((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        const response = await fetch(`/api/tmdb?name=${encodeURIComponent(mediaName)}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`)
        }

        const result = await response.json()

        setData({
          media: result.media,
          type: result.type,
          credits: result.credits || [],
          similar: result.similar || [],
          isLoading: false,
          error: null,
        })
      } catch (error) {
        console.error("Error fetching TMDb data:", error)
        setData((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Unknown error occurred",
        }))
      }
    }

    fetchData()
  }, [mediaName])

  return data
}
