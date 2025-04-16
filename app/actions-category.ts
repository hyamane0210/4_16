"use server"

import type { RecommendationItem } from "@/components/recommendations"
import { getRecommendations } from "./actions"
import { getEnhancedRecommendations } from "./actions-enhanced"
import { diversifyResults, personalizeResults } from "@/utils/diversity-utils"
import { getArtistByName } from "@/services/spotify-service"
import { getMediaByName } from "@/services/tmdb-service"

/**
 * カテゴリー別のレコメンデーションを取得する関数
 * - 重複排除と多様性確保
 * - API画像の取得と統合
 * - パーソナライズ
 */
export async function getCategoryRecommendations(
  categoryType: string,
  searchTerm: string,
  searchHistory: string[] = [],
): Promise<RecommendationItem[]> {
  // 検索を模倣するための遅延
  await new Promise((resolve) => setTimeout(resolve, 500))

  try {
    // 強化された検索機能を使用してレコメンデーションを取得
    const allRecommendations = await getEnhancedRecommendations(searchTerm, searchHistory)

    // カテゴリータイプに対応するデータを取得
    const categoryMap: Record<string, keyof typeof allRecommendations> = {
      artists: "artists",
      celebrities: "celebrities",
      media: "media",
      fashion: "fashion",
    }

    const categoryKey = categoryMap[categoryType]
    if (!categoryKey) {
      throw new Error(`Invalid category type: ${categoryType}`)
    }

    // カテゴリーに対応するアイテムを取得
    let categoryItems = allRecommendations[categoryKey]

    // アイテムが少ない場合は、通常の検索結果で補完
    if (categoryItems.length < 20) {
      const basicRecommendations = await getRecommendations(searchTerm)
      const additionalItems = basicRecommendations[categoryKey] || []

      // 既存のアイテムと重複しないものを追加
      const existingNames = new Set(categoryItems.map((item) => item.name))
      const newItems = additionalItems.filter((item) => !existingNames.has(item.name))

      categoryItems = [...categoryItems, ...newItems]
    }

    // カテゴリー内の重複を排除し、多様性を確保
    let diversifiedItems = diversifyResults(categoryItems, 50, 0.7)

    // 検索履歴に基づいてパーソナライズ
    if (searchHistory.length > 0) {
      diversifiedItems = personalizeResults(diversifiedItems, searchHistory)
    }

    // API画像を取得して結果に統合
    await enhanceCategoryWithApiImages(diversifiedItems, categoryType)

    return diversifiedItems
  } catch (error) {
    console.error("Error getting category recommendations:", error)
    // エラーが発生した場合は、基本的なレコメンデーションを返す
    const basicRecommendations = await getRecommendations(searchTerm)
    return basicRecommendations[categoryMap[categoryType] as keyof typeof basicRecommendations] || []
  }
}

/**
 * カテゴリーアイテムにAPI画像を追加する関数
 */
async function enhanceCategoryWithApiImages(items: RecommendationItem[], categoryType: string): Promise<void> {
  try {
    if (categoryType === "artists") {
      // アーティストカテゴリーの画像を強化
      const artistPromises = items.map(async (artist, index) => {
        try {
          const spotifyArtist = await getArtistByName(artist.name)
          if (spotifyArtist && spotifyArtist.images && spotifyArtist.images.length > 0) {
            // 画像URLを更新
            items[index] = {
              ...items[index],
              imageUrl: spotifyArtist.images[0].url,
              // 追加情報を保存
              apiData: {
                type: "spotify",
                id: spotifyArtist.id,
                popularity: spotifyArtist.popularity,
                genres: spotifyArtist.genres,
              },
            }
          }
        } catch (error) {
          console.error(`Failed to fetch Spotify image for ${artist.name}:`, error)
          // エラーが発生しても処理を続行
        }
      })

      // 並行して画像を取得
      await Promise.allSettled(artistPromises)
    } else if (categoryType === "media") {
      // メディアカテゴリーの画像を強化
      const mediaPromises = items.map(async (mediaItem, index) => {
        try {
          const { item, type } = await getMediaByName(mediaItem.name)
          if (item) {
            // TMDb画像URLを更新
            const tmdbImageUrl = item.poster_path
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
              : mediaItem.imageUrl
            items[index] = {
              ...items[index],
              imageUrl: tmdbImageUrl,
              // 追加情報を保存
              apiData: {
                type: "tmdb",
                id: item.id,
                mediaType: type,
                voteAverage: item.vote_average,
                releaseDate: type === "movie" ? item.release_date : item.first_air_date,
              },
            }
          }
        } catch (error) {
          console.error(`Failed to fetch TMDb image for ${mediaItem.name}:`, error)
          // エラーが発生しても処理を続行
        }
      })

      // 並行して画像を取得
      await Promise.allSettled(mediaPromises)
    }
    // 他のカテゴリーは現状APIデータがないため処理しない
  } catch (error) {
    console.error("Error enhancing category images:", error)
    // 全体的なエラーが発生しても処理を続行
  }
}

/**
 * 関連カテゴリーのレコメンデーションを取得する関数
 * - 現在のカテゴリーに関連する他のカテゴリーのアイテムを取得
 */
export async function getRelatedCategoryItems(
  currentCategory: string,
  searchTerm: string,
  limit = 6,
): Promise<Record<string, RecommendationItem[]>> {
  try {
    // 全カテゴリーのレコメンデーションを取得
    const allRecommendations = await getRecommendations(searchTerm)

    // 現在のカテゴリー以外のカテゴリーを取得
    const relatedCategories = Object.keys(allRecommendations).filter((category) => category !== currentCategory)

    // 関連カテゴリーのアイテムを取得
    const relatedItems: Record<string, RecommendationItem[]> = {}

    relatedCategories.forEach((category) => {
      const items = allRecommendations[category as keyof typeof allRecommendations]
      if (items && items.length > 0) {
        // 各カテゴリーから指定された数のアイテムを取得
        relatedItems[category] = items.slice(0, limit)
      }
    })

    return relatedItems
  } catch (error) {
    console.error("Error getting related category items:", error)
    return {}
  }
}
