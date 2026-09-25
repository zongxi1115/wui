"use client"

import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

const inputShellVariants = cva(
  "group relative flex w-full items-center transition-[border-color,box-shadow,background-color] duration-200 ease-out has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 has-[input[aria-invalid=true]]:border-destructive motion-reduce:transition-none",
  {
    variants: {
      variant: {
        default:
          "rounded-md border border-input bg-background shadow-xs focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/30 has-[input[aria-invalid=true]]:ring-[3px] has-[input[aria-invalid=true]]:ring-destructive/20",
        underline:
          "border-b border-input bg-transparent focus-within:border-foreground has-[input[aria-invalid=true]]:border-destructive",
      },
      size: {
        sm: "h-8",
        default: "h-10",
        lg: "h-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface InputProps extends Omit<
  React.ComponentProps<"input">,
  "size"
> {
  /** Surface treatment of the input. @default "default" */
  variant?: "default" | "underline"
  /** Visual height preset. @default "default" */
  size?: "sm" | "default" | "lg"
  /** Floating label shown inside the field until focus or input. */
  label?: React.ReactNode
  /** Decorative or actionable content before the input. */
  startContent?: React.ReactNode
  /** Decorative or actionable content after the input. */
  endContent?: React.ReactNode
  /** Extra classes applied to the outer surface. */
  wrapperClassName?: string
  /** Shows an animated clear button while the field has a value; clearing fires `onChange` with an empty value. @default false */
  allowClear?: boolean
  /** Called after the clear button empties the field. */
  onClear?: () => void
}

function setNativeValue(input: HTMLInputElement, next: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set
  setter?.call(input, next)
  input.dispatchEvent(new Event("input", { bubbles: true }))
}

/** A refined text field with optional floating label, inline content and a clear action. */
function Input({
  className,
  wrapperClassName,
  variant = "default",
  size = "default",
  label,
  startContent,
  endContent,
  allowClear = false,
  onClear,
  id,
  placeholder,
  ref,
  value,
  defaultValue,
  onChange,
  disabled,
  readOnly,
  ...props
}: InputProps) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "")
  const hasValue = String(value ?? internalValue).length > 0
  const showClear = allowClear && hasValue && !disabled && !readOnly

  function assignRef(node: HTMLInputElement | null) {
    inputRef.current = node
    if (typeof ref === "function") ref(node)
    else if (ref) ref.current = node
  }

  function clear() {
    const input = inputRef.current
    if (!input) return
    setNativeValue(input, "")
    input.focus()
    onClear?.()
  }

  return (
    <div
      data-slot="input-shell"
      data-size={size}
      data-variant={variant}
      className={cn(inputShellVariants({ variant, size }), wrapperClassName)}
    >
      {startContent ? (
        <span
          data-slot="input-start"
          className={cn(
            "text-muted-foreground group-focus-within:text-foreground flex shrink-0 items-center justify-center transition-colors [&_svg]:size-4",
            variant === "underline" ? "ml-0" : "ml-3"
          )}
        >
          {startContent}
        </span>
      ) : null}
      <input
        ref={assignRef}
        id={inputId}
        data-slot="input"
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={label ? " " : placeholder}
        onChange={(event) => {
          if (value === undefined) setInternalValue(event.target.value)
          onChange?.(event)
        }}
        className={cn(
          "placeholder:text-muted-foreground/75 peer h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none disabled:cursor-not-allowed",
          size === "lg" && "px-4 text-base",
          startContent && "pl-2.5",
          (endContent || allowClear) && "pr-2.5",
          label && "pb-1 pt-4",
          variant === "underline" && "px-0",
          variant === "underline" && startContent && "pl-2.5",
          className
        )}
        {...props}
      />
      {label ? (
        <label
          data-slot="input-label"
          htmlFor={inputId}
          className={cn(
            "text-muted-foreground peer-focus:text-foreground pointer-events-none absolute top-1.5 origin-left text-[10px] font-medium leading-none transition-[top,translate,font-size,color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:translate-y-0 peer-focus:text-[10px] motion-reduce:transition-none",
            variant === "underline" ? "left-0" : "left-3",
            startContent && (variant === "underline" ? "left-6.5" : "left-9.5")
          )}
        >
          {label}
        </label>
      ) : null}
      {allowClear ? (
        <button
          type="button"
          tabIndex={-1}
          data-slot="input-clear"
          data-state={showClear ? "visible" : "hidden"}
          aria-label="清空内容"
          aria-hidden={!showClear}
          className={cn(
            "text-muted-foreground hover:bg-muted hover:text-foreground flex size-5 shrink-0 items-center justify-center rounded-full outline-none transition-[opacity,scale,background-color,color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            "data-[state=hidden]:pointer-events-none data-[state=hidden]:scale-50 data-[state=hidden]:opacity-0",
            endContent ? "mr-1.5" : variant === "underline" ? "mr-0" : "mr-2.5"
          )}
          onMouseDown={(event) => event.preventDefault()}
          onClick={clear}
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-3">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </button>
      ) : null}
      {endContent ? (
        <span
          data-slot="input-end"
          className={cn(
            "text-muted-foreground group-focus-within:text-foreground flex shrink-0 items-center justify-center transition-colors [&_button]:-mr-1 [&_svg]:size-4",
            variant === "underline" ? "mr-0" : "mr-3"
          )}
        >
          {endContent}
        </span>
      ) : null}
    </div>
  )
}

export { Input, inputShellVariants }
