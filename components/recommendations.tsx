"use client"

import { memo, useState, useCallback, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExternalLink, Search, Music, Film, ShoppingBag, Users } from "lucide-react"
import { FavoriteIcon } from "@/components/favorites/favorite-icon"

// RecommendationItemの型定義
export interface RecommendationItem {
  name: string
  reason: string
  features: string[]
  imageUrl: string
  officialUrl: string
  apiData?: {
    type: string
    id: string | number
    [key: string]: any // 追加のAPI固有データ
    imageSource?: string
  }
}

// RecommendationsDataの型定義
export interface RecommendationsData {
  artists: RecommendationItem[]
  celebrities: RecommendationItem[]
  media: RecommendationItem[]
  fashion: RecommendationItem[]
}

// カテゴリータイトルとアイコンのマッピング
const categoryConfig: Record<string, { title: string; icon: any }> = {
  artists: { title: "アーティスト", icon: Music },
  celebrities: { title: "芸能人/インフルエンサー", icon: Users },
  media: { title: "映画/アニメ", icon: Film },
  fashion: { title: "ファッションブランド", icon: ShoppingBag },
}

// 直接アクセスするドメインのリストをセットに変換
const DIRECT_ACCESS_DOMAINS = new Set([
  "i.scdn.co", // Spotify画像
  "image.tmdb.org", // TMDb画像
  "cloudfront.net", // AWS CloudFront
  "amazonaws.com", // AWS S3
  "spotify.com", // Spotify関連
  "spotifycdn.com", // Spotify CDN
  "scdn.co", // Spotify CDN
  "tmdb.org", // TMDb関連
])

// 問題のあるドメインのリストをセットに変換
const PROBLEMATIC_DOMAINS = new Set(["off---white.com", "www.off---white.com", "white.com", "www.white.com"])

// ドメイン抽出のキャッシュ
const domainCache = new Map<string, string | null>()

// ドメインを抽出する関数
const extractDomain = (url: string): string | null => {
  // キャッシュをチェック
  if (domainCache.has(url)) {
    return domainCache.get(url)
  }

  try {
    if (!url || typeof url !== "string" || url.startsWith("/") || url.startsWith("data:")) {
      domainCache.set(url, null)
      return null
    }
    const domain = new URL(url).hostname
    domainCache.set(url, domain)
    return domain
  } catch (e) {
    console.error("Error extracting domain:", e)
    domainCache.set(url, null)
    return null
  }
}

// 処理済みURLのキャッシュ
const processedUrlCache = new Map<string, string>()

// 画像URLを処理する関数
const processImageUrl = (url: string): string => {
  // キャッシュをチェック
  if (processedUrlCache.has(url)) {
    return processedUrlCache.get(url)!
  }

  // 画像URLが存在しない場合はプレースホルダーを使用
  if (!url) {
    const result = "/placeholder.svg"
    processedUrlCache.set(url, result)
    return result
  }

  // 既にプロキシURLまたはプレースホルダーの場合はそのまま使用
  if (url.startsWith("/api/image-proxy") || url.startsWith("/placeholder")) {
    processedUrlCache.set(url, url)
    return url
  }

  // 相対パスの場合はそのまま使用
  if (url.startsWith("/")) {
    processedUrlCache.set(url, url)
    return url
  }

  // 特定のドメインの場合は直接使用
  const domain = extractDomain(url)
  if (domain && DIRECT_ACCESS_DOMAINS.has(domain)) {
    processedUrlCache.set(url, url)
    return url
  }

  // それ以外の場合はプロキシを使用
  const result = `/api/image-proxy?url=${encodeURIComponent(url)}`
  processedUrlCache.set(url, result)
  return result
}

