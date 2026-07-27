import { TextShimmer } from "@/registry/ui/text-shimmer"

export default function TextShimmerDemo() {
  return (
    <TextShimmer className="text-xl font-medium" duration={1.8} spread={1.6}>
      Generating code…
    </TextShimmer>
  )
}
