import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get("image") as File

    if (!imageFile) {
      return NextResponse.json({ error: "画像ファイルが見つかりません" }, { status: 400 })
    }

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
    const apiToken = process.env.CLOUDFLARE_API_TOKEN

    if (!accountId || !apiToken) {
      return NextResponse.json({ error: "Cloudflare認証情報が設定されていません" }, { status: 500 })
    }

    // Cloudflare ImagesにアップロードするためのAPIリクエスト
    const uploadFormData = new FormData()
    uploadFormData.append("file", imageFile)

    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
      body: uploadFormData,
    })

    const result = await response.json()

    if (!result.success) {
      console.error("Cloudflare Images upload failed:", result.errors)
      return NextResponse.json({ error: "アップロードに失敗しました" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      imageId: result.result.id,
      variants: result.result.variants,
    })
  } catch (error) {
    console.error("Error uploading to Cloudflare Images:", error)
    return NextResponse.json({ error: "画像アップロード中にエラーが発生しました" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "URLパラメータが必要です" }, { status: 400 })
  }

  try {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
    const apiToken = process.env.CLOUDFLARE_API_TOKEN

    if (!accountId || !apiToken) {
      return NextResponse.json({ error: "Cloudflare認証情報が設定されていません" }, { status: 500 })
    }

    // 外部URLから画像を取得
    const imageResponse = await fetch(url)
    const imageBlob = await imageResponse.blob()

    // Cloudflare ImagesにアップロードするためのAPIリクエスト
    const uploadFormData = new FormData()
    uploadFormData.append("file", imageBlob)

    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
      body: uploadFormData,
    })

    const result = await response.json()

    if (!result.success) {
      console.error("Cloudflare Images upload failed:", result.errors)
      return NextResponse.json({ error: "アップロードに失敗しました" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      imageId: result.result.id,
      variants: result.result.variants,
    })
  } catch (error) {
    console.error("Error processing external image:", error)
    return NextResponse.json({ error: "外部画像の処理中にエラーが発生しました" }, { status: 500 })
  }
}
