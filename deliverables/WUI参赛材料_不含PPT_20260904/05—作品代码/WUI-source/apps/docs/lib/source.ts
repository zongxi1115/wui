import { docs } from "@/.source"
import { loader } from "fumadocs-core/source"

/**
 * fumadocs-mdx 11 returns `source.files` as a lazy function, while
 * fumadocs-core 15's loader expects `files` to be an array. Normalize so the
 * two interoperate. Generic so the page-data type is preserved for the loader.
 */
function normalizeSource<T extends { files: unknown }>(input: T): T {
  const files =
    typeof input.files === "function"
      ? (input.files as () => unknown[])()
      : input.files
  return { ...input, files } as T
}

export const source = loader({
  baseUrl: "/docs",
  source: normalizeSource(docs.toFumadocsSource()),
})
