import { Progress } from "@/registry/ui/progress"

const sizes = [
  { size: "sm", value: 45, note: "4px · 列表行内" },
  { size: "default", value: 65, note: "6px · 默认" },
  { size: "lg", value: 85, note: "8px · 页面主进度" },
] as const

export default function ProgressSizes() {
  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-4">
        {sizes.map((item) => (
          <div key={item.size} className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <code className="font-mono">size=&quot;{item.size}&quot;</code>
              <span className="text-muted-foreground">{item.note}</span>
            </div>
            <Progress size={item.size} value={item.value} aria-label={`size ${item.size}`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 border-t pt-6">
        {sizes.map((item) => (
          <div key={item.size} className="flex flex-col items-center gap-2.5">
            <Progress
              variant="circular"
              size={item.size}
              value={item.value}
              showValue
              aria-label={`circular ${item.size}`}
            />
            <code className="text-muted-foreground font-mono text-xs">{item.size}</code>
          </div>
        ))}
      </div>
    </div>
  )
}
