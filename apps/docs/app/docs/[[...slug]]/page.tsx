import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getMDXComponents } from "@/mdx-components"
import { DependencyBadges } from "@/components/dependency-badges"
import { LLMPageActions } from "@/components/llm-page-actions"
import { source } from "@/lib/source"

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>
}) {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) notFound()

  const MDX = page.data.body
  const componentName =
    typeof page.data.component === "string" ? page.data.component : undefined

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <LLMPageActions markdownUrl={`/api/llm/${page.slugs.join("/")}`} />
      {componentName ? <DependencyBadges name={componentName} /> : null}
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  )
}

export function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>
}): Promise<Metadata> {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) notFound()

  return {
    title: page.data.title,
    description: page.data.description,
  }
}
