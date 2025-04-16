/**
 * Spotify APIとの連携を行うサービスクラス
 */

// アクセストークンの型定義
interface SpotifyToken {
  access_token: string
  token_type: string
  expires_in: number
  expiry_time?: number
}

// アーティスト情報の型定義
export interface SpotifyArtist {
  id: string
  name: string
  genres: string[]
  popularity: number
  images: { url: string; height: number; width: number }[]
  external_urls: { spotify: string }
  followers: { total: number }
}

// 関連アーティスト情報の型定義
export interface RelatedArtists {
  artists: SpotifyArtist[]
}

// トップトラック情報の型定義
export interface TopTracks {
  tracks: {
    id: string
    name: string
    album: {
      name: string
      images: { url: string; height: number; width: number }[]
    }
    external_urls: { spotify: string }
    preview_url: string | null
  }[]
}

// キャッシュ用のマップ
const artistCache = new Map<string, SpotifyArtist>()
const relatedArtistsCache = new Map<string, RelatedArtists>()
const topTracksCache = new Map<string, TopTracks>()

// トークンを保持する変数
let spotifyToken: SpotifyToken | null = null
let tokenRetryCount = 0
const MAX_TOKEN_RETRY = 3
const TOKEN_RETRY_DELAY = 5000 // 5秒待機

// APIが利用可能かどうかを示すフラグ
let isSpotifyApiAvailable = true

/**
 * Spotify APIのアクセストークンを取得する
 */
async function getSpotifyToken(): Promise<string> {
  // APIが利用不可の場合は早期リターン
  if (!isSpotifyApiAvailable) {
    throw new Error("Spotify API is not available")
  }

  // トークンが存在し、有効期限内であれば再利用
  if (spotifyToken && spotifyToken.expiry_time && spotifyToken.expiry_time > Date.now()) {
    return spotifyToken.access_token
  }

  // 環境変数からクライアントIDとシークレットを取得
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    console.warn("Spotify API credentials are not set in environment variables")
    isSpotifyApiAvailable = false
    throw new Error("Spotify API credentials are not set")
  }

  // リトライカウントをチェック
  if (tokenRetryCount >= MAX_TOKEN_RETRY) {
    console.warn("Max token retry count reached, marking API as unavailable")
    isSpotifyApiAvailable = false
    // リトライカウントをリセット
    tokenRetryCount = 0
    throw new Error("Max token retry count reached")
  }

  try {
    // Base64エンコードされた認証情報を作成
    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

    // トークンを取得するためのリクエスト
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    })

    if (!response.ok) {
      // レスポンスのステータスコードとテキストを取得
      const statusText = response.statusText
      const status = response.status
      const responseText = await response.text()

      // レート制限エラーの場合
      if (status === 429) {
        tokenRetryCount++
        console.warn(`Rate limit exceeded (${tokenRetryCount}/${MAX_TOKEN_RETRY}), retrying in ${TOKEN_RETRY_DELAY}ms`)

        // Retry-Afterヘッダーがあれば、その値を使用
        const retryAfter = response.headers.get("Retry-After")
        const retryDelay = retryAfter ? Number.parseInt(retryAfter) * 1000 : TOKEN_RETRY_DELAY

        // 待機してから再試行
        await new Promise((resolve) => setTimeout(resolve, retryDelay))
        return getSpotifyToken() // 再帰的に再試行
      }

      // 認証エラーの場合、APIを利用不可としてマーク
      if (status === 400 || status === 401) {
        console.error(`Authentication error: ${status} ${statusText} - ${responseText}`)
        isSpotifyApiAvailable = false
        throw new Error(`Failed to get Spotify token: ${status} ${statusText} - ${responseText}`)
      }

      throw new Error(`Failed to get Spotify token: ${status} ${statusText} - ${responseText}`)
    }

    // レスポンスをJSONとしてパース
    const data = await response.json()

    // 有効期限を計算して保存（10秒のマージンを設ける）
    data.expiry_time = Date.now() + (data.expires_in - 10) * 1000
    spotifyToken = data
    tokenRetryCount = 0 // 成功したらリトライカウントをリセット

    return data.access_token
  } catch (error) {
    console.error("Error getting Spotify token:", error)
    tokenRetryCount++

    if (tokenRetryCount < MAX_TOKEN_RETRY) {
      console.warn(`Token fetch failed (${tokenRetryCount}/${MAX_TOKEN_RETRY}), retrying in ${TOKEN_RETRY_DELAY}ms`)
      await new Promise((resolve) => setTimeout(resolve, TOKEN_RETRY_DELAY))
      return getSpotifyToken() // 再帰的に再試行
    }

    // 最大リトライ回数に達した場合、APIを利用不可としてマーク
    isSpotifyApiAvailable = false
    throw error
  }
}

/**
 * Spotify APIを使用してアーティストを検索する
 */
