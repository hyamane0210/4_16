import { type NextRequest, NextResponse } from "next/server"

// 許可されたドメインのリストを拡張
const ALLOWED_DOMAINS = [
  "image.tmdb.org",
  "i.scdn.co",
  "www.universal-music.co.jp",
  "ibighit.com",
  "www.taylorswift.com",
  "www.billieeilish.com",
  "yorushika.com",
  "radwimps.jp",
  "www.aimyong.net",
  "www.horipro.co.jp",
  "www.hoshinogen.com",
  "www.kiminona.com",
  "www.tenkinoko.com",
  "sing-movie.jp",
  "www.kimiuso.jp",
  "www.fujitv.co.jp",
  "www.uniqlo.com",
  "www.gu-global.com",
  "www.beams.co.jp",
  "www.urban-research.jp",
  "studious.co.jp",
  "reissuerecords.net",
  "kinggnu.jp",
  "sudamasaki-official.com",
  "shingeki.tv",
  "jujutsukaisen.jp",
  "kimetsu.com",
  "www.ghibli.jp",
  "www.netflix.com",
  // 追加のドメイン
  "www.gucci.com",
  "gucci.com",
  "www.amazon.com",
  "www.ebay.com",
  "www.rakuten.co.jp",
  "www.zara.com",
  // 一般的な画像ホスティングサービス
  "images.unsplash.com",
  "unsplash.com",
  "img.youtube.com",
  "i.ytimg.com",
  "pbs.twimg.com",
  "abs.twimg.com",
  "cdn.pixabay.com",
  "pixabay.com",
  "images.pexels.com",
  "pexels.com",
  "res.cloudinary.com",
  "cloudinary.com",
  "media.giphy.com",
  "giphy.com",
  "imgur.com",
  "i.imgur.com",
  "flickr.com",
  "live.staticflickr.com",
  "staticflickr.com",
  // Spotify関連のドメインを追加
  "platform-lookaside.fbsbx.com",
  "mosaic.scdn.co",
  "scdn.co",
  "dailymix-images.scdn.co",
  "lineup-images.scdn.co",
  "thisis-images.scdn.co",
  "seeded-session-images.scdn.co",
  "seed-mix-image.spotifycdn.com",
  "spotifycdn.com",
  "charts-images.scdn.co",
  "daily-mix.scdn.co",
  "newjams-images.scdn.co",
  "t.scdn.co",
  "wrapped-images.spotifycdn.com",
  "wrapped-images.scdn.co",
  // Wikidata/Wikipedia関連のドメインを追加
  "upload.wikimedia.org",
  "commons.wikimedia.org",
  "www.wikidata.org",
  "wikidata.org",
  "wikipedia.org",
  "ja.wikipedia.org",
  "en.wikipedia.org",
  // 芸能人/インフルエンサー関連のドメイン
  "www.instagram.com",
  "instagram.com",
  "scontent.cdninstagram.com",
  "scontent-nrt1-1.cdninstagram.com",
  "www.twitter.com",
  "twitter.com",
  "pbs.twimg.com",
  "www.facebook.com",
  "facebook.com",
  "graph.facebook.com",
  "platform-lookaside.fbsbx.com",
  "www.tiktok.com",
  "tiktok.com",
  "p16-sign-sg.tiktokcdn.com",
  "p16-sign-va.tiktokcdn.com",
  // 芸能事務所のドメイン
  "www.johnny-associates.co.jp",
  "www.ldh-inc.co.jp",
  "www.avex.com",
  "www.sonymusic.co.jp",
  "www.jvcmusic.co.jp",
  "www.watanabepro.co.jp",
  "www.yoshimoto.co.jp",
  "www.amuse.co.jp",
  "www.up-front-works.jp",
  "www.stardust.co.jp",
  "www.oricon.co.jp",
  "www.vogue.co.jp",
  "www.elle.com",
  "www.cosmopolitan.com",
]

// 直接アクセスするドメインのリスト（プロキシを使用しない）
const DIRECT_ACCESS_DOMAINS = [
  "i.scdn.co", // Spotify画像
  "image.tmdb.org", // TMDb画像
]

// 問題のあるドメインのリスト
const PROBLEMATIC_DOMAINS = ["off---white.com", "www.off---white.com", "white.com", "www.white.com"]

