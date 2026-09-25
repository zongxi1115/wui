import { TextShimmer } from "@/registry/ui/text-shimmer"

export default function TextShimmerDemo() {
  return (
    <TextShimmer duration={1.8} className="text-base font-medium">
      正在检索知识库并生成回答…
    </TextShimmer>
  )
}
