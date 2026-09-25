import { MailIcon, UserIcon } from "lucide-react"

import { Input } from "@/registry/ui/input"

export default function InputFloatingLabel() {
  return (
    <div className="grid w-full max-w-sm gap-3">
      <Input label="姓名" autoComplete="name" startContent={<UserIcon />} />
      <Input
        label="工作邮箱"
        type="email"
        autoComplete="email"
        defaultValue="lin.wei@example.com"
        startContent={<MailIcon />}
        allowClear
      />
    </div>
  )
}
