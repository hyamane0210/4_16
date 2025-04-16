"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Share2,
  Download,
  Copy,
  Twitter,
  Facebook,
  Instagram,
  Check,
  PieChart,
  BarChart,
  TrendingUp,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import html2canvas from "html2canvas"

// 分析結果の型定義
interface AnalysisData {
  categories: {
    name: string
    value: number
    color: string
  }[]
  keywords: {
    word: string
    count: number
  }[]
  trends: string[]
  personalityType?: string
  personalityDescription?: string
}

interface ShareableCardProps {
  data: AnalysisData
  userName?: string
}

export function ShareableCard({ data, userName = "あなた" }: ShareableCardProps) {
  const { toast } = useToast()
  const cardRef = useRef<HTMLDivElement>(null)
  const [isCopied, setIsCopied] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  // 個性タイプを決定（カテゴリの最大値から）
  const dominantCategory = [...data.categories].sort((a, b) => b.value - a.value)[0]

  const personalityTypes = {
    アーティスト: {
      title: "音楽の探究者",
      description:
        "あなたは音楽に深い関心を持ち、様々なアーティストや音楽ジャンルを探求することを楽しんでいます。新しい音楽体験を常に求め、音楽を通じて感情や思考を表現することを大切にしています。",
      emoji: "🎵",
    },
    "映画/アニメ": {
      title: "ビジュアルストーリーテラー",
      description:
        "あなたは視覚的なストーリーテリングに魅了され、映画やアニメを通じて様々な世界や物語を体験することを好みます。想像力豊かで、物語の深層に隠されたメッセージや象徴を見つけることに長けています。",
      emoji: "🎬",
    },
    ファッション: {
      title: "スタイルイノベーター",
      description:
        "あなたは自己表現の手段としてファッションを重視し、トレンドに敏感でありながらも独自のスタイルを大切にしています。外見を通じて内面を表現することに関心があり、美的センスに優れています。",
      emoji: "👗",
    },
    芸能人: {
      title: "エンターテイメントコネクター",
      description:
        "あなたはエンターテイメント業界の動向に敏感で、芸能人やインフルエンサーの活動に強い関心を持っています。文化的トレンドを早く察知し、社会的なつながりを重視する傾向があります。",
      emoji: "🌟",
    },
  }

  const personalityType = personalityTypes[dominantCategory.name] || {
    title: "多様な探究者",
    description:
      "あなたは幅広い興味を持ち、様々なジャンルやカテゴリーのコンテンツを探求することを楽しんでいます。好奇心旺盛で、新しい発見や体験に常にオープンな姿勢を持っています。",
    emoji: "🔍",
  }

  // 画像としてダウンロード
  const handleDownload = async () => {
    if (!cardRef.current) return

    setIsDownloading(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        // グラデーションの問題を回避するためのオプション
        useCORS: true,
        allowTaint: true,
      })

      const image = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = image
      link.download = `${userName}の好み分析.png`
      link.click()

      toast({
        title: "画像を保存しました",
        description: "分析結果を画像として保存しました。",
        duration: 3000,
      })
    } catch (error) {
      console.error("画像の生成に失敗しました", error)
      toast({
        title: "エラーが発生しました",
        description: "画像の生成に失敗しました。もう一度お試しください。",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsDownloading(false)
    }
  }

  // クリップボードにコピー
  const handleCopy = async () => {
    if (!cardRef.current) return

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        // グラデーションの問題を回避するためのオプション
        useCORS: true,
        allowTaint: true,
      })

      canvas.toBlob(async (blob) => {
        if (!blob) return

        try {
          // 新しいClipboard APIを使用
          const data = [new ClipboardItem({ "image/png": blob })]
          await navigator.clipboard.write(data)

          setIsCopied(true)
          setTimeout(() => setIsCopied(false), 2000)

          toast({
            title: "クリップボードにコピーしました",
            description: "分析結果をクリップボードにコピーしました。",
            duration: 3000,
          })
        } catch (error) {
          console.error("クリップボードへのコピーに失敗しました", error)
          toast({
            title: "エラーが発生しました",
            description: "クリップボードへのコピーに失敗しました。",
            variant: "destructive",
            duration: 3000,
          })
        }
      })
    } catch (error) {
      console.error("画像の生成に失敗しました", error)
    }
  }

  // SNSでシェア
  const handleShare = async (platform: string) => {
    if (!cardRef.current) return

    try {
      // グラデーションを使用している要素を一時的に単色に変更
      const gradientElements = cardRef.current.querySelectorAll('[class*="bg-gradient"]')
      const originalStyles: string[] = []

      gradientElements.forEach((element, index) => {
        const htmlElement = element as HTMLElement
        originalStyles[index] = htmlElement.getAttribute("style") || ""
        htmlElement.style.background = "#f5f5f5" // 安全な単色の背景色
      })

      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        // グラデーションの問題を回避するためのオプション
        useCORS: true,
        allowTaint: true,
      })

      // 元のスタイルに戻す
      gradientElements.forEach((element, index) => {
        const htmlElement = element as HTMLElement
        if (originalStyles[index]) {
          htmlElement.setAttribute("style", originalStyles[index])
        }
      })

      const image = canvas.toDataURL("image/png")
      const text = `${userName}の好み分析結果: ${personalityType.title} ${personalityType.emoji}
#MyProject #好み分析`

      let shareUrl = ""

      switch (platform) {
        case "twitter":
          shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
          break
        case "facebook":
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`
          break
        case "line":
          shareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`
          break
        default:
          // Web Share APIを使用（モバイルデバイス向け）
          if (navigator.share) {
            try {
              // 画像をBlobに変換
              const blobData = await new Promise<Blob | null>((resolve) => {
                canvas.toBlob(resolve, "image/png")
              })

              if (blobData) {
                const file = new File([blobData], "analysis.png", { type: "image/png" })

                await navigator.share({
                  title: `${userName}の好み分析結果`,
                  text: text,
                  url: window.location.href,
                  files: [file],
                })

                toast({
                  title: "共有しました",
                  description: "分析結果を共有しました。",
                  duration: 3000,
                })
                return
              }
            } catch (error) {
              console.error("Web Share APIでの共有に失敗しました", error)
            }
          }

          // フォールバック: URLをクリップボードにコピー
          navigator.clipboard.writeText(`${text}
${window.location.href}`)
          toast({
            title: "URLをコピーしました",
            description: "分析結果のURLをクリップボードにコピーしました。",
            duration: 3000,
          })
          return
      }

      // 新しいウィンドウでシェアURLを開く
      window.open(shareUrl, "_blank", "noopener,noreferrer")

      toast({
        title: "共有ページを開きました",
        description: `${platform}での共有ページを開きました。`,
        duration: 3000,
      })
    } catch (error) {
      console.error("共有用画像の生成に失敗しました", error)
      toast({
        title: "エラーが発生しました",
        description: "共有の準備中にエラーが発生しました。",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  return (
    <div className="space-y-4">
      {/* シェア可能なカード */}
      <Card ref={cardRef} className="overflow-hidden border-2 border-[#454545] shadow-lg">
        <CardContent className="p-6 space-y-6">
          {/* ヘッダー */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">{userName}の好み分析</h3>
              <p className="text-sm text-muted-foreground">My Project</p>
            </div>
            <Badge className="bg-[#454545] text-white hover:bg-[#454545]/90">
              {personalityType.emoji} {personalityType.title}
            </Badge>
          </div>

          {/* パーソナリティタイプ */}
          <div className="bg-[#f5f5f5] rounded-lg p-4">
            <p className="text-sm">{personalityType.description}</p>
          </div>

          {/* カテゴリー分布 */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center">
              <PieChart className="h-4 w-4 mr-1 text-[#454545]" />
              カテゴリー分布
            </h4>
            <div className="space-y-3">
              {data.categories.map((category, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{category.name}</span>
                    <span className="font-medium">{category.value}%</span>
                  </div>
                  <Progress value={category.value} className={category.color} />
                </div>
              ))}
            </div>
          </div>

          {/* キーワード */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center">
              <BarChart className="h-4 w-4 mr-1 text-[#454545]" />
              トップキーワード
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.keywords.slice(0, 5).map((keyword, index) => (
                <Badge key={index} variant="outline" className="bg-[#454545]/10">
                  {keyword.word}
                </Badge>
              ))}
            </div>
          </div>

          {/* 傾向 */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center">
              <TrendingUp className="h-4 w-4 mr-1 text-[#454545]" />
              主な傾向
            </h4>
            <p className="text-sm">{data.trends[0]}</p>
          </div>
        </CardContent>
      </Card>

      {/* シェアボタン */}
      <div className="flex flex-wrap gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleShare("twitter")}
                className="bg-[#1DA1F2] text-white hover:bg-[#1DA1F2]/90 border-none"
              >
                <Twitter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Twitterでシェア</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleShare("facebook")}
                className="bg-[#1877F2] text-white hover:bg-[#1877F2]/90 border-none"
              >
                <Facebook className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Facebookでシェア</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleShare("instagram")}
                className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white hover:opacity-90 border-none"
              >
                <Instagram className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Instagramでシェア</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => handleShare("other")}>
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>その他の方法でシェア</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleCopy}>
                {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>クリップボードにコピー</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleDownload} disabled={isDownloading}>
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>画像として保存</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
