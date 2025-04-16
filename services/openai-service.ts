/**
 * OpenAI APIとの連携を行うサービスクラス
 */
import { globalApiCache } from "@/utils/api-resilience"
import type { RecommendationItem } from "@/components/recommendations"

// OpenAI API設定
const OPENAI_API_URL = "https://api.openai.com/v1"
const EMBEDDING_MODEL = "text-embedding-3-small"
const COMPLETION_MODEL = "gpt-3.5-turbo"

// キャッシュキー
const EMBEDDING_CACHE_PREFIX = "embedding:"
const COMPLETION_CACHE_PREFIX = "completion:"

// キャッシュ有効期間（1週間）
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000

// キャッシュストレージ（メモリ内）
const embeddingCache = new Map<string, { data: number[]; timestamp: number }>()
const completionCache = new Map<string, { data: string; timestamp: number }>()

/**
 * OpenAI APIのAPIキーを取得する
 */
function getApiKey(): string {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error("OpenAI API key is not set in environment variables")
  }
  return apiKey
}

/**
 * テキストの埋め込みベクトルを取得する
 * @param text 埋め込みを生成するテキスト
 * @returns 埋め込みベクトル
 */
export async function getEmbedding(text: string): Promise<number[]> {
  // キャッシュキーを生成
  const cacheKey = `${EMBEDDING_CACHE_PREFIX}${text}`

  // メモリキャッシュをチェック
  const cachedItem = embeddingCache.get(cacheKey)
  if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_TTL) {
    console.log(`Using cached embedding for: ${text.substring(0, 30)}...`)
    return cachedItem.data
  }

  try {
    const apiKey = getApiKey()

    const response = await fetch(`${OPENAI_API_URL}/embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        input: text,
        model: EMBEDDING_MODEL,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    const embedding = data.data[0].embedding

    // メモリキャッシュに保存
    embeddingCache.set(cacheKey, { data: embedding, timestamp: Date.now() })

    return embedding
  } catch (error) {
    console.error("Error getting embedding:", error)
    throw error
  }
}

/**
 * 類似度に基づいてアイテムをソートする
 * @param items ソートするアイテムの配列
 * @param queryEmbedding クエリの埋め込みベクトル
 * @param getItemEmbedding アイテムの埋め込みベクトルを取得する関数
 * @returns ソートされたアイテムの配列
 */
export async function sortBySimilarity<T>(
  items: T[],
  queryEmbedding: number[],
  getItemEmbedding: (item: T) => Promise<number[]>,
): Promise<T[]> {
  // 各アイテムの類似度を計算
  const itemsWithSimilarity = await Promise.all(
    items.map(async (item) => {
      const itemEmbedding = await getItemEmbedding(item)
      const similarity = cosineSimilarity(queryEmbedding, itemEmbedding)
      return { item, similarity }
    }),
  )

  // 類似度でソート（降順）
  return itemsWithSimilarity.sort((a, b) => b.similarity - a.similarity).map((item) => item.item)
}

/**
 * コサイン類似度を計算する
 * @param vecA ベクトルA
 * @param vecB ベクトルB
 * @returns コサイン類似度
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error("Vectors must have the same dimension")
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }

  // ゼロベクトルの場合は類似度0を返す
  if (normA === 0 || normB === 0) {
    return 0
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

/**
 * GPT-3.5-turboを使用してテキストを生成する
 * @param prompt プロンプト
 * @param options オプション
 * @returns 生成されたテキスト
 */
export async function generateText(
  prompt: string,
  options: {
    maxTokens?: number
    temperature?: number
    systemPrompt?: string
  } = {},
): Promise<string> {
  const { maxTokens = 150, temperature = 0.7, systemPrompt = "あなたは役立つアシスタントです。" } = options

  // キャッシュキーを生成（プロンプトとオプションを含む）
  const cacheKey = `${COMPLETION_CACHE_PREFIX}${JSON.stringify({ prompt, maxTokens, temperature, systemPrompt })}`

  // メモリキャッシュをチェック
  const cachedItem = completionCache.get(cacheKey)
  if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_TTL) {
    console.log(`Using cached completion for: ${prompt.substring(0, 30)}...`)
    return cachedItem.data
  }

  try {
    const apiKey = getApiKey()

    const response = await fetch(`${OPENAI_API_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: COMPLETION_MODEL,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: maxTokens,
        temperature: temperature,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    const generatedText = data.choices[0].message.content.trim()

    // メモリキャッシュに保存
    completionCache.set(cacheKey, { data: generatedText, timestamp: Date.now() })

    return generatedText
  } catch (error) {
    console.error("Error generating text:", error)
    throw error
  }
}

/**
 * アイテムの特徴を生成する
 * @param item アイテム
 * @param category カテゴリ
 * @returns 生成された特徴の配列
 */
export async function generateItemFeatures(item: Partial<RecommendationItem>, category: string): Promise<string[]> {
  const cacheKey = `features:${item.name}:${category}`

  // グローバルAPIキャッシュをチェック
  try {
    const cachedFeatures = await globalApiCache.fetch<string[]>(cacheKey)
    if (cachedFeatures && cachedFeatures.length > 0) {
      return cachedFeatures
    }
  } catch (error) {
    // キャッシュミスは無視
  }

  // カテゴリに応じたプロンプトを作成
  let prompt = `以下の${getCategoryName(category)}の特徴を3つ、箇条書きで簡潔に説明してください。各特徴は20文字以内にしてください。\n\n名前: ${
    item.name
  }`

  if (item.reason) {
    prompt += `\n概要: ${item.reason}`
  }

  try {
    const featuresText = await generateText(prompt, {
      maxTokens: 150,
      temperature: 0.7,
      systemPrompt: "あなたは簡潔で正確な特徴を提供する専門家です。",
    })

    // 箇条書きを配列に変換
    const features = featuresText
      .split(/\n/)
      .map((line) => line.replace(/^[•\-*]\s*/, "").trim())
      .filter((line) => line.length > 0)
      .slice(0, 3)

    // グローバルAPIキャッシュに保存
    await globalApiCache.invalidateCache(cacheKey)
    await globalApiCache.fetch(cacheKey, {
      method: "PUT",
      body: JSON.stringify(features),
    })

    return features
  } catch (error) {
    console.error("Error generating item features:", error)
    // エラー時はデフォルトの特徴を返す
    return ["個性的な魅力", "独自のスタイル", "ファンを魅了する才能"]
  }
}

/**
 * 類似アイテムの理由を生成する
 * @param sourceItem 元のアイテム
 * @param targetItem ターゲットアイテム
 * @param category カテゴリ
 * @returns 生成された理由
 */
export async function generateSimilarityReason(
  sourceItem: string,
  targetItem: string,
  category: string,
): Promise<string> {
  const cacheKey = `reason:${sourceItem}:${targetItem}:${category}`

  // グローバルAPIキャッシュをチェック
  try {
    const cachedReason = await globalApiCache.fetch<string>(cacheKey)
    if (cachedReason && cachedReason.length > 0) {
      return cachedReason
    }
  } catch (error) {
    // キャッシュミスは無視
  }

  const categoryName = getCategoryName(category)
  const prompt = `「${sourceItem}」が好きな人に「${targetItem}」をおすすめする理由を1文（40文字以内）で説明してください。両者の共通点や類似点に焦点を当ててください。`

  try {
    const reason = await generateText(prompt, {
      maxTokens: 100,
      temperature: 0.7,
      systemPrompt: `あなたは${categoryName}に詳しい専門家です。簡潔で魅力的な説明を提供してください。`,
    })

    // 文字数制限
    const trimmedReason = reason.length > 60 ? reason.substring(0, 57) + "..." : reason

    // グローバルAPIキャッシュに保存
    await globalApiCache.invalidateCache(cacheKey)
    await globalApiCache.fetch(cacheKey, {
      method: "PUT",
      body: JSON.stringify(trimmedReason),
    })

    return trimmedReason
  } catch (error) {
    console.error("Error generating similarity reason:", error)
    // エラー時はデフォルトの理由を返す
    return `${sourceItem}に似た雰囲気と魅力を持っています`
  }
}

/**
 * カテゴリ名を取得する
 * @param category カテゴリキー
 * @returns 日本語のカテゴリ名
 */
function getCategoryName(category: string): string {
  const categoryNames: Record<string, string> = {
    artists: "アーティスト",
    media: "映画/アニメ",
    celebrities: "芸能人/インフルエンサー",
    fashion: "ファッションブランド",
  }

  return categoryNames[category] || category
}
