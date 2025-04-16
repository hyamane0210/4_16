"use client"

import { useState, useEffect } from "react"

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // ステートを初期化
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue
    }
    try {
      // ローカルストレージからアイテムを取得
      const item = window.localStorage.getItem(key)
      // 解析して返すか、見つからない場合は初期値を返す
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // ローカルストレージと状態を同期させる関数
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // 新しい値が関数の場合は、前の状態を引数として実行
      const valueToStore = value instanceof Function ? value(storedValue) : value
      // ステートを保存
      setStoredValue(valueToStore)
      // ローカルストレージにも保存
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  // ローカルストレージの変更を監視（他のタブでの変更に対応）
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          setStoredValue(JSON.parse(event.newValue))
        } catch (error) {
          console.error(`Error parsing localStorage value:`, error)
        }
      }
    }

    // イベントリスナーを追加
    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange)
    }

    // クリーンアップ関数
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorageChange)
      }
    }
  }, [key])

  return [storedValue, setValue]
}
