"use client"

import type React from "react"
import { useState, memo, useEffect, useRef, useCallback } from "react"
import Image, { type ImageProps } from "next/image"
import type { StaticImport } from "next/dist/shared/lib/server-external"
import { cn } from "@/lib/utils"

// 直接表示するドメインのリストをセットに変換して検索を高速化
const DIRECT_DOMAINS = new Set([
  "i.scdn.co",
  "scdn.co",
  "spotifycdn.com",
  "image.tmdb.org",
  "themoviedb.org",
  "gucci.com",
  "www.gucci.com",
  "cloudfront.net",
  "amazonaws.com",
])

// 問題のあるドメインのリストをセットに変換
const PROBLEMATIC_DOMAINS = new Set(["off---white.com", "www.off---white.com", "white.com", "www.white.com"])

// プレースホルダーカラーの配列を最適化
const placeholderColors = ["bg-gray-200", "bg-blue-100", "bg-green-100", "bg-yellow-100"]

// カラー選択アルゴリズムを最適化
const getPlaceholderColor = (id: string | number) => {
  // 単純なハッシュ関数
  const numericId =
    typeof id === "string" ? id.split("").reduce((acc, char, i) => acc + char.charCodeAt(0) * (i + 1), 0) : id
  return placeholderColors[numericId % placeholderColors.length]
}

interface ImageWithFallbackProps extends Omit<ImageProps, "onError"> {
  fallbackText?: string
  identifier?: string | number
  containerClassName?: string
  showLoadingEffect?: boolean
  renderFallback?: (fallbackText: string) => React.ReactNode
  onError?: () => void
  onLoadingComplete?: () => void
  disableProxy?: boolean
}

// ドメイン抽出をメモ化するためのキャッシュ
const domainCache = new Map<string, string | null>()

// ドメインを抽出する関数
const extractDomain = (url: string | StaticImport): string | null => {
  if (typeof url !== "string") return null

  // キャッシュをチェック
  if (domainCache.has(url)) {
    return domainCache.get(url) || null
  }

  try {
    if (url.startsWith("/") || url.startsWith("data:")) {
      domainCache.set(url, null)
      return null
    }
    const domain = new URL(url).hostname
    domainCache.set(url, domain)
    return domain
  } catch (e) {
    domainCache.set(url, null)
    return null
  }
}

// 処理済みURLのキャッシュ
const processedUrlCache = new Map<string, string>()

// 画像URLを処理する関数
const processImageUrl = (url: string | StaticImport, disableProxy: boolean): string | StaticImport => {
  // StaticImportの場合はそのまま返す
  if (typeof url !== "string") return url

  // キャッシュをチェック
  const cacheKey = `${url}-${disableProxy}`
  if (processedUrlCache.has(cacheKey)) {
    return processedUrlCache.get(cacheKey) as string
  }

  // 無効なURLの場合はプレースホルダーを返す
  if (!url || url === "undefined" || url === "null") {
    const result = "/placeholder.svg?height=400&width=400"
    processedUrlCache.set(cacheKey, result)
    return result
  }

  // 既に処理済みのURLはそのまま返す
  if (url.startsWith("/api/image-proxy") || url.startsWith("/placeholder")) {
    processedUrlCache.set(cacheKey, url)
    return url
  }

  // 相対パスはそのまま返す
  if (url.startsWith("/")) {
    processedUrlCache.set(cacheKey, url)
    return url
  }

  // data:URLはそのまま返す
  if (url.startsWith("data:")) {
    processedUrlCache.set(cacheKey, url)
    return url
  }

  // ドメインを抽出
  const domain = extractDomain(url)

  // 問題のあるドメインの場合はプレースホルダーを返す
  if (domain && PROBLEMATIC_DOMAINS.has(domain)) {
    const result = "/placeholder.svg?height=400&width=400"
    processedUrlCache.set(cacheKey, result)
    return result
  }

  // 直接表示するドメインの場合は元のURLを返す
  if (domain && DIRECT_DOMAINS.has(domain)) {
    processedUrlCache.set(cacheKey, url)
    return url
  }

  // 外部URLの場合、プロキシを使用（disableProxyがfalseの場合）
  if (!disableProxy) {
    const result = `/api/image-proxy?url=${encodeURIComponent(url)}`
    processedUrlCache.set(cacheKey, result)
    return result
  }

  processedUrlCache.set(cacheKey, url)
  return url
}

