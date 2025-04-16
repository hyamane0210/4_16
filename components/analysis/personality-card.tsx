import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PersonalityCardProps {
  title: string
  emoji: string
  description: string
  matchPercentage: number
  traits: string[]
  recommendations: {
    name: string
    type: string
  }[]
}

export function PersonalityCard({
  title,
  emoji,
  description,
  matchPercentage,
  traits,
  recommendations,
}: PersonalityCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="bg-gradient-to-r from-[#454545] to-[#828282] h-2" />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <span>{emoji}</span> {title}
          </CardTitle>
          <Badge className="bg-[#454545]">{matchPercentage}% マッチ</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>

        <div>
          <h4 className="text-sm font-semibold mb-2">特徴</h4>
          <div className="flex flex-wrap gap-2">
            {traits.map((trait, index) => (
              <Badge key={index} variant="outline" className="bg-[#f5f5f5]">
                {trait}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2">おすすめ</h4>
          <div className="grid grid-cols-2 gap-2">
            {recommendations.map((rec, index) => (
              <div key={index} className="text-xs bg-[#f5f5f5] p-2 rounded-md">
                <span className="font-medium">{rec.name}</span>
                <span className="block text-muted-foreground">{rec.type}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
