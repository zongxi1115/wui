import { RocketIcon } from "lucide-react"

import {
  AiTodo,
  AiTodoHeader,
  AiTodoItem,
  AiTodoList,
  AiTodoProgress,
  type AiTodoStatus,
} from "@/registry/ui/ai-todo"

const STEPS: Array<{
  title: string
  description: string
  status: AiTodoStatus
}> = [
  {
    title: "静态检查与依赖安全扫描",
    description: "ESLint、类型检查通过，未发现高危依赖。",
    status: "completed",
  },
  {
    title: "补充单元测试",
    description: "新增 18 个用例，覆盖率 92.4%。",
    status: "completed",
  },
  {
    title: "端到端回归：下单与结算",
    description: "正在模拟多账号并发下单…",
    status: "in-progress",
  },
  {
    title: "灰度回滚演练",
    description: "本次变更不涉及数据迁移，已跳过。",
    status: "cancelled",
  },
  {
    title: "全量发布到生产集群",
    description: "等待金丝雀流量指标确认。",
    status: "pending",
  },
]

export default function AiTodoWorkflow() {
  const done = STEPS.filter(
    (step) => step.status === "completed" || step.status === "cancelled"
  ).length

  return (
    <AiTodo className="mx-auto w-full max-w-xl">
      <AiTodoHeader icon={<RocketIcon className="size-4 text-muted-foreground" />}>
        发布流水线
        <span className="ml-auto text-xs font-normal text-muted-foreground">
          第 3 步，共 5 步
        </span>
      </AiTodoHeader>
      <AiTodoProgress value={done} max={STEPS.length} />
      <AiTodoList>
        {STEPS.map((step) => (
          <AiTodoItem
            key={step.title}
            title={step.title}
            description={step.description}
            status={step.status}
          />
        ))}
      </AiTodoList>
    </AiTodo>
  )
}
