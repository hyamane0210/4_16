"use client"

import React from "react"

import type { RecommendationItem } from "./recommendations"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Music, Film, ShoppingBag, Users } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { FavoriteIcon } from "@/components/favorites/favorite-icon"
import { Card, CardContent } from "@/components/ui/card"
import { Pagination } from "@/components/ui/pagination"
import { useRouter } from "next/navigation"
import { ImageWithFallback } from "./ui/image-with-fallback"
import { ItemDetailContent } from "./item-detail-content"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

// カテゴリーアイコンのマッピング
const categoryIcons: Record<string, any> = {
  artists: Music,
  celebrities: Users,
  media: Film,
  fashion: ShoppingBag,
}

// カテゴリータイトルのマッピング
const categoryTitles: Record<string, string> = {
  artists: "アーティスト",
  celebrities: "芸能人/インフルエンサー",
  media: "映画/アニメ",
  fashion: "ファッションブランド",
}

interface CategoryViewProps {
  items: RecommendationItem[]
  relatedItems?: Record<string, RecommendationItem[]>
  categoryType?: string
  searchTerm?: string
}

export default function CategoryView({
  items,
  relatedItems = {},
  categoryType = "",
  searchTerm = "",
}: CategoryViewProps) {
  const router = useRouter()
  const [selectedItem, setSelectedItem] = useState<RecommendationItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("main")
  const itemsPerPage = 18 // 1ページあたりのアイテム数

  // デバッグ用：元のデータをコンソールに出力
  useEffect(() => {
    console.log("CategoryView items:", items)
    console.log("CategoryView relatedItems:", relatedItems)
  }, [items, relatedItems])

  const handleItemClick = useCallback((item: RecommendationItem) => {
    setSelectedItem(item)
    setIsDialogOpen(true)
  }, [])

  // おすすめ検索を実行する関数
  const handleRecommendedSearch = useCallback(() => {
    if (selectedItem) {
      // ダイアログを閉じる
      setIsDialogOpen(false)

      // 検索ページに遷移して自動的に検索を実行
      router.push(`/search?q=${encodeURIComponent(selectedItem.name)}`)
    }
  }, [selectedItem, router])

  // データが少ない場合は、同じデータを繰り返して30個以上にする
  const extendedItems =
    items.length > 0 ? [...Array(Math.ceil(30 / items.length)).keys()].flatMap(() => items).slice(0, 50) : []

  // ページネーション用のデータ
  const paginatedItems = extendedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(extendedItems.length / itemsPerPage)

  // ページ変更ハンドラー
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    // ページトップにスクロール
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  // 関連カテゴリーのタブを生成
  const relatedTabs = Object.keys(relatedItems).map((category) => (
    <TabsTrigger key={category} value={category} className="flex items-center">
      {categoryIcons[category] && React.createElement(categoryIcons[category], { className: "h-4 w-4 mr-2" })}
      {categoryTitles[category] || category}
    </TabsTrigger>
  ))

  // データがない場合のフォールバック表示
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">該当するアイテムが見つかりませんでした。</p>
        <Button asChild className="mt-4">
          <Link href="/search">検索に戻る</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* タブナビゲーション（関連カテゴリーがある場合のみ表示） */}
      {Object.keys(relatedItems).length > 0 && (
        <Tabs defaultValue="main" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="main" className="flex items-center">
              {categoryType &&
                categoryIcons[categoryType] &&
                React.createElement(categoryIcons[categoryType], { className: "h-4 w-4 mr-2" })}
              {categoryType ? categoryTitles[categoryType] || categoryType : "メイン"}
            </TabsTrigger>
            {relatedTabs}
          </TabsList>

          {/* メインカテゴリーのコンテンツ */}
          <TabsContent value="main" className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {paginatedItems.map((item, index) => (
                <Card
                  key={`${item.name}-${index}`}
                  className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="relative aspect-square w-full">
                    <ImageWithFallback
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16.6vw"
                      loading={index < 10 ? "eager" : "lazy"}
                      fallbackText={item.name.substring(0, 2)}
                      identifier={`${item.name}-${index}`}
                    />
                    <FavoriteIcon item={item} size="sm" />
                  </div>
                  <CardContent className="p-2">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 h-10">{item.reason}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* ページネーション */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="mx-4 flex items-center">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Pagination>
              </div>
            )}
          </TabsContent>

          {/* 関連カテゴリーのコンテンツ */}
          {Object.entries(relatedItems).map(([category, categoryItems]) => (
            <TabsContent key={category} value={category} className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center">
                  {categoryIcons[category] &&
                    React.createElement(categoryIcons[category], { className: "h-5 w-5 mr-2" })}
                  {categoryTitles[category] || category}
                </h2>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/category/${category}?q=${encodeURIComponent(searchTerm)}`}>すべて見る</Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {categoryItems.slice(0, 12).map((item, index) => (
                  <Card
                    key={`${category}-${item.name}-${index}`}
                    className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="relative aspect-square w-full">
                      <ImageWithFallback
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16.6vw"
                        loading="lazy"
                        fallbackText={item.name.substring(0, 2)}
                        identifier={`${category}-${item.name}-${index}`}
                      />
                      <FavoriteIcon item={item} size="sm" />
                    </div>
                    <CardContent className="p-2">
                      <h4 className="font-medium text-sm truncate">{item.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 h-10">{item.reason}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* タブがない場合は直接コンテンツを表示 */}
      {Object.keys(relatedItems).length === 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {paginatedItems.map((item, index) => (
            <Card
              key={`${item.name}-${index}`}
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleItemClick(item)}
            >
              <div className="relative aspect-square w-full">
                <ImageWithFallback
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16.6vw"
                  loading={index < 10 ? "eager" : "lazy"}
                  fallbackText={item.name.substring(0, 2)}
                  identifier={`${item.name}-${index}`}
                />
                <FavoriteIcon item={item} size="sm" />
              </div>
              <CardContent className="p-2">
                <h4 className="font-medium text-sm truncate">{item.name}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 h-10">{item.reason}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ページネーション（タブがない場合のみ表示） */}
      {Object.keys(relatedItems).length === 0 && totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="mx-4 flex items-center">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Pagination>
        </div>
      )}

      {/* 詳細ダイアログ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedItem && (
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden">
            <ItemDetailContent item={selectedItem} onSearch={handleRecommendedSearch} />
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
