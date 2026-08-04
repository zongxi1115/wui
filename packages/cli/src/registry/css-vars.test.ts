import { describe, expect, it } from "vitest"

import { mergeRegistryCssVars, renderRegistryCssVars } from "./css-vars"
import { getPreset } from "./presets"
import type { RegistryItem } from "./schema"

const fullTheme = getPreset("ocean") as RegistryItem

describe("renderRegistryCssVars", () => {
  it("emits the base reset so bare borders map to the theme token", () => {
    const css = renderRegistryCssVars(mergeRegistryCssVars([fullTheme]))
    expect(css).toContain("@layer base {")
    expect(css).toContain("@apply border-border outline-ring/50;")
    expect(css).toContain("@apply bg-background text-foreground;")
  })

  it("keeps the reset inside the managed token markers", () => {
    const css = renderRegistryCssVars(mergeRegistryCssVars([fullTheme]))
    const start = css.indexOf("wui:tokens:start")
    const layer = css.indexOf("@layer base")
    const end = css.indexOf("wui:tokens:end")
    expect(start).toBeGreaterThanOrEqual(0)
    expect(layer).toBeGreaterThan(start)
    expect(end).toBeGreaterThan(layer)
  })

  it("omits the reset for a partial theme without color mappings", () => {
    const partial: RegistryItem = {
      name: "partial",
      type: "registry:theme",
      files: [],
      cssVars: { light: { primary: "oklch(0.5 0 0)" } },
    }
    const css = renderRegistryCssVars(mergeRegistryCssVars([partial]))
    expect(css).not.toContain("@layer base")
  })
})
