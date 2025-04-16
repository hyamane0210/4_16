import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import dynamic from "next/dynamic"

// コンポーネントを動的にインポート
const HeroSection = dynamic(() => import("@/components/home/hero-section"), {
  loading: () => <div className="h-[50vh] bg-gray-100 animate-pulse rounded-lg" />,
  ssr: true,
})

const FavoritesPreview = dynamic(() => import("@/components/home/favorites-preview"), {
  loading: () => <SectionSkeleton title="お気に入り" />,
  ssr: true,
})

const AnalysisPreview = dynamic(() => import("@/components/home/analysis-preview"), {
  loading: () => <SectionSkeleton title="あなたの分析" />,
  ssr: true,
})

const FeaturesSection = dynamic(() => import("@/components/home/features-section"), {
  loading: () => <SectionSkeleton title="機能" />,
  ssr: true,
})

export default function HomePage() {
  return (
    <>
      {/* ヒーローセクション - メイン検索機能 */}
      <HeroSection />

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* お気に入りセクション */}
        <Suspense fallback={<SectionSkeleton title="お気に入り" />}>
          <FavoritesPreview />
        </Suspense>

        {/* 自己分析セクション */}
        <Suspense fallback={<SectionSkeleton title="あなたの分析" />}>
          <AnalysisPreview />
        </Suspense>

        {/* 機能セクション */}
        <FeaturesSection />
      </div>
    </>
  )
}

// スケルトンコンポーネントを最適化
function SectionSkeleton({ title }: { title: string }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-[200px] rounded-lg" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
