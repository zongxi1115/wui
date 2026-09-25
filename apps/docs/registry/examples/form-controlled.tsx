"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { CheckCircle2Icon, KeyRoundIcon, Loader2Icon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  Form,
  FormActions,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
} from "@/registry/ui/form"
import { Input } from "@/registry/ui/input"

type Status = "idle" | "loading" | "success" | "error"

export default function FormControlled() {
  const reduceMotion = useReducedMotion()
  const [apiKey, setApiKey] = React.useState("")
  const [status, setStatus] = React.useState<Status>("idle")
  const [errorMessage, setErrorMessage] = React.useState("")

  function verify(event: React.FormEvent) {
    event.preventDefault()
    if (!apiKey.startsWith("sk-")) {
      setStatus("error")
      setErrorMessage("密钥格式不正确，应以 sk- 开头")
      return
    }

    setStatus("loading")
    setTimeout(() => {
      if (apiKey.length < 16) {
        setStatus("error")
        setErrorMessage("密钥无效或已被吊销，请在控制台重新生成")
      } else {
        setStatus("success")
      }
    }, 1200)
  }

  return (
    <Form onSubmit={verify} className="w-full max-w-md">
      <FormField invalid={status === "error"} required>
        <FormLabel>API 密钥</FormLabel>
        <FormControl>
          <Input
            type="password"
            placeholder="sk-••••••••••••••••"
            autoComplete="off"
            value={apiKey}
            startContent={<KeyRoundIcon />}
            onChange={(event) => {
              setApiKey(event.target.value)
              if (status !== "idle" && status !== "loading") setStatus("idle")
            }}
            readOnly={status === "loading"}
          />
        </FormControl>
        <FormMessage>{errorMessage}</FormMessage>
        <FormDescription>密钥只保存在当前浏览器会话中，不会上传到服务器。</FormDescription>
      </FormField>

      <FormActions className="justify-between">
        <AnimatePresence initial={false}>
          {status === "success" ? (
            <motion.span
              key="success"
              className="text-success flex items-center gap-1.5 text-xs font-medium"
              initial={reduceMotion ? false : { opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -6 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
            >
              <CheckCircle2Icon className="size-4" />
              验证通过，已绑定到当前项目
            </motion.span>
          ) : (
            <span key="placeholder" />
          )}
        </AnimatePresence>
        <Button type="submit" disabled={status === "loading" || !apiKey}>
          {status === "loading" ? <Loader2Icon className="animate-spin" /> : null}
          {status === "loading" ? "正在验证" : "验证并绑定"}
        </Button>
      </FormActions>
    </Form>
  )
}
