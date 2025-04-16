"use client"

import { useOnboarding } from "@/contexts/onboarding-context"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, BarChart2, PieChart, TrendingUp } from "lucide-react"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"

export function AnalysisStep() {
  const { nextStep, prevStep } = useOnboarding()

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center bg-[#f5f5f5] p-2 rounded-full mb-2">
          <BarChart2 className="h-6 w-6 text-[#454545]" />
        </div>
        <h1 className="text-2xl font-bold mb-2">好み分析</h1>
        <p className="text-muted-foreground">お気に入りに追加したコンテンツから、あなたの好みを分析します</p>
      </div>

      <div className="bg-[#f5f5f5] rounded-lg p-6 mb-6 relative">
        <div className="absolute -top-3 -right-3 bg-yellow-400 text-[#454545] rounded-full px-3 py-1 text-sm font-medium">
          Point 1
        </div>
        <h3 className="font-semibold mb-3 flex items-center">
          <PieChart className="h-4 w-4 mr-2" />
          カテゴリー分析
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          お気に入りに追加したコンテンツのカテゴリー分布を確認できます。
          どのジャンルに興味があるのか、視覚的に把握することができます。
        </p>
        <div className="relative rounded-md overflow-hidden h-32 mb-2">
          <ImageWithFallback
            src="/placeholder.svg?height=200&width=600"
            alt="カテゴリー分析の例"
            fill
            className="object-cover"
            fallbackText="カテゴリー"
            identifier="category-analysis-example"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="bg-white/90 rounded-md px-4 py-2 text-sm">カテゴリー別の分布がグラフで表示されます</div>
          </div>
        </div>
      </div>

      <div className="bg-[#f5f5f5] rounded-lg p-6 mb-6 relative">
        <div className="absolute -top-3 -right-3 bg-yellow-400 text-[#454545] rounded-full px-3 py-1 text-sm font-medium">
          Point 2
        </div>
        <h3 className="font-semibold mb-3 flex items-center">
          <TrendingUp className="h-4 w-4 mr-2" />
          好みの傾向
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          お気に入りのコンテンツから抽出したキーワードや特徴をもとに、あなたの好みの傾向を分析します。
          これにより、より精度の高いおすすめを受け取ることができます。
        </p>
        <div className="relative rounded-md overflow-hidden h-32 mb-2">
          <ImageWithFallback
            src="/placeholder.svg?height=200&width=600"
            alt="好みの傾向分析の例"
            fill
            className="object-cover"
            fallbackText="傾向分析"
            identifier="trend-analysis-example"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="bg-white/90 rounded-md px-4 py-2 text-sm">キーワード分析であなたの好みがわかります</div>
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