// ドメイン別のカスタムヘッダーを更新
const DOMAIN_HEADERS: Record<string, HeadersInit> = {
  "i.scdn.co": {
    Referer: "https://open.spotify.com/",
    Origin: "https://open.spotify.com",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,ja;q=0.8",
    "sec-ch-ua": '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "image",
    "sec-fetch-mode": "no-cors",
    "sec-fetch-site": "cross-site",
  },
  "scdn.co": {
    Referer: "https://open.spotify.com/",
    Origin: "https://open.spotify.com",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,ja;q=0.8",
  },
  "spotifycdn.com": {
    Referer: "https://open.spotify.com/",
    Origin: "https://open.spotify.com",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,ja;q=0.8",
  },
  "www.gucci.com": {
    Referer: "https://www.gucci.com/",
    Origin: "https://www.gucci.com",
    "sec-ch-ua": '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "image",
    "sec-fetch-mode": "no-cors",
    "sec-fetch-site": "same-origin",
    Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
  },
  "gucci.com": {
    Referer: "https://www.gucci.com/",
    Origin: "https://www.gucci.com",
    "sec-ch-ua": '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "image",
    "sec-fetch-mode": "no-cors",
    "sec-fetch-site": "same-origin",
    Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
  },
  // Wikimedia Commons用のヘッダー
  "upload.wikimedia.org": {
    Referer: "https://commons.wikimedia.org/",
    Origin: "https://commons.wikimedia.org",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,ja;q=0.8",
  },
  "commons.wikimedia.org": {
    Referer: "https://commons.wikimedia.org/",
    Origin: "https://commons.wikimedia.org",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,ja;q=0.8",
  },
  // Instagram用のヘッダー
  "instagram.com": {
    Referer: "https://www.instagram.com/",
    Origin: "https://www.instagram.com",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,ja;q=0.8",
    "sec-fetch-dest": "image",
    "sec-fetch-mode": "no-cors",
    "sec-fetch-site": "cross-site",
  },
  "scontent.cdninstagram.com": {
    Referer: "https://www.instagram.com/",
    Origin: "https://www.instagram.com",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,ja;q=0.8",
    "sec-fetch-dest": "image",
    "sec-fetch-mode": "no-cors",
    "sec-fetch-site": "cross-site",
  },
}

// デフォルトのヘッダー
const DEFAULT_HEADERS: HeadersInit = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
  Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9,ja;q=0.8",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
}

// リクエストキャッシュ
const requestCache = new Map<string, { timestamp: number; attempts: number }>()

