import { Motion } from "@/registry/ui/motion"

export default function MotionInView() {
  return (
    <div className="w-full space-y-3">
      {["First", "Second", "Third"].map((label, i) => (
        <Motion
          key={label}
          inView
          preset="slide-up"
          delay={i * 0.1}
          className="rounded-md border bg-card px-4 py-3 text-sm text-card-foreground shadow-sm"
        >
          {label} — animates when scrolled into view
        </Motion>
      ))}
    </div>
  )
}
