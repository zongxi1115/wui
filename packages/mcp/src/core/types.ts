/** Shapes emitted by apps/docs/scripts/build-llms.mts. */

export interface PropMeta {
  name: string
  type: string
  required: boolean
  options?: string[]
  defaultValue?: string
  description?: string
}

export interface ComponentDigest {
  name: string
  type: string
  title: string
  description: string
  categories?: string[]
  import?: string
  exports: string[]
  typeExports?: string[]
  install: {
    wui: string
    shadcn?: string
    npmDependencies: string[]
    registryDependencies: string[]
  }
  props: PropMeta[]
  usage?: string
  extended?: string
  events?: string
  examples: Array<{ name: string; title?: string }>
  files: string[]
  docsUrl?: string
  sourceUrl?: string
}

export interface IndexEntry {
  name: string
  type: string
  title: string
  description: string
  categories?: string[]
  keyProps: string[]
  exampleCount: number
}

export interface RegistryIndex {
  name: string
  homepage?: string
  items: IndexEntry[]
}

export interface Overview {
  name: string
  homepage?: string
  instructions: string
  componentCount: number
  tokens: Record<string, Record<string, string>>
}

export interface ExampleEntry {
  name: string
  component: string
  title?: string
  code: string
}

/**
 * Reads a path relative to the registry root (the directory that holds
 * `llms/` and the CLI's `<name>.json` files). Implemented over `fetch` for a
 * remote registry and over `fs` for a local checkout — keeping it a plain
 * function is what lets this core stay isomorphic.
 */
export type Loader = (relPath: string) => Promise<string>
