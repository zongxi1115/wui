import { ProgressiveBlur } from "@/registry/ui/progressive-blur"

const activity = [
  ["09:42", "Design review completed"],
  ["10:18", "Three comments resolved"],
  ["11:06", "Prototype shared with team"],
  ["12:24", "Release notes drafted"],
  ["14:10", "Version 2.4 published"],
]

export default function ProgressiveBlurDemo() {
  return (
    <div className="bg-background relative h-72 w-full max-w-md overflow-hidden rounded-lg border">
      <div className="border-b px-5 py-4">
        <p className="font-medium">Recent activity</p>
        <p className="text-muted-foreground text-sm">Monday, July 27</p>
      </div>
      <div className="divide-y px-5">
        {activity.map(([time, label]) => (
          <div key={time} className="flex items-center gap-4 py-4 text-sm">
            <span className="text-muted-foreground w-10 shrink-0 font-mono text-xs">
              {time}
            </span>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <ProgressiveBlur
        direction="bottom"
        blurLayers={8}
        blurIntensity={0.65}
        className="absolute inset-x-0 bottom-0 h-28"
      />
      <div className="text-muted-foreground pointer-events-none absolute inset-x-0 bottom-4 z-10 text-center text-xs font-medium">
        Scroll for earlier activity
      </div>
    </div>
  )
}
