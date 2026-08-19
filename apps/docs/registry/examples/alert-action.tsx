import { RefreshCwIcon } from "lucide-react"

import { Alert } from "@/registry/ui/alert"
import { Button } from "@/registry/ui/button"

export default function AlertAction() {
  return (
    <div className="grid w-full max-w-lg gap-3">
      <Alert
        variant="warning"
        title="支付方式即将到期"
        action={
          <Button variant="outline" size="sm">
            更新账单
          </Button>
        }
      >
        您的信用卡将于本月 31 日失效，请及时更新以防服务暂停。
      </Alert>

      <Alert
        variant="destructive"
        title="构建流水线中断"
        action={
          <Button variant="outline" size="sm" className="gap-1">
            <RefreshCwIcon className="size-3.5" /> 重试构建
          </Button>
        }
      >
        任务在执行 `pnpm test` 时超时退出（错误代码 137）。
      </Alert>
    </div>
  )
}
