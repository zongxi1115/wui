"use client"

import * as React from "react"
import {
  CopyIcon,
  DownloadIcon,
  Edit2Icon,
  FileCodeIcon,
  FolderInputIcon,
  InfoIcon,
  LockIcon,
  Share2Icon,
  Trash2Icon,
} from "lucide-react"

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/registry/ui/context-menu"

export default function ContextMenuFile() {
  const [isReadOnly, setIsReadOnly] = React.useState(false)

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-48 w-full max-w-lg cursor-context-menu flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center transition-colors hover:bg-muted/30">
        <div className="flex size-12 items-center justify-center rounded-lg border bg-background shadow-xs text-primary">
          <FileCodeIcon className="size-6" />
        </div>
        <span className="mt-3 text-sm font-semibold text-foreground">
          schema.prisma
        </span>
        <span className="mt-1 text-xs text-muted-foreground">
          右键单击（或长按）查看针对此文件的快捷操作
        </span>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-64">
        <ContextMenuLabel>文件操作</ContextMenuLabel>
        <ContextMenuGroup>
          <ContextMenuItem>
            <Edit2Icon />
            <span>重命名</span>
            <ContextMenuShortcut>F2</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <CopyIcon />
            <span>复制路径</span>
            <ContextMenuShortcut>⌥⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <DownloadIcon />
            <span>下载副本</span>
            <ContextMenuShortcut>⌘S</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>

        <ContextMenuSeparator />

        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Share2Icon />
            <span>协作与共享</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>
              <span>邀请协作者...</span>
            </ContextMenuItem>
            <ContextMenuItem>
              <span>复制分享链接</span>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem disabled>
              <span>导出为公共 Gist</span>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuItem>
          <FolderInputIcon />
          <span>移动至项目目录...</span>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuCheckboxItem
          checked={isReadOnly}
          onCheckedChange={(checked) => setIsReadOnly(checked === true)}
        >
          <LockIcon className="mr-2 size-3.5" />
          <span>锁定为只读文件</span>
        </ContextMenuCheckboxItem>

        <ContextMenuItem>
          <InfoIcon />
          <span>查看属性详情</span>
          <ContextMenuShortcut>⌘I</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem destructive>
          <Trash2Icon />
          <span>移至回收站</span>
          <ContextMenuShortcut>⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
