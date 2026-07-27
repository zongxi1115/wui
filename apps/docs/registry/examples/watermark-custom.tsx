import { Watermark } from "@/registry/ui/watermark"

export default function WatermarkCustom() {
  return (
    <Watermark
      content={["CONFIDENTIAL", "acme@example.com"]}
      rotate={-16}
      gap={[48, 56]}
      width={190}
      height={72}
      opacity={0.2}
      font={{ fontSize: 13, fontWeight: 600 }}
      className="w-full max-w-xl"
    >
      <div className="bg-card text-card-foreground rounded-lg border p-8 shadow-sm">
        <h3 className="font-semibold">Internal project brief</h3>
        <p className="text-muted-foreground mt-3 text-sm leading-6">
          Use multiple lines to combine a document status with a viewer name,
          email address, or other traceable identifier.
        </p>
      </div>
    </Watermark>
  )
}
