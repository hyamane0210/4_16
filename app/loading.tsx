import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <p className="mt-4 text-muted-foreground">読み込み中...</p>
      </div>
    </div>
  )
}
