"use client"

import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

const inputShellVariants = cva(
  "group relative flex w-full items-center transition-[border-color,box-shadow,background-color] duration-200 ease-out has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 has-[input[aria-invalid=true]]:border-destructive",
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

export interface InputProps extends React.ComponentProps<"input"> {
  /** Surface treatment of the input. @default "default" */
  variant?: "default" | "underline"
  /** Visual height preset. @default "default" */
  visualSize?: "sm" | "default" | "lg"
  /** Floating label shown inside the field until focus or input. */
  label?: React.ReactNode
  /** Decorative or actionable content before the input. */
  startContent?: React.ReactNode
  /** Decorative or actionable content after the input. */
  endContent?: React.ReactNode
  /** Extra classes applied to the outer surface. */
  wrapperClassName?: string
}

/** A refined text field with optional floating label and inline content. */
function Input({
  className,
  wrapperClassName,
  variant = "default",
  visualSize = "default",
  label,
  startContent,
  endContent,
  id,
  placeholder,
  ...props
}: InputProps) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId

  return (
    <div
      data-slot="input-shell"
      data-size={visualSize}
      data-variant={variant}
      className={cn(
        inputShellVariants({ variant, size: visualSize }),
        wrapperClassName
      )}
    >
      {startContent ? (
        <span
          data-slot="input-start"
          className="ml-3 flex shrink-0 items-center justify-center text-muted-foreground transition-colors group-focus-within:text-foreground [&_svg]:size-4"
        >
          {startContent}
        </span>
      ) : null}
      <input
        id={inputId}
        data-slot="input"
        placeholder={label ? " " : placeholder}
        className={cn(
          "peer h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground/75 disabled:cursor-not-allowed",
          visualSize === "lg" && "px-4 text-base",
          startContent && "pl-2.5",
          endContent && "pr-2.5",
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
            "pointer-events-none absolute top-1.5 origin-left text-[10px] font-medium leading-none text-muted-foreground transition-[top,transform,font-size,color] duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:text-foreground",
            variant === "underline" ? "left-0" : "left-3",
            startContent && (variant === "underline" ? "left-6" : "left-9")
          )}
        >
          {label}
        </label>
      ) : null}
      {endContent ? (
        <span
          data-slot="input-end"
          className="mr-3 flex shrink-0 items-center justify-center text-muted-foreground transition-colors group-focus-within:text-foreground [&_button]:-mr-1 [&_svg]:size-4"
        >
          {endContent}
        </span>
      ) : null}
    </div>
  )
}

export { Input, inputShellVariants }
