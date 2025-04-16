import { getWikipediaContent, searchWikipedia } from "@/services/wikipedia-service"

interface RecommendationsData {
  artists: { name?: string; imageUrl?: string }[]
  celebrities: { name?: string; imageUrl?: string }[]
  media: { name?: string; imageUrl?: string }[]
  fashion: { name?: string; imageUrl?: string }[]
}

interface UserContext {
  recentSearches: string[]
  favorites: string[]
}

// ダミーデータと関数を定義 (実際には適切な場所に定義してください)
const recommendationsDatabase = {}
const defaultRecommendations = {
  artists: [],
  celebrities: [],
  media: [],
  fashion: [],
}
const preprocessQuery = (query: string) => [query] // 簡単な実装
const expandWithRelatedKeywords = (items: any[], searchTerm: string, category: string, limit: number) => items // 簡単な実装
const enhancedDiversifyResults = (items: any[], limit: number, threshold: number) => items // 簡単な実装
const enhancedRemoveCrossCategoryDuplicates = (results: RecommendationsData, threshold: number) => results // 簡単な実装
const contextAwareSearch = (items: any[], searchTerm: string, userContext: UserContext) => items // 簡単な実装
// const sortByVectorRelevance = (items: any[], searchTerm: string) => items; // 簡単な実装

/**
 * エンティティの画像と説明を強化する
 */
async function enhanceWithWikipedia(results: RecommendationsData): Promise<void> {
  // 芸能人カテゴリの画像を強化
  const celebrityPromises = results.celebrities.map(async (celebrity, index) => {
    if (!celebrity.name) return // 名前がない場合はスキップ

    try {
      const searchResults = await searchWikipedia(celebrity.name, 1)
      if (searchResults.length > 0) {
        const wikipediaContent = await getWikipediaContent(searchResults[0].pageid)
        if (wikipediaContent?.thumbnail?.source) {
          // 画像URLを更新
          results.celebrities[index] = {
            ...results.celebrities[index],
            imageUrl: wikipediaContent.thumbnail.source,
          }
        }
      }
    } catch (error) {
      console.error(`Failed to fetch Wikipedia content for ${celebrity.name}:`, error)
      // エラーが発生しても処理を続行
    }
  })

  // ファッションブランドカテゴリの画像を強化
  const fashionPromises = results.fashion.map(async (fashion, index) => {
    if (!fashion.name) return // 名前がない場合はスキップ

    try {
      const searchResults = await searchWikipedia(fashion.name, 1)
      if (searchResults.length > 0) {
        const wikipediaContent = await getWikipediaContent(searchResults[0].pageid)
        if (wikipediaContent?.thumbnail?.source) {
          // 画像URLを更新
          results.fashion[index] = {
            ...results.fashion[index],
            imageUrl: wikipediaContent.thumbnail.source,
          }
        }
      }
    } catch (error) {
      console.error(`Failed to fetch Wikipedia content for ${fashion.name}:`, error)
      // エラーが発生しても処理を続行
    }
  })

  // 並行して画像を取得し、すべての処理が完了するのを待つ
  await Promise.allSettled([...celebrityPromises, ...fashionPromises])
}

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
    await enhanceWithWikipedia(results)

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
      // Object.keys(results).forEach((category) => {
      //   results[category] = sortByVectorRelevance(results[category], searchTerm)
      // })
    }

    // 8. API画像を取得して結果に統合
    // await enhanceWithApiImages(results)

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
