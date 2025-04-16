/**
 * 検索結果の多様性と重複排除を強化するユーティリティ
 */

import type { RecommendationItem } from "@/components/recommendations"
import { preprocessQuery } from "./search-utils"

/**
 * 文字列間のレーベンシュタイン距離を計算する関数
 * 2つの文字列がどれだけ異なるかを数値化（編集距離）
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length
  const n = str2.length

  // 動的計画法のためのテーブルを作成
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0))

  // 初期化
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j

  // 動的計画法でテーブルを埋める
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + 1, // 置換
          dp[i - 1][j] + 1, // 削除
          dp[i][j - 1] + 1, // 挿入
        )
      }
    }
  }

  return dp[m][n]
}

/**
 * 文字列間の類似度を計算する関数（0〜1の値、1が完全一致）
 */
function stringSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0
  if (str1 === str2) return 1

  const maxLength = Math.max(str1.length, str2.length)
  if (maxLength === 0) return 1

  const distance = levenshteinDistance(str1, str2)
  return 1 - distance / maxLength
}

/**
 * 単語の共通性を計算する関数
 */
function calculateWordOverlap(text1: string, text2: string): number {
  const words1 = new Set(preprocessQuery(text1))
  const words2 = new Set(preprocessQuery(text2))

  if (words1.size === 0 || words2.size === 0) return 0

  // 共通の単語
  const intersection = new Set([...words1].filter((x) => words2.has(x)))

  // Jaccard類似度: 共通要素数 / 全要素数
  const union = new Set([...words1, ...words2])

  return intersection.size / union.size
}

/**
 * 改善された類似度スコアを計算する関数
 */
export function calculateEnhancedSimilarityScore(item1: RecommendationItem, item2: RecommendationItem): number {
  // 名前の類似度（完全一致の場合は高いスコア）
  const nameSimilarity = stringSimilarity(item1.name.toLowerCase(), item2.name.toLowerCase())

  // 名前が非常に似ている場合は高い類似度を返す
  if (nameSimilarity > 0.8) {
    return nameSimilarity
  }

  // テキスト特徴量を抽出
  const text1 = `${item1.name} ${item1.reason} ${item1.features.join(" ")}`.toLowerCase()
  const text2 = `${item2.name} ${item2.reason} ${item2.features.join(" ")}`.toLowerCase()

  // 単語の重複を計算
  const wordOverlap = calculateWordOverlap(text1, text2)

  // 特徴の類似度を計算
  const featureSimilarity = calculateFeatureSimilarity(item1.features, item2.features)

  // 理由の類似度を計算
  const reasonSimilarity = stringSimilarity(item1.reason, item2.reason)

  // 重み付け
  const weights = {
    name: 0.5,
    wordOverlap: 0.2,
    features: 0.2,
    reason: 0.1,
  }

  // 総合スコアを計算
  const totalScore =
    nameSimilarity * weights.name +
    wordOverlap * weights.wordOverlap +
    featureSimilarity * weights.features +
    reasonSimilarity * weights.reason

  return totalScore
}

/**
 * 特徴リスト間の類似度を計算する関数
 */
function calculateFeatureSimilarity(features1: string[], features2: string[]): number {
  if (!features1.length || !features2.length) return 0

  let totalSimilarity = 0
  let comparisonCount = 0

  // 各特徴ペアの類似度を計算
  for (const f1 of features1) {
    for (const f2 of features2) {
      totalSimilarity += stringSimilarity(f1.toLowerCase(), f2.toLowerCase())
      comparisonCount++
    }
  }

  return comparisonCount > 0 ? totalSimilarity / comparisonCount : 0
}

/**
 * 改善された重複検出関数
 */
export function detectEnhancedDuplicates(
  items: RecommendationItem[],
  similarityThreshold = 0.7,
): Map<number, number[]> {
  const duplicateGroups = new Map<number, number[]>()

  for (let i = 0; i < items.length; i++) {
    const duplicates: number[] = []

    for (let j = i + 1; j < items.length; j++) {
      const similarity = calculateEnhancedSimilarityScore(items[i], items[j])
      if (similarity >= similarityThreshold) {
        duplicates.push(j)
      }
    }

    if (duplicates.length > 0) {
      duplicateGroups.set(i, duplicates)
    }
  }

  return duplicateGroups
}

/**
 * 改善された多様性確保関数
 */
