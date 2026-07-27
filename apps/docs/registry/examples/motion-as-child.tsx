import { Button } from "@/registry/ui/button"
import { Motion } from "@/registry/ui/motion"

export default function MotionAsChild() {
  return (
    <Motion asChild preset="pop" transition="spring">
      <Button>Popped in with asChild</Button>
    </Motion>
  )
}
