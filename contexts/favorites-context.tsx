"use client"

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react"
import type { RecommendationItem } from "@/components/recommendations"

type FavoritesContextType = {
  favorites: RecommendationItem[]
  addFavorite: (item: RecommendationItem) => void
  removeFavorite: (name: string) => void
  isFavorite: (name: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

// Storage key constant
const STORAGE_KEY = "favorites"

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<RecommendationItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load favorites from localStorage only once on mount
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(STORAGE_KEY)
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites))
      }
    } catch (e) {
      console.error("Failed to parse favorites from localStorage", e)
    } finally {
      setIsInitialized(true)
    }
  }, [])

  // Save favorites to localStorage when they change, but only after initialization
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
      } catch (e) {
        console.error("Failed to save favorites to localStorage", e)
      }
    }
  }, [favorites, isInitialized])

  // Memoize functions to prevent unnecessary re-renders
  const addFavorite = useCallback((item: RecommendationItem) => {
    setFavorites((prev) => {
      // Check if item already exists
      if (prev.some((fav) => fav.name === item.name)) {
        return prev
      }
      return [...prev, item]
    })
  }, [])

  const removeFavorite = useCallback((name: string) => {
    setFavorites((prev) => prev.filter((item) => item.name !== name))
  }, [])

  const isFavorite = useCallback(
    (name: string) => {
      return favorites.some((item) => item.name === name)
    },
    [favorites],
  )

  // Memoize context value
  const contextValue = useMemo(
    () => ({
      favorites,
      addFavorite,
      removeFavorite,
      isFavorite,
    }),
    [favorites, addFavorite, removeFavorite, isFavorite],
  )

  return <FavoritesContext.Provider value={contextValue}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
