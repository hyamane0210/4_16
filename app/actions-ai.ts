"use server"

import type { RecommendationsData, RecommendationItem } from "@/components/recommendations"
import {
  getEmbedding,
  sortBySimilarity,
  generateItemFeatures,
  generateSimilarityReason,
} from "@/services/openai-service"
import { preprocessQuery } from "@/utils/search-utils"
import { getMediaByName } from "@/services/tmdb-service"
import { getArtistByName } from "@/services/spotify-service"
import { globalApiCache } from "@/utils/api-resilience"
import { enhancedDiversifyResults } from "@/utils/enhanced-diversity-utils"

// 既存のデータベースをインポート
import { defaultRecommendations, recommendationsDatabase } from "./actions"

// キャッシュキー
const EMBEDDING_CACHE_KEY = "ai_embedding:"
const RECOMMENDATION_CACHE_KEY = "ai_recommendation:"

// キャッシュ有効期間（1週間）
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000

/**
 * OpenAIを使用したAIレコメンデーションを取得する
 */
export async function getAIRecommendations(searchTerm: string): Promise<RecommendationsData> {
  // 検索キーワードを前処理
  const processedTerm = preprocessQuery(searchTerm).join(" ")

  // キャッシュキーを生成
  const cacheKey = `${RECOMMENDATION_CACHE_KEY}${processedTerm}`

  // キャッシュをチェック
  try {
    const cachedRecommendations = await globalApiCache.fetch<RecommendationsData>(cacheKey)
    if (cachedRecommendations) {
      console.log(`Using cached AI recommendations for: ${processedTerm}`)
      return cachedRecommendations
    }
  } catch (error) {
    // キャッシュミスは無視
  }

  try {
    // 結果を格納するオブジェクト
    const results: RecommendationsData = {
      artists: [],
      celebrities: [],
      media: [],
      fashion: [],
    }

    // 1. 既存のデータベースから初期データを取得
    const initialData = getInitialRecommendations(searchTerm)

    // 2. 検索キーワードの埋め込みを取得
    const queryEmbedding = await getQueryEmbedding(processedTerm)

    // 3. 各カテゴリごとに類似度に基づいてアイテムをソート
    for (const category of Object.keys(initialData) as Array<keyof RecommendationsData>) {
      if (initialData[category].length > 0) {
        // アイテムの埋め込みを取得する関数
        const getItemEmbedding = async (item: RecommendationItem) => {
          return getItemEmbedding(item, category as string)
        }

        // 類似度でソート
        const sortedItems = await sortBySimilarity(initialData[category], queryEmbedding, getItemEmbedding)

        // 上位12件を取得
        results[category] = sortedItems.slice(0, 12)

        // 4. AIを使用して各アイテムの特徴と理由を生成
        results[category] = await enhanceItemsWithAI(results[category], searchTerm, category as string)
      }
    }

    // 5. 多様性を確保
    Object.keys(results).forEach((category) => {
      results[category as keyof RecommendationsData] = enhancedDiversifyResults(
        results[category as keyof RecommendationsData],
        12,
        0.7,
      )
    })

    // 6. API画像を取得して結果に統合
    await enhanceWithApiImages(results)

    // キャッシュに保存
    await globalApiCache.invalidateCache(cacheKey)
    await globalApiCache.fetch(cacheKey, {
      method: "PUT",
      body: JSON.stringify(results),
    })

    return results
  } catch (error) {
    console.error("Error in AI recommendations:", error)

    // エラーが発生した場合はデフォルトの推薦を返す
    return {
      artists: defaultRecommendations.artists.slice(0, 12),
      celebrities: defaultRecommendations.celebrities.slice(0, 12),
      media: defaultRecommendations.media.slice(0, 12),
      fashion: defaultRecommendations.fashion.slice(0, 12),
    }
  }
}

/**
 * 初期レコメンデーションを取得する
 */
