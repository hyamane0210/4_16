/**
 * TMDb (The Movie Database) APIとの連携を行うサービスクラス
 */

// 既存のimportに追加
import { getTMDbImageUrl } from "@/utils/image-utils"

// 映画情報の型定義
export interface Movie {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genres: { id: number; name: string }[]
  runtime: number
  status: string
  tagline: string
  homepage: string
}

// テレビ番組情報の型定義
export interface TVShow {
  id: number
  name: string
  original_name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  vote_count: number
  genres: { id: number; name: string }[]
  episode_run_time: number[]
  number_of_seasons: number
  number_of_episodes: number
  status: string
  tagline: string
  homepage: string
  type: string
}

// 検索結果の型定義
export interface SearchResult {
  id: number
  media_type: "movie" | "tv" | "person"
  title?: string
  name?: string
  overview: string
  poster_path: string | null
  profile_path: string | null
  release_date?: string
  first_air_date?: string
  vote_average: number
}

// キャスト情報の型定義
export interface Cast {
  id: number
  name: string
  character: string
  profile_path: string | null
}

// クレジット情報の型定義
export interface Credits {
  cast: Cast[]
}

// 類似作品の型定義
export interface Similar {
  results: SearchResult[]
}

// キャッシュ用のマップ
const movieCache = new Map<number, Movie>()
const tvShowCache = new Map<number, TVShow>()
const searchCache = new Map<string, SearchResult[]>()
const creditsCache = new Map<string, Credits>()
const similarCache = new Map<string, Similar>()

/**
 * TMDb APIのベースURL
 */
const TMDB_API_BASE_URL = "https://api.themoviedb.org/3"

// APIキーの検証状態を追跡
let isApiKeyValidated = false
let validatedApiKey: string | null = null

/**
 * TMDb APIのAPIキーを取得し、検証する
 */
async function getValidatedApiKey(): Promise<string> {
  // 既に検証済みのAPIキーがある場合はそれを返す
  if (isApiKeyValidated && validatedApiKey) {
    return validatedApiKey
  }

  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) {
    throw new Error("TMDb API key is not set in environment variables")
  }

  // APIキーから余分なスペースや改行を削除
  const cleanedApiKey = apiKey.trim()

  // APIキーが有効かどうかを確認するための簡単なテスト
  try {
    console.log("Validating TMDb API key...")
    const testUrl = `${TMDB_API_BASE_URL}/configuration?api_key=${cleanedApiKey}`

    const response = await fetch(testUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("TMDb API key validation failed:", errorData)
      throw new Error(`Invalid TMDb API key: ${errorData.status_message || response.statusText}`)
    }

    // APIキーが有効であることを確認
    console.log("TMDb API key is valid")
    isApiKeyValidated = true
    validatedApiKey = cleanedApiKey
    return cleanedApiKey
  } catch (error) {
    console.error("Error validating TMDb API key:", error)

    // 開発環境では詳細なエラーメッセージを表示
    if (process.env.NODE_ENV === "development") {
      console.log("API Key (first 4 chars):", cleanedApiKey.substring(0, 4) + "...")
      console.log("API Key length:", cleanedApiKey.length)
    }

    throw new Error(`TMDb API key validation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// getImageUrl関数を更新
export function getImageUrl(path: string | null, size = "w500"): string {
  return getTMDbImageUrl(path, size)
}

/**
 * TMDb APIを使用して映画やテレビ番組を検索する
 */
export async function searchMedia(query: string, page = 1): Promise<SearchResult[]> {
  // キャッシュキーを生成
  const cacheKey = `${query}_${page}`

  // キャッシュをチェック
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey) || []
  }

  try {
    // 検証済みのAPIキーを取得
    const apiKey = await getValidatedApiKey()
    const encodedQuery = encodeURIComponent(query)

    const url = `${TMDB_API_BASE_URL}/search/multi?api_key=${apiKey}&query=${encodedQuery}&page=${page}&language=ja-JP&include_adult=false`

    console.log(`Fetching from TMDb: ${url.replace(apiKey, "API_KEY_HIDDEN")}`)

    const response = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("TMDb API error:", errorData)
      throw new Error(
        `TMDb API responded with status ${response.status}: ${errorData.status_message || response.statusText}`,
      )
    }

    const data = await response.json()

    // APIレスポンスの検証
    if (!data || !Array.isArray(data.results)) {
      console.error("Invalid TMDb API response:", data)
      return []
    }

    // 映画、テレビ番組、人物のみをフィルタリング
    const results = data.results.filter(
      (item: any) => item && (item.media_type === "movie" || item.media_type === "tv" || item.media_type === "person"),
    )

    // キャッシュに保存
    searchCache.set(cacheKey, results)

    return results
  } catch (error) {
    console.error(`Error searching media for "${query}":`, error)
    // エラーをスローせず、空の配列を返す
    return []
  }
}

/**
 * TMDb APIを使用して人物を検索する
 */
export async function searchPeople(query: string, page = 1): Promise<SearchResult[]> {
  try {
    // 検証済みのAPIキーを取得
    const apiKey = await getValidatedApiKey()
    const encodedQuery = encodeURIComponent(query)

    const url = `${TMDB_API_BASE_URL}/search/person?api_key=${apiKey}&query=${encodedQuery}&page=${page}&language=ja-JP&include_adult=false`

    console.log(`Fetching from TMDb: ${url.replace(apiKey, "API_KEY_HIDDEN")}`)

    const response = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("TMDb API error:", errorData)
      throw new Error(
        `TMDb API responded with status ${response.status}: ${errorData.status_message || response.statusText}`,
      )
    }

    const data = await response.json()

    // APIレスポンスの検証
    if (!data || !Array.isArray(data.results)) {
      console.error("Invalid TMDb API response:", data)
      return []
    }

    // 人物のみをフィルタリング
    const results = data.results.filter((item: any) => item && item.media_type === "person")

    return results
  } catch (error) {
    console.error(`Error searching people for "${query}":`, error)
    // エラーをスローせず、空の配列を返す
    return []
  }
}

/**
 * 人物IDから人物情報を取得する
 */
export async function getPerson(personId: number): Promise<SearchResult | null> {
  try {
    const apiKey = await getValidatedApiKey()

    const response = await fetch(`${TMDB_API_BASE_URL}/person/${personId}?api_key=${apiKey}&language=ja-JP`, {
      next: { revalidate: 86400 },
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get person: ${response.statusText}`)
    }

    const person = await response.json()
    return person
  } catch (error) {
    console.error("Error getting person:", error)
    return null
  }
}

