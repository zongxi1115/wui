import { AlertCircleIcon, MailIcon } from "lucide-react"

import { Input } from "@/registry/ui/input"

export default function InputStates() {
  return (
    <div className="grid w-full max-w-sm gap-3">
      <Input type="email" placeholder="name@example.com" startContent={<MailIcon />} />
      <Input defaultValue="Not a valid address" aria-invalid="true" endContent={<AlertCircleIcon className="text-destructive" />} />
      <Input placeholder="Disabled" disabled />
    </div>
  )
}
