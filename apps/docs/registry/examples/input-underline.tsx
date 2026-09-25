import { LinkIcon } from "lucide-react"

import { Input } from "@/registry/ui/input"

export default function InputUnderline() {
  return (
    <div className="grid w-full max-w-sm gap-6">
      <Input variant="underline" placeholder="项目名称" allowClear />
      <Input variant="underline" label="访问地址" startContent={<LinkIcon />} />
    </div>
  )
}
