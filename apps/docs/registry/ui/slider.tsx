"use client"

import * as React from "react"
import { Direction, Slider as SliderPrimitive } from "radix-ui"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

const sliderTrackVariants = cva(
  "relative w-full grow cursor-pointer overflow-hidden rounded-full bg-muted transition-[height,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-focus-within:ring-1 group-focus-within:ring-primary group-focus-within:ring-offset-1 group-focus-within:ring-offset-background motion-reduce:transition-none",
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

export interface SliderProps extends React.ComponentProps<
  typeof SliderPrimitive.Root
> {
  /** Track expansion treatment used on hover and focus. @default "default" */
  variant?: "default" | "expand"
  /** Controls when the value label is visible. @default "hover" */
  showValue?: "hover" | "always" | "never"
  /** Formats the value displayed above each thumb. */
  formatValue?: (value: number) => React.ReactNode
  /** Values rendered as subtle dots on the track. */
  marks?: number[]
}

/**
 * An adjustable range input with a filled track and compact thumb. Clicking the
 * track or stepping with the keyboard glides to the new value; dragging follows
 * the pointer 1:1.
 */
function Slider({
  className,
  value,
  defaultValue = [50],
  onValueChange,
  min = 0,
  max = 100,
  dir,
  inverted = false,
  orientation = "horizontal",
  variant = "default",
  showValue = "hover",
  formatValue = (current) => current,
  marks = [],
  disabled,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onLostPointerCapture,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: SliderProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const [dragging, setDragging] = React.useState(false)
  const pointerDownRef = React.useRef(false)
  const currentValues = value ?? internalValue
  const direction = Direction.useDirection(dir)
  const startEdge =
    orientation === "vertical"
      ? inverted
        ? "top"
        : "bottom"
      : (direction === "ltr") !== inverted
        ? "left"
        : "right"
  const endEdge = {
    left: "right",
    right: "left",
    top: "bottom",
    bottom: "top",
  }[startEdge]
  const percentages = currentValues.map(
    (current) => ((current - min) / (max - min)) * 100
  )
  const rangeStart = currentValues.length > 1 ? Math.min(...percentages) : 0
  const rangeEnd = Math.max(...percentages)
  // Match Radix's in-bounds offset for the fixed 1rem thumb anchor.
  const rangeStyle = {
    [startEdge]:
      currentValues.length > 1
        ? `calc(${rangeStart}% + ${0.5 - rangeStart / 100}rem)`
        : "0%",
    [endEdge]: `calc(${100 - rangeEnd}% - ${0.5 - rangeEnd / 100}rem)`,
  }

  function handleValueChange(next: number[]) {
    if (value === undefined) setInternalValue(next)
    onValueChange?.(next)
  }

  function endPointer() {
    pointerDownRef.current = false
    setDragging(false)
  }

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      data-dragging={dragging || undefined}
      className={cn(
        "group relative flex w-full touch-none select-none items-center py-3 outline-none data-[orientation=vertical]:h-full data-[orientation=vertical]:w-auto data-[disabled]:cursor-not-allowed data-[orientation=vertical]:flex-col data-[orientation=vertical]:px-3 data-[orientation=vertical]:py-0 data-[disabled]:opacity-50",
        // Glide between values on click and keyboard; follow the pointer exactly while dragging.
        // Radix positions each thumb through an unstyled wrapper span, so it is targeted from the root.
        "[&>span:has([data-slot=slider-thumb])]:transition-[left,right,top,bottom] [&>span:has([data-slot=slider-thumb])]:duration-200 [&>span:has([data-slot=slider-thumb])]:ease-[cubic-bezier(0.22,1,0.36,1)] data-[dragging]:[&>span:has([data-slot=slider-thumb])]:transition-none motion-reduce:[&>span:has([data-slot=slider-thumb])]:transition-none",
        className
      )}
      value={value}
      defaultValue={defaultValue}
      onValueChange={handleValueChange}
      min={min}
      max={max}
      dir={direction}
      inverted={inverted}
      orientation={orientation}
      disabled={disabled}
      onPointerDown={(event) => {
        pointerDownRef.current = true
        onPointerDown?.(event)
      }}
      onPointerMove={(event) => {
        if (pointerDownRef.current && !dragging) setDragging(true)
        onPointerMove?.(event)
      }}
      onPointerUp={(event) => {
        endPointer()
        onPointerUp?.(event)
      }}
      onLostPointerCapture={(event) => {
        endPointer()
        onLostPointerCapture?.(event)
      }}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        data-variant={variant}
        className={cn(
          sliderTrackVariants({ variant }),
          "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-3"
        )}
      >
        <SliderPrimitive.Range asChild>
          <span
            data-slot="slider-range"
            style={rangeStyle}
            className="bg-primary absolute rounded-full transition-[left,right,top,bottom] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full group-data-[dragging]:transition-none motion-reduce:transition-none"
          />
        </SliderPrimitive.Range>
        {marks.map((mark) => (
          <span
            key={mark}
            data-slot="slider-mark"
            aria-hidden="true"
            className="bg-foreground/10 pointer-events-none absolute top-1/2 z-10 size-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ left: `${((mark - min) / (max - min)) * 100}%` }}
          />
        ))}
      </SliderPrimitive.Track>
      {currentValues.map((current, index) => (
        <SliderPrimitive.Thumb
          key={index}
          data-slot="slider-thumb"
          // Radix reads the accessible name from each thumb (role="slider"), not the root.
          aria-label={
            ariaLabel && currentValues.length > 1
              ? `${ariaLabel}（${index === 0 ? "最小值" : "最大值"}）`
              : ariaLabel
          }
          aria-labelledby={ariaLabelledBy}
          className="group/thumb relative block size-4 cursor-grab rounded-full outline-none active:cursor-grabbing disabled:pointer-events-none"
        >
          <span
            aria-hidden="true"
            className="border-primary bg-background group-active/thumb:ring-primary/15 pointer-events-none absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-sm transition-[width,height,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-focus-within:size-3.5 group-hover:size-3.5 group-active/thumb:size-4 group-active/thumb:ring-4 motion-reduce:transition-none"
          />
          {showValue !== "never" ? (
            <span
              data-slot="slider-value"
              className={cn(
                "bg-foreground text-background pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-20 origin-bottom -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-1.5 text-[11px] font-medium tabular-nums leading-none shadow-sm transition-[opacity,translate,scale] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                showValue === "always"
                  ? "opacity-100"
                  : "translate-y-1.5 scale-75 opacity-0 group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100"
              )}
            >
              {formatValue(current)}
              <svg
                aria-hidden="true"
                width="8"
                height="4"
                viewBox="0 0 8 4"
                className="fill-foreground absolute left-1/2 top-[calc(100%-1px)] block -translate-x-1/2"
              >
                <path d="M0 0h8L4 4Z" />
              </svg>
            </span>
          ) : null}
        </SliderPrimitive.Thumb>
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider, sliderTrackVariants }
