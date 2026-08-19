"use client"

import * as React from "react"
import { Code2Icon, CopyIcon, CheckIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/ui/dialog"

export default function DialogCustomSize() {
  const [copied, setCopied] = React.useState(false)

  const codeSnippet = `// tailwind.config.ts
import type { Config } from "tailwindcss"

export default {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
    },
  },
} satisfies Config`

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Code2Icon />
          查看配置文件 (宽版弹窗)
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Tailwind CSS 配置文件预览</DialogTitle>
          <DialogDescription>
            你可以复制以下配置内容直接粘贴到项目的配置文件中。
          </DialogDescription>
        </DialogHeader>
        <div className="relative my-2 rounded-md bg-muted p-4 font-mono text-xs text-foreground">
          <pre className="overflow-x-auto">{codeSnippet}</pre>
          <Button
            size="sm"
            variant="ghost"
            className="absolute right-2 top-2 h-7 px-2"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <CheckIcon className="size-3.5 text-emerald-500" />
                <span className="text-xs text-emerald-500">已复制</span>
              </>
            ) : (
              <>
                <CopyIcon className="size-3.5" />
                <span className="text-xs">复制</span>
              </>
            )}
          </Button>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">关闭</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
