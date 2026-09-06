import path from "node:path"

import { describe, expect, it } from "vitest"

import { configSchema, type RegistryItem } from "../registry/schema"
import { resolveTarget } from "./add"

const config = configSchema.parse({ aliases: {}, registries: {} })
const item = { name: "demo", type: "registry:ui", files: [] } as RegistryItem

const at = (target: string | undefined, baseDir: string, filePath = "x.tsx") =>
  resolveTarget(item, { path: filePath, type: "registry:ui", target }, config, baseDir)

describe("resolveTarget", () => {
  it("places aliased targets under the configured directories", () => {
    expect(at("@ui/icons/a.tsx", "src")).toBe(
      path.join("src", "components", "ui", "icons", "a.tsx")
    )
    expect(at("@lib/helpers/b.ts", "src")).toBe(
      path.join("src", "lib", "helpers", "b.ts")
    )
  })

  it("keeps a bare target reachable through @/ in a src project", () => {
    // Regression: bare targets used to bypass baseDir and land at the project
    // root, where `@/components/...` could no longer resolve them.
    expect(at("components/ui/animated-icons/a.tsx", "src")).toBe(
      path.join("src", "components", "ui", "animated-icons", "a.tsx")
    )
  })

  it("leaves a bare target at the root in a flat project", () => {
    expect(at("components/ui/animated-icons/a.tsx", ".")).toBe(
      path.join("components", "ui", "animated-icons", "a.tsx")
    )
  })

  it("treats ~/ as the project root even when a src dir exists", () => {
    expect(at("~/public/logo.svg", "src")).toBe(path.join("public/logo.svg"))
  })

  it("falls back to the type-based directory when no target is given", () => {
    expect(at(undefined, "src", "registry/ui/button.tsx")).toBe(
      path.join("src", "components", "ui", "button.tsx")
    )
  })
})
