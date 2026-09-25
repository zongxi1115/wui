import { Upload } from "@/registry/ui/upload"

export default function UploadStates() {
  return (
    <div className="grid w-full max-w-lg gap-3 sm:grid-cols-2">
      <Upload size="compact" label="上传合同" description="PDF 或 DOCX，不超过 20 MB" accept=".pdf,.docx" />
      <Upload size="compact" label="上传素材" status="uploading" progress={68} multiple />
      <Upload size="compact" label="素材已接收" status="complete" />
      <Upload size="compact" label="上传素材" status="error" />
    </div>
  )
}
