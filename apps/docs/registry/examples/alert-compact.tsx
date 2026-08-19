import { Alert } from "@/registry/ui/alert"

export default function AlertCompact() {
  return (
    <div className="grid w-full max-w-lg gap-2.5">
      <Alert size="compact" variant="success">
        生产环境部署成功，版本号 v1.4.2。
      </Alert>
      <Alert size="compact" variant="warning">
        API 调用速率已接近配额上限（92%）。
      </Alert>
      <Alert size="compact" variant="destructive">
        SSL 证书将于 3 天后过期。
      </Alert>
      <Alert size="compact" variant="info">
        已自动保存草稿于 14:32。
      </Alert>
    </div>
  )
}
