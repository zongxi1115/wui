"use client"

import * as React from "react"
import {
  AiTool,
  AiToolCode,
  AiToolContent,
  AiToolLabel,
  AiToolSection,
  AiToolTrigger,
} from "@/registry/ui/ai-tool"

export default function AiToolChain() {
  return (
    <div className="w-full max-w-xl mx-auto space-y-3">
      <div className="text-xs text-muted-foreground mb-1">
        Agent 在排查网络与性能问题时连续调用的多阶段工具流水线：
      </div>

      {/* Step 1: Query logs */}
      <AiTool status="success" defaultOpen={false}>
        <AiToolTrigger name="query_error_logs" />
        <AiToolContent>
          <AiToolSection>
            <AiToolLabel>查询条件</AiToolLabel>
            <AiToolCode>{`{
  "service": "api-gateway",
  "level": "error",
  "since": "15m",
  "limit": 100
}`}</AiToolCode>
          </AiToolSection>
          <AiToolSection>
            <AiToolLabel>输出结果</AiToolLabel>
            <p className="text-xs text-muted-foreground">
              捕获到 14 条 <code>HTTP 504 Gateway Timeout</code> 异常，均来自 <code>/api/checkout</code> 接口。
            </p>
          </AiToolSection>
        </AiToolContent>
      </AiTool>

      {/* Step 2: Database health check */}
      <AiTool status="success" defaultOpen={false}>
        <AiToolTrigger name="check_postgres_connection_pool" />
        <AiToolContent>
          <AiToolSection>
            <AiToolLabel>数据库指标</AiToolLabel>
            <AiToolCode>{`{
  "activeConnections": 98,
  "maxConnections": 100,
  "waitingClients": 42,
  "avgWaitTimeMs": 4820
}`}</AiToolCode>
          </AiToolSection>
          <AiToolSection>
            <AiToolLabel>诊断结论</AiToolLabel>
            <p className="text-xs text-muted-foreground">
              连接池接近饱和（98%），存在大量慢事务占用连接未释放。
            </p>
          </AiToolSection>
        </AiToolContent>
      </AiTool>

      {/* Step 3: Run explain analyze */}
      <AiTool status="running" defaultOpen={true}>
        <AiToolTrigger name="explain_analyze_slow_query" />
        <AiToolContent>
          <AiToolSection>
            <AiToolLabel>正在分析的 SQL</AiToolLabel>
            <AiToolCode>{`EXPLAIN ANALYZE 
SELECT * FROM orders 
WHERE user_id = 'usr_8192' 
  AND status = 'pending' 
ORDER BY created_at DESC;`}</AiToolCode>
          </AiToolSection>
          <AiToolSection>
            <AiToolLabel>执行进度</AiToolLabel>
            <p className="text-xs text-info">
              正在生成执行计划代价树并比对索引覆盖情况…
            </p>
          </AiToolSection>
        </AiToolContent>
      </AiTool>
    </div>
  )
}
