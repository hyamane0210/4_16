"use client"

import { useParams, useRouter } from "next/navigation"
import { useSpotifyData } from "@/hooks/use-spotify-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Music, ExternalLink, Search, AlertTriangle } from "lucide-react"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"
import Link from "next/link"

export default function ArtistPage() {
  const params = useParams()
  const router = useRouter()
  const artistName = typeof params.name === "string" ? decodeURIComponent(params.name) : null
  const { artist, isLoading, error } = useSpotifyData(artistName)

  // 検索ページに戻る関数
  const handleBackToSearch = () => {
    router.push(`/search?q=${encodeURIComponent(artistName || "")}`)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <p>アーティスト情報を読み込み中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-500 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              エラーが発生しました
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              {error.includes("rate limit")
                ? "APIのリクエスト制限に達しました。しばらく時間をおいてから再試行してください。"
                : error}
            </p>
            <div className="flex space-x-4">
              <Button onClick={() => router.refresh()} variant="outline">
                再試行
              </Button>
              <Button asChild>
                <Link href="/search">検索に戻る</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // アーティスト情報がない場合のフォールバック
  if (!artist) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Music className="h-5 w-5 mr-2" />
              {artistName || "アーティスト"}の情報
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              「{artistName}」に関する詳細情報を取得できませんでした。検索ページから他の情報を探すことができます。
            </p>
            <div className="flex space-x-4">
              <Button onClick={() => router.refresh()} variant="outline">
                再試行
              </Button>
              <Button onClick={handleBackToSearch} className="bg-[#454545] hover:bg-[#454545]/90">
                <Search className="mr-2 h-4 w-4" />「{artistName}」で検索
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* アーティスト情報ヘッダー */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          {/* アーティスト画像 */}
          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-lg overflow-hidden shadow-lg">
            {artist.images && artist.images.length > 0 ? (
              <ImageWithFallback
                src={artist.images[0].url || "/placeholder.svg"}
                alt={artist.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 192px, 256px"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Music className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>

          {/* アーティスト情報 */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{artist.name}</h1>

            {/* ジャンル */}
            {artist.genres && artist.genres.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {artist.genres.map((genre) => (
                    <Badge key={genre} variant="secondary" className="capitalize">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* 人気度と統計 */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-muted-foreground">
                <div className="flex items-center">
                  <span className="font-semibold mr-1">人気度:</span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${artist.popularity}%` }}></div>
                  </div>
                  <span className="ml-1">{artist.popularity}%</span>
                </div>
              </div>
            </div>

            {/* 外部リンク */}
            <div className="mt-6 flex flex-wrap gap-2 justify-center md:justify-start">
              <Button asChild variant="outline">
                <a
                  href={artist.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Spotifyで聴く
                </a>
              </Button>

              <Button variant="default" className="bg-[#454545] hover:bg-[#454545]/90" onClick={handleBackToSearch}>
                <Search className="h-4 w-4 mr-2" />「{artist.name}」で検索
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
