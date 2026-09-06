import { Button } from "@/registry/ui/button"

export default function ButtonRipple() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button ripple>Click for ripple</Button>
      <Button ripple variant="secondary">
        Secondary
      </Button>
      <Button ripple motion variant="outline">
        Ripple + motion
      </Button>
    </div>
  )
}
