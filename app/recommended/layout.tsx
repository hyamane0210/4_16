import type React from "react"
import LayoutContent from "@/app/layout-content"

export default function RecommendedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <LayoutContent>{children}</LayoutContent>
}
