import meta from "@/content/docs/components/meta.json"
import { source } from "@/lib/source"

export interface CatalogItem {
  /** Registry name, e.g. `ai-chat`. */
  name: string
  /** Chinese half of the doc title, e.g. `按钮`. */
  zh: string
  /** English half of the doc title, e.g. `Button`. */
  en: string
  description: string
  url: string
}

export interface CatalogGroup {
  /** English section label from the sidebar separator, e.g. `General`. */
  en: string
  /** Chinese section label from the sidebar separator, e.g. `通用`. */
  zh: string
  items: CatalogItem[]
}

/** Matches sidebar separators such as `---General · 通用---`. */
const SEPARATOR = /^---(.*)---$/
const HAN = /\p{Script=Han}/u

/** Splits a bilingual doc title such as `AI 对话 AI Chat` at its last Han character. */
function splitTitle(title: string): { zh: string; en: string } {
  let lastHan = -1
  for (let index = 0; index < title.length; index += 1) {
    if (HAN.test(title[index])) lastHan = index
  }
  if (lastHan === -1) return { zh: title.trim(), en: "" }
  return {
    zh: title.slice(0, lastHan + 1).trim(),
    en: title.slice(lastHan + 1).trim(),
  }
}

/**
 * Builds the home page component index from the docs sidebar taxonomy.
 * `meta.json` supplies the order and section labels while the MDX frontmatter
 * supplies each title and description, so the landing page cannot drift from
 * the docs as components are added.
 */
export function getComponentCatalog(): CatalogGroup[] {
  const groups: CatalogGroup[] = []

  for (const entry of meta.pages) {
    const separator = SEPARATOR.exec(entry)
    if (separator) {
      const [en = entry, zh = ""] = separator[1]
        .split("·")
        .map((part) => part.trim())
      groups.push({ en, zh, items: [] })
      continue
    }

    const page = source.getPage(["components", entry])
    const group = groups.at(-1)
    if (!page || !group) continue

    group.items.push({
      name: entry,
      ...splitTitle(page.data.title),
      description: page.data.description ?? "",
      url: page.url,
    })
  }

  return groups.filter((group) => group.items.length > 0)
}

export function countComponents(catalog: CatalogGroup[]): number {
  return catalog.reduce((total, group) => total + group.items.length, 0)
}
