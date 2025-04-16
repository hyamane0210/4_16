"use client"
import { useOnboarding } from "@/contexts/onboarding-context"
import { WelcomeStep } from "./welcome-step"
import { QuickSelection } from "./quick-selection"
import { GuidedSearch } from "./guided-search"
import { SearchStep } from "./search-step"
import { FavoritesStep } from "./favorites-step"
import { AnalysisStep } from "./analysis-step"
import { CompleteStep } from "./complete-step"

export function OnboardingSteps() {
  const { currentStep } = useOnboarding()

  // ステップに応じたコンポーネントを表示
  switch (currentStep) {
    case 1:
      return <WelcomeStep />
    case 2:
      return <QuickSelection />
    case 3:
      return <GuidedSearch />
    case 4:
      return <SearchStep />
    case 5:
      return <FavoritesStep />
    case 6:
      return <AnalysisStep />
    case 7:
      return <CompleteStep />
    default:
      return <WelcomeStep />
  }
}
