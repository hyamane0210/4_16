"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, Heart, Star, Search, ArrowRight } from "lucide-react"
import { useFavorites } from "@/contexts/favorites-context"
import { useOnboarding } from "@/contexts/onboarding-context"
import { getRecommendations } from "@/app/actions"
import { Recommendations } from "@/components/recommendations"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"

export function GuidedSearch() {
  const { completeOnboarding } = useOnboarding()
  const { favorites } = useFavorites()
  const [searchTerm, setSearchTerm] = useState("")
  const [recommendations, setRecommendations] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchComplete, setSearchComplete] = useState(false)
  const [selectedFavorite, setSelectedFavorite] = useState(null)
  const [step, setStep] = useState(1) // 1: 選択、2: 検索結果

  // クイック選択で追加されたお気に入りを取得
  const quickSelectionFavorites = favorites.filter((item) => item.features.includes("クイック選択"))

  // 初期化時に選択されたお気に入りがあれば最初のものを選択
  useEffect(() => {
    if (quickSelectionFavorites.length > 0 && !selectedFavorite) {
      setSelectedFavorite(quickSelectionFavorites[0])
      setSearchTerm(quickSelectionFavorites[0].name)
    }
  }, [quickSelectionFavorites, selectedFavorite])

  // 検索を実行する関数
  const performSearch = async () => {
    if (!searchTerm) return

    setLoading(true)
    try {
      const results = await getRecommendations(searchTerm)
      setRecommendations(results)
      setSearchComplete(true)
      setStep(2)
    } catch (error) {
      console.error("検索中にエラーが発生しました", error)
    } finally {
      setLoading(false)
    }
  }

  // 選択されたお気に入りで検索
  const searchWithFavorite = (favorite) => {
    setSelectedFavorite(favorite)
    setSearchTerm(favorite.name)
  }

  // 検索を開始
  const startSearch = () => {
    performSearch()
  }

  // アプリを始める
  const finishOnboarding = () => {
    completeOnboarding()
  }

  return (
    <div className="p-6 md:p-8">
      {step === 1 ? (
        <>
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center bg-[#f5f5f5] p-2 rounded-full mb-2">
              <Search className="h-6 w-6 text-[#454545]" />
            </div>
            <h1 className="text-2xl font-bold mb-2">選んだコンテンツで検索してみましょう</h1>
            <p className="text-muted-foreground mb-4">
              お気に入りに追加したコンテンツから1つ選んで、関連するおすすめを見つけましょう。
            </p>
          </div>

          <div className="bg-[#f5f5f5] rounded-lg p-6 mb-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Heart className="h-4 w-4 mr-2" />
              あなたのお気に入り
            </h3>

            {quickSelectionFavorites.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {quickSelectionFavorites.map((favorite, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all overflow-hidden ${
                      selectedFavorite && selectedFavorite.name === favorite.name
                        ? "ring-2 ring-[#454545]"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => searchWithFavorite(favorite)}
                  >
                    <div className="relative aspect-square w-full">
                      <ImageWithFallback
                        src={favorite.imageUrl || "/placeholder.svg?height=200&width=200"}
                        alt={favorite.name}
                        fill
                        className="object-cover"
                        fallbackText={favorite.name.substring(0, 2)}
                        identifier={`guided-favorite-${index}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                        <div className="p-3 text-white">
                          <p className="font-medium">{favorite.name}</p>
                        </div>
                      </div>
                      {selectedFavorite && selectedFavorite.name === favorite.name && (
                        <div className="absolute top-2 right-2 bg-[#454545] text-white rounded-full w-6 h-6 flex items-center justify-center">
                          <Star className="h-4 w-4 fill-current" />
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">お気に入りがありません。検索キーワードを入力してください。</p>
              </div>
            )}
          </div>

          <div className="bg-[#f5f5f5] rounded-lg p-6 mb-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Search className="h-4 w-4 mr-2" />
              検索キーワード
            </h3>

            <div className="flex gap-2">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="検索キーワードを入力..."
                className="flex-1"
              />
              <Button
                onClick={startSearch}
                disabled={!searchTerm || loading}
                className="bg-[#454545] hover:bg-[#454545]/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    検索中
                  </>
                ) : (
                  <>
                    検索
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                選択したコンテンツまたは入力したキーワードで検索します。 関連するおすすめコンテンツが表示されます。
              </p>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={finishOnboarding}>
              スキップ
            </Button>
            <Button
              onClick={startSearch}
              disabled={!searchTerm || loading}
              className="bg-[#454545] hover:bg-[#454545]/90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  検索中
                </>
              ) : (
                <>
                  検索する
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center bg-[#f5f5f5] p-2 rounded-full mb-2">
              <Star className="h-6 w-6 text-[#454545]" />
            </div>
            <h1 className="text-2xl font-bold mb-2">検索結果</h1>
            <p className="text-muted-foreground mb-4">
              「{searchTerm}」に関連するおすすめコンテンツです。
              <br />
              気に入ったコンテンツは星マークをクリックしてお気に入りに追加できます。
            </p>
            <Badge variant="outline" className="bg-yellow-50">
              検索完了
            </Badge>
          </div>

          <div className="max-h-[50vh] overflow-y-auto pr-2 scrollbar mb-6">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : recommendations ? (
              <Recommendations data={recommendations} searchTerm={searchTerm} />
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">検索結果がありません。別のキーワードで試してみてください。</p>
              </div>
            )}
          </div>

          <div className="bg-[#f5f5f5] rounded-lg p-6 mb-6">
            <h3 className="font-semibold mb-3">次のステップ</h3>
            <p className="text-sm text-muted-foreground mb-4">
              これでチュートリアルは完了です。アプリを使って、さらに多くのコンテンツを探索しましょう。
              <br />• 検索機能で新しいコンテンツを見つける
              <br />• お気に入りに追加して整理する
              <br />• 自己分析でパーソナライズされたおすすめを受け取る
            </p>
          </div>

          <div className="flex justify-center">
            <Button onClick={finishOnboarding} className="bg-[#454545] hover:bg-[#454545]/90 px-8">
              アプリを始める
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
