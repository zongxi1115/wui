import { Button } from "@/registry/ui/button"
import {
  Card,
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
        <CardTitle>团队空间</CardTitle>
        <CardDescription>邀请成员共同管理项目与组件资源。</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/50 flex items-center justify-between rounded-md px-3 py-2.5 text-sm">
          <span>当前成员</span>
          <span className="font-medium tabular-nums">8 / 12</span>
        </div>
      </CardContent>
      <CardFooter className="justify-end border-t pt-4">
        <Button variant="ghost" size="sm">
          管理权限
        </Button>
        <Button size="sm">邀请成员</Button>
      </CardFooter>
    </Card>
  )
}
