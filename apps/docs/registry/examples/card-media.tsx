import { ArrowRightIcon } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMedia,
  CardTitle,
} from "@/registry/ui/card"

export default function CardMediaDemo() {
  return (
    <Card
      interactive
      className="has-[a:focus-visible]:ring-ring/40 group w-full max-w-sm has-[a:focus-visible]:ring-[3px]"
    >
      <CardMedia className="aspect-[16/9]">
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=720&auto=format&fit=crop&q=80"
          alt="抽象的流体波纹"
          className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      </CardMedia>
      <CardHeader>
        <div className="mb-1 flex items-center gap-2">
          <Badge variant="secondary" size="sm">
            设计系统
          </Badge>
          <span className="text-muted-foreground text-xs">阅读约 6 分钟</span>
        </div>
        <CardTitle>
          <a
            href="#card-media"
            className="outline-none after:absolute after:inset-0"
          >
            组件 API 如何在组合性与约束之间取得平衡
          </a>
        </CardTitle>
        <CardDescription>
          从插槽、受控状态到键盘交互，拆解一套组件库在三年迭代中沉淀的设计取舍。
        </CardDescription>
      </CardHeader>
      <CardFooter className="text-muted-foreground justify-between text-xs">
        <span>林澈 · 9 月 12 日</span>
        <span className="text-foreground inline-flex items-center gap-1 font-medium">
          阅读全文
          <ArrowRightIcon className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </CardFooter>
    </Card>
  )
}
