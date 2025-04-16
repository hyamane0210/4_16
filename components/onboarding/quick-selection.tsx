"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, Check, ArrowRight } from "lucide-react"
import { useFavorites } from "@/contexts/favorites-context"
import { useOnboarding } from "@/contexts/onboarding-context"
import { Badge } from "@/components/ui/badge"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"

// クイック選択用のカテゴリーとアイテム
const quickSelectionItems = [
  {
    category: "アーティスト",
    items: [
      { id: "artist-1", name: "米津玄師", image: "/placeholder.svg?height=200&width=200" },
      { id: "artist-2", name: "BTS（防弾少年団）", image: "/placeholder.svg?height=200&width=200" },
      { id: "artist-3", name: "テイラー・スウィフト", image: "/placeholder.svg?height=200&width=200" },
      { id: "artist-4", name: "キング・ヌー", image: "/placeholder.svg?height=200&width=200" },
    ],
  },
  {
    category: "映画/アニメ",
    items: [
      { id: "media-1", name: "鬼滅の刃", image: "/placeholder.svg?height=200&width=200" },
      { id: "media-2", name: "呪術廻戦", image: "/placeholder.svg?height=200&width=200" },
      { id: "media-3", name: "進撃の巨人", image: "/placeholder.svg?height=200&width=200" },
      { id: "media-4", name: "君の名は。", image: "/placeholder.svg?height=200&width=200" },
    ],
  },
  {
    category: "ファッション",
    items: [
      { id: "fashion-1", name: "ユニクロ", image: "/placeholder.svg?height=200&width=200" },
      { id: "fashion-2", name: "ジーユー", image: "/placeholder.svg?height=200&width=200" },
      { id: "fashion-3", name: "エイチアンドエム", image: "/placeholder.svg?height=200&width=200" },
      { id: "fashion-4", name: "ザラ", image: "/placeholder.svg?height=200&width=200" },
    ],
  },
]

export function QuickSelection() {
  const { addFavorite, isFavorite } = useFavorites()
  const { nextStep, completeOnboarding } = useOnboarding()
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const toggleItem = (item: { id: string; name: string; image: string }, category: string) => {
    // 選択状態を切り替え
    setSelectedItems((prev) => {
      if (prev.includes(item.id)) {
        return prev.filter((id) => id !== item.id)
      } else {
        return [...prev, item.id]
      }
    })

    // お気に入りに追加/削除
    if (!isFavorite(item.name)) {
      const favoriteItem = {
        name: item.name,
        reason: `${category}カテゴリーからクイック選択で追加されました`,
        features: [`${category}`, "クイック選択"],
        imageUrl: item.image,
        officialUrl: `https://example.com/${encodeURIComponent(item.name)}`,
      }
      addFavorite(favoriteItem)
    }
  }

  // 次のステップ（ガイド付き検索）に進む
  const handleContinue = () => {
    nextStep()
  }

  // スキップしてオンボーディングを完了
  const handleSkip = () => {
    completeOnboarding()
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center bg-[#f5f5f5] p-2 rounded-full mb-2">
          <Heart className="h-6 w-6 text-[#454545]" />
        </div>
        <h1 className="text-2xl font-bold mb-2">好きなコンテンツを選んでみましょう</h1>
        <p className="text-muted-foreground mb-4">
          興味のあるコンテンツを選択して、すぐにパーソナライズされた体験を始めましょう。
          <br />
          選択したアイテムはお気に入りに追加され、あなた専用のおすすめが表示されます。
        </p>
        <Badge variant="outline" className="bg-yellow-50">
          {selectedItems.length}個選択中
        </Badge>
      </div>

      <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 scrollbar">
        {quickSelectionItems.map((category, categoryIndex) => (
          <div key={categoryIndex} className="space-y-3">
            <h3 className="text-lg font-semibold">{category.category}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {category.items.map((item) => {
                const isSelected = selectedItems.includes(item.id)
                return (
                  <Card
                    key={item.id}
                    className={`cursor-pointer transition-all overflow-hidden ${
                      isSelected ? "ring-2 ring-[#454545]" : "hover:shadow-md"
                    }`}
                    onClick={() => toggleItem(item, category.category)}
                  >
                    <div className="relative aspect-square w-full">
                      <ImageWithFallback
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        fallbackText={item.name.substring(0, 2)}
                        identifier={`quick-selection-${item.id}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                        <div className="p-3 text-white">
                          <p className="font-medium">{item.name}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-[#454545] text-white rounded-full w-6 h-6 flex items-center justify-center">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {selectedItems.length === 0
            ? "コンテンツを選択するとお気に入りに追加されます"
            : `${selectedItems.length}個のコンテンツをお気に入りに追加しました`}
        </p>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={handleSkip} className="flex-1 sm:flex-auto">
            スキップ
          </Button>
          <Button onClick={handleContinue} className="bg-[#454545] hover:bg-[#454545]/90 flex-1 sm:flex-auto">
            {selectedItems.length > 0 ? "選択したコンテンツで検索" : "次へ"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
