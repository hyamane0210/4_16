import { type NextRequest, NextResponse } from "next/server"
import { getCategoryRecommendations, getRelatedCategoryItems } from "@/app/actions-category"

export async function POST(request: NextRequest) {
  try {
    // URLからクエリパラメータを取得
    const searchParams = request.nextUrl.searchParams
    const categoryType = searchParams.get("type")
    const searchTerm = searchParams.get("q")

    if (!categoryType || !searchTerm) {
      return NextResponse.json({ error: "Category type and search term are required" }, { status: 400 })
    }

    // リクエストボディから検索履歴を取得
    const { searchHistory = [] } = await request.json()

    // カテゴリーデータを取得
    const [items, relatedItems] = await Promise.all([
      getCategoryRecommendations(categoryType, searchTerm, searchHistory),
      getRelatedCategoryItems(categoryType, searchTerm),
    ])

    return NextResponse.json({
      items,
      relatedItems,
    })
  } catch (error) {
    console.error("Error in category API route:", error)
    return NextResponse.json({ error: "Failed to fetch category data" }, { status: 500 })
  }
}
