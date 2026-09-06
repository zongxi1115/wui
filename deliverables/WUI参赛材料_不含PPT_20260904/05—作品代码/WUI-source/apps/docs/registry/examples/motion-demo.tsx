import { Motion } from "@/registry/ui/motion"

export default function MotionDemo() {
  return (
    <Motion
      preset="slide-up"
      className="rounded-lg border bg-card px-6 py-4 text-sm text-card-foreground shadow-sm"
    >
      I slide up and fade in when I mount.
    </Motion>
  )
}
