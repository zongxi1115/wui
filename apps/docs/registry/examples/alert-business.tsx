import { KeyRoundIcon, ShieldAlertIcon } from "lucide-react"

import { Alert } from "@/registry/ui/alert"
import { Button } from "@/registry/ui/button"

export default function AlertBusiness() {
  return (
    <div className="w-full max-w-xl space-y-4">
      {/* Security alert */}
      <Alert
        variant="destructive"
        icon={<ShieldAlertIcon className="size-5 text-destructive" />}
        title="检测到未经授权的 API 访问尝试"
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              查看审计日志
            </Button>
            <Button
              size="sm"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              立刻吊销密钥
            </Button>
          </div>
        }
      >
        来自 IP 地址 <code>198.51.100.42</code> 的请求多次尝试使用已弃用的 Admin Token 进行提权操作。
      </Alert>

      {/* Expiration warning banner */}
      <Alert
        variant="warning"
        icon={<KeyRoundIcon className="size-5 text-warning" />}
        title="根证书将在 48 小时后失效"
        action={
          <Button variant="outline" size="sm">
            轮换证书
          </Button>
        }
        closable
      >
        服务网格内部互联 mTLS 证书即将到期。请在业务低峰期前完成证书轮换以避免握手失败。
      </Alert>
    </div>
  )
}
