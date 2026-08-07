import { Textarea } from "@/registry/ui/textarea"

export default function TextareaDemo() {
  return (
    <div className="w-full max-w-md space-y-2">
      <label htmlFor="project-note" className="text-sm font-medium">
        项目说明
      </label>
      <Textarea
        id="project-note"
        placeholder="补充目标、范围或需要协作的事项…"
      />
      <p className="text-muted-foreground text-xs">
        说明会同步给当前项目的所有成员。
      </p>
    </div>
  )
}
