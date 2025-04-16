"use client"

import { useParams, useRouter } from "next/navigation"
import { useTMDbData } from "@/hooks/use-tmdb-data"
import { getImageUrl } from "@/services/tmdb-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Film, Tv, ExternalLink, Calendar, Clock, Star, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function MediaPage() {
  const params = useParams()
  const router = useRouter()
  const mediaName = typeof params.name === "string" ? decodeURIComponent(params.name) : null
  const { media, type, isLoading, error } = useTMDbData(mediaName)

  // 検索ページに戻る関数
  const handleBackToSearch = () => {
    router.push(`/search?q=${encodeURIComponent(mediaName || "")}`)
  }

  // 日付をフォーマットする関数
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "不明"

    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date)
    } catch (e) {
      return dateString
    }
  }

  // 時間をフォーマットする関数
  const formatRuntime = (minutes: number | undefined) => {
    if (!minutes) return "不明"

    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    return `${hours}時間${mins > 0 ? ` ${mins}分` : ""}`
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <p>メディア情報を読み込み中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-500">エラーが発生しました</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button className="mt-4" asChild>
              <Link href="/search">検索に戻る</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!media || !type) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>メディアが見つかりません</CardTitle>
          </CardHeader>
          <CardContent>
            <p>「{mediaName}」に関する情報が見つかりませんでした。</p>
            <Button className="mt-4" asChild>
              <Link href="/search">検索に戻る</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 映画またはテレビ番組のタイトルを取得
  const title = type === "movie" ? (media as any).title : (media as any).name

  // オリジナルタイトルを取得
  const originalTitle = type === "movie" ? (media as any).original_title : (media as any).original_name

  // 公開日または初回放送日を取得
  const releaseDate = type === "movie" ? (media as any).release_date : (media as any).first_air_date

  // 上映時間またはエピソード時間を取得
  const runtime = type === "movie" ? (media as any).runtime : (media as any).episode_run_time?.[0]

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* メディア情報ヘッダー */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* ポスター画像 */}
          <div className="relative w-full md:w-1/3 h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-lg">
            {media.poster_path ? (
              <Image
                src={getImageUrl(media.poster_path, "w500") || "/placeholder.svg"}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                {type === "movie" ? (
                  <Film className="h-12 w-12 text-gray-400" />
                ) : (
                  <Tv className="h-12 w-12 text-gray-400" />
                )}
              </div>
            )}
          </div>

          {/* メディア情報 */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>

            {/* オリジナルタイトル（日本語と異なる場合のみ表示） */}
            {originalTitle !== title && <p className="text-lg text-muted-foreground mb-4">{originalTitle}</p>}

            {/* タグライン */}
            {media.tagline && <p className="text-lg italic mb-4">"{media.tagline}"</p>}

            {/* ジャンル */}
            {media.genres && media.genres.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {media.genres.map((genre) => (
                    <Badge key={genre.id} variant="secondary">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* メタデータ */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">公開: {formatDate(releaseDate)}</span>
              </div>

              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">時間: {formatRuntime(runtime)}</span>
              </div>

              <div className="flex items-center">
                <Star className="h-4 w-4 mr-2 text-yellow-500" />
                <span className="text-sm">
                  評価: {media.vote_average.toFixed(1)}/10 ({media.vote_count.toLocaleString()}件)
                </span>
              </div>

              {/* テレビ番組の場合はシーズン数とエピソード数を表示 */}
              {type === "tv" && (
                <>
                  <div className="flex items-center">
                    <span className="text-sm">シーズン数: {(media as any).number_of_seasons}</span>
                  </div>

                  <div className="flex items-center">
                    <span className="text-sm">エピソード数: {(media as any).number_of_episodes}</span>
                  </div>
                </>
              )}

              <div className="flex items-center">
                <span className="text-sm">ステータス: {media.status}</span>
              </div>
            </div>

            {/* あらすじ */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">あらすじ</h3>
              <p className="text-sm text-muted-foreground">{media.overview || "あらすじはありません。"}</p>
            </div>

            {/* アクションボタン */}
            <div className="flex flex-wrap gap-2 mt-6">
              {/* 外部リンク */}
              {media.homepage && (
                <Button asChild variant="outline">
                  <a href={media.homepage} target="_blank" rel="noopener noreferrer" className="flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    公式サイトを見る
                  </a>
                </Button>
              )}

              {/* 検索ボタン */}
              <Button variant="default" className="bg-[#454545] hover:bg-[#454545]/90" onClick={handleBackToSearch}>
                <Search className="h-4 w-4 mr-2" />「{title}」で検索
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
