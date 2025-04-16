/**
 * 検索機能を強化するためのユーティリティ関数
 */

// 日本語と英語の一般的なストップワード
const STOP_WORDS = [
  // 日本語
  "の",
  "に",
  "は",
  "を",
  "た",
  "が",
  "で",
  "て",
  "と",
  "し",
  "れ",
  "さ",
  "ある",
  "いる",
  "も",
  "する",
  "から",
  "な",
  "こと",
  "として",
  "い",
  "や",
  "れる",
  // 英語
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "in",
  "on",
  "at",
  "to",
  "for",
  "with",
  "by",
  "about",
  "against",
  "between",
  "into",
  "through",
]

/**
 * 検索クエリを前処理する関数
 * - トークン化
 * - ストップワード除去
 * - 正規化
 */
export function preprocessQuery(query: string): string[] {
  // 小文字に変換
  const lowercased = query.toLowerCase()

  // 特殊文字を空白に置換
  const cleaned = lowercased.replace(/[^\w\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, " ")

  // トークン化（空白で分割）
  const tokens = cleaned.split(/\s+/).filter((token) => token.length > 0)

  // ストップワード除去
  const filteredTokens = tokens.filter((token) => !STOP_WORDS.includes(token))

  return filteredTokens.length > 0 ? filteredTokens : tokens // ストップワードだけの場合は元のトークンを返す
}

/**
 * テキスト内のキーワード出現回数をカウントする関数
 */
export function countKeywordOccurrences(text: string, keywords: string[]): number {
  if (!text || !keywords || keywords.length === 0) return 0

  const lowercasedText = text.toLowerCase()
  let count = 0

  keywords.forEach((keyword) => {
    // キーワードが空でない場合のみカウント
    if (keyword.trim().length > 0) {
      const regex = new RegExp(keyword, "gi")
      const matches = lowercasedText.match(regex)
      if (matches) {
        count += matches.length
      }
    }
  })

  return count
}

/**
 * アイテムの関連性スコアを計算する関数
 */
export function calculateRelevanceScore(item: any, keywords: string[]): number {
  if (!item || !keywords || keywords.length === 0) return 0

  // 検索対象のテキストを結合
  const searchableText = `${item.name} ${item.reason} ${item.features ? item.features.join(" ") : ""}`.toLowerCase()

  // 基本スコア: 名前に完全一致するキーワードがあれば高いスコア
  let score = 0
  const itemName = item.name.toLowerCase()

  keywords.forEach((keyword) => {
    // 名前に完全一致
    if (itemName === keyword) {
      score += 100
    }
    // 名前に部分一致
    else if (itemName.includes(keyword)) {
      score += 50
    }
    // その他のテキストに一致
    else if (searchableText.includes(keyword)) {
      score += 25
    }
  })

  // キーワードの出現回数によるボーナス
  const occurrences = countKeywordOccurrences(searchableText, keywords)
  score += occurrences * 5

  // 特徴（features）にキーワードが含まれる場合のボーナス
  if (item.features && Array.isArray(item.features)) {
    const featureText = item.features.join(" ").toLowerCase()
    keywords.forEach((keyword) => {
      if (featureText.includes(keyword)) {
        score += 15
      }
    })
  }

  return score
}

/**
 * 検索結果をスコアでソートする関数
 */
export function sortByRelevance(items: any[], keywords: string[]): any[] {
  return [...items].sort((a, b) => {
    const scoreA = calculateRelevanceScore(a, keywords)
    const scoreB = calculateRelevanceScore(b, keywords)
    return scoreB - scoreA // 降順ソート
  })
}

/**
 * 類似キーワードを提案する関数
 */
export function suggestSimilarKeywords(query: string, availableKeywords: string[]): string[] {
  const processedQuery = query.toLowerCase()

  // 簡易的な類似度計算（部分一致）
  return availableKeywords
    .filter(
      (keyword) => keyword.toLowerCase().includes(processedQuery) || processedQuery.includes(keyword.toLowerCase()),
    )
    .slice(0, 5) // 上位5件を返す
}

/**
 * 日本語と英語の形態素解析を行う簡易的な関数
 * 注: 本格的な形態素解析には専用ライブラリを使用することを推奨
 */
export function simpleTokenize(text: string): string[] {
  // 英数字とひらがな/カタカナ/漢字を分割
  const alphaNumericPattern = /[a-zA-Z0-9]+/g
  const japanesePattern = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/g

  const alphaNumericMatches = text.match(alphaNumericPattern) || []
  const japaneseMatches = text.match(japanesePattern) || []

  return [...alphaNumericMatches, ...japaneseMatches]
}
