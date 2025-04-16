/**
 * データ拡張と関連データの動的生成を行うユーティリティ
 */

import type { RecommendationItem } from "@/components/recommendations"
import { preprocessQuery } from "./search-utils"
import { generateDynamicItems, inferCategory } from "./dynamic-data-generator"

// 関連キーワードのマッピング
const RELATED_KEYWORDS: Record<string, string[]> = {
  // 音楽ジャンル
  ポップ: ["J-POP", "K-POP", "ポップロック", "エレクトロポップ", "シンセポップ"],
  ロック: ["ハードロック", "オルタナティブロック", "パンク", "メタル", "インディーロック"],
  ヒップホップ: ["ラップ", "トラップ", "R&B", "ソウル", "ファンク"],
  ジャズ: ["ブルース", "ソウルジャズ", "フュージョン", "ビバップ", "スイング"],
  クラシック: ["オーケストラ", "ピアノ", "バイオリン", "オペラ", "交響曲"],

  // 映画ジャンル
  アクション: ["冒険", "スリラー", "スパイ", "マーベル", "バトル"],
  ドラマ: ["恋愛", "青春", "家族", "社会派", "伝記"],
  SF: ["ファンタジー", "宇宙", "未来", "ディストピア", "タイムトラベル"],
  ホラー: ["サスペンス", "心理", "オカルト", "ゾンビ", "超常現象"],
  コメディ: ["ロマンティックコメディ", "ブラックコメディ", "パロディ", "シチュエーションコメディ", "ドタバタ"],

  // ファッションスタイル
  カジュアル: ["ストリート", "アメカジ", "スポーツ", "デイリー", "リラックス"],
  フォーマル: ["ビジネス", "スーツ", "ドレス", "エレガント", "クラシック"],
  ストリート: ["アーバン", "ヒップホップ", "スケーター", "グラフィティ", "ストリートアート"],
  ヴィンテージ: ["レトロ", "古着", "アンティーク", "70年代", "80年代"],
  ミニマル: ["シンプル", "モノトーン", "北欧", "機能的", "洗練"],
}

/**
 * 検索キーワードから関連キーワードを生成する関数
 */
export function generateRelatedKeywords(query: string, maxKeywords = 5): string[] {
  const keywords = preprocessQuery(query)
  if (keywords.length === 0) return []

  const relatedKeywords: string[] = []

  // 各キーワードに対して関連キーワードを探す
  for (const keyword of keywords) {
    // 直接マッピングがある場合
    if (RELATED_KEYWORDS[keyword]) {
      relatedKeywords.push(...RELATED_KEYWORDS[keyword])
      continue
    }

    // 部分一致するマッピングを探す
    for (const [key, values] of Object.entries(RELATED_KEYWORDS)) {
      if (keyword.includes(key) || key.includes(keyword)) {
        relatedKeywords.push(...values)
        break
      }
    }
  }

  // 重複を排除して指定数まで絞り込む
  return [...new Set(relatedKeywords)].slice(0, maxKeywords)
}

/**
 * 関連キーワードを使って検索結果を拡張する関数
 */
export function expandWithRelatedKeywords(
  existingItems: RecommendationItem[],
  query: string,
  category: string,
  targetCount = 12,
): RecommendationItem[] {
  // 既存のアイテムが十分にある場合はそのまま返す
  if (existingItems.length >= targetCount) {
    return existingItems
  }

  // 関連キーワードを生成
  const relatedKeywords = generateRelatedKeywords(query)
  if (relatedKeywords.length === 0) {
    // 関連キーワードがない場合は元のクエリで生成
    const generatedItems = generateDynamicItems(query, category, targetCount - existingItems.length)
    return [...existingItems, ...generatedItems]
  }

  // 各関連キーワードで生成するアイテム数を計算
  const itemsPerKeyword = Math.ceil((targetCount - existingItems.length) / relatedKeywords.length)

  let expandedItems: RecommendationItem[] = [...existingItems]

  // 各関連キーワードでアイテムを生成
  for (const keyword of relatedKeywords) {
    if (expandedItems.length >= targetCount) break

    const remainingCount = targetCount - expandedItems.length
    const generatedItems = generateDynamicItems(keyword, category, Math.min(itemsPerKeyword, remainingCount))

    expandedItems = [...expandedItems, ...generatedItems]
  }

  return expandedItems
}

/**
 * 多様性を確保するためのデータ拡張関数
 */
export function expandWithDiversity(
  existingItems: RecommendationItem[],
  query: string,
  targetCount = 12,
): Record<string, RecommendationItem[]> {
  // クエリからカテゴリを推測
  const mainCategory = inferCategory(query) || "media"

  // 既存のアイテムをカテゴリごとに分類
  const categorizedItems: Record<string, RecommendationItem[]> = {
    artists: [],
    media: [],
    celebrities: [],
    fashion: [],
  }

  // 既存のアイテムを振り分け
  existingItems.forEach((item) => {
    const itemText = `${item.name} ${item.reason} ${item.features.join(" ")}`.toLowerCase()

    // カテゴリを推測
    let itemCategory = inferCategory(itemText)

    // 推測できない場合はメインカテゴリに分類
    if (!itemCategory) {
      itemCategory = mainCategory
    }

    if (categorizedItems[itemCategory]) {
      categorizedItems[itemCategory].push(item)
    } else {
      // 該当するカテゴリがない場合はメインカテゴリに追加
      categorizedItems[mainCategory].push(item)
    }
  })

  // 各カテゴリを拡張
  Object.keys(categorizedItems).forEach((category) => {
    // メインカテゴリは多めに生成
    const categoryTargetCount = category === mainCategory ? targetCount : Math.floor(targetCount / 2)

    if (categorizedItems[category].length < categoryTargetCount) {
      // 関連キーワードで拡張
      categorizedItems[category] = expandWithRelatedKeywords(
        categorizedItems[category],
        query,
        category,
        categoryTargetCount,
      )
    }
  })

  return categorizedItems
}
