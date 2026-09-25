"use client"

import * as React from "react"

import { RichTextEditor } from "@/registry/ui/rich-text-editor"

const initialValue = `<h2>v2.4 更新说明</h2><p>本次发布重点优化了团队协作体验。</p><ul><li>评论支持 <strong>@ 提及</strong> 成员与话题</li><li>表单校验提示改为平滑展开</li></ul><blockquote>发布前请确认所有变更已完成验收。</blockquote>`

export default function RichTextEditorDemo() {
  const [value, setValue] = React.useState(initialValue)

  return (
    <div className="grid w-full max-w-2xl gap-2">
      <span id="release-notes-label" className="text-sm font-medium">
        更新说明
      </span>
      <RichTextEditor
        aria-labelledby="release-notes-label"
        aria-describedby="release-notes-hint"
        value={value}
        onValueChange={setValue}
        placeholder="写下本次更新的内容…"
        accept=".pdf,.doc,.docx,.xlsx,.zip"
        onFileUpload={async (files) =>
          files.map((file) => ({ name: file.name, url: URL.createObjectURL(file) }))
        }
        onImageUpload={async (files) =>
          files.map((file) => ({ alt: file.name, url: URL.createObjectURL(file) }))
        }
      />
      <p id="release-notes-hint" className="text-muted-foreground text-xs">
        选中文字后点击工具栏切换格式，再次点击标题或引用可恢复为正文；示例中的附件仅保存在本地。
      </p>
    </div>
  )
}
