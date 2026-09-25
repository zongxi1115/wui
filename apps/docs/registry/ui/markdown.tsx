import * as React from "react"
import ReactMarkdown, {
  type Components,
  type Options as ReactMarkdownOptions,
} from "react-markdown"
import remarkGfm from "remark-gfm"

import { cn } from "@/registry/lib/utils"
import { AiStreamEdge } from "@/registry/ui/ai-stream"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockCopy,
  CodeBlockHeader,
} from "@/registry/ui/code-block"

type MarkdownTreeNode = {
  type: string
  value?: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: MarkdownTreeNode[]
}

function textContent(node?: MarkdownTreeNode): string {
  if (!node) return ""
  if (node.type === "text") return node.value ?? ""
  return (node.children ?? []).map(textContent).join("")
}

function codeLanguage(node?: MarkdownTreeNode) {
  const className = node?.properties?.className
  if (!Array.isArray(className)) return undefined
  const match = className.find(
    (name): name is string =>
      typeof name === "string" && name.startsWith("language-")
  )
  return match?.slice("language-".length)
}

function createStreamFeatherPlugin(featherLength: number) {
  return () => (tree: MarkdownTreeNode) => {
    function featherLastText(parent: MarkdownTreeNode): boolean {
      if (!parent.children) return false

      for (let index = parent.children.length - 1; index >= 0; index -= 1) {
        const child = parent.children[index]

        if (child.children && featherLastText(child)) return true
        if (child.type !== "text" || !child.value?.trim()) continue

        const tailLength = Math.min(
          Math.max(featherLength, 0),
          child.value.length
        )
        if (tailLength === 0) return true

        const stableText = child.value.slice(0, -tailLength)
        const liveEdge = child.value.slice(-tailLength)
        const replacement: MarkdownTreeNode[] = []

        if (stableText) replacement.push({ type: "text", value: stableText })
        replacement.push({
          type: "element",
          tagName: "span",
          properties: { "data-markdown-stream-edge": "" },
          children: [{ type: "text", value: liveEdge }],
        })
        parent.children.splice(index, 1, ...replacement)
        return true
      }

      return false
    }

    featherLastText(tree)
  }
}

