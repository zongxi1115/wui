"use client"

import * as React from "react"
import { GlobeIcon, ServerIcon, SlidersIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  Form,
  FormActions,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormLegend,
  FormSection,
} from "@/registry/ui/form"
import { Input } from "@/registry/ui/input"
import { Switch } from "@/registry/ui/switch"

export default function FormLayout() {
  const [formData, setFormData] = React.useState({
    projectName: "wui-production-cluster",
    region: "ap-east-1",
    maxReplicas: "12",
    enableHttps: true,
    enableAutoScaling: true,
  })

  return (
    <div className="bg-background w-full max-w-2xl rounded-2xl border p-6 shadow-xs sm:p-8">
      <Form
        onSubmit={(e) => {
          e.preventDefault()
          alert("配置已提交保存！")
        }}
      >
        <FormSection>
          <FormLegend className="flex items-center gap-2 text-lg">
            <SlidersIcon className="text-primary size-5" />
            服务集群基础与弹性伸缩配置
          </FormLegend>
          <p className="text-muted-foreground -mt-2 mb-2 text-xs">
            组织多列排版与开关项组合的高密度业务配置表单
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField required>
              <FormLabel>集群服务名称</FormLabel>
              <FormControl>
                <Input
                  value={formData.projectName}
                  onChange={(e) =>
                    setFormData((v) => ({ ...v, projectName: e.target.value }))
                  }
                  startContent={<ServerIcon />}
                />
              </FormControl>
              <FormDescription>全局唯一的集群资源标识</FormDescription>
            </FormField>

            <FormField required>
              <FormLabel>部署主地域</FormLabel>
              <FormControl>
                <Input
                  value={formData.region}
                  onChange={(e) =>
                    setFormData((v) => ({ ...v, region: e.target.value }))
                  }
                  startContent={<GlobeIcon />}
                />
              </FormControl>
              <FormDescription>就近物理机房集群代码</FormDescription>
            </FormField>
          </div>

          <FormField>
            <FormLabel>最大副本数量限制</FormLabel>
            <FormControl>
              <Input
                type="number"
                value={formData.maxReplicas}
                onChange={(e) =>
                  setFormData((v) => ({ ...v, maxReplicas: e.target.value }))
                }
              />
            </FormControl>
            <FormDescription>高并发流量峰值时最大可自动扩展的 Pod 数</FormDescription>
          </FormField>

          <div className="bg-muted/40 divide-border/60 mt-2 divide-y rounded-lg border p-3.5">
            <div className="flex items-center justify-between pb-3">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">强制开启 HTTPS 重定向</p>
                <p className="text-muted-foreground text-xs">
                  自动签发免费 TLS 证书并拦截全部明文 HTTP 请求
                </p>
              </div>
              <Switch
                checked={formData.enableHttps}
                onCheckedChange={(checked) =>
                  setFormData((v) => ({ ...v, enableHttps: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">智能弹性伸缩 (Auto Scaling)</p>
                <p className="text-muted-foreground text-xs">
                  CPU 使用率高于 80% 时自动扩容节点
                </p>
              </div>
              <Switch
                checked={formData.enableAutoScaling}
                onCheckedChange={(checked) =>
                  setFormData((v) => ({ ...v, enableAutoScaling: checked }))
                }
              />
            </div>
          </div>
        </FormSection>

        <FormActions>
          <Button variant="outline" type="button">
            重置更改
          </Button>
          <Button type="submit">保存集群配置</Button>
        </FormActions>
      </Form>
    </div>
  )
}
