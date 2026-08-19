import { LoaderPinwheelIcon } from "lucide-react"
import { Spin } from "@/registry/ui/spin"

export default function SpinCustom() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <Spin
        indicator={
          <LoaderPinwheelIcon className="size-7 animate-spin text-primary" />
        }
        label="正在智能解析模型参数…"
      />
    </div>
  )
}
