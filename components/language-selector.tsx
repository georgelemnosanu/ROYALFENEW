"use client"

import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSimpleLanguage } from "@/lib/translations"

export function LanguageSelector() {
  const { currentLang, changeLanguage, t } = useSimpleLanguage()

  const toggleLanguage = () => {
    changeLanguage(currentLang === "en" ? "ro" : "en")
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="text-white hover:text-amber-200 transition-colors"
    >
      <Globe className="h-4 w-4 mr-2" />
      {currentLang === "en" ? "🇺🇸 EN" : "🇷🇴 RO"}
    </Button>
  )
}
