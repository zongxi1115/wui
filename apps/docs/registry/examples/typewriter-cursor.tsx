import { Typewriter, type TypewriterCursor } from "@/registry/ui/typewriter"

const rows: { cursor: TypewriterCursor; label: string; text: string }[] = [
  { cursor: "bar", label: "bar", text: "pnpm add motion" },
  { cursor: "block", label: "block", text: "git push origin main" },
  { cursor: "underscore", label: "underscore", text: "wui add text-rotate" },
]

export default function TypewriterCursorDemo() {
  return (
    <div className="w-full max-w-md divide-y rounded-lg border font-mono text-sm">
      {rows.map((row, index) => (
        <div key={row.cursor} className="flex items-center gap-3 px-4 py-3">
          <span className="w-24 shrink-0 text-xs text-muted-foreground">
            {row.label}
          </span>
          <span className="text-muted-foreground">$</span>
          <Typewriter
            texts={[row.text]}
            cursor={row.cursor}
            startDelay={index * 400}
            typeSpeed={60}
            pauseDuration={2400}
            className="text-foreground"
          />
        </div>
      ))}
    </div>
  )
}
