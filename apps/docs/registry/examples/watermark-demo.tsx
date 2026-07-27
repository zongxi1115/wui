import { Watermark } from "@/registry/ui/watermark"

export default function WatermarkDemo() {
  return (
    <Watermark content="WUI" className="w-full max-w-xl">
      <div className="bg-card text-card-foreground rounded-lg border p-8 shadow-sm">
        <h3 className="text-lg font-semibold">Quarterly report</h3>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          Watermarks identify ownership without blocking selection, clicks, or
          other interactions with the protected content.
        </p>
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[
            ["Revenue", "$128K"],
            ["Growth", "+18%"],
            ["Customers", "2,406"],
          ].map(([label, value]) => (
            <div key={label} className="bg-muted rounded-md p-3">
              <div className="text-muted-foreground text-xs">{label}</div>
              <div className="mt-1 font-semibold">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </Watermark>
  )
}
