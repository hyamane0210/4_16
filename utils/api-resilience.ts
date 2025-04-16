/**
 * API呼び出しの回復力を高めるためのユーティリティ関数
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
}

class ApiCache {
  private cache = new Map<string, CacheEntry<any>>()
  private ttl: number

  constructor(ttl: number = 60 * 60 * 1000) {
    // 1時間
    this.ttl = ttl
  }

  async fetch<T>(key: string, options?: RequestInit): Promise<T | undefined> {
    const cached = this.cache.get(key)

    if (cached && Date.now() - cached.timestamp < this.ttl) {
      console.log(`Cache hit for key: ${key.substring(0, 50)}...`)
      return cached.data as T
    }

    if (options?.method === "PUT") {
      console.log(`Skipping network fetch for PUT request with key: ${key.substring(0, 50)}...`)
      return // PUTリクエストの場合はキャッシュのみを更新し、ネットワーク呼び出しは行わない
    }

    try {
      console.log(`Fetching from network for key: ${key.substring(0, 50)}...`)
      const response = await fetch(key, options)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = (await response.json()) as T
      this.cache.set(key, { data, timestamp: Date.now() })
      return data
    } catch (error) {
      console.error(`Fetch error for key ${key}:`, error)
      this.cache.delete(key)
      return undefined
    }
  }

  async invalidateCache(key: string): Promise<void> {
    this.cache.delete(key)
  }
}

export const globalApiCache = new ApiCache()
