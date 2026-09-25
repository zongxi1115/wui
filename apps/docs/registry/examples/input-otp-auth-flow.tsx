"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { CheckCircle2Icon, Loader2Icon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { InputOTP } from "@/registry/ui/input-otp"

type Status = "idle" | "verifying" | "error" | "verified"

export default function InputOTPAuthFlow() {
  const reduceMotion = useReducedMotion()
  const [code, setCode] = React.useState("")
  const [status, setStatus] = React.useState<Status>("idle")
  const [countdown, setCountdown] = React.useState(59)

  React.useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown((current) => current - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  function verify(value: string) {
    setStatus("verifying")
    setTimeout(() => {
      setStatus(value === "123456" ? "verified" : "error")
    }, 900)
  }

  const fade = {
    initial: reduceMotion ? false : { opacity: 0, y: 4 },
    animate: { opacity: 1, y: 0 },
    exit: reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 },
    transition: { duration: reduceMotion ? 0 : 0.2 },
  } as const

  return (
    <div className="grid w-full max-w-sm justify-items-center gap-5 text-center">
      <div className="grid gap-1">
        <h3 className="text-base font-semibold">验证手机号</h3>
        <p className="text-muted-foreground text-xs">
          验证码已发送至 138 **** 8826，测试码为 123456
        </p>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {status === "verified" ? (
          <motion.div key="verified" className="grid justify-items-center gap-2 py-3" {...fade}>
            <CheckCircle2Icon className="text-success size-8" />
            <p className="text-sm font-medium">验证成功</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCode("")
                setStatus("idle")
              }}
            >
              再试一次
            </Button>
          </motion.div>
        ) : (
          <motion.div key="form" className="grid justify-items-center gap-3" {...fade}>
            <InputOTP
              value={code}
              onValueChange={(next) => {
                setCode(next)
                if (status === "error") setStatus("idle")
              }}
              onComplete={verify}
              invalid={status === "error"}
              disabled={status === "verifying"}
              aria-label="短信验证码"
              aria-describedby="otp-auth-status"
            />
            <div id="otp-auth-status" className="min-h-5 text-xs" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                {status === "verifying" ? (
                  <motion.span key="verifying" className="text-muted-foreground inline-flex items-center gap-1.5" {...fade}>
                    <Loader2Icon className="size-3.5 animate-spin" />
                    正在验证
                  </motion.span>
                ) : status === "error" ? (
                  <motion.span key="error" className="text-destructive font-medium" {...fade}>
                    验证码错误，请重新输入
                  </motion.span>
                ) : countdown > 0 ? (
                  <motion.span key="countdown" className="text-muted-foreground tabular-nums" {...fade}>
                    {countdown} 秒后可重新发送
                  </motion.span>
                ) : (
                  <motion.span key="resend" {...fade}>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs"
                      onClick={() => {
                        setCountdown(60)
                        setCode("")
                        setStatus("idle")
                      }}
                    >
                      重新发送验证码
                    </Button>
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
