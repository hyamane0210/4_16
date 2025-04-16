"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Home, Search, Heart, BarChart2, Menu, X, User, LogOut, Sparkles } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/auth-context"
import { useOnboarding } from "@/contexts/onboarding-context"
import { markVisitedInSession } from "@/utils/session-utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isLoading, signOut } = useAuth()
  const { allowNavigation, isFirstVisit } = useOnboarding()
  const [mounted, setMounted] = useState(false)

  // クライアントサイドでのみレンダリングを確認
  useEffect(() => {
    setMounted(true)

    // 現在のページがウェルカムページでない場合、セッション訪問済みとしてマーク
    if (pathname !== "/welcome" && pathname !== "/quick-selection" && pathname !== "/guided-search") {
      markVisitedInSession()
    }
  }, [pathname])

  // Make sure we're importing the correct icons
  // Make sure the navItems array includes the recommended page
  const navItems = [
    { href: "/", label: "ホーム", icon: Home },
    { href: "/search", label: "検索", icon: Search },
    { href: "/favorites", label: "お気に入り", icon: Heart },
    { href: "/recommended", label: "おすすめ", icon: Sparkles },
    { href: "/analysis", label: "好み分析", icon: BarChart2 },
  ]

  // ヘッダーのナビゲーションリンクにカスタムクリックハンドラを追加
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    // ウェルカムページへのアクセスは常に許可
    if (path === "/welcome") {
      router.push(path)
      return
    }

    e.preventDefault() // デフォルトのナビゲーションを防止

    // セッション訪問済みとしてマーク
    markVisitedInSession()

    // オンボーディングコンテキストを通じてナビゲーションを許可
    if (allowNavigation(path)) {
      router.push(path)
    }
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  // サーバーサイドレンダリング時やマウント前は簡易表示
  if (!mounted) {
    return (
      <header className="sticky top-0 z-40 w-full bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="text-xl font-bold">My Project</div>
            <div className="w-8 h-8">
              <Skeleton className="w-8 h-8 rounded-full" />
            </div>
          </div>
        </div>
      </header>
    )
  }

  // ヘッダーのスタイルを更新
  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            onClick={(e) => handleNavClick(e, "/")}
            className="text-xl font-bold flex-shrink-0 gradient-text"
          >
            My Project
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 flex-1 justify-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/80 hover:bg-accent/50 hover:text-foreground",
                )}
              >
                <item.icon className="h-5 w-5 mr-1.5" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {isLoading ? (
              <Skeleton className="w-8 h-8 rounded-full" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                      <ImageWithFallback
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                        fallbackText={user.name.charAt(0).toUpperCase()}
                        identifier={`user-avatar-${user.id}`}
                        containerClassName="rounded-full"
                      />
                      <AvatarFallback className="text-lg bg-primary/10 text-primary">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" onClick={(e) => handleNavClick(e, "/profile")} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>プロフィール</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={signOut}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>ログアウト</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="px-3 py-1 rounded-md hover:bg-gray-100 transition-all duration-200"
                >
                  <Link href="/signin" onClick={(e) => handleNavClick(e, "/signin")}>
                    <span className="text-gray-900 font-medium">ログイン</span>
                  </Link>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  asChild
                  className="px-3 py-1 rounded-md bg-gray-900 hover:bg-gray-800 transition-all duration-200"
                >
                  <Link href="/signup" onClick={(e) => handleNavClick(e, "/signup")}>
                    <span className="font-medium">登録</span>
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" aria-label="メニュー">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[350px] md:hidden">
                <div className="flex flex-col h-full py-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold gradient-text">メニュー</h2>
                    <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <nav className="flex flex-col space-y-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center px-4 py-3 text-base font-medium rounded-md transition-colors",
                          isActive(item.href)
                            ? "bg-primary/10 text-primary"
                            : "text-foreground/80 hover:bg-accent/50 hover:text-foreground",
                        )}
                        onClick={(e) => {
                          handleNavClick(e, item.href)
                          setMobileMenuOpen(false)
                        }}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.label}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile auth buttons */}
                  <div className="mt-auto pt-6 border-t">
                    {user ? (
                      <div className="space-y-3">
                        <div className="flex items-center px-4">
                          <Avatar className="h-9 w-9 mr-3 ring-2 ring-primary/20">
                            <ImageWithFallback
                              src={user.avatar || "/placeholder.svg"}
                              alt={user.name}
                              width={36}
                              height={36}
                              className="rounded-full"
                              fallbackText={user.name.charAt(0).toUpperCase()}
                              identifier={`mobile-user-avatar-${user.id}`}
                              containerClassName="rounded-full"
                            />
                            <AvatarFallback className="text-lg bg-primary/10 text-primary">
                              {user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Button
                            variant="ghost"
                            className="w-full justify-start px-4"
                            onClick={(e) => {
                              e.preventDefault()
                              markVisitedInSession()
                              allowNavigation("/profile")
                              router.push("/profile")
                              setMobileMenuOpen(false)
                            }}
                          >
                            <User className="mr-3 h-5 w-5" />
                            プロフィール
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start px-4 text-destructive hover:text-destructive"
                            onClick={() => {
                              signOut()
                              setMobileMenuOpen(false)
                            }}
                          >
                            <LogOut className="mr-3 h-5 w-5" />
                            ログアウト
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-2 px-4">
                        <Button
                          variant="default"
                          className="rounded-md bg-gray-900 hover:bg-gray-800 transition-all duration-200"
                          onClick={(e) => {
                            e.preventDefault()
                            markVisitedInSession()
                            allowNavigation("/signup")
                            router.push("/signup")
                            setMobileMenuOpen(false)
                          }}
                        >
                          <span className="font-medium">登録</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="rounded-md border-gray-300 hover:bg-gray-100 transition-all duration-200"
                          onClick={(e) => {
                            e.preventDefault()
                            markVisitedInSession()
                            allowNavigation("/signin")
                            router.push("/signin")
                            setMobileMenuOpen(false)
                          }}
                        >
                          <span className="text-gray-900 font-medium">ログイン</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
