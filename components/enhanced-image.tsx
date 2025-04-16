"use client"

import type React from "react"
import Image, { type ImageProps } from "next/image"
import { cn } from "@/lib/utils"

// 画像ソースの優先順位
export enum ImageSource {
  SPOTIFY = "spotify",
  TMDB = "tmdb",
  KNOWLEDGE_GRAPH = "knowledge_graph",
  ORIGINAL = "original",
  FALLBACK = "fallback",
}

interface EnhancedImageProps extends ImageProps {
  apiSource?: ImageSource
  fallbackText?: string
  identifier?: string
}

export const EnhancedImage: React.FC<EnhancedImageProps> = ({
  src,
  alt,
  className,
  fallbackText,
  identifier,
  apiSource = ImageSource.ORIGINAL,
  ...props
}) => {
  const placeholderText = fallbackText || alt?.substring(0, 2).toUpperCase() || "??"

  return (
    <div className="relative w-full h-full">
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        className={cn("object-cover", className)}
        fill
        placeholder="blur"
        blurDataURL="/placeholder.svg" // Replace with a real blur data URL if available
        {...props}
      />
    </div>
  )
}
