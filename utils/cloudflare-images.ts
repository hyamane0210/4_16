/**
 * 外部URLからCloudflare ImagesのIDを取得または生成する
 */
export async function getCloudflareImageId(url: string): Promise<string | null> {
  try {
    // キャッシュから確認（実装例）
    const cachedId = localStorage.getItem(`cf-img-${url}`)
    if (cachedId) {
      return cachedId
    }

    // APIを呼び出して画像をCloudflareにアップロード
    const response = await fetch(`/api/cloudflare-images?url=${encodeURIComponent(url)}`)
    const data = await response.json()

    if (!data.success) {
      console.error("Failed to upload image to Cloudflare:", data.error)
      return null
    }

    // キャッシュに保存
    localStorage.setItem(`cf-img-${url}`, data.imageId)

    return data.imageId
  } catch (error) {
    console.error("Error getting Cloudflare image ID:", error)
    return null
  }
}

/**
 * Cloudflare ImagesのURLを生成する
 */
export function getCloudflareImageUrl(imageId: string, variant = "public"): string {
  const deliveryUrl =
    process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_DELIVERY_URL || "imagedelivery.net/Wf_GgwhK_PzC4QW9XQv8Mw"
  return `https://${deliveryUrl}/${imageId}/${variant}`
}

/**
 * 外部URLをCloudflare Images URLに変換する
 * （非同期処理を避けたい場合のシンプルな実装）
 */
export function getCloudflareProxyUrl(url: string): string {
  // URLをbase64エンコード
  const encodedUrl = btoa(url)
  // 簡易的なハッシュ関数
  const hash = Array.from(encodedUrl)
    .reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) & 0xffffffff, 0)
    .toString(16)

  // ハッシュをIDとして使用
  return getCloudflareImageUrl(hash)
}
