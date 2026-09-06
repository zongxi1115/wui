import { UsersIcon } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"

export default function CardComposition() {
  return (
    <Card className="w-full max-w-sm gap-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UsersIcon className="size-4 text-primary" />
          团队空间
        </CardTitle>
        <CardDescription>邀请成员共同管理项目、组件库与部署流水线。</CardDescription>
        <CardAction>
          <Badge variant="secondary" size="sm">
            8 / 12 位
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
          当前空间配额剩余 4 个席位。升级为企业版可解锁无限协作成员与单点登录 (SSO)。
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2 pt-1">
        <Button variant="ghost" size="sm">
          管理权限
        </Button>
        <Button size="sm">邀请成员</Button>
      </CardFooter>
    </Card>
  )
}
