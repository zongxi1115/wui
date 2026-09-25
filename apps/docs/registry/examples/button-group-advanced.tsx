import { CalendarClockIcon, EyeIcon, SaveIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { ButtonGroup } from "@/registry/ui/button-group"

export default function ButtonGroupAdvanced() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <ButtonGroup aria-label="时间范围">
        <Button variant="outline" size="sm">
          今天
        </Button>
        <Button variant="outline" size="sm">
          近 7 天
        </Button>
        <Button variant="outline" size="sm">
          近 30 天
        </Button>
        <Button variant="outline" size="sm">
          自定义
        </Button>
      </ButtonGroup>

      <ButtonGroup orientation="vertical" aria-label="发布操作">
        <Button variant="outline" className="justify-start">
          <SaveIcon />
          保存草稿
        </Button>
        <Button variant="outline" className="justify-start">
          <EyeIcon />
          预览内容
        </Button>
        <Button variant="outline" className="justify-start" disabled>
          <CalendarClockIcon />
          定时发布
        </Button>
      </ButtonGroup>
    </div>
  )
}
