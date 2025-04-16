"use client"

import { useOnboarding } from "@/contexts/onboarding-context"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Search, Sparkles } from "lucide-react"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"

export function SearchStep() {
  const { nextStep, prevStep } = useOnboarding()

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center bg-[#f5f5f5] p-2 rounded-full mb-2">
          <Search className="h-6 w-6 text-[#454545]" />
        </div>
        <h1 className="text-2xl font-bold mb-2">検索機能</h1>
        <p className="text-muted-foreground">好きなアーティストや作品を検索して、新しいおすすめを見つけましょう</p>
      </div>

      <div className="bg-[#f5f5f5] rounded-lg p-6 mb-6 relative">
        <div className="absolute -top-3 -right-3 bg-yellow-400 text-[#454545] rounded-full px-3 py-1 text-sm font-medium">
          Point 1
        </div>
        <h3 className="font-semibold mb-3 flex items-center">
          <Search className="h-4 w-4 mr-2" />
          キーワード検索
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          アーティスト名、映画タイトル、ブランド名などを入力して検索できます。
          例えば「米津玄師」「鬼滅の刃」「UNIQLO」など、好きなコンテンツを検索してみましょう。
        </p>
        <div className="relative rounded-md overflow-hidden h-32 mb-2">
          <ImageWithFallback
            src="/placeholder.svg?height=200&width=600"
            alt="検索ボックスの例"
            fill
            className="object-cover"
            fallbackText="検索例"
            identifier="search-box-example"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="bg-white/90 rounded-md px-4 py-2 text-sm">検索ボックスに好きなキーワードを入力</div>
          </div>
        </div>
      </div>

      <div className="bg-[#f5f5f5] rounded-lg p-6 mb-6 relative">
        <div className="absolute -top-3 -right-3 bg-yellow-400 text-[#454545] rounded-full px-3 py-1 text-sm font-medium">
          Point 2
        </div>
        <h3 className="font-semibold mb-3 flex items-center">
          <Sparkles className="h-4 w-4 mr-2" />
          おすすめコンテンツ
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          検索結果には、入力したキーワードに関連するアーティスト、映画、ファッションブランドなどが表示されます。
          気になるコンテンツを見つけたら、詳細を確認してみましょう。
        </p>
        <div className="relative rounded-md overflow-hidden h-32 mb-2">
          <ImageWithFallback
            src="/placeholder.svg?height=200&width=600"
            alt="検索結果の例"
            fill
            className="object-cover"
            fallbackText="検索結果"
            identifier="search-results-example"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="bg-white/90 rounded-md px-4 py-2 text-sm">カテゴリー別におすすめが表示されます</div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          戻る
        </Button>
        <Button onClick={nextStep} className="bg-[#454545] hover:bg-[#454545]/90">
          次へ
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
