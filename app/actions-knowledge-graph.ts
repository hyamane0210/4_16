"use server"

import { searchEntities, convertToRecommendationItem, determineCategory } from "@/services/knowledge-graph-service"
import type { RecommendationsData } from "@/components/recommendations"
import { recommendationsDatabase, getRecommendations } from "@/app/actions"

/**
 * Knowledge Graph APIを使用して推薦データを取得する
 */
export async function getKnowledgeGraphRecommendations(searchTerm: string): Promise<RecommendationsData> {
  try {
    // まず既存のデータベースから検索
    const existingData = await getRecommendations(searchTerm)

    // 既存のデータベースに結果がある場合はそれを返す
    const hasResults = Object.values(existingData).some((items) => items.length > 0)
    if (hasResults && searchTerm in recommendationsDatabase) {
      return existingData
    }

    // Knowledge Graph APIから検索
    const entities = await searchEntities(searchTerm, [], 20)

    if (entities.length === 0) {
      // エンティティが見つからない場合はデフォルトの推薦を返す
      return existingData
    }

    // エンティティをカテゴリ別に分類
    const categorizedItems: RecommendationsData = {
      artists: [],
      celebrities: [],
      media: [],
      fashion: [],
    }

    entities.forEach((entity) => {
      const category = determineCategory(entity)
      const item = convertToRecommendationItem(entity)

      if (categorizedItems[category]) {
        categorizedItems[category].push(item)
      } else {
        // 未知のカテゴリの場合はcelebritiesに追加
        categorizedItems.celebrities.push(item)
      }
    })

    // 既存のデータとマージ
    const mergedData: RecommendationsData = {
      artists: [...categorizedItems.artists, ...existingData.artists.slice(0, 5 - categorizedItems.artists.length)],
      celebrities: [
        ...categorizedItems.celebrities,
        ...existingData.celebrities.slice(0, 5 - categorizedItems.celebrities.length),
      ],
      media: [...categorizedItems.media, ...existingData.media.slice(0, 5 - categorizedItems.media.length)],
      fashion: [...categorizedItems.fashion, ...existingData.fashion.slice(0, 5 - categorizedItems.fashion.length)],
    }

    return mergedData
  } catch (error) {
    console.error("Error getting Knowledge Graph recommendations:", error)
    // エラー時は既存の推薦を返す
    return getRecommendations(searchTerm)
  }
}
