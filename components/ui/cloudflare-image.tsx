"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image"
import { cn } from "@/lib/utils"

// 直接表示するドメインのリスト
const DIRECT_DOMAINS = ["gucci.com", "www.gucci.com", "i.scdn.co", "scdn.co", "spotifycdn.com"]

interface CloudflareImageProps extends Omit<ImageProps, "src"> {
  src: string
  containerClassName?: string
  imageId?: string
}

// ドメインを抽出する関数
const extractDomain = (url: string): string | null => {
  try {
    if (!url || typeof url !== "string" || url.startsWith("/") || url.startsWith("data:")) {
      return null
    }
    const domain = new URL(url).hostname
    return domain
  } catch (e) {
    console.error("Error extracting domain:", e)
    return null
  }
}

export const CloudflareImage: React.FC<CloudflareImageProps> = ({
  src,
  alt,
  containerClassName,
  className,
  imageId,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState<string>(src)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    // ドメインを抽出
    const domain = extractDomain(src)
    const isDirectDomain = domain && DIRECT_DOMAINS.some((d) => domain.includes(d))

    if (isDirectDomain) {
      // 直接表示するドメインの場合は元のURLを使用
      setImageSrc(src)
      setLoading(false)
      return
    }

    // 画像プロキシURLを生成（フォールバック用）
    const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(src)}`

    // まず画像プロキシURLを設定（処理中に表示）
    setImageSrc(proxyUrl)
    setLoading(false)
  }, [src, imageId])

  // 画像読み込みエラー処理
  const handleError = () => {
    console.error(`CloudflareImage: Error loading image: ${imageSrc}`)

    // ドメインを抽出
    const domain = extractDomain(src)
    const isDirectDomain = domain && DIRECT_DOMAINS.some((d) => domain.includes(d))

    // 直接表示するドメインの場合は、プレースホルダーを使用
    if (isDirectDomain) {
      console.log("Direct domain image failed, using placeholder")
      setError(true)
      return
    }

    // 最大2回まで再試行
    if (retryCount < 2) {
      setRetryCount((prev) => prev + 1)

      if (retryCount === 0) {
        // 1回目の再試行: 元のURLを直接使用
        console.log("CloudflareImage: Retrying with original URL")
        setImageSrc(src)
        return
      } else if (retryCount === 1) {
        // 2回目の再試行: キャッシュバスティング
        const cacheBuster = `${src}${src.includes("?") ? "&" : "?"}cb=${Date.now()}`
        console.log(`CloudflareImage: Retrying with cache busting: ${cacheBuster}`)
        setImageSrc(cacheBuster)
        return
      }
    }

    // すべての再試行が失敗した場合
    setError(true)
  }

  return (
    <div className={cn("relative w-full h-full", containerClassName)}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
          <span className="text-gray-500">読み込み中...</span>
        </div>
      )}

      <Image
        src={error ? "/placeholder.svg" : imageSrc}
        alt={alt}
        className={cn("object-cover", className, loading ? "opacity-0" : "opacity-100")}
        unoptimized={true}
        onError={handleError}
        onLoad={() => setLoading(false)}
        {...props}
      />
    </div>
  )
}
