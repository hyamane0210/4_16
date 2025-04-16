/**
 * 複数のAPIから画像を取得し統合するためのユーティリティ
 */
import { getArtistByName } from "@/services/spotify-service"
import { getMediaByName } from "@/services/tmdb-service"
import { searchEntities } from "@/services/knowledge-graph-service"
import { getProxiedImageUrl } from "@/utils/image-utils"
import type { RecommendationItem } from "@/components/recommendations"

// 画像ソースの優先順位
export enum ImageSource {
  SPOTIFY = "spotify",
  TMDB = "tmdb",
  KNOWLEDGE_GRAPH = "knowledge_graph",
  ORIGINAL = "original",
  FALLBACK = "fallback",
}

// 画像情報の型定義
export interface ImageInfo {
  url: string
  source: ImageSource
  quality: number // 0-100の品質スコア
  width?: number
  height?: number
}

/**
 * 検索クエリに基づいて最適な画像を取得する
 */
export async function getOptimalImage(query: string, category?: string): Promise<ImageInfo> {
  try {
    const images: ImageInfo[] = []

    // 1. カテゴリに基づいて適切なAPIから画像を取得
    if (!category || category === "artists") {
      const spotifyArtist = await getArtistByName(query)
      if (spotifyArtist && spotifyArtist.images && spotifyArtist.images.length > 0) {
        // Spotifyの画像は高品質なので高いスコアを付ける
        images.push({
          url: spotifyArtist.images[0].url,
          source: ImageSource.SPOTIFY,
          quality: 90,
          width: spotifyArtist.images[0].width,
          height: spotifyArtist.images[0].height,
        })
      }
    }

    if (!category || category === "media") {
      const { item, type } = await getMediaByName(query)
      if (item && (item.poster_path || item.backdrop_path)) {
        // TMDbの画像も高品質
        images.push({
          url: `https://image.tmdb.org/t/p/w500${item.poster_path || item.backdrop_path}`,
          source: ImageSource.TMDB,
          quality: 85,
        })
      }
    }

    // 2. Knowledge Graph APIから画像を取得（すべてのカテゴリで試行）
    const entities = await searchEntities(query, [], 1)
    if (entities.length > 0 && entities[0].image && entities[0].image.contentUrl) {
      images.push({
        url: entities[0].image.contentUrl,
        source: ImageSource.KNOWLEDGE_GRAPH,
        quality: 75,
      })
    }

    // 3. 画像が見つからない場合はフォールバック
    if (images.length === 0) {
      return {
        url: "/placeholder.svg?height=400&width=400",
        source: ImageSource.FALLBACK,
        quality: 0,
      }
    }

    // 4. 品質スコアに基づいて最適な画像を選択
    images.sort((a, b) => b.quality - a.quality)

    // 5. 選択された画像にプロキシを適用（必要な場合）
    const bestImage = images[0]
    if (bestImage.source !== ImageSource.SPOTIFY && bestImage.source !== ImageSource.FALLBACK) {
      bestImage.url = getProxiedImageUrl(bestImage.url)
    }

    return bestImage
  } catch (error) {
    console.error("Error getting optimal image:", error)
    return {
      url: "/placeholder.svg?height=400&width=400",
      source: ImageSource.FALLBACK,
      quality: 0,
    }
  }
}

/**
 * 推薦アイテムに最適な画像を追加する
 */
export async function enhanceItemWithOptimalImage(
  item: RecommendationItem,
  category?: string,
): Promise<RecommendationItem> {
  try {
    // すでに高品質な画像がある場合はスキップ
    if (item.apiData && (item.apiData.type === "spotify" || item.apiData.type === "tmdb")) {
      return item
    }

    const imageInfo = await getOptimalImage(item.name, category)

    // 画像URLを更新
    return {
      ...item,
      imageUrl: imageInfo.url,
      // APIデータを追加または更新
      apiData: {
        ...item.apiData,
        imageSource: imageInfo.source,
        imageQuality: imageInfo.quality,
      },
    }
  } catch (error) {
    console.error(`Failed to enhance item with optimal image: ${item.name}`, error)
    return item
  }
}

/**
 * 推薦データの全アイテムに最適な画像を追加する
 */
export async function enhanceRecommendationsWithOptimalImages(recommendations: any): Promise<any> {
  const enhancedRecommendations = { ...recommendations }

  // 各カテゴリのアイテムを処理
  for (const category of Object.keys(enhancedRecommendations)) {
    const enhancedItems = await Promise.all(
      enhancedRecommendations[category].map(async (item: RecommendationItem) => {
        return await enhanceItemWithOptimalImage(item, category)
      }),
    )
    enhancedRecommendations[category] = enhancedItems
  }

  return enhancedRecommendations
}
