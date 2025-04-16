"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { getRecommendations } from "@/app/actions"
import { Recommendations } from "./recommendations"
import { Loader2 } from "lucide-react"

// 検索フォームのテキストを日本語に翻訳
export default function SearchForm() {
  const [searchTerm, setSearchTerm] = useState("")
  const [recommendations, setRecommendations] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) {
      setError("検索キーワードを入力してください")
      return
    }

    setLoading(true)
    setError("")

    try {
      const results = await getRecommendations(searchTerm)
      setRecommendations(results)
    } catch (err) {
      setError("推薦の取得中にエラーが発生しました。もう一度お試しください。")
    } finally {
      setLoading(false)
    }
  }

  const getSuggestions = () => {
    // Return at least 6 suggestions based on the current search term
    const defaultSuggestions = [
      "米津玄師",
      "BTS",
      "鬼滅の刃",
      "ナイキ",
      "テイラー・スウィフト",
      "進撃の巨人",
      "ビリー・アイリッシュ",
      "ユニクロ",
      "ハリー・ポッター",
    ]

    if (!searchTerm) return defaultSuggestions

    // Filter suggestions that match the current search term
    const filtered = defaultSuggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    // Return at least 6 suggestions, filling with defaults if needed
    return filtered.length >= 6
      ? filtered
      : [...filtered, ...defaultSuggestions.filter((s) => !filtered.includes(s))].slice(0, 9)
  }

  // 検索フォームのスタイルを更新
  return (
    <div className="space-y-8">
      <Card className="p-6 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="searchTerm" className="text-sm font-medium">
              キーワードで検索
            </label>
            <div className="flex gap-2">
              <Input
                id="searchTerm"
                placeholder="例: 米津玄師、鬼滅の刃、UNIQLO..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 border-input/60 focus-visible:ring-primary"
              />
              <Button type="submit" disabled={loading} variant="gradient">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    検索中
                  </>
                ) : (
                  "検索"
                )}
              </Button>
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>
      </Card>

      {recommendations && <Recommendations data={recommendations} searchTerm={searchTerm} />}
    </div>
  )
}
