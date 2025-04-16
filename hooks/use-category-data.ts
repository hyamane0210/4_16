"use client"

import { useState, useEffect, useCallback } from "react"
import { useLocalStorage } from "./use-local-storage"
import type { RecommendationItem } from "@/components/recommendations"

// ローカルストレージのキー
const SEARCH_HISTORY_KEY = "search_history"

export function useCategoryData(categoryType: string, searchTerm: string) {
  const [items, setItems] = useState<RecommendationItem[]>([])
  const [relatedItems, setRelatedItems] = useState<Record<string, RecommendationItem[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchHistory] = useLocalStorage<string[]>(SEARCH_HISTORY_KEY, [])

  const fetchCategoryData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // カテゴリーデータを取得
      const response = await fetch(
        `/api/category?type=${encodeURIComponent(categoryType)}&q=${encodeURIComponent(searchTerm)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ searchHistory }),
        },
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch category data: ${response.statusText}`)
      }

      const data = await response.json()
      setItems(data.items || [])
      setRelatedItems(data.relatedItems || {})
    } catch (err) {
      console.error("Error fetching category data:", err)
      setError(err instanceof Error ? err.message : "カテゴリーデータの取得に失敗しました")
    } finally {
      setLoading(false)
    }
  }, [categoryType, searchTerm, searchHistory])

  // 初回マウント時にデータを取得
  useEffect(() => {
    fetchCategoryData()
  }, [fetchCategoryData])

  // データを再取得する関数
  const refreshData = useCallback(() => {
    fetchCategoryData()
  }, [fetchCategoryData])

  return {
    items,
    relatedItems,
    loading,
    error,
    refreshData,
  }
}
