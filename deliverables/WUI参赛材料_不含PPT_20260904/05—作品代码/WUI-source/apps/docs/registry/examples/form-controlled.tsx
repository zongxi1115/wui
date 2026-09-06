"use client"

import * as React from "react"
import { CheckCircle2Icon, Loader2Icon, SendIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  Form,
  FormActions,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormSection,
} from "@/registry/ui/form"
import { Input } from "@/registry/ui/input"

export default function FormControlled() {
  const [apiKey, setApiKey] = React.useState("")
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = React.useState("")

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!apiKey.startsWith("sk-")) {
      setStatus("error")
      setErrorMessage("API Key 格式不正确，必须以 'sk-' 开头")
      return
    }

    setStatus("loading")
    setErrorMessage("")

    // 模拟网络请求验证
    setTimeout(() => {
      if (apiKey.length < 16) {
        setStatus("error")
        setErrorMessage("密钥长度不足，校验失败")
      } else {
        setStatus("success")
      }
    }, 1200)
  }

  return (
    <div className="bg-background w-full max-w-md rounded-xl border p-6 shadow-xs">
      <Form onSubmit={handleVerify}>
        <FormSection>
          <FormField invalid={status === "error"} required>
            <FormLabel>OpenAI / Anthropic API Key</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value)
                  if (status !== "idle") setStatus("idle")
                }}
                disabled={status === "loading"}
              />
            </FormControl>
            {status === "error" ? (
              <FormMessage>{errorMessage}</FormMessage>
            ) : (
              <FormDescription>
                密钥仅保存在你的浏览器本地会话，不会上传至任何第三方服务器。
              </FormDescription>
            )}
          </FormField>
        </FormSection>

        <FormActions>
          {status === "success" ? (
            <div className="text-success flex items-center gap-1.5 text-xs font-medium mr-auto">
              <CheckCircle2Icon className="size-4" />
              <span>密钥验证通过并已激活</span>
            </div>
          ) : null}

          <Button
            type="submit"
            disabled={status === "loading" || !apiKey}
          >
            {status === "loading" ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                正在校验...
              </>
            ) : (
              <>
                <SendIcon className="size-4" />
                验证并绑定
              </>
            )}
          </Button>
        </FormActions>
      </Form>
    </div>
  )
}
