import { registryItemSchema, type RegistryItem } from "./schema"

/**
 * Built-in preset themes bundled with the CLI. They mirror the token surface of
 * the default @wui/theme so they can be applied fully offline — no registry
 * fetch required. Each preset only overrides the brand tokens (primary + ring)
 * on top of the shared neutral base.
 */

const BASE_LIGHT: Record<string, string> = {
  radius: "0.625rem",
  background: "oklch(1 0 0)",
  foreground: "oklch(0.145 0 0)",
  card: "oklch(1 0 0)",
  "card-foreground": "oklch(0.145 0 0)",
  popover: "oklch(1 0 0)",
  "popover-foreground": "oklch(0.145 0 0)",
  primary: "oklch(0.205 0 0)",
  "primary-foreground": "oklch(0.985 0 0)",
  secondary: "oklch(0.97 0 0)",
  "secondary-foreground": "oklch(0.205 0 0)",
  muted: "oklch(0.97 0 0)",
  "muted-foreground": "oklch(0.556 0 0)",
  accent: "oklch(0.97 0 0)",
  "accent-foreground": "oklch(0.205 0 0)",
  destructive: "oklch(0.577 0.245 27.325)",
  "destructive-foreground": "oklch(0.985 0 0)",
  info: "oklch(0.488 0.243 264.376)",
  "info-foreground": "oklch(0.985 0 0)",
  success: "oklch(0.448 0.119 151.328)",
  "success-foreground": "oklch(0.985 0 0)",
  warning: "oklch(0.473 0.137 46.201)",
  "warning-foreground": "oklch(0.985 0 0)",
  border: "oklch(0.922 0 0)",
  input: "oklch(0.922 0 0)",
  ring: "oklch(0.708 0 0)",
  overlay: "oklch(0 0 0 / 50%)",
  shine: "oklch(1 0 0 / 50%)",
}

const BASE_DARK: Record<string, string> = {
  radius: "0.625rem",
  background: "oklch(0.145 0 0)",
  foreground: "oklch(0.985 0 0)",
  card: "oklch(0.205 0 0)",
  "card-foreground": "oklch(0.985 0 0)",
  popover: "oklch(0.205 0 0)",
  "popover-foreground": "oklch(0.985 0 0)",
  primary: "oklch(0.922 0 0)",
  "primary-foreground": "oklch(0.205 0 0)",
  secondary: "oklch(0.269 0 0)",
  "secondary-foreground": "oklch(0.985 0 0)",
  muted: "oklch(0.269 0 0)",
  "muted-foreground": "oklch(0.708 0 0)",
  accent: "oklch(0.269 0 0)",
  "accent-foreground": "oklch(0.985 0 0)",
  destructive: "oklch(0.577 0.245 27.325)",
  "destructive-foreground": "oklch(0.985 0 0)",
  info: "oklch(0.707 0.165 254.624)",
  "info-foreground": "oklch(0.145 0 0)",
  success: "oklch(0.765 0.177 163.223)",
  "success-foreground": "oklch(0.145 0 0)",
  warning: "oklch(0.795 0.184 86.047)",
  "warning-foreground": "oklch(0.205 0 0)",
  border: "oklch(1 0 0 / 10%)",
  input: "oklch(1 0 0 / 15%)",
  ring: "oklch(0.556 0 0)",
  overlay: "oklch(0 0 0 / 50%)",
  shine: "oklch(1 0 0 / 50%)",
}

const BASE_THEME: Record<string, string> = {
  "radius-sm": "calc(var(--radius) - 4px)",
  "radius-md": "calc(var(--radius) - 2px)",
  "radius-lg": "var(--radius)",
  "radius-xl": "calc(var(--radius) + 4px)",
  "color-background": "var(--background)",
  "color-foreground": "var(--foreground)",
  "color-card": "var(--card)",
  "color-card-foreground": "var(--card-foreground)",
  "color-popover": "var(--popover)",
  "color-popover-foreground": "var(--popover-foreground)",
  "color-primary": "var(--primary)",
  "color-primary-foreground": "var(--primary-foreground)",
  "color-secondary": "var(--secondary)",
  "color-secondary-foreground": "var(--secondary-foreground)",
  "color-muted": "var(--muted)",
  "color-muted-foreground": "var(--muted-foreground)",
  "color-accent": "var(--accent)",
  "color-accent-foreground": "var(--accent-foreground)",
  "color-destructive": "var(--destructive)",
  "color-destructive-foreground": "var(--destructive-foreground)",
  "color-info": "var(--info)",
  "color-info-foreground": "var(--info-foreground)",
  "color-success": "var(--success)",
  "color-success-foreground": "var(--success-foreground)",
  "color-warning": "var(--warning)",
  "color-warning-foreground": "var(--warning-foreground)",
  "color-border": "var(--border)",
  "color-input": "var(--input)",
  "color-ring": "var(--ring)",
  "color-overlay": "var(--overlay)",
  "color-shine": "var(--shine)",
}

