import { describe, expect, it } from "vitest"

import { configSchema } from "./schema"
import { transformImports, transformRsc } from "./transform"

const config = configSchema.parse({ aliases: {}, registries: {} })

describe("transformImports", () => {
  it("rewrites registry aliases to consumer aliases", () => {
    const input = [
      `import { cn } from "@/registry/lib/utils"`,
      `import { Button } from "@/registry/ui/button"`,
      `import { ConfirmDialog } from "@/registry/components/confirm-dialog"`,
    ].join("\n")
    const out = transformImports(input, config)
    expect(out).toContain(`from "@/lib/utils"`)
    expect(out).toContain(`from "@/components/ui/button"`)
    expect(out).toContain(`from "@/components/confirm-dialog"`)
    expect(out).not.toContain("@/registry")
  })
})

describe("transformRsc", () => {
  it("keeps 'use client' when rsc is true", () => {
    const cfg = configSchema.parse({ rsc: true, aliases: {}, registries: {} })
    expect(transformRsc(`"use client"\n\nconst x = 1`, cfg)).toContain(
      "use client"
    )
  })

  it("strips 'use client' when rsc is false", () => {
    const cfg = configSchema.parse({ rsc: false, aliases: {}, registries: {} })
    expect(transformRsc(`"use client"\n\nconst x = 1`, cfg)).not.toContain(
      "use client"
    )
  })
})
