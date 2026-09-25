"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

const inputNumberVariants = cva(
  "border-input bg-background shadow-xs focus-within:border-ring focus-within:ring-ring/30 has-[input[aria-invalid=true]]:border-destructive has-[input[aria-invalid=true]]:ring-destructive/20 has-[input[aria-invalid=true]]:ring-[3px] flex w-full items-center overflow-hidden rounded-md border transition-[border-color,box-shadow] duration-200 ease-out focus-within:ring-[3px] has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 motion-reduce:transition-none",
  {
    variants: {
      size: {
        sm: "h-8 text-xs",
        default: "h-10 text-sm",
        lg: "h-12 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const controlBtnVariants = cva(
  "group/step text-muted-foreground hover:bg-accent hover:text-foreground active:bg-accent/70 inline-flex touch-none select-none items-center justify-center outline-none transition-colors disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      size: {
        sm: "w-7",
        default: "w-9",
        lg: "w-11",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const HOLD_DELAY = 380
const HOLD_INTERVAL = 70

export interface InputNumberProps
  extends Omit<
    React.ComponentProps<"input">,
    "defaultValue" | "onChange" | "type" | "value" | "prefix" | "size"
  > {
  /** 当前数值；传入后组件进入受控模式。 */
  value?: number | null
  /** 非受控模式下的初始数值。 */
  defaultValue?: number
  /** 数值变化时触发，清空输入时返回 `null`。 */
  onValueChange?: (value: number | null) => void
  /** 允许输入的最小值。 */
  min?: number
  /** 允许输入的最大值。 */
  max?: number
  /** 点击按钮或按方向键时的步进值；按住 Shift 时为 10 倍步进。 @default 1 */
  step?: number
  /** 前缀插槽（如货币符号 ¥、$）。 */
  prefix?: React.ReactNode
  /** 后缀插槽（如单位 kg、%、GiB）。 */
  suffix?: React.ReactNode
  /** 尺寸密度。@default "default" */
  size?: "sm" | "default" | "lg"
  /** 输入框外层容器样式。 */
  wrapperClassName?: string
}

/** 支持范围约束、长按连续步进、方向感知滚动动效和键盘操作的数值输入框。 */
function InputNumber({
  value,
  defaultValue,
  onValueChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  size = "default",
  disabled,
  readOnly,
  className,
  wrapperClassName,
  onBlur,
  onKeyDown,
  ...props
}: InputNumberProps) {
  const reduceMotion = useReducedMotion()
  const controlled = value !== undefined
  const [internalValue, setInternalValue] = React.useState<number | null>(
    defaultValue ?? null
  )
  const currentValue = controlled ? value : internalValue
  const [draft, setDraft] = React.useState(
    currentValue === null || currentValue === undefined
      ? ""
      : String(currentValue)
  )
  // A stepped value slides in from the direction it came from; `rolling` hides
  // the native text while the overlay animates, then hands display back to it.
  const [roll, setRoll] = React.useState({ id: 0, direction: 1 as 1 | -1 })
  const [rolling, setRolling] = React.useState(false)
  const valueRef = React.useRef(currentValue)
  const holdRef = React.useRef<{ timeout?: number; interval?: number }>({})
  valueRef.current = currentValue

  React.useEffect(() => {
    if (!controlled) return
    const parsedDraft = draft.trim() === "" ? null : Number(draft)
    if (value !== parsedDraft) setDraft(value === null ? "" : String(value))
    // `draft` intentionally stays out of this dependency list so intermediate
    // input such as `-` and `1.` is not replaced while the user is typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlled, value])

  React.useEffect(() => stopHold, [])

  const precision = Math.max(
    String(step).split(".")[1]?.length ?? 0,
    String(min ?? "").split(".")[1]?.length ?? 0,
    String(max ?? "").split(".")[1]?.length ?? 0
  )

  const clamp = (next: number) => {
    const bounded = Math.min(max ?? Infinity, Math.max(min ?? -Infinity, next))
    return Number(bounded.toFixed(precision))
  }

  const commit = (next: number | null) => {
    valueRef.current = next
    if (!controlled) setInternalValue(next)
    setDraft(next === null ? "" : String(next))
    onValueChange?.(next)
  }

  const stepBy = (direction: 1 | -1, multiplier = 1) => {
    if (disabled || readOnly) return false
    const latest = valueRef.current
    const base = latest ?? (direction > 0 ? (min ?? 0) : (max ?? 0))
    const next = clamp(base + direction * step * multiplier)
    if (next === latest) return false
    if (!reduceMotion) {
      setRoll((previous) => ({ id: previous.id + 1, direction }))
      setRolling(true)
    }
    commit(next)
    return true
  }

  function stopHold() {
    window.clearTimeout(holdRef.current.timeout)
    window.clearInterval(holdRef.current.interval)
    holdRef.current = {}
  }

  function startHold(direction: 1 | -1) {
    stopHold()
    stepBy(direction)
    holdRef.current.timeout = window.setTimeout(() => {
      holdRef.current.interval = window.setInterval(() => {
        if (!stepBy(direction)) stopHold()
      }, HOLD_INTERVAL)
    }, HOLD_DELAY)
  }

  const atMin =
    currentValue !== null &&
    currentValue !== undefined &&
    min !== undefined &&
    currentValue <= min
  const atMax =
    currentValue !== null &&
    currentValue !== undefined &&
    max !== undefined &&
    currentValue >= max

  function stepButtonProps(direction: 1 | -1) {
    return {
      type: "button" as const,
      tabIndex: -1,
      className: cn(controlBtnVariants({ size }), direction > 0 && "border-l"),
      disabled: disabled || readOnly || (direction > 0 ? atMax : atMin),
      onMouseDown: (event: React.MouseEvent) => event.preventDefault(),
      onPointerDown: (event: React.PointerEvent) => {
        if (event.button !== 0) return
        event.currentTarget.setPointerCapture(event.pointerId)
        startHold(direction)
      },
      onPointerUp: stopHold,
      onPointerCancel: stopHold,
      onLostPointerCapture: stopHold,
      // Keyboard or assistive-technology activation arrives as a click without a pointer.
      onClick: (event: React.MouseEvent) => {
        if (event.detail === 0) stepBy(direction)
      },
    }
  }

  const iconClassName =
    "size-3.5 transition-transform duration-150 ease-out group-active/step:scale-75 motion-reduce:transition-none"

  return (
    <div
      data-slot="input-number"
      className={cn(inputNumberVariants({ size }), wrapperClassName)}
    >
      {prefix ? (
        <span className="text-muted-foreground pl-3 pr-1 select-none shrink-0 font-medium">
          {prefix}
        </span>
      ) : null}

      <div className="relative h-full min-w-0 flex-1">
        <input
          data-slot="input-number-input"
          type="text"
          inputMode="decimal"
          role="spinbutton"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentValue ?? undefined}
          value={draft}
          disabled={disabled}
          readOnly={readOnly}
          className={cn(
            "placeholder:text-muted-foreground size-full bg-transparent px-3 tabular-nums outline-none disabled:cursor-not-allowed",
            prefix && "pl-1",
            suffix && "pr-1",
            rolling && "text-transparent",
            className
          )}
          onChange={(event) => {
            const nextDraft = event.target.value
            setRolling(false)
            setDraft(nextDraft)
            if (nextDraft.trim() === "") {
              valueRef.current = null
              if (!controlled) setInternalValue(null)
              onValueChange?.(null)
              return
            }
            const parsed = Number(nextDraft)
            if (Number.isFinite(parsed)) {
              valueRef.current = parsed
              if (!controlled) setInternalValue(parsed)
              onValueChange?.(parsed)
            }
          }}
          onBlur={(event) => {
            const parsed = Number(draft)
            if (draft.trim() === "" || !Number.isFinite(parsed)) commit(null)
            else commit(clamp(parsed))
            onBlur?.(event)
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowUp" || event.key === "ArrowDown") {
              event.preventDefault()
              const multiplier = event.shiftKey ? 10 : 1
              stepBy(event.key === "ArrowUp" ? 1 : -1, multiplier)
            }
            onKeyDown?.(event)
          }}
          {...props}
        />

        {!reduceMotion ? (
          <span
            aria-hidden="true"
            data-slot="input-number-roll"
            className={cn(
              "pointer-events-none absolute inset-0 flex items-center overflow-hidden px-3 tabular-nums",
              prefix && "pl-1",
              suffix && "pr-1",
              !rolling && "invisible",
              className
            )}
          >
            <AnimatePresence initial={false} custom={roll.direction}>
              <motion.span
                key={roll.id}
                custom={roll.direction}
                className="absolute whitespace-pre"
                variants={{
                  enter: (direction: number) => ({ y: `${direction * 70}%`, opacity: 0 }),
                  center: { y: "0%", opacity: 1 },
                  exit: (direction: number) => ({ y: `${direction * -70}%`, opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 520, damping: 38, mass: 0.7 }}
                onAnimationComplete={(definition) => {
                  if (definition === "center") setRolling(false)
                }}
              >
                {draft}
              </motion.span>
            </AnimatePresence>
          </span>
        ) : null}
      </div>

      {suffix ? (
        <span className="text-muted-foreground pl-1 pr-2.5 select-none shrink-0 font-normal">
          {suffix}
        </span>
      ) : null}

      <div
        data-slot="input-number-controls"
        className="flex h-full shrink-0 border-l"
      >
        <button
          data-slot="input-number-decrement"
          aria-label="减小数值"
          {...stepButtonProps(-1)}
        >
          <Minus className={iconClassName} />
        </button>
        <button
          data-slot="input-number-increment"
          aria-label="增大数值"
          {...stepButtonProps(1)}
        >
          <Plus className={iconClassName} />
        </button>
      </div>
    </div>
  )
}

export { InputNumber, inputNumberVariants }
