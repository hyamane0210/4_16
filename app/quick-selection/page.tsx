"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, Check, ArrowRight } from "lucide-react"
import { useFavorites } from "@/contexts/favorites-context"
import { Badge } from "@/components/ui/badge"
import { useOnboarding } from "@/contexts/onboarding-context"
import { useVisitHistory } from "@/hooks/use-visit-history"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"
import { getProxiedImageUrl, getTMDbImageUrl, getSpotifyImageUrl } from "@/utils/image-utils"
import { useSpotifyData } from "@/hooks/use-spotify-data"
import { useTMDbData } from "@/hooks/use-tmdb-data"

// クイック選択用のカテゴリーとアイテム
const quickSelectionItems = [
  {
    category: "アーティスト",
    type: "artists",
    items: [
      {
        id: "artist-1",
        name: "ケンドリック・ラマー",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["ヒップホップ", "ラップ", "ピューリッツァー賞受賞"],
      },
      {
        id: "artist-2",
        name: "BTS",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["K-POP", "ダンス", "国際的"],
      },
      {
        id: "artist-3",
        name: "テイラー・スウィフト",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["ポップ", "カントリー", "自伝的歌詞"],
      },
      {
        id: "artist-4",
        name: "ビリー・アイリッシュ",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["ポップ", "オルタナティブ", "グラミー賞受賞"],
      },
      {
        id: "artist-5",
        name: "ドレイク",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["ヒップホップ", "R&B", "カナダ"],
      },
      {
        id: "artist-6",
        name: "アリアナ・グランデ",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["ポップ", "R&B", "ボーカル"],
      },
      {
        id: "artist-7",
        name: "エド・シーラン",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["ポップ", "フォーク", "シンガーソングライター"],
      },
      {
        id: "artist-8",
        name: "ザ・ウィークエンド",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["R&B", "ポップ", "エレクトロ"],
      },
      {
        id: "artist-9",
        name: "YOASOBI",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["J-POP", "小説", "ボーカロイド"],
      },
      {
        id: "artist-10",
        name: "カニエ・ウェスト",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["ヒップホップ", "プロデューサー", "ファッション"],
      },
      {
        id: "artist-11",
        name: "レディー・ガガ",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["ポップ", "ダンス", "アバンギャルド"],
      },
      {
        id: "artist-12",
        name: "ブルーノ・マーズ",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["ポップ", "R&B", "ファンク"],
      },
      {
        id: "artist-13",
        name: "あいみょん",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["J-POP", "シンガーソングライター", "ロック"],
      },
      {
        id: "artist-14",
        name: "ジャスティン・ビーバー",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["ポップ", "R&B", "カナダ"],
      },
      {
        id: "artist-15",
        name: "リアーナ",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["R&B", "ポップ", "ファッション"],
      },
    ],
  },
  {
    category: "映画/アニメ",
    type: "media",
    items: [
      {
        id: "media-1",
        name: "鬼滅の刃",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["アニメ", "アクション", "時代物"],
      },
      {
        id: "media-2",
        name: "インセプション",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["SF", "クリストファー・ノーラン", "複雑な展開"],
      },
      {
        id: "media-3",
        name: "進撃の巨人",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["アニメ", "ダーク", "ファンタジー"],
      },
      {
        id: "media-4",
        name: "千と千尋の神隠し",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["アニメ映画", "スタジオジブリ", "ファンタジー"],
      },
      {
        id: "media-5",
        name: "アベンジャーズ",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["アクション", "スーパーヒーロー", "マーベル"],
      },
      {
        id: "media-6",
        name: "君の名は。",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["アニメ映画", "新海誠", "ロマンス"],
      },
      {
        id: "media-7",
        name: "ハリー・ポッター",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["ファンタジー", "魔法", "冒険"],
      },
      {
        id: "media-8",
        name: "ジョーカー",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["ドラマ", "犯罪", "心理"],
      },
      {
        id: "media-9",
        name: "ワンピース",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["アニメ", "冒険", "海賊"],
      },
      {
        id: "media-10",
        name: "スター・ウォーズ",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["SF", "宇宙", "冒険"],
      },
      {
        id: "media-11",
        name: "天気の子",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["アニメ映画", "新海誠", "ファンタジー"],
      },
      {
        id: "media-12",
        name: "ダークナイト",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["アクション", "スーパーヒーロー", "クリストファー・ノーラン"],
      },
      {
        id: "media-13",
        name: "呪術廻戦",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["アニメ", "アクション", "超常現象"],
      },
      {
        id: "media-14",
        name: "パラサイト 半地下の家族",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["ドラマ", "スリラー", "韓国"],
      },
      {
        id: "media-15",
        name: "ボヘミアン・ラプソディ",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["伝記", "音楽", "ドラマ"],
      },
    ],
  },
  {
    category: "ファッション",
    type: "fashion",
    items: [
      {
        id: "fashion-1",
        name: "ナイキ",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["スポーツウェア", "スニーカー", "アスレチック"],
      },
      {
        id: "fashion-2",
        name: "ザラ",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["ファストファッション", "トレンディ", "手頃な価格"],
      },
      {
        id: "fashion-3",
        name: "グッチ",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["高級", "ハイファッション", "イタリア"],
      },
      {
        id: "fashion-4",
        name: "ユニクロ",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["ベーシック", "ミニマリスト", "日本"],
      },
      {
        id: "fashion-5",
        name: "アディダス",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["スポーツウェア", "スニーカー", "ドイツ"],
      },
      {
        id: "fashion-6",
        name: "H&M",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["ファストファッション", "手頃な価格", "スウェーデン"],
      },
      {
        id: "fashion-7",
        name: "ルイ・ヴィトン",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["高級", "バッグ", "フランス"],
      },
      {
        id: "fashion-8",
        name: "シャネル",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["高級", "クラシック", "フランス"],
      },
      {
        id: "fashion-9",
        name: "プラダ",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["高級", "ミニマリスト", "イタリア"],
      },
      {
        id: "fashion-10",
        name: "ノースフェイス",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["アウトドア", "機能性", "アメリカ"],
      },
      {
        id: "fashion-11",
        name: "ディオール",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["高級", "エレガント", "フランス"],
      },
      {
        id: "fashion-12",
        name: "ラコステ",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["スポーツウェア", "カジュアル", "フランス"],
      },
      {
        id: "fashion-13",
        name: "バレンシアガ",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["高級", "ストリート", "スペイン"],
      },
      {
        id: "fashion-14",
        name: "GU",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["ファストファッション", "手頃な価格", "日本"],
      },
      {
        id: "fashion-15",
        name: "ヴェルサーチ",
        image: "/placeholder.svg?height=200&width=200",
        tags: ["高級", "ゴージャス", "イタリア"],
      },
    ],
  },
]