// Memoize component to prevent unnecessary re-renders
export const ImageWithFallback = memo(function ImageWithFallback({
  src,
  alt,
  fallbackText,
  identifier,
  containerClassName,
  showLoadingEffect = true,
  renderFallback,
  className,
  onError,
  onLoadingComplete,
  disableProxy = false,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [imageSrc, setImageSrc] = useState<string | StaticImport>("/placeholder.svg?height=400&width=400")
  const [retryCount, setRetryCount] = useState(0)
  const isMounted = useRef(true)

  // コンポーネントマウント時に画像URLを処理
  useEffect(() => {
    // コンポーネントがマウントされていることを確認
    isMounted.current = true

    // 初期状態をリセット
    setError(false)
    setLoading(true)
    setRetryCount(0)

    // URLが問題のあるドメインを含むかチェック
    const domain = typeof src === "string" ? extractDomain(src) : null
    const isProblematicDomain = domain && PROBLEMATIC_DOMAINS.has(domain)

    if (isProblematicDomain) {
      // 問題のあるドメインの場合は直接プレースホルダーを使用
      setImageSrc("/placeholder.svg?height=400&width=400")
      setLoading(false)
      setError(true)
    } else {
      // 通常の処理
      const processedUrl = processImageUrl(src, disableProxy || false)
      setImageSrc(processedUrl)
    }

    // クリーンアップ関数
    return () => {
      isMounted.current = false
    }
  }, [src, disableProxy])

  // Optimize identifier generation
  const id = identifier || (alt ? alt.substring(0, 8) : Math.floor(Math.random() * 100))
  const placeholderColor = getPlaceholderColor(id)

  // Optimize text display
  const displayText = fallbackText || (alt ? alt.substring(0, 2).toUpperCase() : "")

  // useCallbackを使用してハンドラ関数をメモ化
  const handleError = useCallback(() => {
    if (!isMounted.current) return

    // 最大2回まで再試行
    if (retryCount < 2) {
      setRetryCount((prev) => prev + 1)

      if (retryCount === 0) {
        // 1回目の再試行: 元のURLを直接使用
        if (typeof src === "string") {
          setImageSrc(src)
        }
      } else if (retryCount === 1) {
        // 2回目の再試行: キャッシュバスティング
        const timestamp = Date.now()
        if (typeof src === "string") {
          const cacheBuster = src.includes("?") ? `${src}&_cb=${timestamp}` : `${src}?_cb=${timestamp}`
          setImageSrc(cacheBuster)
        }
      }
    } else {
      // すべての再試行が失敗した場合
      setError(true)
      setImageSrc("/placeholder.svg?height=400&width=400")
      setLoading(false)
      if (onError && isMounted.current) onError()
    }
  }, [retryCount, src, onError])

  const handleLoadComplete = useCallback(() => {
    if (!isMounted.current) return
    setLoading(false)
    if (onLoadingComplete && isMounted.current) onLoadingComplete()
  }, [onLoadingComplete])

  return (
    <div className={cn("relative w-full h-full", containerClassName)}>
      {/* Placeholder */}
      {(loading || error) && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            placeholderColor,
            showLoadingEffect && !error && "animate-pulse",
          )}
        >
          {renderFallback ? (
            renderFallback(displayText)
          ) : (
            <span className="text-gray-500 font-semibold text-lg">{displayText}</span>
          )}
        </div>
      )}

      {/* Actual image */}
      {!error && (
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={alt}
          className={cn(loading ? "opacity-0" : "opacity-100", "transition-opacity duration-300", className)}
          onLoadingComplete={handleLoadComplete}
          onError={handleError}
          unoptimized={true}
          {...props}
        />
      )}
    </div>
  )
})
