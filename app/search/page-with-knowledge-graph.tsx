import { Suspense } from "react"
import { Recommendations } from "@/components/recommendations"
import { SearchForm } from "@/components/search-form"
import { getKnowledgeGraphRecommendations } from "@/app/actions-knowledge-graph"

interface SearchPageProps {
  searchParams: {
    q?: string
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const searchTerm = searchParams.q || ""

  return (
    <div className="container py-6 space-y-8">
      <SearchForm initialQuery={searchTerm} />

      {searchTerm ? (
        <Suspense fallback={<div className="text-center py-12">検索結果を読み込み中...</div>}>
          <SearchResults searchTerm={searchTerm} />
        </Suspense>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">検索キーワードを入力してください</p>
        </div>
      )}
    </div>
  )
}

async function SearchResults({ searchTerm }: { searchTerm: string }) {
  // Knowledge Graph APIを使用して推薦データを取得
  const data = await getKnowledgeGraphRecommendations(searchTerm)

  return <Recommendations data={data} searchTerm={searchTerm} />
}
