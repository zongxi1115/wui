import { BellRingIcon, SparklesIcon } from "lucide-react"

import { Alert } from "@/registry/ui/alert"

export default function AlertCustomIcon() {
  return (
    <div className="grid w-full max-w-lg gap-3">
      {/* Custom Icon */}
      <Alert
        variant="info"
        icon={<SparklesIcon className="text-amber-500" />}
        title="AI 智能优化建议"
      >
        我们分析了您的数据流并生成了 3 条缓存优化规则，预计可降低 35% 的延迟。
      </Alert>

      <Alert
        icon={<BellRingIcon className="text-violet-500" />}
        title="推送订阅已就绪"
      >
        您将通过 Slack 与邮件接收每小时的集群健康度报告。
      </Alert>

      {/* No Icon */}
      <Alert icon={false} title="纯文本提示">
        隐藏左侧图标的简洁模式，适合在狭窄弹窗或嵌套表单提示中呈现。
      </Alert>
    </div>
  )
}