function getInitialRecommendations(searchTerm: string): RecommendationsData {
  const keywords = preprocessQuery(searchTerm)

  // 結果を格納するオブジェクト
  const results: RecommendationsData = {
    artists: [],
    celebrities: [],
    media: [],
    fashion: [],
  }

  // 既存のデータベースから検索
  let foundInDatabase = false

  for (const [key, value] of Object.entries(recommendationsDatabase)) {
    // キーワードのいずれかがデータベースのキーに含まれているか確認
    if (keywords.some((keyword) => key.toLowerCase().includes(keyword) || keyword.includes(key.toLowerCase()))) {
      foundInDatabase = true

      // 各カテゴリのアイテムをコピー
      Object.keys(value).forEach((category) => {
        results[category as keyof RecommendationsData] = [...value[category as keyof typeof value]]
      })

      break
    }
  }

  // データベースに見つからない場合はデフォルトデータを使用
  if (!foundInDatabase) {
    Object.keys(results).forEach((category) => {
      results[category as keyof RecommendationsData] = [
        ...defaultRecommendations[category as keyof typeof defaultRecommendations],
      ]
    })
  }

  return results
}

/**
 * クエリの埋め込みを取得する
 */
async function getQueryEmbedding(query: string): Promise<number[]> {
  const cacheKey = `${EMBEDDING_CACHE_KEY}${query}`

  // キャッシュをチェック
  try {
    const cachedEmbedding = await globalApiCache.fetch<number[]>(cacheKey)
    if (cachedEmbedding && cachedEmbedding.length > 0) {
      return cachedEmbedding
    }
  } catch (error) {
    // キャッシュミスは無視
  }

  // 埋め込みを取得
  const embedding = await getEmbedding(query)

  // キャッシュに保存
  await globalApiCache.invalidateCache(cacheKey)
  await globalApiCache.fetch(cacheKey, {
    method: "PUT",
    body: JSON.stringify(embedding),
  })

  return embedding
}

/**
 * アイテムの埋め込みを取得する
 */
async function getItemEmbedding(item: RecommendationItem, category: string): Promise<number[]> {
  const cacheKey = `${EMBEDDING_CACHE_KEY}${category}:${item.name}`

  // キャッシュをチェック
  try {
    const cachedEmbedding = await globalApiCache.fetch<number[]>(cacheKey)
    if (cachedEmbedding && cachedEmbedding.length > 0) {
      return cachedEmbedding
    }
  } catch (error) {
    // キャッシュミスは無視
  }

  // アイテムのテキストを結合
  const itemText = `${item.name} ${item.reason || ""} ${item.features?.join(" ") || ""}`

  // 埋め込みを取得
  const embedding = await getEmbedding(itemText)

  // キャッシュに保存
  await globalApiCache.invalidateCache(cacheKey)
  await globalApiCache.fetch(cacheKey, {
    method: "PUT",
    body: JSON.stringify(embedding),
  })

  return embedding
}

/**
 * AIを使用してアイテムを強化する
 */
async function enhanceItemsWithAI(
  items: RecommendationItem[],
  searchTerm: string,
  category: string,
): Promise<RecommendationItem[]> {
  return Promise.all(
    items.map(async (item) => {
      // 特徴がない場合は生成
      if (!item.features || item.features.length === 0) {
        item.features = await generateItemFeatures(item, category)
      }

      // 理由がない場合は生成
      if (!item.reason || item.reason.length === 0) {
        item.reason = await generateSimilarityReason(searchTerm, item.name, category)
      }

      return item
    }),
  )
}

/**
 * API画像を取得して結果に統合する
 */
async function enhanceWithApiImages(results: RecommendationsData): Promise<void> {
  try {
    // アーティストカテゴリの画像を強化
    const artistPromises = results.artists.map(async (artist, index) => {
      try {
        const spotifyArtist = await getArtistByName(artist.name)

        if (spotifyArtist && spotifyArtist.images && spotifyArtist.images.length > 0) {
          // 画像URLを更新
          results.artists[index] = {
            ...results.artists[index],
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

    // メディアカテゴリの画像も同様に改善
    const mediaPromises = results.media.map(async (mediaItem, index) => {
      try {
        const { item, type } = await getMediaByName(mediaItem.name)
        if (item) {
          // TMDb画像URLを更新
          const tmdbImageUrl = item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : mediaItem.imageUrl
          results.media[index] = {
            ...results.media[index],
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

    // 並行して画像を取得し、すべての処理が完了するのを待つ
    await Promise.allSettled([...artistPromises, ...mediaPromises])
  } catch (error) {
    console.error("Error enhancing images:", error)
    // 全体的なエラーが発生しても処理を続行
  }
}
