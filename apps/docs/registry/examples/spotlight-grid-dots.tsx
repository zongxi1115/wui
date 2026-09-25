import { SpotlightGrid } from "@/registry/ui/spotlight-grid"

export default function SpotlightGridDots() {
  return (
    <SpotlightGrid
      pattern="dots"
      size={18}
      radius={160}
      baseOpacity={0.14}
      patternColor="var(--chart-1)"
      className="bg-card w-full max-w-md rounded-lg border"
    >
      <div className="flex h-56 flex-col items-center justify-center text-center">
        <p className="font-medium">拖拽文件到这里上传</p>
        <p className="text-muted-foreground mt-1 text-sm">
          支持 PNG、JPG、PDF，单个文件不超过 20MB
        </p>
      </div>
    </SpotlightGrid>
  )
}