// GET関数内のSpotify画像処理部分を修正
export async function GET(request: NextRequest) {
  let imageUrl: string | null = null
  try {
    const { searchParams } = new URL(request.url)
    imageUrl = searchParams.get("url")

    const forceBypass = searchParams.get("bypass") === "true"

    if (!imageUrl) {
      return new NextResponse("Missing URL parameter", { status: 400 })
    }

    // URLの形式を検証
    let url: URL
    try {
      url = new URL(imageUrl)
    } catch (e) {
      console.error(`Invalid URL: ${imageUrl}`, e)
      return NextResponse.redirect("/placeholder.svg?height=400&width=400", 302)
    }

    const domain = url.hostname

    // 問題のあるドメインの場合はプレースホルダーを返す
    if (PROBLEMATIC_DOMAINS.some((d) => domain.includes(d))) {
      console.warn(`Problematic domain detected: ${domain}`)
      return NextResponse.redirect("/placeholder.svg?height=400&width=400", 302)
    }

    // リクエスト制限のチェック
    const cacheKey = imageUrl
    const now = Date.now()
    const cachedData = requestCache.get(cacheKey)

    if (cachedData) {
      // 1分以内に3回以上リクエストされた場合はブロック
      if (now - cachedData.timestamp < 60000 && cachedData.attempts >= 3) {
        console.warn(`Rate limit exceeded for: ${imageUrl}`)
        return NextResponse.redirect("/placeholder.svg?height=400&width=400", 302)
      }

      // 試行回数を更新
      cachedData.attempts += 1
      requestCache.set(cacheKey, cachedData)
    } else {
      // 新しいエントリを作成
      requestCache.set(cacheKey, { timestamp: now, attempts: 1 })
    }

    // ドメインが許可リストにあるか確認（bypassフラグがない場合）
    if (!forceBypass && !ALLOWED_DOMAINS.includes(domain)) {
      console.warn(`Domain not allowed: ${domain}`)
      return NextResponse.redirect("/placeholder.svg?height=400&width=400", 302)
    }

    // ドメイン別のカスタムヘッダーを取得
    let headers: HeadersInit = { ...DEFAULT_HEADERS }

    // 特定のドメイン用のヘッダーを追加
    if (DOMAIN_HEADERS[domain]) {
      headers = { ...headers, ...DOMAIN_HEADERS[domain] }
    } else {
      // 一般的なドメイン用のヘッダー
      headers["Referer"] = `https://${domain}/`
      headers["Origin"] = `https://${domain}`
    }

    // Gucciの画像の場合、特別な処理
    if (domain.includes("gucci.com")) {
      // Gucciの画像は直接返す（プロキシを使用しない）
      return NextResponse.redirect(imageUrl, 302)
    }

    // Wikimedia Commonsの画像の場合、特別な処理
    if (domain.includes("wikimedia.org")) {
      // キャッシュバスティングのためのタイムスタンプを追加
      const timestamp = Date.now()
      const separator = imageUrl.includes("?") ? "&" : "?"
      const urlWithTimestamp = `${imageUrl}${separator}_t=${timestamp}`

      try {
        const response = await fetch(urlWithTimestamp, {
          headers,
          cache: "no-store", // キャッシュを無効化
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch Wikimedia image: ${response.status}`)
        }

        const contentType = response.headers.get("Content-Type") || "image/jpeg"
        const imageData = await response.arrayBuffer()

        // レスポンスヘッダーを設定
        const responseHeaders = new Headers()
        responseHeaders.set("Content-Type", contentType)
        responseHeaders.set("Cache-Control", "public, max-age=86400") // 1日間キャッシュ
        responseHeaders.set("Access-Control-Allow-Origin", "*")

        return new NextResponse(imageData, {
          headers: responseHeaders,
          status: 200,
        })
      } catch (wikimediaError) {
        console.error(`Wikimedia image fetch error for ${imageUrl}:`, wikimediaError)
        // エラー時はプレースホルダーを返す
        return NextResponse.redirect("/placeholder.svg?height=400&width=400", 302)
      }
    }

    // Spotifyの画像の場合、特別な処理
    if (domain.includes("scdn.co") || domain.includes("spotifycdn.com")) {
      // キャッシュバスティングのためのタイムスタンプを追加
      const timestamp = Date.now()
      const separator = imageUrl.includes("?") ? "&" : "?"
      const urlWithTimestamp = `${imageUrl}${separator}_t=${timestamp}`

      // 直接リダイレクトする代わりに、フェッチして返す
      try {
        const response = await fetch(urlWithTimestamp, {
          headers,
          cache: "no-store", // キャッシュを無効化
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch Spotify image: ${response.status}`)
        }

        const contentType = response.headers.get("Content-Type") || "image/jpeg"
        const imageData = await response.arrayBuffer()

        // レスポンスヘッダーを設定
        const responseHeaders = new Headers()
        responseHeaders.set("Content-Type", contentType)
        responseHeaders.set("Cache-Control", "no-cache, no-store, must-revalidate")
        responseHeaders.set("Pragma", "no-cache")
        responseHeaders.set("Expires", "0")
        responseHeaders.set("Access-Control-Allow-Origin", "*")

        return new NextResponse(imageData, {
          headers: responseHeaders,
          status: 200,
        })
      } catch (spotifyError) {
        console.error(`Spotify image fetch error for ${imageUrl}:`, spotifyError)
        // エラー時は元のURLに直接リダイレクト
        return NextResponse.redirect(imageUrl, 302)
      }
    }

    // タイムアウト設定
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5秒でタイムアウト

    try {
      // 画像をフェッチ
      const response = await fetch(imageUrl, {
        headers,
        cache: "force-cache",
        signal: controller.signal,
      })

      clearTimeout(timeoutId) // タイムアウトをクリア

      if (!response.ok) {
        console.error(`Failed to fetch image: ${response.status} ${response.statusText} for URL: ${imageUrl}`)

        // 404エラーの場合、プレースホルダー画像を返す
        if (response.status === 404) {
          return NextResponse.redirect("/placeholder.svg?height=400&width=400", 302)
        }

        return NextResponse.redirect("/placeholder.svg?height=400&width=400", 302)
      }

      // 画像のContent-Typeを取得
      const contentType = response.headers.get("Content-Type") || "image/jpeg"

      // 画像データを取得
      const imageData = await response.arrayBuffer()

      // レスポンスヘッダーを設定
      const responseHeaders = new Headers()
      responseHeaders.set("Content-Type", contentType)
      responseHeaders.set("Cache-Control", "public, max-age=86400") // 1日間キャッシュ
      responseHeaders.set("Access-Control-Allow-Origin", "*")

      return new NextResponse(imageData, {
        headers: responseHeaders,
        status: 200,
      })
    } catch (fetchError) {
      clearTimeout(timeoutId) // タイムアウトをクリア
      console.error(`Fetch error for ${imageUrl}:`, fetchError)

      // エラー時はプレースホルダー画像を返す
      return NextResponse.redirect("/placeholder.svg?height=400&width=400", 302)
    }
  } catch (error) {
    console.error("Image proxy error:", error)
    // エラー時はプレースホルダー画像を返す
    return NextResponse.redirect("/placeholder.svg?height=400&width=400", 302)
  }
}
