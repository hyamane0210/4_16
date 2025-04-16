"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { getImprovedRecommendations } from "@/app/actions-improved"
import { Loader2, SearchIcon, History, Sparkles, Film, Music, ShoppingBag, Users } from "lucide-react"
import { Search } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
import { suggestSimilarKeywords } from "@/utils/search-utils"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useFavorites } from "@/contexts/favorites-context"

// Lazy load the recommendations component
const DynamicRecommendations = dynamic(
  () => import("@/components/recommendations").then((mod) => ({ default: mod.Recommendations })),
  {
    loading: () => (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    ),
    ssr: false,
  },
)

// 人気の検索キーワード（カテゴリ別に整理）
const POPULAR_SEARCHES = {
  artists: [
    "米津玄師",
    "BTS",
    "テイラー・スウィフト",
    "ビリー・アイリッシュ",
    "YOASOBI",
    "ブルーノ・マーズ",
    "キング・ヌー",
    "あいみょん",
    "RADWIMPS",
    "Aimer",
    "NewJeans",
    "ケンドリック・ラマー",
  ],
  media: [
    "鬼滅の刃",
    "進撃の巨人",
    "ハリー・ポッター",
    "ジブリ",
    "アベンジャーズ",
    "ワンピース",
    "呪術廻戦",
    "SPY×FAMILY",
    "推しの子",
    "ジョジョの奇妙な冒険",
    "チェンソーマン",
    "スパイダーマン",
  ],
  fashion: [
    "ナイキ",
    "ユニクロ",
    "アディダス",
    "ザラ",
    "UNIQLO",
    "グッチ",
    "ルイヴィトン",
    "シャネル",
    "ノースフェイス",
    "ユニクロ",
    "H&M",
    "無印良品",
  ],
  celebrities: [
    "北村匠海",
    "小松菜奈",
    "新垣結衣",
    "山崎賢人",
    "広瀬すず",
    "菅田将暉",
    "浜辺美波",
    "中村倫也",
    "橋本環奈",
    "吉沢亮",
    "石原さとみ",
    "松本潤",
  ],
}

// ローカルストレージのキー
const SEARCH_HISTORY_KEY = "search_history"
const MAX_HISTORY_ITEMS = 20

