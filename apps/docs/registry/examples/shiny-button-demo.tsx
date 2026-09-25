import { ArrowRightIcon, SparklesIcon } from "lucide-react"

import { ShinyButton } from "@/registry/ui/shiny-button"

export default function ShinyButtonDemo() {
  return (
    <ShinyButton>
      <SparklesIcon />
      开始免费试用
      <ArrowRightIcon />
    </ShinyButton>
  )
}
