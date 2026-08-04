import { describe, expect, it } from "vitest"

import { getPreset, isPreset, listPresets, PRESET_NAMES } from "./presets"

describe("presets", () => {
  it("exposes every preset in listPresets", () => {
    const listed = listPresets().map((preset) => preset.name)
    expect(listed).toEqual([...PRESET_NAMES])
  })

  it("builds a complete registry:theme item for each preset", () => {
    for (const name of PRESET_NAMES) {
      const item = getPreset(name)
      expect(item).not.toBeNull()
      expect(item?.type).toBe("registry:theme")
      // Presets carry the full token surface for both modes plus the mapping.
      expect(item?.cssVars?.light?.primary).toBeTruthy()
      expect(item?.cssVars?.dark?.primary).toBeTruthy()
      expect(item?.cssVars?.theme?.["color-primary"]).toBe("var(--primary)")
    }
  })

  it("gives each preset a distinct primary color", () => {
    const primaries = PRESET_NAMES.map(
      (name) => getPreset(name)?.cssVars?.light?.primary
    )
    expect(new Set(primaries).size).toBe(PRESET_NAMES.length)
  })

  it("reports unknown names as non-presets", () => {
    expect(isPreset("ocean")).toBe(true)
    expect(isPreset("not-a-preset")).toBe(false)
    expect(getPreset("not-a-preset")).toBeNull()
  })
})
