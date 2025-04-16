"use client"

import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ExternalLink, Search, Star, Calendar, Music, Film } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FavoriteIcon } from "@/components/favorites/favorite-icon"
import type { RecommendationItem } from "./recommendations"
import { Badge } from "@/components/ui/badge"
import { EnhancedImage } from "./enhanced-image"
import { ImageSource } from "@/utils/image-integration-utils"

export function ItemDetailContent({
  item,
  onSearch,
}: {
  item: RecommendationItem
  onSearch: () => void
}) {
  // APIデータがあるか確認
  const hasApiData = item.apiData !== undefined

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl">{item.name}</DialogTitle>
      </DialogHeader>
      <div className="max-h-[60vh] overflow-y-auto pr-4">
        <div className="space-y-4">
          <div className="relative w-full h-64 rounded-md overflow-hidden">
            <EnhancedImage
              src={item.imageUrl || "/placeholder.svg?height=400&width=400"}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 500px"
              fallbackText={item.name.substring(0, 2)}
              identifier={item.name}
              apiSource={
                item.apiData?.type === "spotify"
                  ? ImageSource.SPOTIFY
                  : item.apiData?.type === "tmdb"
                    ? ImageSource.TMDB
                    : ImageSource.ORIGINAL
              }
            />
            <div className="absolute top-2 right-2">
              <FavoriteIcon item={item} size="lg" />
            </div>
          </div>

          {/* APIデータがある場合、追加情報を表示 */}
          {hasApiData && (
            <div className="bg-muted/30 p-3 rounded-md">
              {item.apiData.type === "spotify" && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center">
                    <Music className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm font-medium">Spotify情報</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      人気度: {item.apiData.popularity}/100
                    </Badge>
                    {item.apiData.genres && item.apiData.genres.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.apiData.genres.slice(0, 3).map((genre, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {item.apiData.type === "tmdb" && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center">
                    <Film className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm font-medium">
                      {item.apiData.mediaType === "movie" ? "映画情報" : "TV番組情報"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.apiData.voteAverage && (
                      <div className="flex items-center">
                        <Star className="h-3 w-3 mr-1 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs">{item.apiData.voteAverage.toFixed(1)}</span>
                      </div>
                    )}
                    {item.apiData.releaseDate && (
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-xs">{new Date(item.apiData.releaseDate).getFullYear()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <h3 className="font-semibold text-lg">提案理由</h3>
            <p className="text-muted-foreground">{item.reason}</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">特徴</h3>
            <ul className="list-disc pl-5 text-muted-foreground">
              {item.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg">公式サイト</h3>
            <a
              href={item.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-primary hover:underline"
            >
              {item.officialUrl.replace(/^https?:\/\//, "").split("/")[0]}
              <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <DialogFooter className="mt-4">
        <Button onClick={onSearch} className="w-full bg-[#454545] hover:bg-[#454545]/90">
          <Search className="mr-2 h-4 w-4" />「{item.name}」で検索
        </Button>
      </DialogFooter>
    </>
  )
}
