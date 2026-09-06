import { Motion, type MotionPreset } from "@/registry/ui/motion"

const presets: MotionPreset[] = ["fade", "scale", "slide-up", "pop", "blur"]

export default function MotionPresets() {
  return (
    <div className="flex flex-wrap gap-3">
      {presets.map((preset, i) => (
        <Motion
          key={preset}
          preset={preset}
          delay={i * 0.08}
          transition="spring"
          className="rounded-md border bg-muted px-4 py-3 text-sm font-medium"
        >
          {preset}
        </Motion>
      ))}
    </div>
  )
}
