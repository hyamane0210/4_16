"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, HelpCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useVisitHistory } from "@/hooks/use-visit-history"
import { useOnboarding } from "@/contexts/onboarding-context"
import { useMemo } from "react"

export function HeroSection() {
  const { isFirstVisit, isLoaded } = useVisitHistory()
  const { startOnboarding } = useOnboarding()

  // useMemoを使用して計算結果をキャッシュ
  const isNewUser = useMemo(() => {
    return isLoaded && isFirstVisit
  }, [isLoaded, isFirstVisit])

  return (
    <section className="relative rounded-xl overflow-hidden bg-gradient-to-r from-[#454545] to-[#828282]">
      <div className="absolute inset-0 bg-gradient-to-r from-[#454545]/90 to-transparent z-10"></div>
      <div className="absolute right-0 top-0 w-full md:w-1/2 h-full">
        <Image
          src="/placeholder.svg?height=500&width=600"
          alt="Hero image"
          width={600}
          height={500}
          className="w-full h-full object-cover opacity-80"
        />
      </div>
      <div className="relative z-20 py-12 px-6 md:px-10 lg:px-16 max-w-3xl">
        <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 transition-colors">
          {isNewUser ? "ようこそ" : "おすすめ"}
        </Badge>
        <h1 className="text-3xl md:text-5xl font-bold text-white">
          あなたの次の
          <br className="hidden sm:inline" />
          お気に入りを発見しよう
        </h1>
        <p className="text-white/90 mb-8 text-lg max-w-xl">
          アーティスト、映画、アニメ、ファッションなど、あなたの興味に合わせたおすすめを見つけましょう
        </p>
        <div className="flex flex-wrap gap-4">
          <Button asChild size="lg" className="bg-white text-[#454545] hover:bg-white/90 shadow-lg">
            <Link href="/search">
              <Search className="mr-2 h-5 w-5" />
              検索する
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white/20"
            onClick={startOnboarding}
          >
            <HelpCircle className="mr-2 h-5 w-5" />
            使い方を見る
          </Button>
        </div>
      </div>
    </section>
  )
}
