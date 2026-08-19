"use client"

import * as React from "react"

import { RichTextEditor } from "@/registry/ui/rich-text-editor"

const initialValue = `<h2>产品更新说明</h2><p>本次发布优化了团队的协作体验。</p><ul><li>支持在正文中插入<strong>重点信息</strong></li><li>使用列表组织操作步骤</li></ul><blockquote>发布前请确认所有变更已完成验收。</blockquote>`

export default function RichTextEditorDemo() {
  const [value, setValue] = React.useState(initialValue)

  return (
    <div className="w-full max-w-2xl space-y-2">
      <label className="text-xs font-medium text-muted-foreground" htmlFor="release-notes">
        更新说明
      </label>
      <RichTextEditor
        id="release-notes"
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
      <p className="text-xs text-muted-foreground">支持浏览器常用编辑快捷键、附件和图片插入；实际项目中请接入上传服务。</p>
    </div>
  )
}
