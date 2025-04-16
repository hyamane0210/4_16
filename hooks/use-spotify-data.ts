"use client"

import { useState, useEffect } from "react"
import type { SpotifyArtist } from "@/services/spotify-service"

interface SpotifyData {
  artist: SpotifyArtist | null
  relatedArtists: SpotifyArtist[]
  topTracks: any[]
  isLoading: boolean
  error: string | null
}

export function useSpotifyData(artistName: string | null): SpotifyData {
  const [data, setData] = useState<SpotifyData>({
    artist: null,
    relatedArtists: [],
    topTracks: [],
    isLoading: false,
    error: null,
  })

  useEffect(() => {
    // アーティスト名がない場合は何もしない
    if (!artistName) return

    const fetchData = async () => {
      setData((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        const response = await fetch(`/api/spotify?artist=${encodeURIComponent(artistName)}`)

        // レスポンスが正常でない場合
        if (!response.ok) {
          const status = response.status
          const statusText = response.statusText
          let errorMessage = `Failed to fetch data: ${status} ${statusText}`

          // レート制限エラーの場合
          if (status === 429) {
            errorMessage = "API rate limit exceeded. Please try again later."
          }

          // レスポンスのテキストを取得
          try {
            const errorText = await response.text()
            errorMessage += ` - ${errorText}`
          } catch (e) {
            // テキスト取得に失敗した場合は無視
          }

          throw new Error(errorMessage)
        }

        const result = await response.json()

        // エラーチェック
        if (result.error) {
          throw new Error(result.error)
        }

        setData({
          artist: result.artist,
          relatedArtists: result.relatedArtists || [],
          topTracks: result.topTracks || [],
          isLoading: false,
          error: null,
        })
      } catch (error) {
        console.error("Error fetching Spotify data:", error)
        setData((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Unknown error occurred",
        }))
      }
    }

    fetchData()
  }, [artistName])

  return data
}
