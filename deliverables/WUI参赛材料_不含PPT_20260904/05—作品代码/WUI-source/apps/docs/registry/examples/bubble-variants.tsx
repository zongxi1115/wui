import {
  Bubble,
  BubbleBody,
  BubbleContent,
} from "@/registry/ui/bubble"

export default function BubbleVariants() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-3">
      <Bubble>
        <BubbleBody>
          <BubbleContent>默认气泡适合普通收到的消息。</BubbleContent>
        </BubbleBody>
      </Bubble>
      <Bubble side="end">
        <BubbleBody>
          <BubbleContent variant="primary">
            主色气泡用于强调当前用户发出的消息。
          </BubbleContent>
        </BubbleBody>
      </Bubble>
      <Bubble>
        <BubbleBody>
          <BubbleContent variant="outline">
            描边气泡适合需要保留背景层级的场景。
          </BubbleContent>
        </BubbleBody>
      </Bubble>
      <Bubble>
        <BubbleBody>
          <BubbleContent variant="ghost">
            无表面样式可承载更长的 AI 回答或富文本内容。
          </BubbleContent>
        </BubbleBody>
      </Bubble>
    </div>
  )
}
