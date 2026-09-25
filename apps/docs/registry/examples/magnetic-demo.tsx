import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Magnetic } from "@/registry/ui/magnetic"

export default function MagneticDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Magnetic strength={0.3} maxDistance={14}>
        <Button size="lg">
          开始免费试用
          <ArrowRightIcon />
        </Button>
      </Magnetic>
      <p className="text-muted-foreground text-xs">
        把鼠标移到按钮上，它会轻轻被指针吸引
      </p>
    </div>
  )
}
