/**
 * 動的なデータ生成を行うユーティリティ
 */

import type { RecommendationItem } from "@/components/recommendations"
import { preprocessQuery } from "./search-utils"

// 基本的なカテゴリーとキーワードのマッピング
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  artists: [
    "音楽",
    "アーティスト",
    "バンド",
    "歌手",
    "ミュージシャン",
    "シンガー",
    "ラッパー",
    "作曲家",
    "DJ",
    "プロデューサー",
    "ボーカリスト",
    "ギタリスト",
  ],
  media: [
    "映画",
    "アニメ",
    "ドラマ",
    "テレビ番組",
    "シリーズ",
    "マンガ",
    "小説",
    "ゲーム",
    "エンターテイメント",
    "コンテンツ",
    "作品",
    "シリーズ",
  ],
  celebrities: [
    "芸能人",
    "俳優",
    "女優",
    "タレント",
    "モデル",
    "インフルエンサー",
    "有名人",
    "スター",
    "セレブ",
    "パーソナリティ",
    "コメディアン",
  ],
  fashion: [
    "ファッション",
    "ブランド",
    "服",
    "アパレル",
    "スタイル",
    "デザイナー",
    "コレクション",
    "トレンド",
    "アクセサリー",
    "靴",
    "バッグ",
    "ジュエリー",
  ],
}

// 特徴のテンプレート
const FEATURE_TEMPLATES: Record<string, string[]> = {
  artists: [
    "独特な音楽スタイル",
    "印象的なボーカル",
    "革新的なサウンド",
    "感情的な歌詞",
    "多様なジャンルの融合",
    "実験的な音楽性",
    "文化的影響力",
    "ライブパフォーマンスの魅力",
    "音楽シーンへの貢献",
    "ファンとの強い繋がり",
    "社会的メッセージ性",
    "芸術的表現",
  ],
  media: [
    "魅力的なストーリーテリング",
    "印象的な映像美",
    "革新的な演出",
    "感情を揺さぶる展開",
    "複雑なキャラクター描写",
    "社会的テーマの探求",
    "ジャンルの新しい解釈",
    "視聴者を引き込む世界観",
    "批評家からの高い評価",
    "文化的影響力",
    "独創的な設定",
    "没入感のある体験",
  ],
  celebrities: [
    "多才な演技力",
    "カリスマ性",
    "ユニークな個性",
    "社会的影響力",
    "ファッションセンス",
    "メディアでの存在感",
    "多様なプロジェクトへの参加",
    "ファンとの強い繋がり",
    "慈善活動への貢献",
    "業界での評価",
    "トレンド設定力",
    "表現力の豊かさ",
  ],
  fashion: [
    "革新的なデザイン",
    "高品質な素材",
    "独自の美学",
    "時代を超えたスタイル",
    "持続可能な取り組み",
    "文化的影響力",
    "セレブリティからの支持",
    "独特なブランドアイデンティティ",
    "職人技の伝統",
    "トレンド設定力",
    "多様性の推進",
    "アート性の高さ",
  ],
}

// 理由のテンプレート
const REASON_TEMPLATES: Record<string, string[]> = {
  artists: [
    "{keyword}に関連する音楽スタイルで知られています。",
    "{keyword}の影響を受けた革新的なアーティストです。",
    "{keyword}のファンに人気のあるミュージシャンです。",
    "{keyword}と同様の音楽性を持つアーティストです。",
    "{keyword}に似た雰囲気の楽曲で知られています。",
  ],
  media: [
    "{keyword}に関連するテーマを扱った作品です。",
    "{keyword}のファンに推奨される作品です。",
    "{keyword}と同様の世界観を持つコンテンツです。",
    "{keyword}に影響を受けた作品として評価されています。",
    "{keyword}に似た魅力を持つエンターテイメントです。",
  ],
  celebrities: [
    "{keyword}に関連する活動で知られています。",
    "{keyword}のファンに人気のあるパーソナリティです。",
    "{keyword}と共演経験のある芸能人です。",
    "{keyword}に似た魅力を持つタレントです。",
    "{keyword}と同様のジャンルで活躍しています。",
  ],
  fashion: [
    "{keyword}のスタイルに影響を与えたブランドです。",
    "{keyword}のファンに人気のあるファッションです。",
    "{keyword}と同様の美学を持つデザインで知られています。",
    "{keyword}に似た雰囲気のコレクションを展開しています。",
    "{keyword}と相性の良いスタイルを提案しています。",
  ],
}

