"use server"

import type { RecommendationsData } from "@/components/recommendations"
import { preprocessQuery } from "@/utils/search-utils"
import { getArtistByName } from "@/services/spotify-service"
import { getMediaByName, searchPeople, getPerson } from "@/services/tmdb-service"
import { diversifyResults, removeCrossCategoryDuplicates, personalizeResults } from "@/utils/diversity-utils"
import { expandWithRelatedKeywords } from "@/utils/data-expansion-utils"

// 既存のデータベースをインポート
import { defaultRecommendations, recommendationsDatabase } from "./actions"

/**
 * 強化された検索機能を提供する関数
 * - キーワード前処理
 * - 関連性スコアリング
 * - 結果のランキング
 * - 重複排除と多様性確保
 * - API画像の取得と統合
 */
export async function getEnhancedRecommendations(
  searchTerm: string,
  searchHistory: string[] = [],
): Promise<RecommendationsData> {
  // 検索を模倣するための遅延
  await new Promise((resolve) => setTimeout(resolve, 1000))

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

    // 3. Wikipedia APIからデータを取得して統合（削除）

    // 4. 関連キーワードを使ってデータを拡張
    Object.keys(results).forEach((category) => {
      if (results[category].length < 12) {
        results[category] = expandWithRelatedKeywords(results[category], searchTerm, category, 12)
      }
    })

    // 5. 各カテゴリ内の重複を排除し、多様性を確保
    Object.keys(results).forEach((category) => {
      results[category] = diversifyResults(results[category], 12, 0.7)
    })

    // 6. カテゴリ間の重複を排除
    results = removeCrossCategoryDuplicates(results, 0.7)

    // 7. コンテキスト考慮型検索でアイテムをソート
    if (searchHistory.length > 0) {
      Object.keys(results).forEach((category) => {
        results[category] = personalizeResults(results[category], searchHistory)
      })
    } else {
      // コンテキストがない場合はベクトル検索でソート
      // Object.keys(results).forEach((category) => {
      //   results[category] = sortByVectorRelevance(results[category], searchTerm)
      // })
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
      if (!artist.name) return // 名前がない場合はスキップ

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

    // 芸能人カテゴリの画像を強化
    const celebrityPromises = results.celebrities.map(async (celebrity, index) => {
      if (!celebrity.name) return // 名前がない場合はスキップ

      try {
        const people = await searchPeople(celebrity.name)
        if (people && people.length > 0) {
          // 最初の検索結果を使用
          const person = await getPerson(people[0].id)
          if (person && person.profile_path) {
            // 画像URLを更新
            results.celebrities[index] = {
              ...results.celebrities[index],
              imageUrl: `https://image.tmdb.org/t/p/w500${person.profile_path}`,
              // 追加情報を保存
              apiData: {
                type: "tmdb",
                id: person.id,
              },
            }
          }
        }
      } catch (error) {
        console.error(`Failed to fetch TMDb image for ${celebrity.name}:`, error)
        // エラーが発生しても処理を続行
      }
    })

    // メディアカテゴリの画像も同様に改善
    const mediaPromises = results.media.map(async (mediaItem, index) => {
      if (!mediaItem.name) return // 名前がない場合はスキップ

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
              releaseDate: type === "movie" ? (item as any).release_date : (item as any).first_air_date,
            },
          }
        }
      } catch (error) {
        console.error(`Failed to fetch TMDb image for ${mediaItem.name}:`, error)
        // エラーが発生しても処理を続行
      }
    })

    // 並行して画像を取得し、すべての処理が完了するのを待つ
    await Promise.allSettled([...artistPromises, ...celebrityPromises, ...mediaPromises])
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
