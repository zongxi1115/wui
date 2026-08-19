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
    <div className="grid w-full max-w-2xl grid-cols-1 md:grid-cols-2 gap-4">
      {/* Elevated variant */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Elevated (默认悬浮)</CardTitle>
          <CardDescription>带有柔和的环境投影与低对比度边框。</CardDescription>
          <CardAction>
            <Badge variant="secondary">Pro</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          适用于主要展示区域、独立突出卡片或页面主视觉容器。
        </CardContent>
        <CardFooter>
          <Button size="sm" className="w-full">了解详情</Button>
        </CardFooter>
      </Card>

      {/* Outline variant */}
      <Card variant="outline">
        <CardHeader>
          <CardTitle>Outline (扁平描边)</CardTitle>
          <CardDescription>纯边框设计，无环境阴影堆叠。</CardDescription>
          <CardAction>
            <Badge variant="outline">Free</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          适用于高密度网格列表或仪表盘，避免多层阴影造成的视觉噪音。
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full">立即配置</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