export async function searchArtists(query: string, limit = 5): Promise<SpotifyArtist[]> {
  // APIが利用不可の場合は空配列を返す
  if (!isSpotifyApiAvailable) {
    console.warn("Spotify API is not available, returning empty results")
    return []
  }

  try {
    const token = await getSpotifyToken()

    // 検索クエリをURLエンコード
    const encodedQuery = encodeURIComponent(query)

    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodedQuery}&type=artist&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const status = response.status
      const statusText = response.statusText

      // レート制限エラーの場合
      if (status === 429) {
        console.warn("Search rate limit exceeded, returning empty results")
        return []
      }

      throw new Error(`Failed to search artists: ${status} ${statusText}`)
    }

    const data = await response.json()
    return data.artists.items
  } catch (error) {
    console.error("Error searching artists:", error)
    return []
  }
}

/**
 * アーティストIDからアーティスト情報を取得する
 */
export async function getArtist(artistId: string): Promise<SpotifyArtist | null> {
  // APIが利用不可の場合はnullを返す
  if (!isSpotifyApiAvailable) {
    console.warn("Spotify API is not available, returning null")
    return null
  }

  // キャッシュをチェック
  if (artistCache.has(artistId)) {
    return artistCache.get(artistId) || null
  }

  try {
    const token = await getSpotifyToken()

    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "Mozilla/5.0 (compatible; MyApp/1.0)",
      },
      next: { revalidate: 3600 }, // 1時間キャッシュ
    })

    if (!response.ok) {
      const status = response.status
      const statusText = response.statusText

      // レート制限エラーの場合
      if (status === 429) {
        console.warn("Artist fetch rate limit exceeded, returning null")
        return null
      }

      throw new Error(`Failed to get artist: ${status} ${statusText}`)
    }

    const artist = await response.json()

    // 画像URLが存在することを確認
    if (artist && artist.images && artist.images.length > 0) {
      // 画像が存在することを確認
      console.log(`Artist ${artist.name} has ${artist.images.length} images`)
    } else {
      console.warn(`Artist ${artist.name} has no images`)
    }

    // キャッシュに保存
    artistCache.set(artistId, artist)

    return artist
  } catch (error) {
    console.error("Error getting artist:", error)
    return null
  }
}

/**
 * アーティスト名からアーティスト情報を取得する
 */
export async function getArtistByName(artistName: string): Promise<SpotifyArtist | null> {
  // APIが利用不可の場合はnullを返す
  if (!isSpotifyApiAvailable) {
    console.warn("Spotify API is not available, returning null for artist:", artistName)
    return null
  }

  try {
    // キャッシュキーを生成（アーティスト名を小文字に変換）
    const cacheKey = artistName.toLowerCase()

    // キャッシュをチェック（名前ベースの簡易キャッシュ）
    for (const [id, artist] of artistCache.entries()) {
      if (artist.name.toLowerCase() === cacheKey) {
        return artist
      }
    }

    const artists = await searchArtists(artistName, 1)
    if (artists.length > 0) {
      const artist = await getArtist(artists[0].id)
      return artist
    }
    return null
  } catch (error) {
    console.error("Error getting artist by name:", error)
    return null
  }
}

/**
 * アーティストの関連アーティストを取得する
 */
export async function getRelatedArtists(artistId: string): Promise<RelatedArtists | null> {
  // APIが利用不可の場合は空の関連アーティスト配列を返す
  if (!isSpotifyApiAvailable) {
    console.warn("Spotify API is not available, returning empty related artists")
    return { artists: [] }
  }

  // キャッシュをチェック
  if (relatedArtistsCache.has(artistId)) {
    return relatedArtistsCache.get(artistId) || null
  }

  try {
    const token = await getSpotifyToken()

    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/related-artists`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      console.error(`Failed to get related artists: ${response.status} ${response.statusText}`)
      // エラーの場合は空の関連アーティスト配列を返す
      return { artists: [] }
    }

    const relatedArtists = await response.json()

    // キャッシュに保存
    relatedArtistsCache.set(artistId, relatedArtists)

    return relatedArtists
  } catch (error) {
    console.error("Error getting related artists:", error)
    // エラーの場合は空の関連アーティスト配列を返す
    return { artists: [] }
  }
}

/**
 * アーティストのトップトラックを取得する
 */
export async function getArtistTopTracks(artistId: string, market = "JP"): Promise<TopTracks | null> {
  // APIが利用不可の場合は空のトップトラック配列を返す
  if (!isSpotifyApiAvailable) {
    console.warn("Spotify API is not available, returning empty top tracks")
    return { tracks: [] }
  }

  // キャッシュキーを生成
  const cacheKey = `${artistId}_${market}`
  if (topTracksCache.has(cacheKey)) {
    return topTracksCache.get(cacheKey) || null
  }

  try {
    const token = await getSpotifyToken()

    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=${market}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      // レート制限エラーの場合
      if (response.status === 429) {
        console.warn("Top tracks fetch rate limit exceeded, returning null")
        return { tracks: [] }
      }

      throw new Error(`Failed to get top tracks: ${response.statusText}`)
    }

    const topTracks = await response.json()

    // キャッシュに保存
    topTracksCache.set(cacheKey, topTracks)

    return topTracks
  } catch (error) {
    console.error("Error getting top tracks:", error)
    return { tracks: [] }
  }
}
