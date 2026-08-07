import { AlignCenter, AlignLeft, AlignRight } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { ButtonGroup } from "@/registry/ui/button-group"

export default function ButtonGroupDemo() {
  return (
    <ButtonGroup aria-label="文本对齐方式">
      <Button variant="outline" size="icon" aria-label="左对齐">
        <AlignLeft />
      </Button>
      <Button variant="outline" size="icon" aria-label="居中对齐">
        <AlignCenter />
      </Button>
      <Button variant="outline" size="icon" aria-label="右对齐">
        <AlignRight />
      </Button>
    </ButtonGroup>
  )
}
