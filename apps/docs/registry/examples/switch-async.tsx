"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { Switch } from "@/registry/ui/switch"

type SyncState = { tone: "muted" | "success" | "destructive"; text: string } | null

export default function SwitchAsync() {
  const reduceMotion = useReducedMotion()
  const [enabled, setEnabled] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [attempts, setAttempts] = React.useState(0)
  const [state, setState] = React.useState<SyncState>(null)

  async function handleCheckedChange(next: boolean) {
    setLoading(true)
    setState({ tone: "muted", text: "正在同步到服务器…" })
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // 第二次操作模拟网络失败，演示状态回滚。
    const failed = attempts % 3 === 1
    setAttempts((count) => count + 1)
    setLoading(false)

    if (failed) {
      setState({ tone: "destructive", text: "网络异常，设置未保存，已恢复为原状态" })
      return
    }
    setEnabled(next)
    setState({
      tone: "success",
      text: next ? "已开启，下次登录需输入动态验证码" : "已关闭两步验证",
    })
  }

  return (
    <div className="grid w-full max-w-sm gap-3">
      <div className="flex items-center justify-between gap-6">
        <label htmlFor="two-factor" className="grid cursor-pointer gap-1">
          <span className="text-sm font-medium leading-none">两步验证</span>
          <span className="text-muted-foreground text-xs">
            登录时除密码外还需输入动态验证码
          </span>
        </label>
        <Switch
          id="two-factor"
          checked={enabled}
          loading={loading}
          onCheckedChange={handleCheckedChange}
        />
      </div>

      <div className="min-h-4" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {state ? (
            <motion.p
              key={state.text}
              className={
                state.tone === "success"
                  ? "text-success text-xs"
                  : state.tone === "destructive"
                    ? "text-destructive text-xs"
                    : "text-muted-foreground text-xs"
              }
              initial={reduceMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
              transition={{ duration: reduceMotion ? 0 : 0.18 }}
            >
              {state.text}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}
