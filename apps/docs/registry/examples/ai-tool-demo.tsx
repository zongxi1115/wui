import {
  AiTool,
  AiToolCode,
  AiToolContent,
  AiToolError,
  AiToolLabel,
  AiToolSection,
  AiToolTrigger,
} from "@/registry/ui/ai-tool"

export default function AiToolDemo() {
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-3">
      <AiTool status="running" defaultOpen>
        <AiToolTrigger name="search_docs" />
        <AiToolContent>
          <AiToolSection>
            <AiToolLabel>输入</AiToolLabel>
            <AiToolCode>{`{
  "query": "React Server Components",
  "limit": 5
}`}</AiToolCode>
          </AiToolSection>
        </AiToolContent>
      </AiTool>

      <AiTool status="success">
        <AiToolTrigger name="read_file" />
        <AiToolContent>
          <AiToolSection>
            <AiToolLabel>结果</AiToolLabel>
            已读取 app/dashboard/page.tsx，共 184 行。
          </AiToolSection>
        </AiToolContent>
      </AiTool>

      <AiTool status="error" defaultOpen>
        <AiToolTrigger name="database_query" />
        <AiToolContent>
          <AiToolSection>
            <AiToolLabel>错误</AiToolLabel>
            <AiToolError>连接超时，请检查数据库网络策略。</AiToolError>
          </AiToolSection>
        </AiToolContent>
      </AiTool>
    </div>
  )
}
