import { Input } from "@/registry/ui/input"

export default function InputUnderline() {
  return (
    <div className="grid w-full max-w-sm gap-5">
      <Input variant="underline" placeholder="Project name" />
      <Input variant="underline" label="Workspace URL" />
    </div>
  )
}
