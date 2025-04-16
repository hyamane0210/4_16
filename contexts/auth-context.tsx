"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
  id: string
  email: string
  name: string
  avatar?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  signUp: (email: string, password: string, name: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // ローカルストレージからユーザー情報を読み込む
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Failed to parse user from localStorage", e)
      }
    }
    setIsLoading(false)
  }, [])

  // サインアップ処理
  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      // 実際のアプリではAPIリクエストを行う
      // ここではローカルストレージに保存するだけの簡易実装
      await new Promise((resolve) => setTimeout(resolve, 1000)) // 処理時間をシミュレート

      // パスワードをハッシュ化して保存（実際のアプリではサーバーサイドで行う）
      localStorage.setItem(`user_${email}`, JSON.stringify({ email, password, name }))

      const newUser = {
        id: Date.now().toString(),
        email,
        name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      }

      localStorage.setItem("user", JSON.stringify(newUser))
      setUser(newUser)
    } catch (error) {
      console.error("Sign up failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // サインイン処理
  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // 実際のアプリではAPIリクエストを行う
      // ここではローカルストレージから読み込むだけの簡易実装
      await new Promise((resolve) => setTimeout(resolve, 1000)) // 処理時間をシミュレート

      const storedUserData = localStorage.getItem(`user_${email}`)
      if (!storedUserData) {
        throw new Error("User not found")
      }

      const userData = JSON.parse(storedUserData)
      if (userData.password !== password) {
        throw new Error("Invalid password")
      }

      const loggedInUser = {
        id: Date.now().toString(),
        email,
        name: userData.name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`,
      }

      localStorage.setItem("user", JSON.stringify(loggedInUser))
      setUser(loggedInUser)
    } catch (error) {
      console.error("Sign in failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // サインアウト処理
  const signOut = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, isLoading, signUp, signIn, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
