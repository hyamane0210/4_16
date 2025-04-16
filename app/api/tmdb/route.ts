import { type NextRequest, NextResponse } from "next/server"
import { getMediaByName, getCredits, getSimilar } from "@/services/tmdb-service"

export async function GET(request: NextRequest) {
  // URLからクエリパラメータを取得
  const searchParams = request.nextUrl.searchParams
  const mediaName = searchParams.get("name")

  if (!mediaName) {
    return NextResponse.json({ error: "Media name is required" }, { status: 400 })
  }

  try {
    // 映画またはテレビ番組の情報を取得
    const { item, type } = await getMediaByName(mediaName)

    if (!item || !type) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 })
    }

    // クレジットと類似作品を並行して取得
    const [credits, similar] = await Promise.all([getCredits(item.id, type), getSimilar(item.id, type)])

    // レスポンスデータを構築
    const response = {
      media: item,
      type,
      credits: credits?.cast || [],
      similar: similar?.results || [],
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in TMDb API route:", error)
    return NextResponse.json({ error: "Failed to fetch media data" }, { status: 500 })
  }
}
