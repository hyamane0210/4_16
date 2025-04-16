/**
 * 検索履歴を管理するユーティリティ関数
 */

// ローカルストレージのキー
const SEARCH_HISTORY_KEY = "search_history"
const MAX_HISTORY_ITEMS = 20

/**
 * ローカルストレージから検索履歴を取得する関数
 */
export function getLocalSearchHistory(): string[] {
  if (typeof window === "undefined") return []

  try {
    const storedHistory = localStorage.getItem(SEARCH_HISTORY_KEY)
    if (storedHistory) {
      return JSON.parse(storedHistory)
    }
  } catch (error) {
    console.error("Failed to parse search history from localStorage", error)
  }

  return []
}

/**
 * 検索履歴に新しい検索語を追加する関数
 */
export function addToSearchHistory(term: string): void {
  if (typeof window === "undefined") return

  try {
    const history = getLocalSearchHistory()

    // 既存の履歴から同じ検索語を削除
    const filteredHistory = history.filter((item) => item.toLowerCase() !== term.toLowerCase())

    // 新しい検索語を先頭に追加
    const updatedHistory = [term, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS)

    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory))
  } catch (error) {
    console.error("Failed to update search history in localStorage", error)
  }
}

/**
 * 検索履歴から項目を削除する関数
 */
export function removeFromSearchHistory(term: string): void {
  if (typeof window === "undefined") return

  try {
    const history = getLocalSearchHistory()
    const updatedHistory = history.filter((item) => item !== term)
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory))
  } catch (error) {
    console.error("Failed to remove item from search history", error)
  }
}

/**
 * 検索履