export default function QuickSelectionPage() {
  const router = useRouter()
  const { addFavorite, isFavorite } = useFavorites()
  const { goToGuidedSearch, completeOnboarding } = useOnboarding()
  const { isFirstVisit, isLoaded } = useVisitHistory()
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [itemImages, setItemImages] = useState<Record<string, string>>({})
  const { searchArtist } = useSpotifyData()
  const { searchMovie } = useTMDbData()

  // APIから画像を取得
  useEffect(() => {
    const fetchImages = async () => {
      const newImages: Record<string, string> = {}

      // アーティスト画像を取得
      for (const item of quickSelectionItems[0].items) {
        try {
          const result = await searchArtist(item.name)
          if (result && result.artists && result.artists.items && result.artists.items.length > 0) {
            const artist = result.artists.items[0]
            if (artist.images && artist.images.length > 0) {
              newImages[item.id] = getSpotifyImageUrl(artist.images)
            }
          }
        } catch (error) {
          console.error(`Error fetching artist image for ${item.name}:`, error)
        }
      }

      // 映画/アニメ画像を取得
      for (const item of quickSelectionItems[1].items) {
        try {
          const result = await searchMovie(item.name)
          if (result && result.results && result.results.length > 0) {
            const movie = result.results[0]
            if (movie.poster_path) {
              newImages[item.id] = getTMDbImageUrl(movie.poster_path)
            }
          }
        } catch (error) {
          console.error(`Error fetching movie image for ${item.name}:`, error)
        }
      }

      // ファッションブランドの画像はプレースホルダーのまま

      setItemImages(newImages)
    }

    fetchImages()
  }, [searchArtist, searchMovie])

  // 初回訪問でない場合の処理
  useEffect(() => {
    if (isLoaded && !isFirstVisit) {
      // オンボーディングが完了している場合はホームにリダイレクト
      const hasCompletedOnboarding = localStorage.getItem("onboarding-completed") === "true"
      if (hasCompletedOnboarding) {
        router.push("/")
      }
    }
  }, [isFirstVisit, router, isLoaded])

  const toggleItem = (
    item: { id: string; name: string; image: string; tags?: string[] },
    category: string,
    type: string,
  ) => {
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
        features: [...(item.tags || []), category, "クイック選択"],
        imageUrl: itemImages[item.id] || getProxiedImageUrl(item.image),
        officialUrl: `https://example.com/${encodeURIComponent(item.name)}`,
      }
      addFavorite(favoriteItem)
    }
  }

  // 次のステップ（ガイド付き検索）に進む
  const handleContinue = () => {
    // 選択したアイテムの情報を収集
    const selectedItemsInfo = []

    for (const category of quickSelectionItems) {
      for (const item of category.items) {
        if (selectedItems.includes(item.id)) {
          selectedItemsInfo.push({
            ...item,
            type: category.type,
          })
        }
      }
    }

    // 選択したアイテムがある場合はガイド付き検索に遷移
    if (selectedItemsInfo.length > 0) {
      goToGuidedSearch(selectedItemsInfo)
    } else {
      // 選択がない場合もガイド付き検索へ（空の配列を渡す）
      goToGuidedSearch([])
    }
  }

  // スキップしてホームに戻る
  const handleSkip = () => {
    completeOnboarding()
  }

  // ローディング中は何も表示しない
  if (!isLoaded) {
    return null
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <div className="text-center mb-6 md:mb-8">
        <div className="inline-flex items-center justify-center bg-[#f5f5f5] p-3 rounded-full mb-3 md:mb-4">
          <Heart className="h-7 w-7 md:h-8 md:w-8 text-[#454545]" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3">好きなコンテンツを選んでみましょう</h1>
        <p className="text-muted-foreground mb-3 md:mb-4 max-w-2xl mx-auto text-sm md:text-base">
          興味のあるコンテンツを選択して、すぐにパーソナライズされた体験を始めましょう。
          <br className="hidden md:block" />
          選択したアイテムはお気に入りに追加され、あなた専用のおすすめが表示されます。
        </p>
        <Badge variant="outline" className="bg-yellow-50">
          {selectedItems.length}個選択中
        </Badge>
      </div>

      <div className="space-y-6 md:space-y-8 mb-6 md:mb-8">
        {quickSelectionItems.map((category, categoryIndex) => (
          <div key={categoryIndex} className="space-y-3 md:space-y-4">
            <h3 className="text-lg md:text-xl font-semibold">{category.category}</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 md:gap-3">
              {category.items.map((item) => {
                const isSelected = selectedItems.includes(item.id)
                return (
                  <Card
                    key={item.id}
                    className={`cursor-pointer transition-all overflow-hidden ${
                      isSelected ? "ring-2 ring-[#454545]" : "hover:shadow-md"
                    }`}
                    onClick={() => toggleItem(item, category.category, category.type)}
                  >
                    <div className="relative aspect-square w-full">
                      <ImageWithFallback
                        src={itemImages[item.id] || getProxiedImageUrl(item.image) || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        fallbackText={item.name.substring(0, 2)}
                        identifier={item.id}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                        <div className="p-2 text-white">
                          <p className="font-medium text-xs md:text-sm truncate">{item.name}</p>
                          {item.tags && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.tags.slice(0, 1).map((tag, idx) => (
                                <span key={idx} className="text-xs bg-white/20 px-1 py-0.5 rounded-full truncate">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-[#454545] text-white rounded-full w-5 h-5 flex items-center justify-center">
                          <Check className="h-3 w-3" />
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

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">
        <p className="text-sm text-muted-foreground order-2 sm:order-1">
          {selectedItems.length === 0
            ? "コンテンツを選択するとお気に入りに追加されます"
            : `${selectedItems.length}個のコンテンツをお気に入りに追加しました`}
        </p>
        <div className="flex gap-2 w-full sm:w-auto order-1 sm:order-2">
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