const defaultComponents: Components = {
  h1: ({ node: _node, className, ...props }) => (
    <h1
      className={cn(
        "mb-4 mt-8 text-2xl font-semibold tracking-tight first:mt-0",
        className
      )}
      {...props}
    />
  ),
  h2: ({ node: _node, className, ...props }) => (
    <h2
      className={cn(
        "mb-3 mt-8 text-xl font-semibold tracking-tight first:mt-0",
        className
      )}
      {...props}
    />
  ),
  h3: ({ node: _node, className, ...props }) => (
    <h3
      className={cn("mb-2 mt-6 text-base font-semibold first:mt-0", className)}
      {...props}
    />
  ),
  h4: ({ node: _node, className, ...props }) => (
    <h4
      className={cn("mb-2 mt-5 text-sm font-semibold first:mt-0", className)}
      {...props}
    />
  ),
  h5: ({ node: _node, className, ...props }) => (
    <h5
      className={cn("mb-2 mt-4 text-sm font-medium first:mt-0", className)}
      {...props}
    />
  ),
  h6: ({ node: _node, className, ...props }) => (
    <h6
      className={cn(
        "text-muted-foreground mb-2 mt-4 text-xs font-medium first:mt-0",
        className
      )}
      {...props}
    />
  ),
  p: ({ node: _node, className, ...props }) => (
    <p
      className={cn("my-4 leading-7 first:mt-0 last:mb-0", className)}
      {...props}
    />
  ),
  a: ({ node: _node, className, ...props }) => (
    <a
      className={cn(
        "text-primary decoration-primary/40 hover:decoration-primary font-medium underline underline-offset-4 transition-colors",
        className
      )}
      {...props}
    />
  ),
  strong: ({ node: _node, className, ...props }) => (
    <strong className={cn("font-semibold", className)} {...props} />
  ),
  span: ({ node: _node, className, style, ...props }) => {
    const isStreamEdge = "data-markdown-stream-edge" in props

    if (isStreamEdge) {
      return <AiStreamEdge className={className} style={style} {...props} />
    }

    return <span className={className} style={style} {...props} />
  },
  ul: ({ node: _node, className, ...props }) => (
    <ul
      className={cn(
        "marker:text-muted-foreground my-4 ml-5 list-disc space-y-2 [&.contains-task-list]:ml-0 [&.contains-task-list]:list-none",
        className
      )}
      {...props}
    />
  ),
  ol: ({ node: _node, className, ...props }) => (
    <ol
      className={cn(
        "marker:text-muted-foreground my-4 ml-5 list-decimal space-y-2 [&.contains-task-list]:ml-0 [&.contains-task-list]:list-none",
        className
      )}
      {...props}
    />
  ),
  li: ({ node: _node, className, ...props }) => (
    <li
      className={cn("pl-1 leading-7 [&.task-list-item]:pl-0", className)}
      {...props}
    />
  ),
  blockquote: ({ node: _node, className, ...props }) => (
    <blockquote
      className={cn(
        "border-border text-muted-foreground my-5 border-l-2 pl-4 [&>p]:my-0",
        className
      )}
      {...props}
    />
  ),
  hr: ({ node: _node, className, ...props }) => (
    <hr className={cn("border-border my-8", className)} {...props} />
  ),
  code: ({ node: _node, className, ...props }) => (
    <code
      className={cn(
        "bg-muted rounded-sm px-1 py-0.5 font-mono text-[0.875em]",
        className
      )}
      {...props}
    />
  ),
  pre: ({ node, className, children, ...props }) => {
    const code = (node as MarkdownTreeNode | undefined)?.children?.[0]
    const language = codeLanguage(code)

    return (
      <CodeBlock data-language={language} className="my-5">
        <CodeBlockHeader className="min-h-9 py-1.5">
          <span className="text-muted-foreground font-sans text-xs">
            {language ?? "text"}
          </span>
          <CodeBlockActions>
            <CodeBlockCopy content={textContent(code).replace(/\n$/, "")} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <pre
          className={cn(
            "overflow-x-auto px-4 py-3.5 leading-5 [&>code]:rounded-none [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-[1em]",
            className
          )}
          {...props}
        >
          {children}
        </pre>
      </CodeBlock>
    )
  },
  table: ({ node: _node, className, ...props }) => (
    <div className="my-5 w-full overflow-x-auto border-y">
      <table
        className={cn("w-full border-collapse text-sm", className)}
        {...props}
      />
    </div>
  ),
  thead: ({ node: _node, className, ...props }) => (
    <thead className={cn("bg-muted/50 border-b", className)} {...props} />
  ),
  tr: ({ node: _node, className, ...props }) => (
    <tr className={cn("border-b last:border-b-0", className)} {...props} />
  ),
  th: ({ node: _node, className, ...props }) => (
    <th
      className={cn("h-10 px-3 text-left align-middle font-medium", className)}
      {...props}
    />
  ),
  td: ({ node: _node, className, ...props }) => (
    <td className={cn("px-3 py-2.5 align-top", className)} {...props} />
  ),
  input: ({ node: _node, className, ...props }) => (
    <input
      className={cn("accent-primary mr-2 size-4 translate-y-0.5", className)}
      {...props}
    />
  ),
  img: ({ node: _node, className, alt, ...props }) => (
    <img
      className={cn("my-5 max-w-full border", className)}
      alt={alt ?? ""}
      {...props}
    />
  ),
}

export interface MarkdownProps
  extends
    Omit<React.ComponentProps<"div">, "children">,
    Omit<ReactMarkdownOptions, "children" | "components"> {
  /** Markdown source to parse and render. */
  children: string
  /** Whether the source is still receiving content. @default false */
  isStreaming?: boolean
  /** Number of trailing characters covered by the live feather. @default 18 */
  featherLength?: number
  /** Override renderers for individual Markdown elements. */
  components?: Components
}

/** Parses CommonMark and GFM source into styled, safe React elements. */
function Markdown({
  children,
  className,
  isStreaming = false,
  featherLength = 18,
  components,
  remarkPlugins,
  rehypePlugins,
  remarkRehypeOptions,
  allowElement,
  allowedElements,
  disallowedElements,
  skipHtml,
  unwrapDisallowed,
  urlTransform,
  ...props
}: MarkdownProps) {
  return (
    <div
      data-slot="markdown"
      data-streaming={isStreaming || undefined}
      aria-live={isStreaming ? "polite" : undefined}
      aria-busy={isStreaming}
      className={cn(
        "text-foreground min-w-0 text-sm",
        // Blocks mounted while streaming ease in; already-rendered blocks keep their DOM and stay still.
        isStreaming &&
          "[&>*]:animate-in [&>*]:fade-in-0 [&>*]:slide-in-from-bottom-1 [&>*]:duration-300 [&>*]:ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:[&>*]:animate-none",
        className
      )}
      {...props}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, ...(remarkPlugins ?? [])]}
        rehypePlugins={
          isStreaming
            ? [
                ...(rehypePlugins ?? []),
                createStreamFeatherPlugin(featherLength),
              ]
            : rehypePlugins
        }
        remarkRehypeOptions={remarkRehypeOptions}
        allowElement={allowElement}
        allowedElements={allowedElements}
        disallowedElements={disallowedElements}
        skipHtml={skipHtml}
        unwrapDisallowed={unwrapDisallowed}
        urlTransform={urlTransform}
        components={{ ...defaultComponents, ...components }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}

export { Markdown }
