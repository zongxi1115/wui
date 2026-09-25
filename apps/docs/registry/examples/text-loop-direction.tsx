import { TextLoop } from "@/registry/ui/text-loop"

const stages = ["排队中", "构建中", "测试中", "灰度发布", "已上线"]

export default function TextLoopDirection() {
  return (
    <dl className="w-full max-w-sm divide-y border-y text-sm">
      <div className="flex items-center justify-between py-3">
        <dt className="text-muted-foreground">
          <code className="text-xs">direction=&quot;up&quot;</code>
        </dt>
        <dd className="font-medium">
          <TextLoop direction="up" interval={1.6}>
            {stages.map((stage) => (
              <span key={stage}>{stage}</span>
            ))}
          </TextLoop>
        </dd>
      </div>
      <div className="flex items-center justify-between py-3">
        <dt className="text-muted-foreground">
          <code className="text-xs">direction=&quot;down&quot;</code>
        </dt>
        <dd className="font-medium">
          <TextLoop direction="down" interval={1.6}>
            {[...stages].reverse().map((stage) => (
              <span key={stage}>{stage}</span>
            ))}
          </TextLoop>
        </dd>
      </div>
    </dl>
  )
}
