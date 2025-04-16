/**
 * 検索アルゴリズムを強化するユーティリティ
 */

import type { RecommendationItem } from "@/components/recommendations"
import { preprocessQuery } from "./search-utils"

// 簡易的なベクトル表現のための単語埋め込み
interface WordEmbedding {
  [word: string]: number[]
}

// 簡易的な単語埋め込みデータ（実際の実装ではより大規模なデータを使用）
const SIMPLE_EMBEDDINGS: WordEmbedding = {
  // 音楽関連
  音楽: [1.0, 0.2, 0.1, 0.0],
  アーティスト: [0.9, 0.3, 0.1, 0.0],
  バンド: [0.8, 0.3, 0.1, 0.0],
  歌手: [0.9, 0.2, 0.1, 0.0],
  ミュージシャン: [0.9, 0.3, 0.1, 0.0],

  // 映画関連
  映画: [0.1, 0.9, 0.2, 0.0],
  アニメ: [0.1, 0.8, 0.3, 0.0],
  ドラマ: [0.1, 0.7, 0.3, 0.0],
  作品: [0.2, 0.7, 0.3, 0.1],
  監督: [0.1, 0.8, 0.2, 0.0],

  // 芸能人関連
  芸能人: [0.2, 0.3, 0.9, 0.1],
  俳優: [0.1, 0.4, 0.8, 0.1],
  女優: [0.1, 0.4, 0.8, 0.1],
  タレント: [0.2, 0.3, 0.8, 0.2],
  モデル: [0.2, 0.2, 0.7, 0.4],

  // ファッション関連
  ファッション: [0.1, 0.1, 0.3, 0.9],
  ブランド: [0.1, 0.1, 0.2, 0.9],
  服: [0.0, 0.0, 0.1, 0.9],
  スタイル: [0.1, 0.1, 0.3, 0.8],
  デザイン: [0.2, 0.2, 0.2, 0.7],
}

/**
 * テキストをベクトル表現に変換する関数
 */
export function textToVector(text: string, dimension = 4): number[] {
  // テキストを単語に分割
  const words = preprocessQuery(text)

  // ゼロベクトルで初期化
  const vector = Array(dimension).fill(0)
  let wordCount = 0

  // 各単語のベクトルを加算
  for (const word of words) {
    if (SIMPLE_EMBEDDINGS[word]) {
      for (let i = 0; i < dimension; i++) {
        vector[i] += SIMPLE_EMBEDDINGS[word][i]
      }
      wordCount++
    }
  }

  // 単語が見つからなかった場合は均等なベクトルを返す
  if (wordCount === 0) {
    return Array(dimension).fill(1 / dimension)
  }

  // 平均ベクトルを計算
  for (let i = 0; i < dimension; i++) {
    vector[i] /= wordCount
  }

  return vector
}

/**
 * ベクトル間のコサイン類似度を計算する関数
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error("Vectors must have the same dimension")
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }

  // ゼロベクトルの場合は類似度0を返す
  if (normA === 0 || normB === 0) {
    return 0
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

/**
 * ベクトル検索を使用してアイテムの関連性スコアを計算する関数
 */
export function calculateVectorRelevanceScore(item: RecommendationItem, queryVector: number[]): number {
  // アイテムのテキストを結合
  const itemText = `${item.name} ${item.reason} ${item.features.join(" ")}`

  // アイテムのテキストをベクトル化
  const itemVector = textToVector(itemText)

  // コサイン類似度を計算
  const similarity = cosineSimilarity(queryVector, itemVector)

  return similarity
}

/**
 * コンテキスト考慮型検索のためのユーザーコンテキスト
 */
export interface UserContext {
  recentSearches: string[]
  favorites: RecommendationItem[]
  preferences?: {
    categories?: string[]
    genres?: string[]
    [key: string]: any
  }
}

/**
 * コンテキスト考慮型検索を実行する関数
 */
export function contextAwareSearch(
  items: RecommendationItem[],
  query: string,
  userContext: UserContext,
): RecommendationItem[] {
  // クエリをベクトル化
  const queryVector = textToVector(query)

  // コンテキストをベクトル化
  const contextVectors: number[][] = []

  // 最近の検索をコンテキストに追加
  if (userContext.recentSearches && userContext.recentSearches.length > 0) {
    const recentSearchesText = userContext.recentSearches.join(" ")
    contextVectors.push(textToVector(recentSearchesText))
  }

  // お気に入りをコンテキストに追加
  if (userContext.favorites && userContext.favorites.length > 0) {
    const favoritesText = userContext.favorites.map((item) => `${item.name} ${item.features.join(" ")}`).join(" ")
    contextVectors.push(textToVector(favoritesText))
  }

  // 各アイテムにスコアを付与
  const scoredItems = items.map((item) => {
    // クエリとの関連性スコア
    const queryScore = calculateVectorRelevanceScore(item, queryVector)

    // コンテキストとの関連性スコア
    let contextScore = 0
    if (contextVectors.length > 0) {
      // 各コンテキストベクトルとの類似度の平均を計算
      contextScore =
        contextVectors.reduce((sum, contextVector) => {
          return sum + calculateVectorRelevanceScore(item, contextVector)
        }, 0) / contextVectors.length
    }

    // 最終スコアを計算（クエリとコンテキストの重み付け）
    const finalScore = queryScore * 0.7 + contextScore * 0.3

    return {
      item,
      score: finalScore,
    }
  })

  // スコアでソート
  return scoredItems.sort((a, b) => b.score - a.score).map((scored) => scored.item)
}

/**
 * ベクトル検索を使用してアイテムをソートする関数
 */
export function sortByVectorRelevance(items: RecommendationItem[], query: string): RecommendationItem[] {
  // クエリをベクトル化
  const queryVector = textToVector(query)

  // 各アイテムにスコアを付与
  const scoredItems = items.map((item) => {
    const score = calculateVectorRelevanceScore(item, queryVector)
    return { item, score }
  })

  // スコアでソート
  return scoredItems.sort((a, b) => b.score - a.score).map((scored) => scored.item)
}
