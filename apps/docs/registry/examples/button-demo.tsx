import { Button } from "@/registry/ui/button"

export default function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button>保存更改</Button>
      <Button variant="outline">取消</Button>
    </div>
  )
}
