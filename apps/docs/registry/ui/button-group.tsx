import * as React from "react"

import { cn } from "@/registry/lib/utils"

export interface ButtonGroupProps extends React.ComponentProps<"div"> {
  /** 按钮排列方向。 @default "horizontal" */
  orientation?: "horizontal" | "vertical"
}

/**
 * 将一组相关按钮连接为单个操作单元。子项应使用 `Button`。
 *
 * 选择器作用于直接子元素而非 `data-slot=button`：当 Button 被
 * `DropdownMenuTrigger asChild` 等包装时，其 data-slot 会被覆盖，
 * 但仍需正确拼接圆角与边框。
 */
function ButtonGroup({
  className,
  orientation = "horizontal",
  role = "group",
  ...props
}: ButtonGroupProps) {
  return (
    <div
      data-slot="button-group"
      data-orientation={orientation}
      role={role}
      className={cn(
        "isolate inline-flex w-fit [&>*]:relative [&>*]:shadow-none [&>*:focus-visible]:z-10",
        orientation === "horizontal" &&
          "flex-row [&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none [&>[data-variant=default]:not(:first-child)]:border-l [&>[data-variant=default]:not(:first-child)]:border-l-primary-foreground/20 [&>[data-variant=destructive]:not(:first-child)]:border-l [&>[data-variant=destructive]:not(:first-child)]:border-l-destructive-foreground/20",
        orientation === "vertical" &&
          "flex-col [&>*:not(:first-child)]:-mt-px [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none [&>[data-variant=default]:not(:first-child)]:border-t [&>[data-variant=default]:not(:first-child)]:border-t-primary-foreground/20",
        className
      )}
      {...props}
    />
  )
}

export { ButtonGroup }