// 基本的なデータセット（カテゴリごとに少数のアイテム）
const BASE_ITEMS: Record<string, any[]> = {
  artists: [
    { name: "新しい波", features: ["実験的サウンド", "電子音楽の要素", "革新的なプロデュース"] },
    { name: "クリスタルボイス", features: ["透明感のある歌声", "感情的な表現", "繊細なメロディ"] },
    { name: "ディープグルーヴ", features: ["重厚なベースライン", "リズム重視", "ダンサブルなトラック"] },
    { name: "エコーチェンバー", features: ["空間的なサウンド", "リバーブ効果", "幻想的な雰囲気"] },
    { name: "パルスウェーブ", features: ["シンセサイザー中心", "80年代風レトロ", "キャッチーなフック"] },
  ],
  media: [
    { name: "無限の扉", features: ["SF要素", "複雑な世界観", "哲学的テーマ"] },
    { name: "夢幻回廊", features: ["ファンタジー設定", "冒険的ストーリー", "魅力的なキャラクター"] },
    { name: "都市の影", features: ["ノワール風", "ミステリー要素", "都市を舞台にした物語"] },
    { name: "時の砂時計", features: ["タイムトラベル", "歴史的背景", "運命のテーマ"] },
    { name: "星の記憶", features: ["宇宙を舞台", "壮大なスケール", "人間ドラマ"] },
  ],
  celebrities: [
    { name: "朝日輝", features: ["多才な演技", "カリスマ性", "幅広い役柄"] },
    { name: "月野静", features: ["独特の雰囲気", "ファッションアイコン", "SNSでの影響力"] },
    { name: "風川颯", features: ["自然体の魅力", "親しみやすさ", "多方面での活躍"] },
    { name: "雪村澄", features: ["知的な印象", "洗練された話し方", "国際的な活動"] },
    { name: "花園彩", features: ["明るい個性", "エネルギッシュ", "ファンとの交流"] },
  ],
  fashion: [
    { name: "エターナルシーク", features: ["ミニマルデザイン", "持続可能な素材", "時代を超えたスタイル"] },
    { name: "アーバンフロー", features: ["ストリート要素", "現代的シルエット", "機能性重視"] },
    { name: "ルミナスシャドウ", features: ["コントラスト効果", "独特のカラーパレット", "芸術的表現"] },
    { name: "ナチュラルハーモニー", features: ["オーガニック素材", "地球に優しい製法", "自然との調和"] },
    { name: "テクノクラフト", features: ["革新的なテクノロジー", "伝統的な職人技", "未来志向"] },
  ],
}

/**
 * 検索キーワードからカテゴリを推測する関数
 */
export function inferCategory(query: string): string | null {
  const processedQuery = query.toLowerCase()

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((keyword) => processedQuery.includes(keyword))) {
      return category
    }
  }

  return null
}

/**
 * 検索キーワードに基づいて動的にアイテムを生成する関数
 */
export function generateDynamicItems(query: string, category: string, count = 5): RecommendationItem[] {
  // クエリからキーワードを抽出
  const keywords = preprocessQuery(query)
  if (keywords.length === 0) return []

  // カテゴリが有効かチェック
  if (!CATEGORY_KEYWORDS[category]) return []

  const result: RecommendationItem[] = []

  // ベースとなるアイテムを取得
  const baseItems = BASE_ITEMS[category] || []

  for (let i = 0; i < count; i++) {
    // ベースアイテムからランダムに選択
    const baseItem = baseItems[Math.floor(Math.random() * baseItems.length)]

    // 主要キーワードを選択
    const mainKeyword = keywords[Math.floor(Math.random() * keywords.length)]

    // 特徴をランダムに選択
    const featureTemplates = FEATURE_TEMPLATES[category] || []
    const selectedFeatures = []

    // 3つの特徴を選択
    for (let j = 0; j < 3; j++) {
      const randomIndex = Math.floor(Math.random() * featureTemplates.length)
      selectedFeatures.push(featureTemplates[randomIndex])
    }

    // 理由テンプレートをランダムに選択
    const reasonTemplates = REASON_TEMPLATES[category] || []
    const reasonTemplate = reasonTemplates[Math.floor(Math.random() * reasonTemplates.length)]

    // 理由テンプレートにキーワードを挿入
    const reason = reasonTemplate.replace("{keyword}", mainKeyword)

    // 名前を生成（ベースアイテム名 + キーワードの要素）
    const name = `${baseItem.name} ${mainKeyword.charAt(0).toUpperCase() + mainKeyword.slice(1)}`

    // アイテムを作成
    const item: RecommendationItem = {
      name,
      reason,
      features: [...selectedFeatures],
      imageUrl: "/placeholder.svg",
      officialUrl: `https://example.com/${encodeURIComponent(name)}`,
    }

    result.push(item)
  }

  return result
}

/**
 * 既存のデータセットを拡張する関数
 */
export function expandDataset(
  existingItems: RecommendationItem[],
  query: string,
  category: string,
  targetCount: number,
): RecommendationItem[] {
  // 既存のアイテムが十分にある場合はそのまま返す
  if (existingItems.length >= targetCount) {
    return existingItems
  }

  // 不足分を計算
  const neededCount = targetCount - existingItems.length

  // 動的にアイテムを生成
  const generatedItems = generateDynamicItems(query, category, neededCount)

  // 既存のアイテムと生成したアイテムを結合
  return [...existingItems, ...generatedItems]
}

/**
 * 検索結果の多様性を高めるためのデータ拡張関数
 */
export function enhanceSearchResults(
  results: Record<string, RecommendationItem[]>,
  query: string,
  targetCountPerCategory = 12,
): Record<string, RecommendationItem[]> {
  const enhancedResults = { ...results }

  // 各カテゴリを拡張
  Object.keys(enhancedResults).forEach((category) => {
    enhancedResults[category] = expandDataset(enhancedResults[category], query, category, targetCountPerCategory)
  })

  return enhancedResults
}
