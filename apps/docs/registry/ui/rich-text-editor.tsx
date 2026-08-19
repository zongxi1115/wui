"use client"

import * as React from "react"
import {
  BoldIcon,
  CodeIcon,
  ExternalLinkIcon,
  Heading1Icon,
  Heading2Icon,
  ImagePlusIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  LoaderCircleIcon,
  PaperclipIcon,
  QuoteIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  StrikethroughIcon,
  UnderlineIcon,
  Undo2Icon,
} from "lucide-react"

import { Button } from "@/registry/ui/button"
import { cn } from "@/registry/lib/utils"

type Command =
  | "bold"
  | "italic"
  | "underline"
  | "strikeThrough"
  | "insertUnorderedList"
  | "insertOrderedList"
  | "formatBlock"
  | "formatBlockQuote"
  | "formatCode"
  | "createLink"
  | "removeFormat"
  | "undo"
  | "redo"

export interface RichTextEditorProps extends Omit<
  React.ComponentProps<"div">,
  "children" | "contentEditable" | "defaultValue" | "onChange" | "value"
> {
  /** 受控模式下的 HTML 内容。 */
  value?: string
  /** 非受控模式下的初始 HTML 内容。 */
  defaultValue?: string
  /** 内容变化时返回编辑器当前的 HTML。 */
  onValueChange?: (value: string) => void
  /** 编辑区为空时显示的提示文案。 */
  placeholder?: string
  /** 是否禁用编辑与格式化操作。 */
  disabled?: boolean
  /** 是否隐藏默认工具栏。 */
  hideToolbar?: boolean
  /** 可选择的附件类型，使用原生 input accept 格式。 */
  accept?: string
  /** 是否允许一次选择多个附件。 */
  multiple?: boolean
  /**
   * 接管文件上传，并返回可公开访问的附件地址；成功后编辑器会将它们插入为链接。
   * 未提供时，附件按钮不会显示。
   */
  onFileUpload?: (
    files: File[]
  ) => Promise<RichTextEditorAttachment[]> | RichTextEditorAttachment[]
  /** 接管图片上传，并返回可公开访问的图片地址；成功后编辑器会将它们插入。 */
  onImageUpload?: (
    files: File[]
  ) => Promise<RichTextEditorImage[]> | RichTextEditorImage[]
  /** 应用于可编辑内容区域的额外类名。 */
  editorClassName?: string
}

export interface RichTextEditorAttachment {
  /** 附件名称，会作为链接文本插入。 */
  name: string
  /** 上传后可访问的文件地址。 */
  url: string
}

export interface RichTextEditorImage {
  /** 图片上传后的可访问地址。 */
  url: string
  /** 图片的替代文本。 */
  alt?: string
}

const toolbarItems: Array<{
  command: Command
  label: string
  icon: React.ComponentType<{ className?: string }>
  value?: string
}> = [
  { command: "undo", label: "撤销", icon: Undo2Icon },
  { command: "redo", label: "重做", icon: Redo2Icon },
  { command: "formatBlock", value: "h1", label: "一级标题", icon: Heading1Icon },
  { command: "formatBlock", value: "h2", label: "二级标题", icon: Heading2Icon },
  { command: "bold", label: "加粗", icon: BoldIcon },
  { command: "italic", label: "斜体", icon: ItalicIcon },
  { command: "underline", label: "下划线", icon: UnderlineIcon },
  { command: "strikeThrough", label: "删除线", icon: StrikethroughIcon },
  { command: "insertUnorderedList", label: "无序列表", icon: ListIcon },
  { command: "insertOrderedList", label: "有序列表", icon: ListOrderedIcon },
  { command: "formatBlockQuote", label: "引用", icon: QuoteIcon },
  { command: "formatCode", label: "代码", icon: CodeIcon },
  { command: "createLink", label: "插入链接", icon: LinkIcon },
  { command: "removeFormat", label: "清除格式", icon: RemoveFormattingIcon },
]

/**
 * A dependency-free rich text editor built on the browser's native editing API.
 * Its value is HTML, so sanitize user-provided content before rendering it elsewhere.
 */
