import { codeToHtml } from "shiki"

const cache = new Map<string, string>()

/**
 * Rewrite the registry-internal import prefixes to the paths a consumer would
 * actually have after running `wui add`, so the code shown in the docs matches
 * what lands in a user's project.
 */
export function fixImportsForDisplay(code: string): string {
  return code
    .replaceAll("@/registry/lib/utils", "@/lib/utils")
    .replaceAll("@/registry/ui/", "@/components/ui/")
    .replaceAll("@/registry/hooks/", "@/hooks/")
    .replaceAll("@/registry/components/", "@/components/")
}

export async function highlightCode(
  code: string,
  lang = "tsx"
): Promise<string> {
  const key = `${lang}:${code}`
  const cached = cache.get(key)
  if (cached) return cached

  const html = await codeToHtml(code, {
    lang,
    themes: {
      light: "github-light-default",
      dark: "github-dark-default",
    },
    // Emit --shiki-light/--shiki-dark CSS vars instead of inline colors, so
    // light/dark is driven purely by CSS (see the `.wui-code` rules).
    defaultColor: false,
  })

  cache.set(key, html)
  return html
}
