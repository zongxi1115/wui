import { Steps } from "@/registry/ui/steps"

const items = [
  { title: "填写信息", description: "联系人与配送地址" },
  { title: "确认订单", description: "核对商品与优惠" },
  { title: "完成支付", description: "选择付款方式" },
]

export default function StepsDemo() {
  return <Steps className="max-w-2xl" current={1} items={items} />
}
