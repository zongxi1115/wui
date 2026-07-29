import { Alert } from "@/registry/ui/alert"

export default function AlertDemo() {
  return (
    <div className="grid w-full max-w-lg gap-3">
      <Alert variant="info" title="New version available">
        Refresh the page when you are ready to update.
      </Alert>
      <Alert variant="success" title="Changes saved">
        Your workspace settings are now up to date.
      </Alert>
      <Alert variant="warning" title="Storage is almost full">
        Remove unused files to keep uploads working.
      </Alert>
      <Alert variant="destructive" title="Connection failed">
        Check your network and try again.
      </Alert>
    </div>
  )
}
