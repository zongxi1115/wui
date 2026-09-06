"use client"

import * as React from "react"

import { cn } from "@/registry/lib/utils"

export interface InputOTPProps extends Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> {
  /** 验证码内容；传入后组件进入受控模式。 */
  value?: string
  /** 非受控模式下的初始内容。 */
  defaultValue?: string
  /** 输入位数。 @default 6 */
  length?: number
  /** 内容变化时触发。 */
  onValueChange?: (value: string) => void
  /** 所有输入位填满时触发。 */
  onComplete?: (value: string) => void
  /** 是否只接受数字。 @default true */
  numeric?: boolean
  /** 是否禁用全部输入位。 */
  disabled?: boolean
  /** 单个输入框的样式。 */
  inputClassName?: string
  /** 验证码输入组的无障碍名称。 @default "验证码" */
  "aria-label"?: string
}

/** 支持粘贴分发、键盘移动和完成回调的分格验证码输入框。 */
function InputOTP({
  value,
  defaultValue = "",
  length = 6,
  onValueChange,
  onComplete,
  numeric = true,
  disabled,
  inputClassName,
  className,
  "aria-label": ariaLabel = "验证码",
  ...props
}: InputOTPProps) {
  const controlled = value !== undefined
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const currentValue = (value ?? internalValue).slice(0, length)
  const refs = React.useRef<Array<HTMLInputElement | null>>([])

  const normalize = React.useCallback(
    (text: string) =>
      (numeric ? text.replace(/\D/g, "") : text).slice(0, length),
    [length, numeric]
  )

  const update = (next: string, focusIndex?: number) => {
    const normalized = normalize(next)
    if (!controlled) setInternalValue(normalized)
    onValueChange?.(normalized)
    if (normalized.length === length) onComplete?.(normalized)
    if (focusIndex !== undefined) refs.current[focusIndex]?.focus()
  }

  const characters = Array.from(
    { length },
    (_, index) => currentValue[index] ?? ""
  )

  return (
    <div
      data-slot="input-otp"
      role="group"
      aria-label={ariaLabel}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {characters.map((character, index) => (
        <input
          key={index}
          ref={(node) => {
            refs.current[index] = node
          }}
          data-slot="input-otp-slot"
          aria-label={`第 ${index + 1} 位，共 ${length} 位`}
          autoComplete={index === 0 ? "one-time-code" : "off"}
          inputMode={numeric ? "numeric" : "text"}
          pattern={numeric ? "[0-9]*" : undefined}
          maxLength={1}
          value={character}
          disabled={disabled}
          className={cn(
            "border-input bg-background shadow-xs focus:border-ring focus:ring-ring/30 size-10 rounded-md border text-center text-base font-medium tabular-nums outline-none transition-[border-color,box-shadow] focus:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
            inputClassName
          )}
          onFocus={(event) => event.currentTarget.select()}
          onChange={(event) => {
            const incoming = normalize(event.target.value)
            if (!incoming) return
            const next = characters.slice()
            next[index] = incoming.at(-1) ?? ""
            update(next.join(""), Math.min(index + 1, length - 1))
          }}
          onPaste={(event) => {
            event.preventDefault()
            const pasted = normalize(event.clipboardData.getData("text"))
            if (!pasted) return
            const next = characters.slice()
            pasted.split("").forEach((item, offset) => {
              if (index + offset < length) next[index + offset] = item
            })
            update(next.join(""), Math.min(index + pasted.length, length - 1))
          }}
          onKeyDown={(event) => {
            if (event.key === "Backspace") {
              event.preventDefault()
              const target = character ? index : Math.max(index - 1, 0)
              update(characters.slice(0, target).join(""), target)
            } else if (event.key === "ArrowLeft") {
              event.preventDefault()
              refs.current[Math.max(index - 1, 0)]?.focus()
            } else if (event.key === "ArrowRight") {
              event.preventDefault()
              refs.current[Math.min(index + 1, length - 1)]?.focus()
            } else if (event.key === "Delete") {
              event.preventDefault()
              update(characters.slice(0, index).join(""))
            }
          }}
        />
      ))}
    </div>
  )
}

export { InputOTP }
