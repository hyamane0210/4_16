"use client"

import { useOnboarding } from "@/contexts/onboarding-context"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import { useState, useEffect, useCallback } from "react"

export function RestartOnboardingButton() {
  const [mounted, setMounted] = useState(false)

  // クライアントサイドでのみレンダリングを確認
  useEffect(() => {
    setMounted(true)
  }, [])

  const { startOnboarding } = useOnboarding()

  const handleClick = useCallback(() => {
    // 直接ウェルカムページに遷移
    window.location.href = "/welcome"
  }, [])

  // サーバーサイドレンダリング時やマウント前は何も表示しない
  if (!mounted) {
    return null
  }

  return (
    <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleClick}>
      <HelpCircle className="h-4 w-4" />
      <span className="hidden sm:inline">使い方</span>
    </Button>
  )
}
