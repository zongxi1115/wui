import { Button } from "@/registry/ui/button"
import { Alert } from "@/registry/ui/alert"

export default function AlertAction() {
  return (
    <div className="w-full max-w-lg">
      <Alert
        title="Draft restored"
        action={
          <Button variant="ghost" size="sm">
            Review
          </Button>
        }
      >
        We recovered changes from your previous session.
      </Alert>
    </div>
  )
}
