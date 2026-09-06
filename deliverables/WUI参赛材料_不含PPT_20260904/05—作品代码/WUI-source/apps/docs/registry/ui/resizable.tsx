"use client"

import * as React from "react"
import { GripVerticalIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"

type ResizableOrientation = "horizontal" | "vertical"

interface ResizableContextValue {
  disabled: boolean
  maxSize: number
  minSize: number
  orientation: ResizableOrientation
  setSize: (size: number) => void
  size: number
  step: number
}

const ResizableContext = React.createContext<ResizableContextValue | null>(null)

function useResizableContext() {
  const context = React.useContext(ResizableContext)
  if (!context) {
    throw new Error("Resizable 子组件必须位于 ResizablePanelGroup 内")
  }
  return context
}

export interface ResizablePanelGroupProps extends Omit<
  React.ComponentProps<"div">,
  "onChange"
> {
  /** 首个面板的受控尺寸百分比。 */
  size?: number
  /** 首个面板的初始尺寸百分比。@default 50 */
  defaultSize?: number
  /** 首个面板允许的最小尺寸百分比。@default 20 */
  minSize?: number
  /** 首个面板允许的最大尺寸百分比。@default 80 */
  maxSize?: number
  /** 面板排列与拖动方向。@default "horizontal" */
  orientation?: ResizableOrientation
  /** 键盘方向键每次调整的百分比。@default 2 */
  step?: number
  /** 禁止指针与键盘调整。@default false */
  disabled?: boolean
  /** 首个面板尺寸变化时触发。 */
  onSizeChange?: (size: number) => void
}

/** 协调两个面板及其拖动手柄的尺寸。 */
function ResizablePanelGroup({
  className,
  children,
  size: controlledSize,
  defaultSize = 50,
  minSize = 20,
  maxSize = 80,
  orientation = "horizontal",
  step = 2,
  disabled = false,
  onSizeChange,
  style,
  ...props
}: ResizablePanelGroupProps) {
  const lowerBound = Math.min(minSize, maxSize)
  const upperBound = Math.max(minSize, maxSize)
  const clamp = React.useCallback(
    (next: number) => Math.min(upperBound, Math.max(lowerBound, next)),
    [lowerBound, upperBound]
  )
  const [internalSize, setInternalSize] = React.useState(() =>
    clamp(defaultSize)
  )
  const currentSize = clamp(controlledSize ?? internalSize)

  const setSize = React.useCallback(
    (next: number) => {
      const clamped = clamp(next)
      if (controlledSize === undefined) setInternalSize(clamped)
      onSizeChange?.(clamped)
    },
    [clamp, controlledSize, onSizeChange]
  )

  const context = React.useMemo(
    () => ({
      disabled,
      maxSize: upperBound,
      minSize: lowerBound,
      orientation,
      setSize,
      size: currentSize,
      step: Math.max(0.1, step),
    }),
    [currentSize, disabled, lowerBound, orientation, setSize, step, upperBound]
  )

  return (
    <ResizableContext.Provider value={context}>
      <div
        data-slot="resizable-panel-group"
        data-orientation={orientation}
        className={cn(
          "flex size-full min-h-0 min-w-0 overflow-hidden",
          orientation === "vertical" && "flex-col",
          className
        )}
        style={
          {
            "--resizable-primary-size": `${currentSize}%`,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
      </div>
    </ResizableContext.Provider>
  )
}

/** ResizablePanelGroup 内的内容面板；首个面板由手柄调整尺寸。 */
function ResizablePanel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="resizable-panel"
      className={cn(
        "min-h-0 min-w-0 flex-1 overflow-auto first:grow-0 first:basis-[var(--resizable-primary-size)]",
        className
      )}
      {...props}
    />
  )
}

export interface ResizableHandleProps extends React.ComponentProps<"div"> {
  /** 在手柄中央显示抓取指示器。@default false */
  withHandle?: boolean
}

/** 支持指针拖动与方向键调整的面板分隔手柄。 */
function ResizableHandle({
  className,
  withHandle = false,
  onPointerDown,
  onPointerMove,
  onKeyDown,
  ...props
}: ResizableHandleProps) {
  const context = useResizableContext()
  const group = React.useRef<HTMLElement | null>(null)

  function updateFromPointer(event: React.PointerEvent<HTMLDivElement>) {
    if (
      !event.currentTarget.hasPointerCapture(event.pointerId) ||
      !group.current
    )
      return
    const rect = group.current.getBoundingClientRect()
    const next =
      context.orientation === "horizontal"
        ? ((event.clientX - rect.left) / rect.width) * 100
        : ((event.clientY - rect.top) / rect.height) * 100
    context.setSize(next)
  }

  return (
    <div
      data-slot="resizable-handle"
      data-orientation={context.orientation}
      data-disabled={context.disabled || undefined}
      role="separator"
      aria-orientation={context.orientation}
      aria-valuemin={context.minSize}
      aria-valuemax={context.maxSize}
      aria-valuenow={Math.round(context.size)}
      aria-disabled={context.disabled}
      tabIndex={context.disabled ? -1 : 0}
      className={cn(
        "bg-border focus-visible:ring-ring relative z-10 flex shrink-0 touch-none select-none items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-offset-2 data-[orientation=vertical]:h-px data-[orientation=horizontal]:w-px data-[disabled]:cursor-not-allowed data-[orientation=horizontal]:cursor-col-resize data-[orientation=vertical]:cursor-row-resize data-[disabled]:opacity-50 [&[data-orientation=vertical]>div]:rotate-90",
        className
      )}
      onPointerDown={(event) => {
        onPointerDown?.(event)
        if (event.defaultPrevented || context.disabled) return
        group.current = event.currentTarget.parentElement
        event.currentTarget.setPointerCapture(event.pointerId)
        event.preventDefault()
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event)
        if (!event.defaultPrevented && !context.disabled)
          updateFromPointer(event)
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.defaultPrevented || context.disabled) return
        const decrementKey =
          context.orientation === "horizontal" ? "ArrowLeft" : "ArrowUp"
        const incrementKey =
          context.orientation === "horizontal" ? "ArrowRight" : "ArrowDown"
        if (event.key === decrementKey)
          context.setSize(context.size - context.step)
        else if (event.key === incrementKey)
          context.setSize(context.size + context.step)
        else if (event.key === "Home") context.setSize(context.minSize)
        else if (event.key === "End") context.setSize(context.maxSize)
        else return
        event.preventDefault()
      }}
      {...props}
    >
      {withHandle ? (
        <div
          data-slot="resizable-handle-grip"
          className="bg-border flex h-7 w-4 items-center justify-center rounded-sm border"
        >
          <GripVerticalIcon className="size-3" aria-hidden="true" />
        </div>
      ) : null}
    </div>
  )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
