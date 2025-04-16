/**
 * 画像関連のユーティリティ関数 - パフォーマンス最適化版
 */

// URLキャッシュを実装
const urlCache = new Map<string, string>()

/**
 * 外部画像URLをプロキシURLに変換する関数
 */
export function getProxiedImageUrl(originalUrl: string | null | undefined): string {
  // 無効なURLの場合はプレースホルダーを返す
  if (!originalUrl) {
    return "/placeholder.svg?height=400&width=400"
  }

  // キャッシュをチェック
  const cacheKey = `proxy_${originalUrl}`
  if (urlCache.has(cacheKey)) {
    return urlCache.get(cacheKey)!
  }

  // 新しいURLを生成してキャッシュに保存
  const proxiedUrl = `/api/image-proxy?url=${encodeURIComponent(originalUrl)}`
  urlCache.set(cacheKey, proxiedUrl)
  return proxiedUrl
}

/**
 * TMDb画像URLを生成する関数
 */
export function getTMDbImageUrl(path: string | null, size = "w500"): string {
  // 無効なパスの場合はプレースホルダーを返す
  if (!path) {
    return "/placeholder.svg?height=400&width=400"
  }

  // キャッシュをチェック
  const cacheKey = `tmdb_${path}_${size}`
  if (urlCache.has(cacheKey)) {
    return urlCache.get(cacheKey)!
  }

  // 新しいURLを生成してキャッシュに保存
  const tmdbUrl = `https://image.tmdb.org/t/p/${size}${path}`
  urlCache.set(cacheKey, tmdbUrl)
  return tmdbUrl
}

/**
 * Spotify画像URLをプロキシURLに変換する関数
 */
export function getSpotifyImageUrl(images: any[] | undefined): string {
  // 無効な画像配列の場合はプレースホルダーを返す
  if (!images || images.length === 0 || !images[0].url) {
    return "/placeholder.svg?height=400&width=400"
  }

  // キャッシュをチェック
  const imageUrl = images[0].url
  const cacheKey = `spotify_${imageUrl}`
  if (urlCache.has(cacheKey)) {
    return urlCache.get(cacheKey)!
  }

  // URLをキャッシュに保存して返す
  urlCache.set(cacheKey, imageUrl)
  return imageUrl
}

/**
 * Wikidata/Wikipedia画像URLを処理する関数
 */
export function getWikipediaImageUrl(entityId: string | null): string {
  // 無効なエンティティIDの場合はプレースホルダーを返す
  if (!entityId) {
    return "/placeholder.svg?height=400&width=400"
  }

  // キャッシュをチェック
  const cacheKey = `wiki_${entityId}`
  if (urlCache.has(cacheKey)) {
    return urlCache.get(cacheKey)!
  }

  // Wikidata IDからWikimedia Commonsの画像URLを構築
  const wikimediaUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${entityId}?width=800`

  // 画像プロキシを使用
  const proxiedUrl = `/api/image-proxy?url=${encodeURIComponent(wikimediaUrl)}`
  urlCache.set(cacheKey, proxiedUrl)
  return proxiedUrl
}

// キャッシュサイズを制限する関数
export function limitCacheSize(maxSize = 100): void {
  if (urlCache.size > maxSize) {
    // 最も古いエントリを削除
    const keysIterator = urlCache.keys()
    const oldestKey = keysIterator.next().value
    urlCache.delete(oldestKey)
  }
}
