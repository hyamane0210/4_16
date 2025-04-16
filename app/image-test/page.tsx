"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"
import { getProxiedImageUrl } from "@/utils/image-utils"
import Image from "next/image"

export default function ImageTestPage() {
  const [imageUrl, setImageUrl] = useState("https://image.tmdb.org/t/p/w500/ktejodbcdCPXbMMdnpI9BUxW6O8.jpg")
  const [proxyUrl, setProxyUrl] = useState("")
  const [useProxy, setUseProxy] = useState(true)
  const [useNextImage, setUseNextImage] = useState(true)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleGenerateProxyUrl = () => {
    try {
      const url = getProxiedImageUrl(imageUrl)
      setProxyUrl(url)
      setError("")
    } catch (err) {
      setError(`Error generating proxy URL: ${err.message}`)
    }
  }

  const handleTestDirectFetch = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const contentType = response.headers.get("content-type")
      setError(`Direct fetch successful! Content-Type: ${contentType}`)
    } catch (err) {
      setError(`Direct fetch error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleTestProxyFetch = async () => {
    setLoading(true)
    setError("")
    try {
      const url = getProxiedImageUrl(imageUrl)
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const contentType = response.headers.get("content-type")
      setError(`Proxy fetch successful! Content-Type: ${contentType}`)
    } catch (err) {
      setError(`Proxy fetch error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">画像テストページ</h1>

      <Card>
        <CardHeader>
          <CardTitle>画像URL設定</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">画像URL</label>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleGenerateProxyUrl}>プロキシURLを生成</Button>
            <Button onClick={handleTestDirectFetch} variant="outline">
              直接フェッチをテスト
            </Button>
            <Button onClick={handleTestProxyFetch} variant="outline">
              プロキシフェッチをテスト
            </Button>
          </div>

          {proxyUrl && (
            <div className="p-2 bg-muted rounded-md overflow-x-auto">
              <p className="text-sm font-mono break-all">{proxyUrl}</p>
            </div>
          )}

          {error && (
            <div className="p-2 bg-red-50 text-red-800 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={useProxy} onChange={(e) => setUseProxy(e.target.checked)} />
              <span>プロキシを使用</span>
            </label>

            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={useNextImage} onChange={(e) => setUseNextImage(e.target.checked)} />
              <span>Next.js Imageを使用</span>
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>ImageWithFallback コンポーネント</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="relative w-64 h-64 border border-gray-200 rounded-md overflow-hidden">
              <ImageWithFallback
                src={imageUrl || "/placeholder.svg"}
                alt="Test image"
                fill
                disableProxy={!useProxy}
                fallbackText="IMG"
                className="object-cover"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{useNextImage ? "Next.js Image" : "標準 img タグ"}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="relative w-64 h-64 border border-gray-200 rounded-md overflow-hidden">
              {useNextImage ? (
                <Image
                  src={useProxy ? getProxiedImageUrl(imageUrl) : imageUrl}
                  alt="Test image"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <img
                  src={useProxy ? getProxiedImageUrl(imageUrl) : imageUrl}
                  alt="Test image"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md">
            <p>読み込み中...</p>
          </div>
        </div>
      )}
    </div>
  )
}
