import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID parameter is required" }, { status: 400 })
    }

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
    const apiToken = process.env.CLOUDFLARE_API_TOKEN

    if (!accountId || !apiToken) {
      return NextResponse.json({ error: "Cloudflare credentials not configured" }, { status: 500 })
    }

    // Cloudflare Imagesで画像を検索
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1/search?search=${id}`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      },
    )

    const result = await response.json()

    if (!response.ok) {
      console.error("Cloudflare search error:", result)
      return NextResponse.json({ exists: false, error: "Failed to check image existence" }, { status: 502 })
    }

    // レスポンス構造を安全に確認
    console.log("Cloudflare search response:", JSON.stringify(result, null, 2))

    // 画像が存在するか確認（レスポンス構造を安全に処理）
    const images = result?.result?.images || []
    const exists = Array.isArray(images) && images.some((img: any) => img.id === id)

    if (exists) {
      const deliveryUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_DELIVERY_URL || ""
      // URLからhttps://を削除（もし含まれていれば）
      const cleanDeliveryUrl = deliveryUrl.replace(/^https?:\/\//, "")
      const cloudflareUrl = `https://${cleanDeliveryUrl}/${id}/public`
      return NextResponse.json({ exists: true, id, url: cloudflareUrl })
    }

    // 画像が見つからない場合は直接アップロードを促す
    return NextResponse.json({ exists: false })
  } catch (error) {
    console.error("Error checking image existence:", error)
    return NextResponse.json({ exists: false, error: "Internal server error" }, { status: 500 })
  }
}
