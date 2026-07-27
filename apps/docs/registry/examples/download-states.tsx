import { Download } from "@/registry/ui/download"
import { LockKeyholeIcon } from "lucide-react"

export default function DownloadStates() {
  return (
    <div className="grid w-full max-w-md gap-3">
      <Download size="compact" filename="Press photos.zip" meta="ZIP · 18 MB" />
      <Download size="compact" filename="Product walkthrough.mp4" status="downloading" progress={64} />
      <Download size="compact" filename="Q3 report.pdf" status="complete" />
      <Download size="compact" filename="Private.key" fileIcon={<LockKeyholeIcon className="size-4" />} />
    </div>
  )
}
