/**
 * Google Knowledge Graph APIとの連携を行うサービスクラス
 */

// Knowledge Graph APIのエンティティ型定義
export interface KnowledgeGraphEntity {
  "@id": string
  name: string
  "@type": string[]
  description?: string
  detailedDescription?: {
    articleBody: string
    url: string
    license: string
  }
  image?: {
    contentUrl: string
    url: string
    license: string
  }
  url?: string
}

// Knowledge Graph APIのレスポンス型定義
export interface KnowledgeGraphResponse {
  "@context": {
    "@vocab": string
    goog: string
    resultScore: string
  }
  "@type": string
  itemListElement: Array<{
    "@type": string
    result: KnowledgeGraphEntity
    resultScore: number
  }>
}

// キャッシュ用のマップ
const searchCache = new Map<string, KnowledgeGraphEntity[]>()

/**
 * Google Knowledge Graph APIのAPIキーを取得する
 */
function getApiKey(): string {
  const apiKey = process.env.GOOGLE_KNOWLEDGE_GRAPH_API_KEY
  if (!apiKey) {
    throw new Error("Google Knowledge Graph API key is not set in environment variables")
  }
  return apiKey
}

/**
 * Google Knowledge Graph APIを使用してエンティティを検索する
 */
export async function searchEntities(query: string, types: string[] = [], limit = 10): Promise<KnowledgeGraphEntity[]> {
  // キャッシュキーを生成
  const typesStr = types.join(",")
  const cacheKey = `${query}_${typesStr}_${limit}`

  // キャッシュをチェック
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey) || []
  }

  try {
    const apiKey = getApiKey()
    const encodedQuery = encodeURIComponent(query)

    // APIリクエストURLを構築
    let url = `https://kgsearch.googleapis.com/v1/entities:search?query=${encodedQuery}&key=${apiKey}&limit=${limit}&indent=true`

    // 型フィルターを追加（指定されている場合）
    if (types.length > 0) {
      url += `&types=${types.map((t) => encodeURIComponent(t)).join(",")}`
    }

    // 言語を日本語に設定
    url += "&languages=ja,en"

    const response = await fetch(url, {
      next: { revalidate: 86400 }, // 24時間キャッシュ
    })

    if (!response.ok) {
      throw new Error(`Failed to search entities: ${response.statusText}`)
    }

    const data: KnowledgeGraphResponse = await response.json()

    // エンティティを抽出
    const entities = data.itemListElement.map((item) => item.result).filter((entity) => entity) // nullやundefinedをフィルタリング

    // キャッシュに保存
    searchCache.set(cacheKey, entities)

    return entities
  } catch (error) {
    console.error("Error searching entities:", error)
    return []
  }
}

/**
 * エンティティの種類に基づいて適切なカテゴリを判断する
 */
export function determineCategory(entity: KnowledgeGraphEntity): string {
  const types = entity["@type"] || []

  // 型の文字列表現
  const typeStr = types.join(" ").toLowerCase()

  // アーティスト/ミュージシャン判定
  if (
    typeStr.includes("musician") ||
    typeStr.includes("artist") ||
    typeStr.includes("musicgroup") ||
    typeStr.includes("band") ||
    typeStr.includes("music")
  ) {
    return "artists"
  }

  // 芸能人/有名人判定
  if (
    typeStr.includes("actor") ||
    typeStr.includes("actress") ||
    typeStr.includes("celebrity") ||
    typeStr.includes("person") ||
    typeStr.includes("director") ||
    typeStr.includes("athlete")
  ) {
    return "celebrities"
  }

  // メディア判定
  if (
    typeStr.includes("movie") ||
    typeStr.includes("tvshow") ||
    typeStr.includes("tvseries") ||
    typeStr.includes("book") ||
    typeStr.includes("game") ||
    typeStr.includes("videogame") ||
    typeStr.includes("anime")
  ) {
    return "media"
  }

  // ファッション判定
  if (
    typeStr.includes("brand") ||
    typeStr.includes("clothing") ||
    typeStr.includes("fashion") ||
    typeStr.includes("organization") ||
    typeStr.includes("company") ||
    typeStr.includes("corporation")
  ) {
    return "fashion"
  }

  // デフォルトはcelebrities
  return "celebrities"
}

/**
 * Knowledge Graph エンティティをRecommendationItemに変換する
 * 芸能人/インフルエンサー向けに最適化
 */
export async function convertToRecommendationItem(entity: KnowledgeGraphEntity): Promise<any> {
  // 画像URLを取得（拡張された関数を使用）
  const imageUrl = await getKnowledgeGraphImageUrl(entity)

  return {
    name: entity.name,
    reason: entity.detailedDescription?.articleBody || entity.description || `${entity.name}に関する情報です。`,
    features: [
      ...entity["@type"].slice(0, 3).map((type) => type.replace(/^[a-z]+:/, "")),
      entity.url ? "公式サイトあり" : "",
    ].filter(Boolean),
    imageUrl: imageUrl,
    officialUrl: entity.url || entity.detailedDescription?.url || "#",
    apiData: {
      type: "knowledge_graph",
      id: entity["@id"],
      entityTypes: entity["@type"],
      imageSource: "knowledge_graph",
    },
  }
}
import { getWikipediaContent } from "./wikipedia-service"
import { getProxiedImageUrl } from "@/utils/image-utils"

/**
 * Knowledge Graph APIのエンティティから最適な画像URLを取得する
 */
async function getKnowledgeGraphImageUrl(entity: KnowledgeGraphEntity): Promise<string> {
  // エンティティに画像がある場合はそれを使用
  if (entity.image?.contentUrl) {
    console.log("Knowledge Graph Image URL (contentUrl):", entity.image.contentUrl) // ログを追加
    return getProxiedImageUrl(entity.image.contentUrl)
  }

  if (entity.image?.url) {
    console.log("Knowledge Graph Image URL (url):", entity.image.url) // ログを追加
    return getProxiedImageUrl(entity.image.url)
  }

  // エンティティのIDからWikidataのIDを抽出
  const wikidataId = extractWikidataId(entity["@id"])
  if (wikidataId) {
    // Wikipedia APIから画像を取得
    const wikipediaContent = await getWikipediaContent(wikidataId)
    if (wikipediaContent?.thumbnail?.source) {
      console.log("Wikipedia Image URL:", wikipediaContent.thumbnail.source) // ログを追加
      return getProxiedImageUrl(wikipediaContent.thumbnail.source)
    }
  }

  // デフォルトのプレースホルダー画像
  return "/placeholder.svg?height=400&width=400"
}

/**
 * エンティティIDからWikidata IDを抽出する
 */
function extractWikidataId(entityId: string): string | null {
  if (!entityId) return null

  // Wikidata IDを抽出
  const wikidataMatch = entityId.match(/wikidata\.org\/entity\/(Q\d+)/)
  if (wikidataMatch && wikidataMatch[1]) {
    return wikidataMatch[1]
  }

  // Freebase IDを抽出（古いKG APIのレスポンスで使用）
  const freebaseMatch = entityId.match(/\/m\/([a-zA-Z0-9_]+)/)
  if (freebaseMatch && freebaseMatch[1]) {
    return freebaseMatch[1]
  }

  return null
}
