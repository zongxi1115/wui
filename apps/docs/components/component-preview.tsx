import { ComponentPreviewClient } from "@/components/component-preview-client"
import { fixImportsForDisplay, highlightCode } from "@/lib/highlight-code"
import { getRegistrySource } from "@/lib/registry-source"

export async function ComponentPreview({
  name,
  className,
  previewClassName,
}: {
  name: string
  className?: string
  previewClassName?: string
}) {
  const { code } = await getRegistrySource(name)
  const display = fixImportsForDisplay(code)
  const html = await highlightCode(display, "tsx")

  return (
    <ComponentPreviewClient
      name={name}
      html={html}
      raw={display}
      className={className}
      previewClassName={previewClassName}
    />
  )
}
