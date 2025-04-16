import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { FavoritesProvider } from "@/contexts/favorites-context"
import { OnboardingProvider } from "@/contexts/onboarding-context"
import { AuthProvider } from "@/contexts/auth-context"
import Header from "@/components/header"
import dynamic from "next/dynamic"

// Dynamically import components with loading priority
const Toaster = dynamic(() => import("@/components/ui/toaster").then((mod) => mod.Toaster), {
  ssr: false,
  loading: () => null, // 読み込み中は何も表示しない
})

// フォント最適化
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  // 必要なウェイトのみをロード
  weight: ["400", "500", "600", "700"],
  // 事前読み込み
  preload: true,
  // 可変フォントを使用
  variable: "--font-inter",
})

// レイアウトのメタデータを更新
export const metadata: Metadata = {
  title: "My Project - あなた専用のコンテンツ体験",
  description: "アーティスト、映画、アニメ、ファッションなど、あなたの興味に合わせたおすすめを発見しましょう",
  // モバイル体験向上のためのビューポートメタデータを追加
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  // ブラウザUIのテーマカラーを追加
  themeColor: "#0EA5E9", // 空色のテーマカラー
  // キャッシュ制御
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
  },
    generator: 'v0.dev'
}

// レイアウトコンポーネントを最適化
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning className={inter.variable}>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <FavoritesProvider>
              <OnboardingProvider>
                <div className="min-h-screen bg-background flex flex-col">
                  <Header />
                  <main className="flex-1 bg-gradient-to-b from-background to-secondary/20">{children}</main>
                </div>
                <Toaster />
              </OnboardingProvider>
            </FavoritesProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'