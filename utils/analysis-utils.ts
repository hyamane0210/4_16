import type { RecommendationItem } from "@/components/recommendations"

// カテゴリーを判定する関数
export function getCategoryForItem(item: any): string {
  const text = `${item.name} ${item.reason} ${item.features.join(" ")}`.toLowerCase()

  if (text.includes("アーティスト") || text.includes("歌手") || text.includes("バンド") || text.includes("音楽")) {
    return "artists"
  } else if (text.includes("芸能人") || text.includes("俳優") || text.includes("女優") || text.includes("タレント")) {
    return "celebrities"
  } else if (text.includes("映画") || text.includes("アニメ") || text.includes("ドラマ") || text.includes("作品")) {
    return "media"
  } else if (
    text.includes("ファッション") ||
    text.includes("ブランド") ||
    text.includes("服") ||
    text.includes("スタイル")
  ) {
    return "fashion"
  }

  return "other"
}

// カテゴリー名を取得する関数
export function getCategoryName(categoryId: string): string {
  const categories: Record<string, string> = {
    artists: "アーティスト",
    celebrities: "芸能人",
    media: "映画/アニメ",
    fashion: "ファッション",
    other: "その他",
  }
  return categories[categoryId] || categoryId
}

// Analysis helper functions
export function analyzeCategories(favorites: RecommendationItem[]) {
  // If no favorites, return empty object with zero counts
  if (!favorites || favorites.length === 0) {
    return {
      artists: 0,
      celebrities: 0,
      media: 0,
      fashion: 0,
    }
  }

  // Rest of the function remains the same
  const categories = {
    artists: 0,
    celebrities: 0,
    media: 0,
    fashion: 0,
  }

  // Category keywords
  const categoryKeywords = {
    artists: ["singer", "band", "musician", "artist", "music", "song", "vocal"],
    celebrities: ["actor", "actress", "talent", "model", "influencer", "celebrity"],
    media: ["movie", "anime", "drama", "show", "series", "film", "story"],
    fashion: ["brand", "fashion", "clothing", "apparel", "design", "style", "collection"],
  }

  favorites.forEach((item) => {
    // Infer category from reason and features
    const text = `${item.name} ${item.reason} ${item.features.join(" ")}`.toLowerCase()

    let matched = false
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          categories[category]++
          matched = true
          break
        }
      }
      if (matched) break
    }

    // If no match, try to infer from URL
    if (!matched) {
      const url = item.officialUrl.toLowerCase()
      if (url.includes("music") || url.includes("artist") || url.includes("band")) {
        categories.artists++
      } else if (url.includes("actor") || url.includes("talent") || url.includes("model")) {
        categories.celebrities++
      } else if (url.includes("movie") || url.includes("anime") || url.includes("drama")) {
        categories.media++
      } else if (url.includes("brand") || url.includes("fashion") || url.includes("wear")) {
        categories.fashion++
      } else {
        // Default to media
        categories.media++
      }
    }
  })

  return categories
}

// Keyword analysis
export function analyzeKeywords(favorites: RecommendationItem[]) {
  // If no favorites, return empty array
  if (!favorites || favorites.length === 0) {
    return []
  }

  // Rest of the function remains the same
  const keywords = {}
  const stopWords = [
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "with",
    "by",
    "about",
    "as",
    "of",
    "from",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "shall",
    "should",
    "can",
    "could",
    "may",
    "might",
  ]

  favorites.forEach((item) => {
    const text = `${item.name} ${item.reason} ${item.features.join(" ")}`
    const words = text.split(/\s+|,|\.|;|:/)

    words.forEach((word) => {
      if (word.length > 1 && !stopWords.includes(word.toLowerCase())) {
        keywords[word] = (keywords[word] || 0) + 1
      }
    })
  })

  // Sort by occurrence count
  return Object.entries(keywords)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }))
}

// Trend analysis
export function analyzeTrends(favorites: RecommendationItem[]) {
  // If no favorites, return empty array
  if (!favorites || favorites.length === 0) {
    return ["まだお気に入りがありません。分析を開始するにはコンテンツを追加してください。"]
  }

  // Rest of the function remains the same
  const trends = []

  const categories = analyzeCategories(favorites)
  // Make sure categories is not null before using Object.entries
  if (categories) {
    const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0]

    if (topCategory[0] === "artists") {
      trends.push("音楽に対する関心が高いようです。様々なアーティストの音楽を楽しんでいます。")
    } else if (topCategory[0] === "celebrities") {
      trends.push("芸能人やインフルエンサーに興味があるようです。エンターテインメント業界の動向に敏感かもしれません。")
    } else if (topCategory[0] === "media") {
      trends.push(
        "映画やアニメなどの視覚コンテンツを好む傾向があります。ストーリー性のある作品を楽しんでいるようです。",
      )
    } else if (topCategory[0] === "fashion") {
      trends.push("ファッションやブランドへの関心が高いです。スタイルやトレンドに敏感な傾向があります。")
    }
  }

  // Analyze based on number of favorites
  if (favorites.length > 10) {
    trends.push("多様なコンテンツに興味を持っています。好奇心旺盛で新しい体験に開かれている傾向があります。")
  } else if (favorites.length > 5) {
    trends.push("特定の分野に絞った興味を持っているようです。明確な好みの傾向が見られます。")
  } else {
    trends.push(
      "お気に入りがまだ少ないです。より詳細な分析のために、もっと多くのコンテンツを探索することをお勧めします。",
    )
  }

  return trends
}
