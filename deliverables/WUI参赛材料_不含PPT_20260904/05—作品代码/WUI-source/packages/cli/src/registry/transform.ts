import type { Config } from "./schema"

/**
 * Rewrite the registry-internal `@/registry/...` import prefixes to the
 * consumer's configured aliases. Order matters — more specific prefixes first.
 */
export function transformImports(content: string, config: Config): string {
  const { aliases } = config
  const replacements: Array<[string, string]> = [
    ["@/registry/lib/utils", aliases.utils],
    ["@/registry/ui/", `${aliases.ui}/`],
    ["@/registry/hooks/", `${aliases.hooks}/`],
    ["@/registry/components/", `${aliases.components}/`],
    ["@/registry/lib/", `${aliases.lib}/`],
  ]
  let out = content
  for (const [from, to] of replacements) {
    out = out.split(from).join(to)
  }
  return out
}

/** Strip a leading `"use client"` directive when the project is not using RSC. */
export function transformRsc(content: string, config: Config): string {
  if (config.rsc) return content
  return content.replace(/^\s*["']use client["'];?\s*\n+/, "")
}

export function applyTransforms(content: string, config: Config): string {
  return transformRsc(transformImports(content, config), config)
}
