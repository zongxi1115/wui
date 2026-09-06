import { Upload } from "@/registry/ui/upload"

export default function UploadStates() {
  return (
    <div className="grid w-full max-w-lg gap-3 sm:grid-cols-2">
      <Upload size="compact" label="Upload a document" description="PDF or DOCX" accept=".pdf,.docx" />
      <Upload size="compact" label="Uploading assets" status="uploading" progress={68} multiple />
      <Upload size="compact" label="Assets received" status="complete" />
      <Upload size="compact" label="Upload assets" status="error" />
    </div>
  )
}