// Recommendationsコンポーネント
export function Recommendations({
  data,
  searchTerm,
  useSmallImages = false,
  maxItemsPerCategory = 12,
}: {
  data: RecommendationsData
  searchTerm: string
  useSmallImages?: boolean
  maxItemsPerCategory?: number
}) {
  const [selectedItem, setSelectedItem] = useState<RecommendationItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

  const handleItemClick = useCallback((item: RecommendationItem) => {
    setSelectedItem(item)
    setIsDialogOpen(true)
  }, [])

  // おすすめ検索を実行する関数
  const handleRecommendedSearch = useCallback(() => {
    if (selectedItem) {
      // ダイアログを閉じる
      setIsDialogOpen(false)

      // 検索ページに遷移して自動的に検索を実行
      router.push(`/search?q=${encodeURIComponent(selectedItem.name)}`)
    }
  }, [selectedItem, router])

  // 検索結果があるカテゴリーのみ表示
  const hasResults = Object.values(data).some((items) => items.length > 0)

  if (!hasResults) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold mb-4">「{searchTerm}」の検索結果</h2>
        <p className="text-muted-foreground">検索結果が見つかりませんでした。別のキーワードで試してみてください。</p>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      <h2 className="text-2xl font-bold">「{searchTerm}」の検索結果</h2>

      {Object.entries(data).map(([category, items]) => {
        // 空のカテゴリーは表示しない
        if (items.length === 0) return null

        const { title, icon: Icon } = categoryConfig[category] || {
          title: category,
          icon: () => null,
        }

        return (
          <div key={category} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center">
                {Icon && <Icon className="mr-2 h-5 w-5" />}
                {title}
              </h3>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/category/${category}?q=${encodeURIComponent(searchTerm)}`}>すべて見る</Link>
              </Button>
            </div>

            <div
              className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 ${useSmallImages ? "lg:grid-cols-6" : "lg:grid-cols-5"} gap-3`}
            >
              {items.slice(0, maxItemsPerCategory).map((item, index) => (
                <RecommendationItem
                  key={`${category}-${index}`}
                  item={item}
                  index={index}
                  handleItemClick={handleItemClick}
                  category={category}
                  useSmallImages={useSmallImages}
                />
              ))}
            </div>
          </div>
        )
      })}

      {/* 詳細ダイアログ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedItem && (
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden">
            <ItemDetailContent item={selectedItem} onSearch={handleRecommendedSearch} />
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

// 以下のimportを追加
import { EnhancedImage } from "@/components/enhanced-image"
import { ImageSource } from "@/utils/image-integration-utils"

// 詳細画像コンポーネント
const DetailImage = ({ src, alt, fallbackText }: { src: string; alt: string; fallbackText: string }) => {
  // 画像URLを処理
  const processImageUrlDetail = (url: string) => {
    // 画像URLが存在しない場合はプレースホルダーを使用
    if (!url) return "/placeholder.svg"

    // 既にプロキシURLまたはプレースホルダーの場合はそのまま使用
    if (url.startsWith("/api/image-proxy") || url.startsWith("/placeholder")) return url

    // 相対パスの場合はそのまま使用
    if (url.startsWith("/")) return url

    // 特定のドメインの場合は直接使用
    const domain = extractDomain(url)
    if (domain && DIRECT_ACCESS_DOMAINS.has(domain)) return url

    // それ以外の場合はプロキシを使用
    return `/api/image-proxy?url=${encodeURIComponent(url)}`
  }

  const processedSrc = processImageUrlDetail(src)

  // APIソースを判断
  const apiSource =
    src.includes("scdn.co") || src.includes("spotifycdn.com")
      ? ImageSource.SPOTIFY
      : src.includes("image.tmdb.org")
        ? ImageSource.TMDB
        : ImageSource.ORIGINAL

  return (
    <EnhancedImage
      src={processedSrc}
      alt={alt}
      fill
      className="object-cover"
      fallbackText={fallbackText}
      identifier={alt}
      apiSource={apiSource}
      disableProxy={processedSrc.startsWith("/api/image-proxy")} // プロキシURLの場合は二重プロキシを防止
    />
  )
}

// RecommendationItemコンポーネントを最適化
const RecommendationItem = memo(
  ({
    item,
    index,
    handleItemClick,
    category,
    useSmallImages = false,
  }: {
    item: RecommendationItem
    index: number
    handleItemClick: (item: RecommendationItem) => void
    category: string
    useSmallImages?: boolean
  }) => {
    // useMemoを使用して処理済み画像URLを計算
    const processedImageUrl = useMemo(() => {
      return item.imageUrl ? processImageUrl(item.imageUrl) : "/placeholder.svg"
    }, [item.imageUrl])

    // APIソースを判断
    const apiSource = useMemo(() => {
      if (item.apiData?.type === "spotify") {
        return ImageSource.SPOTIFY
      } else if (item.apiData?.type === "tmdb") {
        return ImageSource.TMDB
      }
      return ImageSource.ORIGINAL
    }, [item.apiData?.type])

    // 画像読み込み状態の管理
    const [imageState, setImageState] = useState<{
      loaded: boolean
      error: boolean
    }>({ loaded: false, error: false })

    // 画像読み込み完了ハンドラ
    const handleImageLoaded = useCallback(() => {
      setImageState({ loaded: true, error: false })
    }, [])

    // 画像読み込みエラーハンドラ
    const handleImageError = useCallback(() => {
      setImageState({ loaded: false, error: true })
    }, [])

    // 初期レンダリング時のみ実行
    useEffect(() => {
      // コンポーネントがアンマウントされたときのクリーンアップ
      return () => {
        // クリーンアップロジック（必要に応じて）
      }
    }, [])

    return (
      <Card className={`overflow-hidden hover:shadow-md transition-shadow ${useSmallImages ? "h-full" : ""}`}>
        <div className="cursor-pointer" onClick={() => handleItemClick(item)}>
          <div className={`relative ${useSmallImages ? "aspect-square w-full" : "aspect-square w-full"}`}>
            <EnhancedImage
              src={processedImageUrl}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16.6vw"
              loading={index < 6 ? "eager" : "lazy"}
              fallbackText={item.name.substring(0, 2)}
              identifier={`${item.name}-${index}`}
              apiSource={apiSource}
              onLoadingComplete={handleImageLoaded}
              onError={handleImageError}
              disableProxy={processedImageUrl.startsWith("/api/image-proxy")}
            />
            <div className="absolute top-2 right-2">
              <FavoriteIcon item={item} />
            </div>

            {/* 画像読み込み中のオーバーレイ */}
            {(!imageState.loaded || imageState.error) && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center animate-pulse">
                <span className="text-gray-500 font-medium">{item.name.substring(0, 2)}</span>
                <span className="sr-only">画像を読み込み中...</span>
              </div>
            )}
          </div>
          <CardContent className={`${useSmallImages ? "p-2" : "p-3"}`}>
            <h4 className={`font-medium ${useSmallImages ? "text-xs" : "text-sm"} truncate`}>{item.name}</h4>
            <p
              className={`${useSmallImages ? "text-xs" : "text-xs"} text-muted-foreground line-clamp-2 ${useSmallImages ? "h-8" : "h-10"}`}
            >
              {item.reason}
            </p>
          </CardContent>
        </div>
      </Card>
    )
  },
  // カスタム比較関数を追加して不要な再レンダリングを防止
  (prevProps, nextProps) => {
    return (
      prevProps.item.name === nextProps.item.name &&
      prevProps.item.imageUrl === nextProps.item.imageUrl &&
      prevProps.useSmallImages === nextProps.useSmallImages
    )
  },
)

RecommendationItem.displayName = "RecommendationItem"

// Linkコンポーネントをインポート
import Link from "next/link"

// ItemDetailContentコンポーネント
const ItemDetailContent = ({ item, onSearch }: { item: RecommendationItem; onSearch: () => void }) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>{item.name}</DialogTitle>
      </DialogHeader>
      <div className="relative w-full aspect-video mb-4">
        <DetailImage src={item.imageUrl} alt={item.name} fallbackText={item.name.substring(0, 2)} />
      </div>
      <div className="space-y-2">
        <p>
          <strong>理由:</strong> {item.reason}
        </p>
        <div>
          <strong>特徴:</strong>
          <ul>
            {item.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
        {item.officialUrl && (
          <p>
            <strong>公式サイト:</strong>
            <a
              href={item.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {item.officialUrl} <ExternalLink className="inline-block h-4 w-4 ml-1" />
            </a>
          </p>
        )}
      </div>
      <DialogFooter>
        <Button type="button" onClick={onSearch}>
          <Search className="mr-2 h-4 w-4" />
          おすすめを検索
        </Button>
      </DialogFooter>
    </>
  )
}
