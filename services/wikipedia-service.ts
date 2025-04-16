/**
 * Wikipedia APIとの連携を行うサービスクラス
 */

// キャッシュ用のマップ
const searchCache = new Map<string, any>()
const contentCache = new Map<string, any>()

// キャッシュの有効期間（24時間）
const CACHE_TTL = 24 * 60 * 60 * 1000

/**
 * Wikipedia APIのベースURL
 */
const WIKIPEDIA_API_BASE_URL = "https://ja.wikipedia.org/w/api.php"

/**
 * Wikipedia APIを使用して検索を行う
 */
export async function searchWikipedia(query: string, limit = 5): Promise<any[]> {
  // キャッシュキーを生成
  const cacheKey = `search_${query}_${limit}`

  // キャッシュをチェック
  if (searchCache.has(cacheKey)) {
    const { data, timestamp } = searchCache.get(cacheKey)
    // キャッシュが有効期間内であれば使用
    if (Date.now() - timestamp < CACHE_TTL) {
      return data
    }
    // 期限切れの場合はキャッシュを削除
    searchCache.delete(cacheKey)
  }

  try {
    // 検索クエリをURLエンコード
    const encodedQuery = encodeURIComponent(query)

    const response = await fetch(
      `${WIKIPEDIA_API_BASE_URL}?action=query&list=search&srsearch=${encodedQuery}&format=json&srlimit=${limit}&origin=*`,
      {
        headers: {
          "User-Agent": "MyApp/1.0 (https://myapp.example; myapp@example.com)",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to search Wikipedia: ${response.statusText}`)
    }

    const data = await response.json()
    const results = data.query.search || []

    // キャッシュに保存
    searchCache.set(cacheKey, { data: results, timestamp: Date.now() })

    return results
  } catch (error) {
    console.error("Error searching Wikipedia:", error)
    return []
  }
}

/**
 * Wikipedia APIを使用して記事の内容を取得する
 */
export async function getWikipediaContent(pageId: number): Promise<any> {
  // キャッシュキーを生成
  const cacheKey = `content_${pageId}`

  // キャッシュをチェック
  if (contentCache.has(cacheKey)) {
    const { data, timestamp } = contentCache.get(cacheKey)
    // キャッシュが有効期間内であれば使用
    if (Date.now() - timestamp < CACHE_TTL) {
      return data
    }
    // 期限切れの場合はキャッシュを削除
    contentCache.delete(cacheKey)
  }

  try {
    const response = await fetch(
      `${WIKIPEDIA_API_BASE_URL}?action=query&prop=extracts|pageimages&exintro=1&explaintext=1&pageids=${pageId}&format=json&pithumbsize=500&origin=*`,
      {
        headers: {
          "User-Agent": "MyApp/1.0 (https://myapp.example; myapp@example.com)",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to get Wikipedia content: ${response.statusText}`)
    }

    const data = await response.json()
    const page = data.query.pages[pageId]

    // キャッシュに保存
    contentCache.set(cacheKey, { data: page, timestamp: Date.now() })

    return page
  } catch (error) {
    console.error("Error getting Wikipedia content:", error)
    return null
  }
}

/**
 * 検索語からWikipediaの情報を取得し、レコメンデーションアイテムに変換する
 */
export async function getWikipediaRecommendations(query: string, limit = 5): Promise<any[]> {
  try {
    const searchResults = await searchWikipedia(query, limit)

    if (!searchResults || searchResults.length === 0) {
      return []
    }

    // 検索結果から最初の5件を取得
    const topResults = searchResults.slice(0, limit)

    // 各検索結果の詳細情報を取得
    const recommendationsPromises = topResults.map(async (result) => {
      const content = await getWikipediaContent(result.pageid)

      if (!content) {
        return null
      }

      // レコメンデーションアイテムに変換
      return {
        name: content.title,
        reason: `Wikipediaで「${query}」に関連する情報として見つかりました。`,
        features: [
          content.extract ? content.extract.substring(0, 100) + "..." : "詳細情報はWikipediaをご覧ください。",
          "信頼性の高い情報源",
          "幅広いトピックをカバー",
        ],
        imageUrl: content.thumbnail ? content.thumbnail.source : "/placeholder.svg",
        officialUrl: `https://ja.wikipedia.org/?curid=${content.pageid}`,
        apiData: {
          type: "wikipedia",
          id: content.pageid,
          extract: content.extract,
        },
      }
    })

    const recommendations = await Promise.all(recommendationsPromises)

    // nullを除外
    return recommendations.filter((item) => item !== null)
  } catch (error) {
    console.error("Error getting Wikipedia recommendations:", error)
    return []
  }
}
