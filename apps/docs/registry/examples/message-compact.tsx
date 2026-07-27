import { Message } from "@/registry/ui/message"

export default function MessageCompact() {
  return (
    <div className="w-full max-w-lg">
      <Message size="compact" variant="success">
        Deployment completed successfully.
      </Message>
    </div>
  )
}
