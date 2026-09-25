import { Button } from "@/registry/ui/button"

export default function ButtonMotion() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button motion>立即升级</Button>
      <Button motion variant="secondary">
        稍后提醒
      </Button>
      <Button motion variant="outline">
        对比套餐
      </Button>
    </div>
  )
}
