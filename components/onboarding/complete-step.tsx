"use client"

import { useOnboarding } from "@/contexts/onboarding-context"
import { Button } from "@/components/ui/button"
import { CheckCircle, Search, Heart, BarChart2 } from "lucide-react"
import { useFavorites } from "@/contexts/favorites-context"

export function CompleteStep() {
  const { completeOnboarding, goToQuickSelection, goToGuidedSearch } = useOnboarding()
  const { favorites } = useFavorites()

  // クイック選択で追加されたお気に入りの数を計算
  const quickSelectionCount = favorites.filter((item) => item.features.includes("クイック選択")).length

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center bg-green-100 p-3 rounded-full mb-4">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">おめでとうございます！</h1>
        <p className="text-muted-foreground">
          My Projectの使い方を学び、実際に体験しました。
          {quickSelectionCount > 0 && (
            <>
              <br />
              <span className="font-medium text-[#454545]">{quickSelectionCount}個</span>
              のコンテンツをお気に入りに追加し、検索機能も試しました！
            </>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#f5f5f5] p-4 rounded-lg text-center">
          <div className="bg-white/80 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3">
            <Search className="h-5 w-5 text-[#454545]" />
          </div>
          <h3 className="font-semibold mb-1">検索する</h3>
          <p className="text-xs text-muted-foreground">好きなコンテンツを検索して新しい発見をしましょう</p>
        </div>
        <div className="bg-[#f5f5f5] p-4 rounded-lg text-center">
          <div className="bg-white/80 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3">
            <Heart className="h-5 w-5 text-[#454545]" />
          </div>
          <h3 className="font-semibold mb-1">お気に入り</h3>
          <p className="text-xs text-muted-foreground">気に入ったコンテンツをお気に入りに追加しましょう</p>
        </div>
        <div className="bg-[#f5f5f5] p-4 rounded-lg text-center">
          <div className="bg-white/80 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3">
            <BarChart2 className="h-5 w-5 text-[#454545]" />
          </div>
          <h3 className="font-semibold mb-1">好み分析</h3>
          <p className="text-xs text-muted-foreground">あなたの好みを分析して新しい提案を受け取りましょう</p>
        </div>
      </div>

      <div className="text-center mb-8">
        <p className="text-sm text-muted-foreground mb-2">
          いつでも設定からこのチュートリアルを再表示できます。
          <br />
          それでは、素敵なコンテンツ体験をお楽しみください！
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {quickSelectionCount === 0 && (
          <Button variant="outline" onClick={goToQuickSelection} className="order-2 sm:order-1">
            <Heart className="mr-2 h-4 w-4" />
            コンテンツを選択する
          </Button>
        )}
        {quickSelectionCount > 0 && (
          <Button variant="outline" onClick={goToGuidedSearch} className="order-2 sm:order-1">
            <Search className="mr-2 h-4 w-4" />
            もっと検索する
          </Button>
        )}
        <Button onClick={completeOnboarding} className="bg-[#454545] hover:bg-[#454545]/90 px-8 order-1 sm:order-2">
          アプリを始める
        </Button>
      </div>
    </div>
  )
}
