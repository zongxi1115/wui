"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "radix-ui"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

const sliderTrackVariants = cva(
  "relative h-1 w-full grow cursor-pointer overflow-hidden rounded-full bg-muted transition-[height] duration-200 ease-out motion-reduce:transition-none",
  {
    variants: {
      variant: {
        default: "group-hover:h-2 group-focus-within:h-2",
        expand: "group-hover:h-5 group-focus-within:h-5",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

export interface SliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root> {
  /** Track expansion treatment used on hover and focus. @default "default" */
  variant?: "default" | "expand"
  /** Controls when the value label is visible. @default "hover" */
  showValue?: "hover" | "always" | "never"
  /** Formats the value displayed above each thumb. */
  formatValue?: (value: number) => React.ReactNode
}

/** An adjustable range input with a track that expands on interaction. */
function Slider({
  className,
  value,
  defaultValue = [50],
  onValueChange,
  min = 0,
  max = 100,
  variant = "default",
  showValue = "hover",
  formatValue = (current) => current,
  disabled,
  ...props
}: SliderProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const currentValues = value ?? internalValue

  function handleValueChange(next: number[]) {
    if (value === undefined) setInternalValue(next)
    onValueChange?.(next)
  }

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn(
        "group relative flex w-full touch-none select-none items-center py-4 outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        className
      )}
      value={value}
      defaultValue={defaultValue}
      onValueChange={handleValueChange}
      min={min}
      max={max}
      disabled={disabled}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        data-variant={variant}
        className={sliderTrackVariants({ variant })}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute h-full bg-primary"
        />
      </SliderPrimitive.Track>
      {currentValues.map((current, index) => (
        <SliderPrimitive.Thumb
          key={index}
          data-slot="slider-thumb"
          className="group/thumb relative block size-5 cursor-grab rounded-full border border-border/70 bg-background shadow-sm outline-none transition-[box-shadow,transform] duration-150 hover:scale-105 focus-visible:ring-[4px] focus-visible:ring-ring/30 active:scale-95 active:cursor-grabbing disabled:pointer-events-none motion-reduce:transition-none"
        >
          {showValue !== "never" ? (
            <span
              data-slot="slider-value"
              className={cn(
                "pointer-events-none absolute bottom-[calc(100%+9px)] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] font-medium leading-none tabular-nums text-background shadow-sm transition-[opacity,transform] duration-150 motion-reduce:transition-none",
                showValue === "always"
                  ? "opacity-100"
                  : "translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
              )}
            >
              {formatValue(current)}
            </span>
          ) : null}
        </SliderPrimitive.Thumb>
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider, sliderTrackVariants }
