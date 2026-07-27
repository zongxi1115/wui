import { CodeBlock } from "@/components/code-block"
import { fixImportsForDisplay, highlightCode } from "@/lib/highlight-code"
import { getRegistrySource } from "@/lib/registry-source"

export async function ComponentSource({
  name,
  title,
}: {
  name: string
  title?: string
}) {
  const { code, file } = await getRegistrySource(name)
  if (!code) {
    return (
      <p className="text-sm text-destructive">
        Source not found for <code>{name}</code>. Run{" "}
        <code>pnpm registry:build</code>.
      </p>
    )
  }

  const display = fixImportsForDisplay(code)
  const html = await highlightCode(display, "tsx")
  const caption = title ?? file ?? undefined

  return (
    <figure className="my-6">
      {caption ? (
        <figcaption className="mb-2 font-mono text-xs text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
      <CodeBlock html={html} raw={display} />
    </figure>
  )
}
