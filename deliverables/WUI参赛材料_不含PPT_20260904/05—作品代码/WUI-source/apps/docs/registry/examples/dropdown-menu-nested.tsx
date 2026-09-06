"use client"

import * as React from "react"
import {
  ArchiveIcon,
  CopyIcon,
  DownloadIcon,
  FileCodeIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  FolderPlusIcon,
  MoreVerticalIcon,
  Share2Icon,
  TagsIcon,
  Trash2Icon,
  UserPlusIcon,
} from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/registry/ui/dropdown-menu"

export default function DropdownMenuNested() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <MoreVerticalIcon />
          文档操作选项
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>文档管理</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <CopyIcon />
            创建副本
            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FolderPlusIcon />
            移动至文件夹...
          </DropdownMenuItem>
          <DropdownMenuItem>
            <TagsIcon />
            编辑标签
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Share2Icon />
              分享与协作
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-48">
              <DropdownMenuItem>
                <UserPlusIcon />
                邀请团队成员
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CopyIcon />
                复制公开链接
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>嵌入到网页...</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <DownloadIcon />
              导出为
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-44">
              <DropdownMenuItem>
                <FileTextIcon />
                PDF 文档 (.pdf)
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileSpreadsheetIcon />
                CSV 表格 (.csv)
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileCodeIcon />
                Markdown (.md)
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <ArchiveIcon />
          归档文档
        </DropdownMenuItem>
        <DropdownMenuItem destructive>
          <Trash2Icon />
          移至废纸篓
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