interface PresetSpec {
  title: string
  description: string
  light: {
    primary: string
    "primary-foreground": string
    ring: string
  }
  dark: {
    primary: string
    "primary-foreground": string
    ring: string
  }
}

const LIGHT_FG = "oklch(0.985 0 0)"
const DARK_FG = "oklch(0.205 0 0)"

const PRESET_SPECS: Record<string, PresetSpec> = {
  ocean: {
    title: "Ocean",
    description: "Deep blue accents with a calm, professional feel.",
    light: {
      primary: "oklch(0.55 0.18 255)",
      "primary-foreground": LIGHT_FG,
      ring: "oklch(0.55 0.18 255)",
    },
    dark: {
      primary: "oklch(0.65 0.17 255)",
      "primary-foreground": DARK_FG,
      ring: "oklch(0.65 0.17 255)",
    },
  },
  violet: {
    title: "Violet",
    description: "Vivid purple accents for a bold, creative look.",
    light: {
      primary: "oklch(0.54 0.22 292)",
      "primary-foreground": LIGHT_FG,
      ring: "oklch(0.54 0.22 292)",
    },
    dark: {
      primary: "oklch(0.67 0.2 292)",
      "primary-foreground": DARK_FG,
      ring: "oklch(0.67 0.2 292)",
    },
  },
  emerald: {
    title: "Emerald",
    description: "Fresh green accents with a natural, balanced tone.",
    light: {
      primary: "oklch(0.58 0.14 163)",
      "primary-foreground": LIGHT_FG,
      ring: "oklch(0.58 0.14 163)",
    },
    dark: {
      primary: "oklch(0.7 0.15 163)",
      "primary-foreground": DARK_FG,
      ring: "oklch(0.7 0.15 163)",
    },
  },
  rose: {
    title: "Rose",
    description: "Warm pink-red accents for a friendly, energetic feel.",
    light: {
      primary: "oklch(0.58 0.2 12)",
      "primary-foreground": LIGHT_FG,
      ring: "oklch(0.58 0.2 12)",
    },
    dark: {
      primary: "oklch(0.68 0.19 12)",
      "primary-foreground": DARK_FG,
      ring: "oklch(0.68 0.19 12)",
    },
  },
  amber: {
    title: "Amber",
    description: "Bright golden accents with high-contrast dark text.",
    light: {
      primary: "oklch(0.75 0.15 75)",
      "primary-foreground": DARK_FG,
      ring: "oklch(0.75 0.15 75)",
    },
    dark: {
      primary: "oklch(0.8 0.16 80)",
      "primary-foreground": DARK_FG,
      ring: "oklch(0.8 0.16 80)",
    },
  },
  slate: {
    title: "Slate",
    description: "Cool blue-grey accents for a muted, refined interface.",
    light: {
      primary: "oklch(0.44 0.04 257)",
      "primary-foreground": LIGHT_FG,
      ring: "oklch(0.44 0.04 257)",
    },
    dark: {
      primary: "oklch(0.79 0.03 257)",
      "primary-foreground": DARK_FG,
      ring: "oklch(0.79 0.03 257)",
    },
  },
}

function buildPreset(name: string, spec: PresetSpec): RegistryItem {
  return registryItemSchema.parse({
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name,
    type: "registry:theme",
    title: `${spec.title} Theme`,
    description: spec.description,
    files: [],
    cssVars: {
      light: { ...BASE_LIGHT, ...spec.light },
      dark: { ...BASE_DARK, ...spec.dark },
      theme: { ...BASE_THEME },
    },
  })
}

/** Names of every built-in preset theme, sorted for stable display. */
export const PRESET_NAMES = Object.keys(PRESET_SPECS).sort()

export function isPreset(name: string): boolean {
  return Object.prototype.hasOwnProperty.call(PRESET_SPECS, name)
}

/** Return a built-in preset theme, or null when the name is unknown. */
export function getPreset(name: string): RegistryItem | null {
  const spec = PRESET_SPECS[name]
  return spec ? buildPreset(name, spec) : null
}

/** Short (name, description) pairs for listing the built-in presets. */
export function listPresets(): Array<{ name: string; description: string }> {
  return PRESET_NAMES.map((name) => ({
    name,
    description: PRESET_SPECS[name].description,
  }))
}
