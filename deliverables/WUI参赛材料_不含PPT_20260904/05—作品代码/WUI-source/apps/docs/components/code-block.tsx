import { CopyButton } from "@/components/copy-button"

export function CodeBlock({ html, raw }: { html: string; raw: string }) {
  return (
    <div className="wui-code not-prose group relative">
      <CopyButton value={raw} />
      <div
        className="max-h-[600px] overflow-auto rounded-lg border text-sm [&_pre]:m-0 [&_pre]:p-4 [&_pre]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
