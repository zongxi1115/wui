"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

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
  /** 是否以圆点遮挡已输入内容，适用于支付密码等敏感场景。 @default false */
  mask?: boolean
  /** 是否禁用全部输入位。 */
  disabled?: boolean
  /** 标记为校验失败，输入位边框切换为危险色。 */
  invalid?: boolean
  /** 单个输入框的样式。 */
  inputClassName?: string
  /** 验证码输入组的无障碍名称。 @default "验证码" */
  "aria-label"?: string
}

/** 支持粘贴分发、短信自动填充、键盘移动和完成回调的分格验证码输入框。 */
function InputOTP({
  value,
  defaultValue = "",
  length = 6,
  onValueChange,
  onComplete,
  numeric = true,
  mask = false,
  disabled,
  invalid = false,
  inputClassName,
  className,
  "aria-label": ariaLabel = "验证码",
  ...props
}: InputOTPProps) {
  const reduceMotion = useReducedMotion()
  const layoutId = React.useId()
  const controlled = value !== undefined
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const [focusedIndex, setFocusedIndex] = React.useState<number | null>(null)
  const currentValue = (value ?? internalValue).slice(0, length)
  const refs = React.useRef<Array<HTMLInputElement | null>>([])
  // Focus moves synchronously inside change handlers, before React re-renders,
  // so the latest length is tracked in a ref rather than read from render scope.
  const lengthRef = React.useRef(currentValue.length)
  lengthRef.current = currentValue.length

  const normalize = React.useCallback(
    (text: string) =>
      (numeric ? text.replace(/\D/g, "") : text.replace(/\s/g, "")).slice(0, length),
    [length, numeric]
  )

  const update = (next: string, focusIndex?: number) => {
    const normalized = normalize(next)
    lengthRef.current = normalized.length
    if (!controlled) setInternalValue(normalized)
    onValueChange?.(normalized)
    if (normalized.length === length && normalized !== currentValue) onComplete?.(normalized)
    if (focusIndex !== undefined) refs.current[focusIndex]?.focus()
  }

  const fillFrom = (index: number, text: string) => {
    const next = currentValue.slice(0, index) + text
    update(next, Math.min(next.length, length - 1))
  }

  const characters = Array.from(
    { length },
    (_, index) => currentValue[index] ?? ""
  )
  // Slots after the first empty one cannot hold a character yet, so focus is redirected.
  const firstEmpty = Math.min(currentValue.length, length - 1)
  const springTransition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 520, damping: 38, mass: 0.7 }

  return (
    <div
      data-slot="input-otp"
      role="group"
      aria-label={ariaLabel}
      data-invalid={invalid || undefined}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {characters.map((character, index) => {
        const focused = focusedIndex === index
        return (
          <div
            key={index}
            data-slot="input-otp-slot"
            data-active={focused || undefined}
            data-filled={character ? true : undefined}
            className={cn(
              "border-input bg-background shadow-xs relative flex size-10 shrink-0 items-center justify-center rounded-md border text-base font-medium tabular-nums transition-[border-color,background-color] duration-200 has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50",
              character && "border-ring/60",
              invalid && "border-destructive",
              inputClassName
            )}
          >
            <input
              ref={(node) => {
                refs.current[index] = node
              }}
              aria-label={`第 ${index + 1} 位，共 ${length} 位`}
              aria-invalid={invalid || undefined}
              autoComplete={index === 0 ? "one-time-code" : "off"}
              inputMode={numeric ? "numeric" : "text"}
              pattern={numeric ? "[0-9]*" : undefined}
              type={mask ? "password" : "text"}
              // Roving tab stop: Tab enters at the next slot to fill and then leaves the group.
              tabIndex={index === firstEmpty ? 0 : -1}
              value={character}
              disabled={disabled}
              className="absolute inset-0 size-full cursor-text rounded-[inherit] bg-transparent text-center text-transparent caret-transparent outline-none selection:bg-transparent disabled:cursor-not-allowed"
              onFocus={(event) => {
                const nextEmpty = Math.min(lengthRef.current, length - 1)
                if (index > nextEmpty) {
                  refs.current[nextEmpty]?.focus()
                  return
                }
                setFocusedIndex(index)
                event.currentTarget.select()
              }}
              onBlur={() => setFocusedIndex((current) => (current === index ? null : current))}
              onChange={(event) => {
                const incoming = normalize(event.target.value)
                if (!incoming) return
                // One-time-code autofill and IME commits can deliver several characters at once.
                if (incoming.length > 2) {
                  fillFrom(index, incoming)
                  return
                }
                // Typing into a filled slot without a selection yields the old and new character.
                const typed =
                  incoming.length === 2 && character
                    ? incoming.replace(character, "")
                    : incoming.at(-1)
                const next = characters.slice()
                next[index] = typed ?? ""
                update(next.join(""), Math.min(index + 1, length - 1))
              }}
              onPaste={(event) => {
                event.preventDefault()
                const pasted = normalize(event.clipboardData.getData("text"))
                if (pasted) fillFrom(index, pasted)
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

            {focused ? (
              <motion.span
                aria-hidden="true"
                data-slot="input-otp-active"
                layoutId={layoutId}
                className={cn(
                  "pointer-events-none absolute -inset-px rounded-[inherit] border ring-[3px]",
                  invalid ? "border-destructive ring-destructive/20" : "border-ring ring-ring/30"
                )}
                transition={springTransition}
              />
            ) : null}

            <AnimatePresence initial={false} mode="popLayout">
              {character ? (
                <motion.span
                  key={`${index}-${character}`}
                  aria-hidden="true"
                  className="pointer-events-none"
                  initial={reduceMotion ? false : { opacity: 0, y: 6, scale: 0.6 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6, transition: { duration: 0.12 } }}
                  transition={springTransition}
                >
                  {mask ? (
                    <span className="block size-2.5 rounded-full bg-foreground" />
                  ) : (
                    character
                  )}
                </motion.span>
              ) : focused ? (
                <motion.span
                  key="caret"
                  aria-hidden="true"
                  data-slot="input-otp-caret"
                  className="pointer-events-none h-[1.1em] w-px bg-foreground"
                  initial={{ opacity: 1 }}
                  animate={reduceMotion ? { opacity: 1 } : { opacity: [1, 1, 0, 0] }}
                  exit={{ opacity: 0, transition: { duration: 0 } }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { duration: 1.1, times: [0, 0.45, 0.55, 1], repeat: Infinity, ease: "easeInOut" }
                  }
                />
              ) : null}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

export { InputOTP }
