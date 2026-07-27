import { Message } from "@/registry/ui/message"

export default function MessageVariants() {
  return (
    <div className="grid w-full max-w-lg gap-3">
      <Message variant="info" title="New version available">
        Refresh the page when you are ready to update.
      </Message>
      <Message variant="success" title="Changes saved">
        Your workspace settings are now up to date.
      </Message>
      <Message variant="warning" title="Storage is almost full">
        Remove unused files to keep uploads working.
      </Message>
      <Message variant="destructive" title="Connection failed">
        Check your network and try again.
      </Message>
    </div>
  )
}
