"use server"

import type { RecommendationsData } from "@/components/recommendations"
import { preprocessQuery } from "@/utils/search-utils"
import { getMediaByName } from "@/services/tmdb-service"
import { getWikipediaRecommendations } from "@/services/wikipedia-service"
import { enhancedDiversifyResults, enhancedRemoveCrossCategoryDuplicates } from "@/utils/enhanced-diversity-utils"
import { expandWithRelatedKeywords } from "@/utils/data-expansion-utils"
import { globalApiCache } from "@/utils/api-resilience"
import { contextAwareSearch, sortByVectorRelevance, type UserContext } from "@/utils/enhanced-search-utils"

// 既存のデータベースをインポート
import { defaultRecommendations, recommendationsDatabase } from "./actions"

/**
 * 大幅に改善された検索機能を提供する関数
 * - 複数データソースの統合
 * - 動的データ生成
 * - 強化された重複排除
 * - コンテキスト考慮型検索
 * - ベクトル検索
 * - APIデータ取得の強化
 */
export async function getImprovedRecommendations(
  searchTerm: string,
  userContext: UserContext = { recentSearches: [], favorites: [] },
): Promise<RecommendationsData> {
  // 検索キーワードを前処理
  const keywords = preprocessQuery(searchTerm)

  // 結果を格納するオブジェクト
  let results: RecommendationsData = {
    artists: [],
    celebrities: [],
    media: [],
    fashion: [],
  }

  try {
    // 1. 既存のデータベースから検索
    let foundInDatabase = false

    for (const [key, value] of Object.entries(recommendationsDatabase)) {
      // キーワードのいずれかがデータベースのキーに含まれているか確認
      if (keywords.some((keyword) => key.toLowerCase().includes(keyword) || keyword.includes(key.toLowerCase()))) {
        foundInDatabase = true

        // 各カテゴリのアイテムをコピー
        Object.keys(value).forEach((category) => {
          results[category] = [...value[category]]
        })

        break
      }
    }

    // 2. データベースに見つからない場合はデフォルトデータを使用
    if (!foundInDatabase) {
      Object.keys(results).forEach((category) => {
        results[category] = [...defaultRecommendations[category]]
      })
    }

    // 3. Wikipedia APIからデータを取得して統合
    try {
      const wikipediaItems = await getWikipediaRecommendations(searchTerm, 10)

      if (wikipediaItems.length > 0) {
        // Wikipediaの結果をカテゴリに振り分け
        wikipediaItems.forEach((item) => {
          // アイテムのテキストからカテゴリを推測
          const itemText = `${item.name} ${item.reason} ${item.features.join(" ")}`.toLowerCase()

          if (itemText.includes("音楽") || itemText.includes("アーティスト") || itemText.includes("バンド")) {
            results.artists.push(item)
          } else if (itemText.includes("映画") || itemText.includes("アニメ") || itemText.includes("ドラマ")) {
            results.media.push(item)
          } else if (itemText.includes("俳優") || itemText.includes("女優") || itemText.includes("タレント")) {
            results.celebrities.push(item)
          } else if (itemText.includes("ファッション") || itemText.includes("ブランド")) {
            results.fashion.push(item)
          } else {
            // カテゴリが不明な場合はmediaに追加
            results.media.push(item)
          }
        })
      }
    } catch (error) {
      console.error("Error fetching Wikipedia data:", error)
      // エラーが発生しても処理を続行
    }

    // 4. 関連キーワードを使ってデータを拡張
    Object.keys(results).forEach((category) => {
      if (results[category].length < 12) {
        results[category] = expandWithRelatedKeywords(results[category], searchTerm, category, 12)
      }
    })

    // 5. 各カテゴリ内の重複を排除し、多様性を確保
    Object.keys(results).forEach((category) => {
      results[category] = enhancedDiversifyResults(results[category], 12, 0.7)
    })

    // 6. カテゴリ間の重複を排除
    results = enhancedRemoveCrossCategoryDuplicates(results, 0.7)

    // 7. コンテキスト考慮型検索でアイテムをソート
    if (userContext.recentSearches.length > 0 || userContext.favorites.length > 0) {
      Object.keys(results).forEach((category) => {
        results[category] = contextAwareSearch(results[category], searchTerm, userContext)
      })
    } else {
      // コンテキストがない場合はベクトル検索でソート
      Object.keys(results).forEach((category) => {
        results[category] = sortByVectorRelevance(results[category], searchTerm)
      })
    }

    // 8. API画像を取得して結果に統合
    await enhanceWithApiImages(results)

    return results
  } catch (error) {
    console.error("Error in improved recommendations:", error)

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
 * 検索結果にAPI画像を追加する関数（リトライとキャッシュ機能強化版）
 */
async function enhanceWithApiImages(results: RecommendationsData): Promise<void> {
  try {
    // アーティストカテゴリの画像を強化
    const artistPromises = results.artists.map(async (artist, index) => {
      try {
        // キャッシュ付きのAPI呼び出し
        const spotifyArtist = await globalApiCache.fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(artist.name)}&type=artist&limit=1`,
          {
            headers: {
              Authorization: `Bearer ${await getSpotifyToken()}`,
            },
          },
        )

        if (spotifyArtist?.artists?.items?.[0]) {
          const artistData = spotifyArtist.artists.items[0]
          if (artistData.images && artistData.images.length > 0) {
            // 画像URLを更新
            results.artists[index] = {
              ...results.artists[index],
              imageUrl: artistData.images[0].url,
              // 追加情報を保存
              apiData: {
                type: "spotify",
                id: artistData.id,
                popularity: artistData.popularity,
                genres: artistData.genres,
              },
            }
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

// Spotifyトークン取得関数（簡略化）
async function getSpotifyToken(): Promise<string> {
  // 実際の実装はspotify-service.tsから取得
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error("Spotify API credentials are not set")
  }

  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authString}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })

  if (!response.ok) {
    throw new Error(`Failed to get Spotify token: ${response.statusText}`)
  }

  const data = await response.json()
  return data.access_token
}
