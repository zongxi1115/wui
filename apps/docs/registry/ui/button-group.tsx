import * as React from "react"

import { cn } from "@/registry/lib/utils"

export interface ButtonGroupProps extends React.ComponentProps<"div"> {
  /** 按钮排列方向。 @default "horizontal" */
  orientation?: "horizontal" | "vertical"
}

/** 将一组相关按钮连接为单个操作单元。子项应使用 `Button`。 */
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
        "isolate inline-flex w-fit [&>[data-slot=button]]:relative [&>[data-slot=button]]:focus-visible:z-10",
        orientation === "horizontal" &&
          "flex-row [&>[data-slot=button]:not(:first-child)]:-ml-px [&>[data-slot=button]:not(:first-child)]:rounded-l-none [&>[data-slot=button]:not(:last-child)]:rounded-r-none",
        orientation === "vertical" &&
          "flex-col [&>[data-slot=button]:not(:first-child)]:-mt-px [&>[data-slot=button]:not(:first-child)]:rounded-t-none [&>[data-slot=button]:not(:last-child)]:rounded-b-none",
        className
      )}
      {...props}
    />
  )
}

export { ButtonGroup }
