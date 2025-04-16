"use client"

import { useParams, useSearchParams } from "next/navigation"
import { useCategoryData } from "@/hooks/use-category-data"
import CategoryView from "@/components/category-view"
import { Loader2, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// カテゴリータイトルのマッピング
const categoryTitles: Record<string, string> = {
  artists: "アーティスト",
  celebrities: "芸能人/インフルエンサー",
  media: "映画/アニメ",
  fashion: "ファッションブランド",
}

export default function CategoryPage() {
  const params = useParams()
  const searchParams = useSearchParams()

  const categoryType = typeof params.type === "string" ? params.type : ""
  const searchTerm = searchParams.get("q") || "米津玄師" // デフォルト検索キーワード

  const { items, relatedItems, loading, error, refreshData } = useCategoryData(categoryType, searchTerm)

  // カテゴリータイトルを取得
  const categoryTitle = categoryTitles[categoryType] || categoryType

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex space-x-4">
          <Button onClick={refreshData} variant="outline">
            再試行
          </Button>
          <Button asChild>
            <Link href="/search">検索に戻る</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <p>カテゴリーデータを読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{categoryTitle}</h1>
        <p className="text-muted-foreground">
          「{searchTerm}」に関連する{categoryTitle}の一覧
        </p>
      </div>

      <CategoryView items={items} relatedItems={relatedItems} categoryType={categoryType} searchTerm={searchTerm} />
    </div>
  )
}
