"use client"

import { useState } from "react"
import Link from "next/link"
import { BarChart3, PieChart, TrendingUp, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

// サンプルの分析データ
const analysisData = {
  categories: [
    { name: "アーティスト", value: 45, color: "bg-primary" },
    { name: "映画/アニメ", value: 30, color: "bg-blue-500" },
    { name: "ファッション", value: 15, color: "bg-green-500" },
    { name: "その他", value: 10, color: "bg-yellow-500" },
  ],
  keywords: [
    { word: "ロック", count: 12 },
    { word: "アニメ", count: 10 },
    { word: "J-POP", count: 8 },
    { word: "アクション", count: 7 },
    { word: "カジュアル", count: 5 },
  ],
  trends: [
    "音楽への関心が高いようです。様々なアーティストの音楽を楽しんでいます。",
    "アニメや映画などの視聴覚コンテンツを好む傾向があります。",
    "カジュアルなファッションへの関心が見られます。",
  ],
}

export default function AnalysisSection() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center">
          <BarChart3 className="mr-2 h-5 w-5 text-primary" />
          あなたの分析
        </h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/analysis" className="flex items-center">
            詳細を見る
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="categories">カテゴリー</TabsTrigger>
          <TabsTrigger value="keywords">キーワード</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                あなたの好みの傾向
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysisData.trends.map((trend, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span className="text-sm">{trend}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <PieChart className="mr-2 h-4 w-4" />
                  カテゴリー分布
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisData.categories.map((category) => (
                    <div key={category.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{category.name}</span>
                        <span className="font-medium">{category.value}%</span>
                      </div>
                      <Progress value={category.value} className={category.color} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">人気キーワード</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysisData.keywords.map((keyword) => (
                    <div
                      key={keyword.word}
                      className="px-3 py-1 rounded-full text-sm"
                      style={{
                        backgroundColor: `rgba(var(--primary), ${0.3 + (0.7 * keyword.count) / analysisData.keywords[0].count})`,
                        color: "white",
                        fontSize: `${Math.max(0.8, 0.8 + (0.4 * keyword.count) / analysisData.keywords[0].count)}rem`,
                      }}
                    >
                      {keyword.word}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                {analysisData.categories.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{category.name}</h3>
                      <span className="text-sm text-muted-foreground">{category.value}%</span>
                    </div>
                    <Progress value={category.value} className={category.color} />
                    <p className="text-sm text-muted-foreground">
                      お気に入りの{category.value}%が{category.name}カテゴリーです
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                {analysisData.keywords.map((keyword, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{keyword.word}</span>
                      <span className="text-sm text-muted-foreground">{keyword.count}回</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${(keyword.count / analysisData.keywords[0].count) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  )
}