export default function ImprovedSearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [recommendations, setRecommendations] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>(SEARCH_HISTORY_KEY, [])
  const [initialSearchDone, setInitialSearchDone] = useState(false)
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const { favorites } = useFavorites()

  // Memoize the query parameter
  const query = useMemo(() => searchParams.get("q"), [searchParams])

  // Optimize initial search with useEffect cleanup
  useEffect(() => {
    let isMounted = true

    if (query && !initialSearchDone) {
      setSearchTerm(query)
      handleSearch(query)
      if (isMounted) {
        setInitialSearchDone(true)
      }
    }

    return () => {
      isMounted = false
    }
  }, [query, initialSearchDone])

  // 検索語入力時に類似キーワードを提案
  useEffect(() => {
    if (searchTerm.length > 1) {
      // 全カテゴリの検索キーワードを結合
      const allPopularSearches = [
        ...POPULAR_SEARCHES.artists,
        ...POPULAR_SEARCHES.media,
        ...POPULAR_SEARCHES.fashion,
        ...POPULAR_SEARCHES.celebrities,
      ]

      const suggestions = suggestSimilarKeywords(searchTerm, [...allPopularSearches, ...searchHistory])
      setSuggestedKeywords(suggestions)
    } else {
      setSuggestedKeywords([])
    }
  }, [searchTerm, searchHistory])

  // 検索履歴を更新する関数
  const updateSearchHistory = useCallback(
    (term: string) => {
      setSearchHistory((prev) => {
        // 既存の履歴から同じ検索語を削除
        const filteredHistory = prev.filter((item) => item.toLowerCase() !== term.toLowerCase())
        // 新しい検索語を先頭に追加
        return [term, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS)
      })
    },
    [setSearchHistory],
  )

  // Memoize search function
  const handleSearch = useCallback(
    async (term: string) => {
      if (!term.trim()) {
        setError("検索キーワードを入力してください")
        return
      }

      setLoading(true)
      setError("")
      setSearchTerm(term)

      try {
        // ユーザーコンテキストを構築
        const userContext = {
          recentSearches: searchHistory,
          favorites: favorites || [],
        }

        // 改善された検索機能を使用
        const results = await getImprovedRecommendations(term, userContext)
        setRecommendations(results)

        // 検索履歴を更新
        updateSearchHistory(term)
      } catch (err) {
        setError("おすすめの取得中にエラーが発生しました。もう一度お試しください。")
      } finally {
        setLoading(false)
      }
    },
    [searchHistory, updateSearchHistory, favorites],
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      handleSearch(searchTerm)
    },
    [searchTerm, handleSearch],
  )

  // 検索履歴をクリアする関数
  const clearSearchHistory = useCallback(() => {
    setSearchHistory([])
  }, [setSearchHistory])

  // 検索履歴から項目を削除する関数
  const removeFromHistory = useCallback(
    (term: string) => {
      setSearchHistory((prev) => prev.filter((item) => item !== term))
    },
    [setSearchHistory],
  )

  // カテゴリー別検索ボタン
  const categorySearchButtons = useMemo(
    () => (
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={activeCategory === "artists" ? "default" : "outline"}
          className="rounded-full flex items-center"
          onClick={() => {
            setActiveCategory("artists")
            handleSearch("音楽 アーティスト")
          }}
        >
          <Music className="h-4 w-4 mr-2" />
          アーティスト
        </Button>
        <Button
          variant={activeCategory === "media" ? "default" : "outline"}
          className="rounded-full flex items-center"
          onClick={() => {
            setActiveCategory("media")
            handleSearch("映画 アニメ")
          }}
        >
          <Film className="h-4 w-4 mr-2" />
          映画/アニメ
        </Button>
        <Button
          variant={activeCategory === "fashion" ? "default" : "outline"}
          className="rounded-full flex items-center"
          onClick={() => {
            setActiveCategory("fashion")
            handleSearch("ファッション ブランド")
          }}
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          ファッション
        </Button>
        <Button
          variant={activeCategory === "celebrities" ? "default" : "outline"}
          className="rounded-full flex items-center"
          onClick={() => {
            setActiveCategory("celebrities")
            handleSearch("芸能人 インフルエンサー")
          }}
        >
          <Users className="h-4 w-4 mr-2" />
          芸能人
        </Button>
      </div>
    ),
    [handleSearch, activeCategory],
  )

  // 人気の検索キーワードを表示
  const renderPopularSearches = useCallback(() => {
    // アクティブなカテゴリがある場合はそのカテゴリの検索キーワードを表示
    const searchTerms = activeCategory
      ? POPULAR_SEARCHES[activeCategory]
      : [
          ...POPULAR_SEARCHES.artists.slice(0, 3),
          ...POPULAR_SEARCHES.media.slice(0, 3),
          ...POPULAR_SEARCHES.fashion.slice(0, 3),
          ...POPULAR_SEARCHES.celebrities.slice(0, 3),
        ]

    return (
      <div className="flex flex-wrap gap-2">
        {searchTerms.map((term, index) => (
          <Button key={index} variant="outline" className="rounded-full" onClick={() => handleSearch(term)}>
            {term}
          </Button>
        ))}
      </div>
    )
  }, [activeCategory, handleSearch])

  // 検索カードのコンポーネント
  const searchCards = useMemo(
    () => (
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-4">
              <Sparkles className="h-5 w-5 mr-2 text-[#454545]" />
              <h2 className="text-lg font-semibold">人気の検索</h2>
            </div>
            {renderPopularSearches()}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <History className="h-5 w-5 mr-2 text-[#454545]" />
                <h2 className="text-lg font-semibold">最近の検索</h2>
              </div>
              {searchHistory.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearSearchHistory}>
                  履歴を消去
                </Button>
              )}
            </div>
            {searchHistory.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((term, index) => (
                  <div key={index} className="relative group">
                    <Button variant="outline" className="rounded-full" onClick={() => handleSearch(term)}>
                      {term}
                    </Button>
                    <button
                      className="absolute -top-1 -right-1 bg-muted rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFromHistory(term)
                      }}
                      aria-label={`${term}を履歴から削除`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">最近の検索履歴はありません</p>
            )}
          </CardContent>
        </Card>
      </div>
    ),
    [searchHistory, handleSearch, clearSearchHistory, removeFromHistory, renderPopularSearches],
  )

  // 検索結果が空の場合のメッセージ
  const emptyResultsMessage = useMemo(
    () => (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="text-center max-w-md">
          <div className="h-16 w-16 text-muted-foreground mx-auto mb-4 flex items-center justify-center">
            <Search className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold mb-4">検索結果が見つかりませんでした</h1>
          <p className="text-muted-foreground mb-6">別のキーワードで検索してみてください。</p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/search">
                <Search className="mr-2 h-4 w-4" />
                新しい検索
              </Link>
            </Button>
          </div>
        </div>
      </div>
    ),
    [],
  )

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">検索</h1>
        <p className="text-muted-foreground">
          アーティスト、映画、アニメ、ファッションブランドなどを検索して、おすすめを見つけましょう
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="例: ケンドリック・ラマー、千と千尋の神隠し、ワンピース、アディダス..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-6 text-lg"
              />
              <Button type="submit" className="absolute right-1 top-1/2 transform -translate-y-1/2" disabled={loading}>
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
            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* キーワード提案 */}
            {suggestedKeywords.length > 0 && (
              <div className="pt-2">
                <p className="text-sm text-muted-foreground mb-2">もしかして:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedKeywords.map((keyword, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="rounded-full bg-muted/50"
                      onClick={() => {
                        setSearchTerm(keyword)
                        handleSearch(keyword)
                      }}
                    >
                      {keyword}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* カテゴリー別検索ボタン */}
      {!recommendations && !loading && categorySearchButtons}

      {!recommendations && !loading && searchCards}

      {loading && (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {recommendations && !loading && <DynamicRecommendations data={recommendations} searchTerm={searchTerm} />}

      {recommendations &&
        Object.values(recommendations).every((items) => items.length === 0) &&
        !loading &&
        emptyResultsMessage}
    </div>
  )
}
