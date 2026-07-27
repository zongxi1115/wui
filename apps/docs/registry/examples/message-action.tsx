import { Button } from "@/registry/ui/button"
import { Message } from "@/registry/ui/message"

export default function MessageAction() {
  return (
    <div className="w-full max-w-lg">
      <Message
        title="Draft restored"
        action={
          <Button variant="ghost" size="sm">
            Review
          </Button>
        }
      >
        We recovered changes from your previous session.
      </Message>
    </div>
  )
}
