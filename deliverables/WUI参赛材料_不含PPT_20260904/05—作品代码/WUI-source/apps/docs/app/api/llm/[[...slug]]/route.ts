import { readFile } from "node:fs/promises"

import { notFound } from "next/navigation"

import { source } from "@/lib/source"

export const dynamic = "force-static"

function removeFrontmatter(content: string) {
  return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "")
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await context.params
  const page = source.getPage(slug)
  if (!page) notFound()

  const sourceText = await readFile(page.absolutePath, "utf8")
  const markdown = `# ${page.data.title}\n\nSource: ${page.url}\n\n${removeFrontmatter(sourceText)}`

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}

export function generateStaticParams() {
  return source.generateParams()
}
