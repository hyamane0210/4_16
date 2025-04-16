"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, ArrowRight, Film, Music, Users, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"

// 人気のアーティスト
const featuredArtists = [
  { name: "米津玄師", image: "/placeholder.svg?height=100&width=100" },
  { name: "BTS", image: "/placeholder.svg?height=100&width=100" },
  { name: "テイラー・スウィフト", image: "/placeholder.svg?height=100&width=100" },
  { name: "YOASOBI", image: "/placeholder.svg?height=100&width=100" },
  { name: "King Gnu", image: "/placeholder.svg?height=100&width=100" },
  { name: "Ado", image: "/placeholder.svg?height=100&width=100" },
]

// 人気の映画/アニメ
const featuredMedia = [
  { name: "鬼滅の刃", image: "/placeholder.svg?height=100&width=100" },
  { name: "千と千尋の神隠し", image: "/placeholder.svg?height=100&width=100" },
  { name: "ハリー・ポッター", image: "/placeholder.svg?height=100&width=100" },
  { name: "進撃の巨人", image: "/placeholder.svg?height=100&width=100" },
  { name: "ワンピース", image: "/placeholder.svg?height=100&width=100" },
  { name: "呪術廻戦", image: "/placeholder.svg?height=100&width=100" },
]

// 人気の芸能人
const featuredCelebrities = [
  { name: "新垣結衣", image: "/placeholder.svg?height=100&width=100" },
  { name: "菅田将暉", image: "/placeholder.svg?height=100&width=100" },
  { name: "浜辺美波", image: "/placeholder.svg?height=100&width=100" },
  { name: "山崎賢人", image: "/placeholder.svg?height=100&width=100" },
  { name: "広瀬すず", image: "/placeholder.svg?height=100&width=100" },
  { name: "佐藤健", image: "/placeholder.svg?height=100&width=100" },
]

// 人気のファッションブランド
const featuredFashion = [
  { name: "ユニクロ", image: "/placeholder.svg?height=100&width=100" },
  { name: "ZARA", image: "/placeholder.svg?height=100&width=100" },
  { name: "H&M", image: "/placeholder.svg?height=100&width=100" },
  { name: "GU", image: "/placeholder.svg?height=100&width=100" },
  { name: "無印良品", image: "/placeholder.svg?height=100&width=100" },
  { name: "ナイキ", image: "/placeholder.svg?height=100&width=100" },
]

export default function HeroSection() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  // Memoize search handler
  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      }
    },
    [searchQuery, router],
  )

  return (
    <section className="relative bg-gradient-to-r from-[#454545] to-[#828282] py-8 md:py-12">
      <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-10"></div>
      <div className="absolute right-0 top-0 w-full md:w-1/2 h-full">
        <div className="relative h-full w-full">
          <ImageWithFallback
            src="/placeholder.svg?height=500&width=600"
            alt="Hero image"
            fill
            className="object-cover opacity-80"
            fallbackText="MP"
            identifier="hero-image"
            showLoadingEffect={false}
            containerClassName="hidden md:block"
            priority
          />
        </div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <Badge className="bg-white/20 text-white hover:bg-white/30 transition-colors">
            パーソナライズドコンテンツ
          </Badge>
          <h1 className="text-2xl md:text-4xl font-bold text-white">あなたの次のお気に入りを発見しよう</h1>
          <p className="text-white/90 mb-4 text-sm md:text-base max-w-xl mx-auto">
            アーティスト、映画、アニメ、ファッションなど、あなたの興味に合わせたおすすめを見つけましょう
          </p>

          {/* 検索フォーム */}
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mt-4 flex">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="例: ドレイク、インセプション、ワンピース..."
                className="pl-8 py-2 text-sm rounded-l-full rounded-r-none border-r-0 bg-background/95"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              size="sm"
              className="rounded-r-full rounded-l-none px-4 bg-[#454545] hover:bg-[#454545]/90"
            >
              検索
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </form>

          {/* 人気のジャンルへのクイックリンク - コンパクト版 */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            {/* カテゴリータイトル行 */}
            <div className="col-span-2 md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-2 mb-1">
              <h3 className="text-white font-medium text-xs flex items-center">
                <Music className="mr-1 h-3 w-3" />
                アーティスト
              </h3>
              <h3 className="text-white font-medium text-xs flex items-center">
                <Film className="mr-1 h-3 w-3" />
                映画/アニメ
              </h3>
              <h3 className="text-white font-medium text-xs flex items-center">
                <Users className="mr-1 h-3 w-3" />
                芸能人
              </h3>
              <h3 className="text-white font-medium text-xs flex items-center">
                <ShoppingBag className="mr-1 h-3 w-3" />
                ファッション
              </h3>
            </div>

            {/* コンテンツグリッド */}
            <div className="bg-white/5 p-1 rounded">
              <div className="grid grid-cols-2 gap-1">
                {featuredArtists.map((artist) => (
                  <Button
                    key={artist.name}
                    variant="link"
                    className="text-white text-xs justify-start p-0 h-6"
                    onClick={() => router.push(`/search?q=${encodeURIComponent(artist.name)}`)}
                  >
                    <span className="truncate">{artist.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 p-1 rounded">
              <div className="grid grid-cols-2 gap-1">
                {featuredMedia.map((media) => (
                  <Button
                    key={media.name}
                    variant="link"
                    className="text-white text-xs justify-start p-0 h-6"
                    onClick={() => router.push(`/search?q=${encodeURIComponent(media.name)}`)}
                  >
                    <span className="truncate">{media.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 p-1 rounded">
              <div className="grid grid-cols-2 gap-1">
                {featuredCelebrities.map((celebrity) => (
                  <Button
                    key={celebrity.name}
                    variant="link"
                    className="text-white text-xs justify-start p-0 h-6"
                    onClick={() => router.push(`/search?q=${encodeURIComponent(celebrity.name)}`)}
                  >
                    <span className="truncate">{celebrity.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 p-1 rounded">
              <div className="grid grid-cols-2 gap-1">
                {featuredFashion.map((brand) => (
                  <Button
                    key={brand.name}
                    variant="link"
                    className="text-white text-xs justify-start p-0 h-6"
                    onClick={() => router.push(`/search?q=${encodeURIComponent(brand.name)}`)}
                  >
                    <span className="truncate">{brand.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
