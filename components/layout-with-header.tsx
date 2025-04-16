"use client"

import type { ReactNode } from "react"

interface LayoutWithHeaderProps {
  children: ReactNode
}

export default function LayoutWithHeader({ children }: LayoutWithHeaderProps) {
  return (
    <div>
      <main>{children}</main>
    </div>
  )
}
