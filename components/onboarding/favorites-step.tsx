"use client"

import { useOnboarding } from "@/contexts/onboarding-context"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Heart, Star, Filter } from "lucide-react"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"

export function FavoritesStep() {
  const { nextStep, prevStep } = useOnboarding()

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center bg-[#f5f5f5] p-2 rounded-full mb-2">
          <Heart className="h-6 w-6 text-[#454545]" />
        </div>
        <h1 className="text-2xl font-bold mb-2">お気に入り管理</h1>
        <p className="text-muted-foreground">気に入ったコンテンツをお気に入りに追加して、カテゴリー別に整理できます</p>
      </div>

      <div className="bg-[#f5f5f5] rounded-lg p-6 mb-6 relative">
        <div className="absolute -top-3 -right-3 bg-yellow-400 text-[#454545] rounded-full px-3 py-1 text-sm font-medium">
          Point 1
        </div>
        <h3 className="font-semibold mb-3 flex items-center">
          <Star className="h-4 w-4 mr-2" />
          お気に入りに追加
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          コンテンツカードの右上にある星マークをクリックすると、お気に入りに追加できます。
          もう一度クリックすると、お気に入りから削除されます。
        </p>
        <div className="relative rounded-md overflow-hidden h-32 mb-2">
          <ImageWithFallback
            src="/placeholder.svg?height=200&width=600"
            alt="お気に入りボタンの例"
            fill
            className="object-cover"
            fallbackText="お気に入り"
            identifier="favorites-button-example"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="bg-white/90 rounded-md px-4 py-2 text-sm">星マークをクリックしてお気に入りに追加</div>
          </div>
        </div>
      </div>

      <div className="bg-[#f5f5f5] rounded-lg p-6 mb-6 relative">
        <div className="absolute -top-3 -right-3 bg-yellow-400 text-[#454545] rounded-full px-3 py-1 text-sm font-medium">
          Point 2
        </div>
        <h3 className="font-semibold mb-3 flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          お気に入りの管理
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          お気に入りページでは、追加したコンテンツをカテゴリー別に表示したり、検索したりできます。
          また、クイック追加機能を使って、新しいコンテンツを簡単に追加することもできます。
        </p>
        <div className="relative rounded-md overflow-hidden h-32 mb-2">
          <ImageWithFallback
            src="/placeholder.svg?height=200&width=600"
            alt="お気に入り管理画面の例"
            fill
            className="object-cover"
            fallbackText="管理画面"
            identifier="favorites-management-example"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="bg-white/90 rounded-md px-4 py-2 text-sm">カテゴリー別にお気に入りを管理できます</div>
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
