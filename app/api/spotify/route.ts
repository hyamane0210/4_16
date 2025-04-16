import { type NextRequest, NextResponse } from "next/server"
import { getArtistByName, getRelatedArtists, getArtistTopTracks } from "@/services/spotify-service"

export async function GET(request: NextRequest) {
  // URLからクエリパラメータを取得
  const searchParams = request.nextUrl.searchParams
  const artistName = searchParams.get("artist")

  if (!artistName) {
    return NextResponse.json({ error: "Artist name is required" }, { status: 400 })
  }

  try {
    // アーティスト情報を取得
    const artist = await getArtistByName(artistName)

    if (!artist) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 })
    }

    // 関連アーティストとトップトラックを並行して取得
    const [relatedArtistsResult, topTracksResult] = await Promise.allSettled([
      getRelatedArtists(artist.id).catch(() => ({ artists: [] })),
      getArtistTopTracks(artist.id).catch(() => ({ tracks: [] })),
    ])

    // レスポンスデータを構築
    const response = {
      artist,
      relatedArtists: relatedArtistsResult.status === "fulfilled" ? relatedArtistsResult.value?.artists || [] : [],
      topTracks: topTracksResult.status === "fulfilled" ? topTracksResult.value?.tracks || [] : [],
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in Spotify API route:", error)

    // エラーメッセージを取得
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch artist data"

    // レート制限エラーの場合は429ステータスコードを返す
    if (errorMessage.includes("rate limit") || errorMessage.includes("Too Many")) {
      return NextResponse.json({ error: "API rate limit exceeded. Please try again later." }, { status: 429 })
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
