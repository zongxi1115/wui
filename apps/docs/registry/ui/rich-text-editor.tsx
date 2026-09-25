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
  /** Stable id; also the active-state key for toggle items. */
  id: string
  command: Command
  label: string
  icon: React.ComponentType<{ className?: string }>
  value?: string
  /** Toggle items expose `aria-pressed`; one-shot actions do not. */
  toggle?: boolean
}> = [
  { id: "undo", command: "undo", label: "撤销", icon: Undo2Icon },
  { id: "redo", command: "redo", label: "重做", icon: Redo2Icon },
  { id: "h1", command: "formatBlock", value: "h1", label: "一级标题", icon: Heading1Icon, toggle: true },
  { id: "h2", command: "formatBlock", value: "h2", label: "二级标题", icon: Heading2Icon, toggle: true },
  { id: "bold", command: "bold", label: "加粗", icon: BoldIcon, toggle: true },
  { id: "italic", command: "italic", label: "斜体", icon: ItalicIcon, toggle: true },
  { id: "underline", command: "underline", label: "下划线", icon: UnderlineIcon, toggle: true },
  { id: "strikeThrough", command: "strikeThrough", label: "删除线", icon: StrikethroughIcon, toggle: true },
  { id: "insertUnorderedList", command: "insertUnorderedList", label: "无序列表", icon: ListIcon, toggle: true },
  { id: "insertOrderedList", command: "insertOrderedList", label: "有序列表", icon: ListOrderedIcon, toggle: true },
  { id: "blockquote", command: "formatBlockQuote", label: "引用", icon: QuoteIcon, toggle: true },
  { id: "pre", command: "formatCode", label: "代码块", icon: CodeIcon, toggle: true },
  { id: "createLink", command: "createLink", label: "插入链接", icon: LinkIcon },
  { id: "removeFormat", command: "removeFormat", label: "清除格式", icon: RemoveFormattingIcon },
]

const inlineStateCommands = [
  "bold",
  "italic",
  "underline",
  "strikeThrough",
  "insertUnorderedList",
  "insertOrderedList",
]

function isEditorEmpty(editor: HTMLElement) {
  return (
    !editor.textContent?.trim() &&
    !editor.querySelector("img, hr, li, pre, blockquote")
  )
}

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
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...props
}: RichTextEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const imageInputRef = React.useRef<HTMLInputElement>(null)
  const initialValueRef = React.useRef(value ?? defaultValue)
  const selectionRef = React.useRef<Range | null>(null)
  const [activeCommands, setActiveCommands] = React.useState<string[]>([])
  const [isUploading, setIsUploading] = React.useState(false)
  const [isEmpty, setIsEmpty] = React.useState(!(value ?? defaultValue))
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
    setIsEmpty(isEditorEmpty(editor))
  }, [value])

  const emitChange = (editor: HTMLDivElement) => {
    setIsEmpty(isEditorEmpty(editor))
    onValueChange?.(editor.innerHTML)
  }

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
    const block = String(document.queryCommandValue("formatBlock") ?? "")
      .toLowerCase()
      .replace(/[<>]/g, "")
    setActiveCommands([
      ...inlineStateCommands.filter((command) => document.queryCommandState(command)),
      ...(["h1", "h2", "blockquote", "pre"].includes(block) ? [block] : []),
    ])
    updateLinkAction()
  }, [updateLinkAction])

  const executeCommand = (command: Command, commandValue?: string) => {
    const editor = editorRef.current
    if (!editor || disabled) return

    editor.focus()

    // Applying an active block format again turns the block back into a paragraph.
    const toggleBlock = (block: string) =>
      document.execCommand(
        "formatBlock",
        false,
        activeCommands.includes(block) ? "p" : block
      )

    if (command === "createLink") {
      const url = window.prompt("输入链接地址")
      if (!url) return
      document.execCommand(command, false, url)
    } else if (command === "formatBlockQuote") {
      toggleBlock("blockquote")
    } else if (command === "formatCode") {
      toggleBlock("pre")
    } else if (command === "formatBlock" && commandValue) {
      toggleBlock(commandValue)
    } else {
      document.execCommand(command, false, commandValue)
    }

    emitChange(editor)
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
    emitChange(editor)
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
    emitChange(editor)
  }

  const uploadFiles = async (fileList: FileList | null) => {
    if (!fileList?.length || !onFileUpload) return

    setIsUploading(true)
    try {
      insertAttachments(await onFileUpload(Array.from(fileList)))
    } finally {
      setIsUploading(false)
    }
  }

  const uploadImages = async (fileList: FileList | null) => {
    if (!fileList?.length || !onImageUpload) return

    setIsUploading(true)
    try {
      insertImages(await onImageUpload(Array.from(fileList)))
    } finally {
      setIsUploading(false)
    }
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
          {toolbarItems.map(({ id, command, icon: Icon, label, value: commandValue, toggle }, index) => {
            const active = toggle ? activeCommands.includes(id) : false
            return (
              <React.Fragment key={id}>
                {[2, 4, 8, 12].includes(index) ? (
                  <span aria-hidden className="bg-border mx-1 h-4 w-px" />
                ) : null}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={disabled}
                  aria-label={label}
                  aria-pressed={toggle ? active : undefined}
                  data-active={active || undefined}
                  title={label}
                  className="data-[active=true]:bg-accent data-[active=true]:text-accent-foreground size-7 rounded-md transition-[background-color,color,scale] duration-150 active:scale-90 motion-reduce:transition-none"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => executeCommand(command, commandValue)}
                >
                  <Icon className="size-3.5" />
                </Button>
              </React.Fragment>
            )
          })}
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
        aria-label={ariaLabelledBy ? ariaLabel : (ariaLabel ?? "富文本编辑器")}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-disabled={disabled || undefined}
        data-placeholder={placeholder}
        data-empty={isEmpty || undefined}
        onInput={(event) => emitChange(event.currentTarget)}
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
          "relative min-h-44 px-4 py-3 text-sm leading-7 outline-none data-[empty=true]:before:pointer-events-none data-[empty=true]:before:absolute data-[empty=true]:before:text-muted-foreground/70 data-[empty=true]:before:content-[attr(data-placeholder)] [&_blockquote]:border-l-primary [&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_h1]:my-3 [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:my-3 [&_h2]:text-xl [&_h2]:font-semibold [&_img]:my-3 [&_img]:max-w-full [&_img]:rounded-md [&_li]:ml-5 [&_ol]:my-3 [&_ol]:list-decimal [&_p]:my-2 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-3 [&_ul]:my-3 [&_ul]:list-disc",
          editorClassName
        )}
      />
      {hoveredLink ? (
        <div
          data-slot="rich-text-editor-link-action"
          className="animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-1 fixed z-[60] duration-150 motion-reduce:animate-none"
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
