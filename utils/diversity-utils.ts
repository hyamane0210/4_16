/**
 * 検索結果の多様性と重複排除を管理するユーティリティ
 */

import type { RecommendationItem } from "@/components/recommendations"
import { preprocessQuery } from "./search-utils"

/**
 * 類似度スコアを計算する関数
 * 0〜1の値を返し、1が完全一致、0が完全に異なることを示す
 */
export function calculateSimilarityScore(item1: RecommendationItem, item2: RecommendationItem): number {
  // 名前の類似度（完全一致の場合は高いスコア）
  if (item1.name.toLowerCase() === item2.name.toLowerCase()) {
    return 1.0
  }

  // テキスト特徴量を抽出
  const text1 = `${item1.name} ${item1.reason} ${item1.features.join(" ")}`.toLowerCase()
  const text2 = `${item2.name} ${item2.reason} ${item2.features.join(" ")}`.toLowerCase()

  // 単語の重複を計算
  const words1 = new Set(preprocessQuery(text1))
  const words2 = new Set(preprocessQuery(text2))

  // 共通の単語
  const intersection = new Set([...words1].filter((x) => words2.has(x)))

  // Jaccard類似度: 共通要素数 / 全要素数
  const union = new Set([...words1, ...words2])

  if (union.size === 0) return 0
  return intersection.size / union.size
}

/**
 * 重複アイテムを検出する関数
 * 類似度閾値を超えるアイテムを重複と見なす
 */
export function detectDuplicates(items: RecommendationItem[], similarityThreshold = 0.7): Map<number, number[]> {
  const duplicateGroups = new Map<number, number[]>()

  for (let i = 0; i < items.length; i++) {
    const duplicates: number[] = []

    for (let j = i + 1; j < items.length; j++) {
      const similarity = calculateSimilarityScore(items[i], items[j])
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
 * 重複を排除して多様性を確保する関数
 */
export function diversifyResults(
  items: RecommendationItem[],
  maxItems = 12,
  similarityThreshold = 0.7,
): RecommendationItem[] {
  if (items.length <= maxItems) return items

  // 重複グループを検出
  const duplicateGroups = detectDuplicates(items, similarityThreshold)

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
 * カテゴリ間の重複を排除する関数
 */
export function removeCrossCategoryDuplicates(
  data: Record<string, RecommendationItem[]>,
  similarityThreshold = 0.8,
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
          const similarity = calculateSimilarityScore(data[category1][idx1], data[category2][idx2])
          if (similarity >= similarityThreshold) {
            duplicatePairs.push([idx1, idx2])
          }
        }
      }

      // 重複を処理（優先度の高いカテゴリを保持）
      for (const [idx1, idx2] of duplicatePairs) {
        // 優先度を決定（例：メディアカテゴリを優先）
        const keepInCategory1 = shouldKeepInFirstCategory(category1, category2)

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
 * カテゴリの優先順位を決定する関数
 * 例：メディアカテゴリを優先する場合はtrueを返す
 */
function shouldKeepInFirstCategory(category1: string, category2: string): boolean {
  // カテゴリの優先順位を定義
  const priorityOrder: Record<string, number> = {
    media: 1, // 最優先
    artists: 2,
    celebrities: 3,
    fashion: 4, // 最低優先
  }

  return (priorityOrder[category1] || 999) <= (priorityOrder[category2] || 999)
}

/**
 * ユーザーの検索履歴に基づいて結果をパーソナライズする関数
 */
export function personalizeResults(
  items: RecommendationItem[],
  searchHistory: string[],
  maxBoost = 0.3,
): RecommendationItem[] {
  if (!searchHistory || searchHistory.length === 0) return items

  // 検索履歴からキーワードを抽出
  const historyKeywords = searchHistory.flatMap((term) => preprocessQuery(term))

  // 各アイテムにパーソナライズスコアを付与
  const scoredItems = items.map((item) => {
    const itemText = `${item.name} ${item.reason} ${item.features.join(" ")}`.toLowerCase()
    const itemKeywords = preprocessQuery(itemText)

    // 検索履歴との一致度を計算
    let matchScore = 0
    historyKeywords.forEach((keyword) => {
      if (itemKeywords.includes(keyword)) {
        matchScore += 1
      }
    })

    // 正規化スコア（0〜maxBoost）
    const normalizedScore = Math.min(matchScore / historyKeywords.length, 1) * maxBoost

    return {
      item,
      personalizedScore: normalizedScore,
    }
  })

  // スコアでソートして元の配列と同じ長さに切り詰める
  return scoredItems.sort((a, b) => b.personalizedScore - a.personalizedScore).map((scored) => scored.item)
}
