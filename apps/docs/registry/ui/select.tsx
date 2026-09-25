"use client"

import * as React from "react"
import * as SelectPrimitive from "radix-ui/select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { motion, useAnimate, useReducedMotion } from "motion/react"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

const SelectGroup = SelectPrimitive.Group
const MotionViewport = motion.create(SelectPrimitive.Viewport)

const SelectValueContext = React.createContext<string | undefined>(undefined)

const SelectHighlightContext = React.createContext<{
  highlighted: string | null
  setHighlighted: (value: string | null) => void
  layoutId: string
} | null>(null)

function Select({
  value,
  defaultValue,
  onValueChange,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const currentValue = value ?? internalValue

  return (
    <SelectValueContext.Provider value={currentValue}>
      <SelectPrimitive.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={(next) => {
          if (value === undefined) setInternalValue(next)
          onValueChange?.(next)
        }}
        {...props}
      />
    </SelectValueContext.Provider>
  )
}

function SelectValue({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  const currentValue = React.useContext(SelectValueContext)
  const reduceMotion = useReducedMotion()
  const [scope, animate] = useAnimate<HTMLSpanElement>()
  const previousValue = React.useRef(currentValue)

  React.useEffect(() => {
    if (previousValue.current === currentValue) return
    previousValue.current = currentValue
    if (reduceMotion || !scope.current) return
    animate(
      scope.current,
      { opacity: [0, 1], y: [5, 0] },
      { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
    )
  }, [animate, currentValue, reduceMotion, scope])

  return (
    <span
      ref={scope}
      className={cn("min-w-0 flex-1 truncate text-left", className)}
    >
      <SelectPrimitive.Value data-slot="select-value" {...props} />
    </span>
  )
}

const selectTriggerVariants = cva(
  "group flex min-w-0 w-fit items-center justify-between gap-3 overflow-hidden whitespace-nowrap rounded-md border border-input bg-background text-sm shadow-xs outline-none transition-[border-color,box-shadow,background-color] duration-200 ease-out hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      size: {
        sm: "h-8 min-w-32 px-3",
        default: "h-10 min-w-44 px-3.5",
        lg: "h-12 min-w-52 px-4 text-base",
      },
    },
    defaultVariants: { size: "default" },
  }
)

export interface SelectTriggerProps extends React.ComponentProps<
  typeof SelectPrimitive.Trigger
> {
  /** Height and minimum-width preset. @default "default" */
  size?: "sm" | "default" | "lg"
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(selectTriggerVariants({ size }), className)}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="text-muted-foreground size-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  sideOffset = 6,
  onPointerLeave,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  const [highlighted, setHighlighted] = React.useState<string | null>(null)
  const layoutId = React.useId()

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 relative z-50 flex max-h-[min(18rem,var(--radix-select-content-available-height))] min-w-[10rem] origin-(--radix-select-content-transform-origin) flex-col overflow-hidden rounded-lg border shadow-md outline-none duration-200 motion-reduce:animate-none",
          position === "popper" && "w-[var(--radix-select-trigger-width)]",
          className
        )}
        onPointerLeave={(event) => {
          onPointerLeave?.(event)
          setHighlighted(null)
        }}
        {...props}
      >
        <SelectHighlightContext.Provider
          value={{ highlighted, setHighlighted, layoutId }}
        >
          <SelectScrollUpButton />
          <MotionViewport
            layoutScroll
            className="min-h-0 flex-1 scroll-py-1 overflow-y-auto p-1"
          >
            {children}
          </MotionViewport>
          <SelectScrollDownButton />
        </SelectHighlightContext.Provider>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(
        "text-muted-foreground px-2.5 py-1.5 text-xs font-semibold tracking-wide",
        className
      )}
      {...props}
    />
  )
}

export interface SelectItemProps extends React.ComponentProps<
  typeof SelectPrimitive.Item
> {
  /** 显示在选项名称下方的辅助说明，不会带入触发器。 */
  description?: React.ReactNode
}

function SelectItem({
  className,
  children,
  value,
  description,
  onFocus,
  ...props
}: SelectItemProps) {
  const reduceMotion = useReducedMotion()
  const highlight = React.useContext(SelectHighlightContext)
  const highlighted = highlight?.highlighted === value

  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      value={value}
      className={cn(
        "data-[highlighted]:text-accent-foreground relative isolate flex w-full cursor-default select-none items-center rounded-md py-2 pl-8 pr-3 text-sm outline-none transition-colors duration-150 data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
        className
      )}
      onFocus={(event) => {
        onFocus?.(event)
        highlight?.setHighlighted(value)
      }}
      {...props}
    >
      {highlighted ? (
        <motion.span
          aria-hidden
          data-slot="select-item-indicator"
          layoutId={highlight?.layoutId}
          className="bg-accent absolute inset-0 z-[-1] rounded-md"
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 520, damping: 38, mass: 0.7 }
          }
        />
      ) : null}
      <span className="absolute left-2 flex size-5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <motion.span
            className="flex"
            initial={reduceMotion ? false : { scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 560, damping: 28, mass: 0.6 }}
          >
            <CheckIcon className="size-4" />
          </motion.span>
        </SelectPrimitive.ItemIndicator>
      </span>
      {description ? (
        <span className="flex min-w-0 flex-col gap-0.5">
          <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
          <span
            data-slot="select-item-description"
            className="text-muted-foreground text-xs leading-4"
          >
            {description}
          </span>
        </span>
      ) : (
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      )}
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "text-muted-foreground flex h-7 items-center justify-center",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "text-muted-foreground flex h-7 items-center justify-center",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  selectTriggerVariants,
}
