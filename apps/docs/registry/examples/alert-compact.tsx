import { Alert } from "@/registry/ui/alert"

export default function AlertCompact() {
  return (
    <div className="w-full max-w-lg">
      <Alert size="compact" variant="success">
        Deployment completed successfully.
      </Alert>
    </div>
  )
}
