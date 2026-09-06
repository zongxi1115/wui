import { Button } from "@/registry/ui/button"
import { ButtonGroup } from "@/registry/ui/button-group"

export default function ButtonGroupAdvanced() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <ButtonGroup aria-label="时间范围">
        <Button variant="outline">今天</Button>
        <Button variant="outline">本周</Button>
        <Button variant="outline">本月</Button>
      </ButtonGroup>

      <ButtonGroup orientation="vertical" aria-label="发布操作">
        <Button variant="outline">保存草稿</Button>
        <Button variant="outline">预览内容</Button>
        <Button variant="outline" disabled>
          定时发布
        </Button>
      </ButtonGroup>
    </div>
  )
}
