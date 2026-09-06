import { createFromSource } from "fumadocs-core/search/server"

import { source } from "@/lib/source"

const segmenter = new Intl.Segmenter("zh-CN", { granularity: "word" })

const tokenizer = {
  language: "zh-CN",
  normalizationCache: new Map<string, string>(),
  tokenize(input: string) {
    const normalized = input.normalize("NFKC").toLocaleLowerCase("zh-CN")
    const tokens = Array.from(segmenter.segment(normalized))
      .filter((part) => part.isWordLike)
      .map((part) => part.segment)

    return Array.from(new Set(tokens))
  },
}

const search = createFromSource(source, { tokenizer })

export const GET = search.GET
