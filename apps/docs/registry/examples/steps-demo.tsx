"use client"

import * as React from "react"

import { Button } from "@/registry/ui/button"
import { Steps } from "@/registry/ui/steps"

const items = [
  { title: "填写信息", description: "联系人与收货地址" },
  { title: "确认订单", description: "核对商品与优惠" },
  { title: "完成支付", description: "选择付款方式" },
]

export default function StepsDemo() {
  const [current, setCurrent] = React.useState(1)
  const done = current >= items.length

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <Steps current={current} items={items} />
      <div className="flex items-center justify-between border-t pt-4">
        <p className="text-muted-foreground text-sm">
          {done ? "订单已提交，等待商家发货" : `第 ${current + 1} 步，共 ${items.length} 步`}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={current === 0}
            onClick={() => setCurrent((value) => value - 1)}
          >
            上一步
          </Button>
          {done ? (
            <Button size="sm" onClick={() => setCurrent(0)}>
              重新开始
            </Button>
          ) : (
            <Button size="sm" onClick={() => setCurrent((value) => value + 1)}>
              {current === items.length - 1 ? "提交订单" : "下一步"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
