"use client"

import { useState } from "react"
import type { RecommendationItem } from "./recommendations"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Search, Filter, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ImageWithFallback } from "./ui/image-with-fallback"
import { FavoriteIcon } from "@/components/favorites/favorite-icon" // パスを修正

interface FavoritesListProps {
  items: RecommendationItem[]
  title?: string
  emptyMessage?: string
  showSearch?: boolean
  showFilters?: boolean
  layout?: "grid" | "list"
  onItemClick?: (item: RecommendationItem) => void
  className?: string
}

export function FavoritesList({
  items,
  title = "アイテム一覧",
  emptyMessage = "アイテムがありません",
  showSearch = true,
  showFilters = true,
  layout = "grid",
  onItemClick,
  className,
}: FavoritesListProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState<"default" | "name" | "date">("default")
  const [selectedItem, setSelectedItem] = useState<RecommendationItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // 検索とソートを適用したアイテムリスト
  const filteredItems = items
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.reason.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortOption === "name") {
        return a.name.localeCompare(b.name)
      } else if (sortOption === "date") {
        // 日付でソートする場合は、アイテムに日付フィールドがあると仮定
        // ここでは単純に名前でソート
        return a.name.localeCompare(b.name)
      }
      return 0
    })

  const handleItemClick = (item: RecommendationItem) => {
    if (onItemClick) {
      onItemClick(item)
    } else {
      setSelectedItem(item)
      setIsDialogOpen(true)
    }
  }

  // おすすめ検索を実行する関数
  const handleRecommendedSearch = () => {
    if (selectedItem) {
      // ダイアログを閉じる
      setIsDialogOpen(false)

      // 検索ページに遷移して自動的に検索を実行
      router.push(`/search?q=${encodeURIComponent(selectedItem.name)}`)
    }
  }

  // カテゴリーを判定する関数
  const getCategoryForItem = (item: any): string => {
    const text = `${item.name} ${item.reason} ${item.features.join(" ")}`.toLowerCase()

    if (text.includes("アーティスト") || text.includes("歌手") || text.includes("バンド") || text.includes("音楽")) {
      return "artists"
    } else if (text.includes("芸能人") || text.includes("俳優") || text.includes("女優") || text.includes("タレント")) {
      return "celebrities"
    } else if (text.includes("映画") || text.includes("アニメ") || text.includes("ドラマ") || text.includes("作品")) {
      return "media"
    } else if (
      text.includes("ファッション") ||
      text.includes("ブランド") ||
      text.includes("服") ||
      text.includes("スタイル")
    ) {
      return "fashion"
    }

    return "other"
  }

  // カテゴリー名を取得する関数
  const getCategoryName = (categoryId: string): string => {
    const categories: Record<string, string> = {
      artists: "アーティスト",
      celebrities: "芸能人",
      media: "映画/アニメ",
      fashion: "ファッション",
      other: "その他",
    }
    return categories[categoryId] || categoryId
  }

  return (
    <div className={cn("space-y-6", className)}>
      {title && <h2 className="text-xl font-bold">{title}</h2>}

      {(showSearch || showFilters) && (
        <div className="flex flex-col sm:flex-row gap-4">
          {showSearch && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          )}

          {showFilters && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  {sortOption === "default" ? "並び替え" : sortOption === "name" ? "名前順" : "日付順"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortOption("default")}>デフォルト</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("name")}>名前順</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("date")}>日付順</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}

      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : layout === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItems.map((item, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="cursor-pointer" onClick={() => handleItemClick(item)}>
                <div className="relative aspect-square w-full overflow-hidden">
                  <ImageWithFallback
                    src={item.imageUrl || "/placeholder.svg?height=400&width=400"}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    loading={index < 10 ? "eager" : "lazy"}
                    fallbackText={item.name.substring(0, 2)}
                    identifier={`favorite-${item.name}-${index}`}
                  />
                  <FavoriteIcon item={item} className="absolute top-2 right-2" />
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="secondary" className="bg-black/60 text-white hover:bg-black/70">
                      {getCategoryName(getCategoryForItem(item))}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium text-sm mb-1 line-clamp-1">{item.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 h-10">{item.reason}</p>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex cursor-pointer" onClick={() => handleItemClick(item)}>
                <div className="relative h-24 w-24 shrink-0">
                  <ImageWithFallback
                    src={item.imageUrl || "/placeholder.svg?height=200&width=200"}
                    alt={item.name}
                    fill
                    className="object-cover"
                    fallbackText={item.name.substring(0, 2)}
                    identifier={`favorite-list-${item.name}-${index}`}
                  />
                </div>
                <CardContent className="flex-1 p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="outline" className="mb-1">
                        {getCategoryName(getCategoryForItem(item))}
                      </Badge>
                      <h3 className="font-medium text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{item.reason}</p>
                    </div>
                    <FavoriteIcon item={item} className="position-static" />
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 詳細ダイアログ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedItem && (
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="text-xl">{selectedItem.name}</DialogTitle>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto pr-4">
              <div className="space-y-4">
                <div className="relative w-full h-64 rounded-md overflow-hidden">
                  <ImageWithFallback
                    src={selectedItem.imageUrl || "/placeholder.svg?height=400&width=400"}
                    alt={selectedItem.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 500px"
                    fallbackText={selectedItem.name.substring(0, 2)}
                    identifier={`dialog-${selectedItem.name}`}
                  />
                  <FavoriteIcon item={selectedItem} size="lg" className="absolute top-2 right-2" />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">提案理由</h3>
                  <p className="text-muted-foreground">{selectedItem.reason}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg">特徴</h3>
                  <ul className="list-disc pl-5 text-muted-foreground">
                    {selectedItem.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg">公式サイト</h3>
                  <a
                    href={selectedItem.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:underline"
                  >
                    {selectedItem.officialUrl.replace(/^https?:\/\//, "").split("/")[0]}
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button onClick={handleRecommendedSearch} className="w-full bg-[#454545] hover:bg-[#454545]/90">
                <Search className="mr-2 h-4 w-4" />「{selectedItem.name}」で検索
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
