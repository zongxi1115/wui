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

export default function CardVariants() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-4 md:grid-cols-2">
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>本月账单</CardTitle>
          <CardDescription>elevated · 页面中的独立主体</CardDescription>
          <CardAction>
            <Badge variant="warning" size="sm">
              待支付
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold tabular-nums tracking-tight">¥12,480.00</p>
          <p className="text-muted-foreground mt-1 text-xs">账期 9 月 1 日 – 9 月 30 日</p>
        </CardContent>
        <CardFooter>
          <Button size="sm" className="w-full">
            立即支付
          </Button>
        </CardFooter>
      </Card>

      <Card variant="outline">
        <CardHeader>
          <CardTitle>自动续费</CardTitle>
          <CardDescription>outline · 高密度网格与设置项</CardDescription>
          <CardAction>
            <Badge variant="outline" size="sm">
              已开启
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold tabular-nums tracking-tight">10 月 1 日</p>
          <p className="text-muted-foreground mt-1 text-xs">将从尾号 6411 的企业账户扣款</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full">
            管理续费
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
