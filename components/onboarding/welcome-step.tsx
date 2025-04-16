"use client"

import { useOnboarding } from "@/contexts/onboarding-context"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"

export function WelcomeStep() {
  const { nextStep, skipOnboarding } = useOnboarding()

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">My Projectへようこそ！</h1>
        <p className="text-muted-foreground">
          あなたの好みに合わせたコンテンツを発見するためのアプリです。
          <br />
          簡単な使い方をご紹介します。
        </p>
      </div>

      <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
        <ImageWithFallback
          src="/placeholder.svg?height=400&width=800"
          alt="アプリの概要"
          fill
          className="object-cover"
          fallbackText="AP"
          identifier="welcome-app-overview"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-4 text-white">
            <h2 className="text-xl font-bold mb-1">あなただけのコンテンツ体験</h2>
            <p className="text-sm">
              アーティスト、映画、アニメ、ファッションなど、あなたの興味に合わせたおすすめを見つけましょう
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#f5f5f5] p-4 rounded-lg text-center">
          <div className="bg-white/80 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <span className="text-[#454545] font-bold text-xl">1</span>
          </div>
          <h3 className="font-semibold mb-1">検索する</h3>
          <p className="text-sm text-muted-foreground">好きなアーティストや作品を検索して、新しい発見をしましょう</p>
        </div>
        <div className="bg-[#f5f5f5] p-4 rounded-lg text-center">
          <div className="bg-white/80 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <span className="text-[#454545] font-bold text-xl">2</span>
          </div>
          <h3 className="font-semibold mb-1">お気に入りに追加</h3>
          <p className="text-sm text-muted-foreground">気に入ったコンテンツをお気に入りに追加して、整理しましょう</p>
        </div>
        <div className="bg-[#f5f5f5] p-4 rounded-lg text-center">
          <div className="bg-white/80 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <span className="text-[#454545] font-bold text-xl">3</span>
          </div>
          <h3 className="font-semibold mb-1">自己分析</h3>
          <p className="text-sm text-muted-foreground">
            お気に入りから、あなたの好みを分析して新しい提案を受け取りましょう
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={skipOnboarding}>
          スキップ
        </Button>
        <Button onClick={nextStep} className="bg-[#454545] hover:bg-[#454545]/90">
          次へ
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
