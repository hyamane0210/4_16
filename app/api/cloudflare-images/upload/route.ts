import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { url, id, proxyUrl } = await request.json()

    if (!url || !id) {
      return NextResponse.json({ error: "URL and ID are required" }, { status: 400 })
    }

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
    const apiToken = process.env.CLOUDFLARE_API_TOKEN

    if (!accountId || !apiToken) {
      return NextResponse.json({ error: "Cloudflare credentials not configured" }, { status: 500 })
    }

    // 画像をフェッチ（プロキシURLがあれば使用）
    const imageUrl = proxyUrl || url
    console.log(`Fetching image from: ${imageUrl}`)

    const imageResponse = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!imageResponse.ok) {
      console.error(`Failed to fetch image: ${imageResponse.status}`)
      return NextResponse.json({ error: "Failed to fetch image" }, { status: 502 })
    }

    const imageBuffer = await imageResponse.arrayBuffer()

    // Cloudflare Imagesにアップロード
    const formData = new FormData()
    formData.append("file", new Blob([imageBuffer]), id)
    formData.append("id", id)

    const uploadResponse = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
      body: formData,
    })

    const result = await uploadResponse.json()

    if (!uploadResponse.ok) {
      console.error("Cloudflare upload error:", result)
      return NextResponse.json({ error: "Failed to upload image to Cloudflare" }, { status: 502 })
    }

    // 成功した場合、Cloudflare画像URLを返す
    const deliveryUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_DELIVERY_URL || ""
    // URLからhttps://を削除（もし含まれていれば）
    const cleanDeliveryUrl = deliveryUrl.replace(/^https?:\/\//, "")
    const cloudflareUrl = `https://${cleanDeliveryUrl}/${id}/public`

    return NextResponse.json({
      success: true,
      id,
      url: cloudflareUrl,
    })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
