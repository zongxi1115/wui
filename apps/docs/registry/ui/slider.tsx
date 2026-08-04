"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "radix-ui"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

const sliderTrackVariants = cva(
  "relative w-full grow cursor-pointer overflow-hidden rounded-full bg-muted transition-[height,box-shadow] duration-150 ease-out group-focus-within:ring-1 group-focus-within:ring-primary group-focus-within:ring-offset-1 group-focus-within:ring-offset-background motion-reduce:transition-none",
  {
    variants: {
      variant: {
        default: "h-3 group-hover:h-3.5 group-focus-within:h-3.5",
        expand: "h-2 group-hover:h-3 group-focus-within:h-3",
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
  /** Values rendered as subtle dots on the track. */
  marks?: number[]
}

/** An adjustable range input with a filled track and compact thumb. */
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
  marks = [],
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
        "group relative flex w-full touch-none select-none items-center py-3 outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
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
          className="absolute h-full rounded-l-full bg-primary"
        />
        {marks.map((mark) => (
          <span
            key={mark}
            data-slot="slider-mark"
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 z-10 size-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/10"
            style={{ left: `${((mark - min) / (max - min)) * 100}%` }}
          />
        ))}
      </SliderPrimitive.Track>
      {currentValues.map((current, index) => (
        <SliderPrimitive.Thumb
          key={index}
          data-slot="slider-thumb"
          className="group/thumb relative block size-3 cursor-grab rounded-full border-2 border-primary bg-white shadow-sm outline-none transition-[width,height] duration-150 ease-out group-hover:size-3.5 group-focus-within:size-3.5 active:cursor-grabbing disabled:pointer-events-none motion-reduce:transition-none"
        >
          {showValue !== "never" ? (
            <span
              data-slot="slider-value"
              className={cn(
                "pointer-events-none absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-foreground px-2 py-1.5 text-[11px] font-medium leading-none tabular-nums text-background shadow-sm transition-[opacity,transform] duration-150 after:absolute after:left-1/2 after:top-[calc(100%-3px)] after:size-2 after:-translate-x-1/2 after:rotate-45 after:bg-foreground motion-reduce:transition-none",
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
