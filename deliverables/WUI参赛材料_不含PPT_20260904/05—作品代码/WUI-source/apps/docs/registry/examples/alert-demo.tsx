import { Alert } from "@/registry/ui/alert"

export default function AlertDemo() {
  return (
    <div className="grid w-full max-w-lg gap-3">
      <Alert variant="info" title="系统版本更新">
        新版本 v2.4.0 已发布，包含性能优化与新的组件支持。
      </Alert>
      <Alert variant="success" title="配置已同步">
        工作区所有安全策略已成功下发至 12 个边缘节点。
      </Alert>
      <Alert variant="warning" title="存储配额预警">
        当前对象存储用量已达 88%，建议及时清理历史构建产物。
      </Alert>
      <Alert variant="destructive" title="服务连接中断">
        无法连接至主数据库集群，请检查网络链路与安全组配置。
      </Alert>
    </div>
  )
}