/**
 * 映画名またはテレビ番組名から情報を取得する
 */
export async function getMediaByName(
  name: string,
): Promise<{ item: Movie | TVShow | null; type: "movie" | "tv" | null }> {
  try {
    if (!name || typeof name !== "string" || name.trim() === "") {
      console.warn("Invalid media name provided:", name)
      return { item: null, type: null }
    }

    console.log(`Searching for media: "${name}"`)
    const results = await searchMedia(name, 1)

    if (results && results.length > 0) {
      const firstResult = results[0]

      if (firstResult.media_type === "movie") {
        const movie = await getMovie(firstResult.id)
        return { item: movie, type: "movie" }
      } else if (firstResult.media_type === "tv") {
        const tvShow = await getTVShow(firstResult.id)
        return { item: tvShow, type: "tv" }
      }
    } else {
      console.log(`No results found for media: "${name}"`)
    }

    return { item: null, type: null }
  } catch (error) {
    console.error(`Error getting media by name "${name}":`, error)
    return { item: null, type: null }
  }
}

/**
 * 映画IDから映画情報を取得する
 */
export async function getMovie(movieId: number): Promise<Movie | null> {
  // キャッシュをチェック
  if (movieCache.has(movieId)) {
    return movieCache.get(movieId) || null
  }

  try {
    const apiKey = await getValidatedApiKey()

    const response = await fetch(
      `${TMDB_API_BASE_URL}/movie/${movieId}?api_key=${apiKey}&language=ja-JP&append_to_response=credits,similar`,
      {
        next: { revalidate: 86400 },
        headers: {
          Accept: "application/json",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to get movie: ${response.statusText}`)
    }

    const movie = await response.json()

    // キャッシュに保存
    movieCache.set(movieId, movie)

    return movie
  } catch (error) {
    console.error("Error getting movie:", error)
    return null
  }
}

/**
 * テレビ番組IDからテレビ番組情報を取得する
 */
export async function getTVShow(tvId: number): Promise<TVShow | null> {
  // キャッシュをチェック
  if (tvShowCache.has(tvId)) {
    return tvShowCache.get(tvId) || null
  }

  try {
    const apiKey = await getValidatedApiKey()

    const response = await fetch(
      `${TMDB_API_BASE_URL}/tv/${tvId}?api_key=${apiKey}&language=ja-JP&append_to_response=credits,similar`,
      {
        next: { revalidate: 86400 },
        headers: {
          Accept: "application/json",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to get TV show: ${response.statusText}`)
    }

    const tvShow = await response.json()

    // キャッシュに保存
    tvShowCache.set(tvId, tvShow)

    return tvShow
  } catch (error) {
    console.error("Error getting TV show:", error)
    return null
  }
}

/**
 * 映画またはテレビ番組のクレジット情報を取得する
 */
export async function getCredits(id: number, mediaType: "movie" | "tv"): Promise<Credits | null> {
  // キャッシュキーを生成
  const cacheKey = `${mediaType}_${id}`

  // キャッシュをチェック
  if (creditsCache.has(cacheKey)) {
    return creditsCache.get(cacheKey) || null
  }

  try {
    const apiKey = await getValidatedApiKey()

    const response = await fetch(`${TMDB_API_BASE_URL}/${mediaType}/${id}/credits?api_key=${apiKey}&language=ja-JP`, {
      next: { revalidate: 86400 },
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get credits: ${response.statusText}`)
    }

    const credits = await response.json()

    // キャッシュに保存
    creditsCache.set(cacheKey, credits)

    return credits
  } catch (error) {
    console.error("Error getting credits:", error)
    return null
  }
}

/**
 * 映画またはテレビ番組の類似作品を取得する
 */
export async function getSimilar(id: number, mediaType: "movie" | "tv"): Promise<Similar | null> {
  // キャッシュキーを生成
  const cacheKey = `${mediaType}_${id}`

  // キャッシュをチェック
  if (similarCache.has(cacheKey)) {
    return similarCache.get(cacheKey) || null
  }

  try {
    const apiKey = await getValidatedApiKey()

    const response = await fetch(
      `${TMDB_API_BASE_URL}/${mediaType}/${id}/similar?api_key=${apiKey}&language=ja-JP&page=1`,
      {
        next: { revalidate: 86400 },
        headers: {
          Accept: "application/json",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to get similar: ${response.statusText}`)
    }

    const similar = await response.json()

    // キャッシュに保存
    similarCache.set(cacheKey, similar)

    return similar
  } catch (error) {
    console.error("Error getting similar:", error)
    return null
  }
}

/**
 * フォールバック検索機能
 * TMDb APIが利用できない場合に、ローカルデータを使用して検索する
 */
export function searchMediaFallback(query: string): SearchResult[] {
  console.log(`Using fallback search for: "${query}"`)
  // ここにフォールバック検索ロジックを実装
  // 例: ローカルのJSONデータを検索するなど
  return []
}
