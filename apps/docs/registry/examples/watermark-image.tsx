import { Watermark } from "@/registry/ui/watermark"

const watermarkImage = `data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40">
    <path fill="#2563eb" d="M8 6h24l8 14-8 14H8L0 20 8 6Z"/>
    <path fill="white" d="m9 13 4 14h4l3-8 3 8h4l4-14h-4l-2.5 9-3-9h-3l-3 9-2.5-9H9Z"/>
    <text x="47" y="26" fill="#2563eb" font-family="Arial, sans-serif" font-size="18" font-weight="700">WUI</text>
  </svg>
`)}`

export default function WatermarkImage() {
  return (
    <Watermark
      image={watermarkImage}
      rotate={-18}
      width={108}
      height={36}
      gap={[56, 52]}
      opacity={0.16}
      className="w-full max-w-xl"
    >
      <div className="bg-card text-card-foreground border p-8">
        <div className="flex items-start justify-between gap-6 border-b pb-5">
          <div>
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
              Analytics workspace
            </p>
            <h3 className="mt-2 text-lg font-semibold">Usage summary</h3>
          </div>
          <span className="text-muted-foreground text-xs tabular-nums">
            Q2 2026
          </span>
        </div>
        <p className="text-muted-foreground mt-5 max-w-md text-sm leading-6">
          Image watermarks can repeat a logo or organization mark while the
          report content remains selectable and interactive.
        </p>
      </div>
    </Watermark>
  )
}