export function enhancedDiversifyResults(
  items: RecommendationItem[],
  maxItems = 12,
  similarityThreshold = 0.7,
): RecommendationItem[] {
  if (items.length <= maxItems) return items

  // 重複グループを検出
  const duplicateGroups = detectEnhancedDuplicates(items, similarityThreshold)

  // 既に選択されたアイテムのインデックスを追跡
  const selectedIndices = new Set<number>()
  const result: RecommendationItem[] = []

  // 重複のないアイテムを優先的に選択
  for (let i = 0; i < items.length && result.length < maxItems; i++) {
    if (!selectedIndices.has(i) && !isInDuplicateGroup(i, duplicateGroups)) {
      result.push(items[i])
      selectedIndices.add(i)
    }
  }

  // 重複グループから代表アイテムを選択
  const groupKeys = Array.from(duplicateGroups.keys())
  for (let i = 0; i < groupKeys.length && result.length < maxItems; i++) {
    const groupKey = groupKeys[i]
    if (!selectedIndices.has(groupKey)) {
      result.push(items[groupKey])
      selectedIndices.add(groupKey)

      // このグループのすべての重複を選択済みとしてマーク
      duplicateGroups.get(groupKey)?.forEach((idx) => {
        selectedIndices.add(idx)
      })
    }
  }

  // 残りのスロットを埋める
  for (let i = 0; i < items.length && result.length < maxItems; i++) {
    if (!selectedIndices.has(i)) {
      result.push(items[i])
      selectedIndices.add(i)
    }
  }

  return result
}

/**
 * 指定されたインデックスが重複グループに含まれているかチェック
 */
function isInDuplicateGroup(index: number, duplicateGroups: Map<number, number[]>): boolean {
  for (const [key, duplicates] of duplicateGroups.entries()) {
    if (duplicates.includes(index)) {
      return true
    }
  }
  return false
}

/**
 * 強化されたカテゴリー間の重複排除関数
 */
export function enhancedRemoveCrossCategoryDuplicates(
  data: Record<string, RecommendationItem[]>,
  similarityThreshold = 0.7,
): Record<string, RecommendationItem[]> {
  const result = { ...data }
  const categories = Object.keys(data)

  // すべてのカテゴリペアを処理
  for (let i = 0; i < categories.length; i++) {
    const category1 = categories[i]

    for (let j = i + 1; j < categories.length; j++) {
      const category2 = categories[j]

      // 2つのカテゴリ間の重複を検出
      const duplicatePairs: [number, number][] = []

      for (let idx1 = 0; idx1 < data[category1].length; idx1++) {
        for (let idx2 = 0; idx2 < data[category2].length; idx2++) {
          const similarity = calculateEnhancedSimilarityScore(data[category1][idx1], data[category2][idx2])
          if (similarity >= similarityThreshold) {
            duplicatePairs.push([idx1, idx2])
          }
        }
      }

      // 重複を処理（優先度の高いカテゴリを保持）
      for (const [idx1, idx2] of duplicatePairs) {
        // 優先度を決定
        const keepInCategory1 = shouldKeepInFirstCategory(
          category1,
          category2,
          data[category1][idx1],
          data[category2][idx2],
        )

        if (keepInCategory1) {
          // カテゴリ2から削除
          result[category2] = result[category2].filter((_, i) => i !== idx2)
        } else {
          // カテゴリ1から削除
          result[category1] = result[category1].filter((_, i) => i !== idx1)
        }
      }
    }
  }

  return result
}

/**
 * 改善されたカテゴリ優先順位決定関数
 */
function shouldKeepInFirstCategory(
  category1: string,
  category2: string,
  item1: RecommendationItem,
  item2: RecommendationItem,
): boolean {
  // カテゴリの優先順位を定義
  const priorityOrder: Record<string, number> = {
    media: 1, // 最優先
    artists: 2,
    celebrities: 3,
    fashion: 4, // 最低優先
  }

  // APIデータがある場合は優先
  if (item1.apiData && !item2.apiData) {
    return true
  }
  if (!item1.apiData && item2.apiData) {
    return false
  }

  // 両方APIデータがある場合は、より詳細なデータを持つ方を優先
  if (item1.apiData && item2.apiData) {
    const dataKeys1 = Object.keys(item1.apiData).length
    const dataKeys2 = Object.keys(item2.apiData).length

    if (dataKeys1 > dataKeys2) return true
    if (dataKeys1 < dataKeys2) return false
  }

  // カテゴリの優先順位で決定
  return (priorityOrder[category1] || 999) <= (priorityOrder[category2] || 999)
}
