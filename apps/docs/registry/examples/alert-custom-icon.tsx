import { BellRingIcon, SparklesIcon } from "lucide-react"

import { Alert } from "@/registry/ui/alert"

export default function AlertCustomIcon() {
  return (
    <div className="grid w-full max-w-lg gap-3">
      <Alert
        variant="info"
        icon={<SparklesIcon className="text-primary" />}
        title="AI 智能优化建议"
      >
        我们分析了你的数据流并生成了 3 条缓存优化规则，预计可降低 35% 的延迟。
      </Alert>

      <Alert
        icon={<BellRingIcon className="text-foreground" />}
        title="推送订阅已就绪"
      >
        你将通过飞书与邮件接收每小时的集群健康度报告。
      </Alert>

      <Alert icon={false} title="无图标模式">
        隐藏左侧图标的简洁模式，适合在狭窄弹窗或嵌套表单提示中呈现。
      </Alert>
    </div>
  )
}
