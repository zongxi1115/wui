"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { GlobeIcon, ServerIcon } from "lucide-react"

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
import { InputNumber } from "@/registry/ui/input-number"
import { Switch } from "@/registry/ui/switch"

const initialConfig = {
  name: "checkout-api",
  region: "cn-shanghai",
  maxReplicas: 12 as number | null,
  https: true,
  autoScaling: true,
}

export default function FormLayout() {
  const reduceMotion = useReducedMotion()
  const [config, setConfig] = React.useState(initialConfig)
  const [saved, setSaved] = React.useState(false)
  const dirty = JSON.stringify(config) !== JSON.stringify(initialConfig)

  function patch(next: Partial<typeof initialConfig>) {
    setConfig((current) => ({ ...current, ...next }))
    setSaved(false)
  }

  return (
    <Form
      className="w-full max-w-2xl"
      onSubmit={(event) => {
        event.preventDefault()
        setSaved(true)
      }}
    >
      <FormSection>
        <FormLegend>服务配置</FormLegend>
        <p className="text-muted-foreground -mt-2 text-sm">
          修改后需要重新部署才会生效。
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField required>
            <FormLabel>服务名称</FormLabel>
            <FormControl>
              <Input
                value={config.name}
                onChange={(event) => patch({ name: event.target.value })}
                startContent={<ServerIcon />}
              />
            </FormControl>
            <FormDescription>小写字母、数字与连字符</FormDescription>
          </FormField>

          <FormField required>
            <FormLabel>部署地域</FormLabel>
            <FormControl>
              <Input
                value={config.region}
                onChange={(event) => patch({ region: event.target.value })}
                startContent={<GlobeIcon />}
              />
            </FormControl>
            <FormDescription>建议选择离用户最近的地域</FormDescription>
          </FormField>
        </div>

        <FormField className="sm:max-w-[calc(50%-0.5rem)]">
          <FormLabel>最大副本数</FormLabel>
          <FormControl>
            <InputNumber
              value={config.maxReplicas}
              onValueChange={(maxReplicas) => patch({ maxReplicas })}
              min={1}
              max={50}
              suffix="个"
            />
          </FormControl>
          <FormDescription>流量高峰时最多扩容到的实例数量</FormDescription>
        </FormField>
      </FormSection>

      <FormSection className="gap-0 divide-y border-y">
        {(
          [
            {
              key: "https",
              title: "强制 HTTPS",
              description: "自动签发证书，并将 HTTP 请求重定向到 HTTPS",
            },
            {
              key: "autoScaling",
              title: "弹性伸缩",
              description: "CPU 使用率持续 5 分钟高于 80% 时自动扩容",
            },
          ] as const
        ).map((item) => (
          <div key={item.key} className="flex items-center justify-between gap-6 py-3.5">
            <label htmlFor={`config-${item.key}`} className="grid cursor-pointer gap-1">
              <span className="text-sm font-medium leading-none">{item.title}</span>
              <span className="text-muted-foreground text-xs">{item.description}</span>
            </label>
            <Switch
              id={`config-${item.key}`}
              checked={config[item.key]}
              onCheckedChange={(checked) => patch({ [item.key]: checked })}
            />
          </div>
        ))}
      </FormSection>

      <FormActions>
        <AnimatePresence initial={false}>
          {saved ? (
            <motion.span
              key="saved"
              className="text-success mr-auto text-xs font-medium"
              initial={reduceMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              配置已保存，将在下次部署时生效
            </motion.span>
          ) : null}
        </AnimatePresence>
        <Button
          type="button"
          variant="ghost"
          disabled={!dirty}
          onClick={() => {
            setConfig(initialConfig)
            setSaved(false)
          }}
        >
          撤销修改
        </Button>
        <Button type="submit" disabled={!dirty || saved}>
          保存配置
        </Button>
      </FormActions>
    </Form>
  )
}
