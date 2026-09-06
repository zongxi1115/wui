import { AtSignIcon, UserIcon } from "lucide-react"

import { Input } from "@/registry/ui/input"

export default function InputFloatingLabel() {
  return (
    <div className="grid w-full max-w-sm gap-3">
      <Input label="Full name" startContent={<UserIcon />} />
      <Input label="Email address" type="email" startContent={<AtSignIcon />} />
    </div>
  )
}
