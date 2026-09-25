import { Button } from "@/registry/ui/button"

export default function ButtonRipple() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button ripple>加入购物车</Button>
      <Button ripple variant="secondary">
        收藏商品
      </Button>
      <Button ripple motion variant="outline">
        涟漪 + 弹簧
      </Button>
    </div>
  )
}
