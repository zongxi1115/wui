import { Button } from "@/registry/ui/button"
import { ConfirmDialog } from "@/registry/components/confirm-dialog"

export default function ConfirmDialogDemo() {
  return (
    <ConfirmDialog
      trigger={<Button variant="destructive">Delete account</Button>}
      title="Delete account?"
      description="This will permanently delete your account and all of its data."
      confirmLabel="Delete"
      variant="destructive"
      onConfirm={() => window.alert("Account deleted")}
    />
  )
}
