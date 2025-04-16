import { type NextRequest, NextResponse } from "next/server"
import { searchEntities, convertToRecommendationItem, determineCategory } from "@/services/knowledge-graph-service"
import type { RecommendationsData } from "@/components/recommendations"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
    }

    // エンティティを検索
    const entities = await searchEntities(query, [], 20)

    if (entities.length === 0) {
      return NextResponse.json({
        message: "No entities found",
        data: {
          artists: [],
          celebrities: [],
          media: [],
          fashion: [],
        } as RecommendationsData,
      })
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

    return NextResponse.json({
      message: "Entities retrieved successfully",
      data: categorizedItems,
    })
  } catch (error) {
    console.error("Error in Knowledge Graph API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