function RichTextEditor({
  className,
  editorClassName,
  value,
  defaultValue = "",
  onValueChange,
  placeholder = "输入内容…",
  disabled = false,
  hideToolbar = false,
  accept,
  multiple = true,
  onFileUpload,
  onImageUpload,
  ...props
}: RichTextEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const imageInputRef = React.useRef<HTMLInputElement>(null)
  const initialValueRef = React.useRef(value ?? defaultValue)
  const selectionRef = React.useRef<Range | null>(null)
  const [activeCommands, setActiveCommands] = React.useState<string[]>([])
  const [isUploading, setIsUploading] = React.useState(false)
  const [hoveredLink, setHoveredLink] = React.useState<{
    href: string
    left: number
    top: number
  } | null>(null)

  React.useLayoutEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    if (value === undefined) {
      if (!editor.innerHTML && initialValueRef.current) {
        editor.innerHTML = initialValueRef.current
      }
      return
    }

    // Avoid writing the same HTML back after every input event: resetting a
    // contenteditable element's innerHTML also resets the native selection.
    if (editor.innerHTML !== value) {
      editor.innerHTML = value
    }
  }, [value])

  const updateLinkAction = React.useCallback(() => {
    const editor = editorRef.current
    const selection = window.getSelection()
    const node = selection?.anchorNode
    const element = node instanceof Element ? node : node?.parentElement
    const link = element?.closest("a")

    if (!editor || !link || !editor.contains(link)) {
      setHoveredLink(null)
      return
    }

    const rect = link.getBoundingClientRect()
    setHoveredLink({
      href: link.href,
      left: rect.left + rect.width / 2,
      top: rect.top - 6,
    })
  }, [])

  const updateActiveCommands = React.useCallback(() => {
    setActiveCommands(
      ["bold", "italic", "underline", "strikeThrough", "insertUnorderedList", "insertOrderedList"].filter(
        (command) => document.queryCommandState(command)
      )
    )
    updateLinkAction()
  }, [updateLinkAction])

  const executeCommand = (command: Command, commandValue?: string) => {
    const editor = editorRef.current
    if (!editor || disabled) return

    editor.focus()

    if (command === "createLink") {
      const url = window.prompt("输入链接地址")
      if (!url) return
      document.execCommand(command, false, url)
    } else if (command === "formatBlockQuote") {
      document.execCommand("formatBlock", false, "blockquote")
    } else if (command === "formatCode") {
      document.execCommand("formatBlock", false, "pre")
    } else {
      document.execCommand(command, false, commandValue)
    }

    onValueChange?.(editor.innerHTML)
    updateActiveCommands()
  }

  const insertAttachments = (attachments: RichTextEditorAttachment[]) => {
    const editor = editorRef.current
    if (!editor) return

    editor.focus()
    const selection = window.getSelection()
    if (selectionRef.current) {
      selection?.removeAllRanges()
      selection?.addRange(selectionRef.current)
    }
    for (const attachment of attachments) {
      const link = document.createElement("a")
      link.href = attachment.url
      link.textContent = attachment.name
      link.target = "_blank"
      link.rel = "noreferrer"
      link.className = "text-primary underline underline-offset-4"
      document.execCommand("insertHTML", false, `${link.outerHTML}&nbsp;`)
    }
    onValueChange?.(editor.innerHTML)
  }

  const restoreSelection = () => {
    const selection = window.getSelection()
    if (selectionRef.current) {
      selection?.removeAllRanges()
      selection?.addRange(selectionRef.current)
    }
  }

  const saveSelection = () => {
    const selection = window.getSelection()
    if (selection?.rangeCount) {
      selectionRef.current = selection.getRangeAt(0).cloneRange()
    }
  }

  const insertImages = (images: RichTextEditorImage[]) => {
    const editor = editorRef.current
    if (!editor) return

    editor.focus()
    restoreSelection()
    for (const image of images) {
      const img = document.createElement("img")
      img.src = image.url
      img.alt = image.alt ?? ""
      img.className = "my-3 max-w-full rounded-md"
      document.execCommand("insertHTML", false, `${img.outerHTML}<br>`)
    }
    onValueChange?.(editor.innerHTML)
  }

  const uploadFiles = async (fileList: FileList | null) => {
    if (!fileList?.length || !onFileUpload) return

    setIsUploading(true)
    const attachments = await onFileUpload(Array.from(fileList))
    insertAttachments(attachments)
    setIsUploading(false)
  }

  const uploadImages = async (fileList: FileList | null) => {
    if (!fileList?.length || !onImageUpload) return

    setIsUploading(true)
    const images = await onImageUpload(Array.from(fileList))
    insertImages(images)
    setIsUploading(false)
  }

  return (
    <div
      data-slot="rich-text-editor"
      className={cn(
        "border-input bg-background focus-within:border-ring focus-within:ring-ring/30 overflow-hidden rounded-lg border shadow-xs transition-[border-color,box-shadow] duration-200 ease-out focus-within:ring-[3px] has-[div[contenteditable=false]]:cursor-not-allowed has-[div[contenteditable=false]]:opacity-60",
        className
      )}
      {...props}
    >
      {!hideToolbar ? (
        <div
          role="toolbar"
          aria-label="富文本格式工具"
          className="bg-muted/30 flex flex-wrap items-center gap-0.5 border-b px-2 py-1.5"
        >
          {toolbarItems.map(({ command, icon: Icon, label, value: commandValue }, index) => (
            <React.Fragment key={`${command}-${commandValue ?? index}`}>
              {[2, 4, 8, 12].includes(index) ? (
                <span aria-hidden className="bg-border mx-1 h-4 w-px" />
              ) : null}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={disabled}
                aria-label={label}
                aria-pressed={activeCommands.includes(command)}
                title={label}
                className={cn(
                  "size-7 rounded-md",
                  activeCommands.includes(command) && "bg-accent text-accent-foreground"
                )}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => executeCommand(command, commandValue)}
              >
                <Icon className="size-3.5" />
              </Button>
            </React.Fragment>
          ))}
          {onFileUpload ? (
            <>
              <span aria-hidden className="bg-border mx-1 h-4 w-px" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={disabled || isUploading}
                aria-label="上传附件"
                title="上传附件"
                className="size-7 rounded-md"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  saveSelection()
                  fileInputRef.current?.click()
                }}
              >
                {isUploading ? (
                  <LoaderCircleIcon className="size-3.5 animate-spin" />
                ) : (
                  <PaperclipIcon className="size-3.5" />
                )}
              </Button>
              <input
                ref={fileInputRef}
                className="sr-only"
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={(event) => {
                  void uploadFiles(event.currentTarget.files)
                  event.currentTarget.value = ""
                }}
              />
            </>
          ) : null}
          {onImageUpload ? (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={disabled || isUploading}
                aria-label="上传图片"
                title="上传图片"
                className="size-7 rounded-md"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  saveSelection()
                  imageInputRef.current?.click()
                }}
              >
                <ImagePlusIcon className="size-3.5" />
              </Button>
              <input
                ref={imageInputRef}
                className="sr-only"
                type="file"
                accept="image/*"
                multiple={multiple}
                onChange={(event) => {
                  void uploadImages(event.currentTarget.files)
                  event.currentTarget.value = ""
                }}
              />
            </>
          ) : null}
        </div>
      ) : null}
      <div
        ref={editorRef}
        data-slot="rich-text-editor-content"
        contentEditable={!disabled}
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label={props["aria-label"] ?? "富文本编辑器"}
        data-placeholder={placeholder}
        onInput={(event) => onValueChange?.(event.currentTarget.innerHTML)}
        onFocus={updateActiveCommands}
        onBlur={() => setHoveredLink(null)}
        onKeyUp={updateActiveCommands}
        onMouseUp={updateActiveCommands}
        onClick={(event) => {
          if (event.target instanceof Element && event.target.closest("a")) {
            event.preventDefault()
          }
        }}
        className={cn(
          "min-h-44 px-4 py-3 text-sm leading-7 outline-none empty:before:pointer-events-none empty:before:text-muted-foreground/70 empty:before:content-[attr(data-placeholder)] [&_blockquote]:border-l-primary [&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_h1]:my-3 [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:my-3 [&_h2]:text-xl [&_h2]:font-semibold [&_img]:my-3 [&_img]:max-w-full [&_img]:rounded-md [&_li]:ml-5 [&_ol]:my-3 [&_ol]:list-decimal [&_p]:my-2 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-3 [&_ul]:my-3 [&_ul]:list-disc",
          editorClassName
        )}
      />
      {hoveredLink ? (
        <div
          data-slot="rich-text-editor-link-action"
          className="fixed z-[60]"
          style={{
            left: hoveredLink.left,
            top: hoveredLink.top,
            transform: "translate(-50%, -100%)",
          }}
          onMouseDown={(event) => event.preventDefault()}
        >
          <Button asChild size="sm" className="h-7 gap-1 px-2 text-xs shadow-md">
            <a href={hoveredLink.href} target="_blank" rel="noreferrer">
              打开链接
              <ExternalLinkIcon className="size-3" />
            </a>
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export { RichTextEditor }
