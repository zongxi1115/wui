import { InfiniteSlider } from "@/registry/ui/infinite-slider"

const tools = ["React", "Motion", "Tailwind", "Radix", "TypeScript", "Next.js"]

export default function InfiniteSliderDemo() {
  return (
    <div className="w-full max-w-2xl [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <InfiniteSlider speed={48} speedOnHover={12} gap={12}>
        {tools.map((tool) => (
          <div
            className="bg-background shadow-xs shrink-0 rounded-md border px-5 py-3 text-sm font-medium"
            key={tool}
          >
            {tool}
          </div>
        ))}
      </InfiniteSlider>
    </div>
  )
}
