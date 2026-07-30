/**
 * new-component.mts — scaffold a new wui component.
 *
 * Usage:
 *   pnpm --filter docs gen:component <name> [--type ui|component]
 *
 * Creates the component source, a demo, and a docs page from templates, then
 * registers the item in registry.json and the components sidebar. Finish with
 * `pnpm --filter docs registry:build` to publish it to the registry.
 */
import { promises as fs } from "node:fs"
import path from "node:path"

const ROOT = process.cwd() // apps/docs

function toPascalCase(name: string): string {
  return name
    .split(/[-_]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("")
}

function toCamelCase(name: string): string {
  const p = toPascalCase(name)
  return p.charAt(0).toLowerCase() + p.slice(1)
}

async function exists(p: string): Promise<boolean> {
  return fs.access(p).then(
    () => true,
    () => false
  )
}

async function writeIfAbsent(rel: string, content: string): Promise<void> {
  const abs = path.join(ROOT, rel)
  if (await exists(abs)) {
    console.log(`• ${rel} already exists, skipped`)
    return
  }
  await fs.mkdir(path.dirname(abs), { recursive: true })
  await fs.writeFile(abs, content, "utf8")
  console.log(`✓ ${rel}`)
}

function componentTemplate(name: string, Pascal: string, camel: string): string {
  return `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

const ${camel}Variants = cva("", {
  variants: {
    variant: {
      default: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

function ${Pascal}({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof ${camel}Variants>) {
  return (
    <div
      data-slot="${name}"
      className={cn(${camel}Variants({ variant, className }))}
      {...props}
    />
  )
}

export { ${Pascal}, ${camel}Variants }
`
}

function demoTemplate(name: string, Pascal: string): string {
  return `import { ${Pascal} } from "@/registry/ui/${name}"

export default function ${Pascal}Demo() {
  return <${Pascal}>${Pascal}</${Pascal}>
}
`
}

function docTemplate(name: string, Pascal: string): string {
  return `---
title: ${Pascal}
description: TODO — one-line description of ${Pascal}.
component: ${name}
---

## 基础示例 · Basic example

<ComponentPreview name="${name}-demo" />

<CodeTabs command="@wui-design/cli@latest add @wui/${name}" />

<ComponentSource name="${name}" title="components/ui/${name}.tsx" />

## 组件作用 · What it's for

TODO — describe what this component is for and when to use it.

## 组件属性 · Props

<PropsTable
  data={[
    {
      prop: "variant",
      type: '"default"',
      default: '"default"',
      description: "Visual style.",
    },
    {
      prop: "className",
      type: "string",
      description: "Extra classes, merged via cn().",
    },
  ]}
/>

## 事件 · Events

TODO — document callbacks / native events forwarded by the component.

## 拓展使用 · Extended usage

TODO — show composition and advanced examples with more <ComponentPreview /> blocks.
`
}

async function updateRegistry(name: string, type: string, filePath: string): Promise<void> {
  const registryPath = path.join(ROOT, "registry.json")
  const registry = JSON.parse(await fs.readFile(registryPath, "utf8"))
  if (registry.items.some((i: { name: string }) => i.name === name)) {
    console.log(`• registry.json already has "${name}", skipped`)
    return
  }
  registry.items.push({
    name,
    type,
    title: toPascalCase(name),
    description: `TODO — description of ${toPascalCase(name)}.`,
    dependencies: ["class-variance-authority"],
    registryDependencies: ["utils"],
    files: [{ path: filePath, type }],
  })
  await fs.writeFile(registryPath, JSON.stringify(registry, null, 2) + "\n", "utf8")
  console.log(`✓ registry.json (+ ${name})`)
}

async function updateSidebar(name: string): Promise<void> {
  const metaPath = path.join(ROOT, "content", "docs", "components", "meta.json")
  const meta = JSON.parse(await fs.readFile(metaPath, "utf8"))
  if (!Array.isArray(meta.pages)) meta.pages = []
  if (!meta.pages.includes(name)) {
    meta.pages.push(name)
    await fs.writeFile(metaPath, JSON.stringify(meta, null, 2) + "\n", "utf8")
    console.log(`✓ components/meta.json (+ ${name})`)
  }
}

async function main() {
  const args = process.argv.slice(2)
  const name = args.find((a) => !a.startsWith("-"))
  const typeFlag = args.includes("--type")
    ? args[args.indexOf("--type") + 1]
    : "ui"

  if (!name || !/^[a-z][a-z0-9-]*$/.test(name)) {
    console.error(
      "Usage: pnpm --filter docs gen:component <kebab-name> [--type ui|component]"
    )
    process.exit(1)
  }

  const Pascal = toPascalCase(name)
  const camel = toCamelCase(name)
  const registryType = typeFlag === "component" ? "registry:component" : "registry:ui"
  const dir = registryType === "registry:component" ? "components" : "ui"
  const filePath = `registry/${dir}/${name}.tsx`

  await writeIfAbsent(filePath, componentTemplate(name, Pascal, camel))
  await writeIfAbsent(
    `registry/examples/${name}-demo.tsx`,
    demoTemplate(name, Pascal)
  )
  await writeIfAbsent(
    `content/docs/components/${name}.mdx`,
    docTemplate(name, Pascal)
  )
  await updateRegistry(name, registryType, filePath)
  await updateSidebar(name)

  console.log(
    `\nNext: fill in the TODOs, then run 'pnpm --filter docs registry:build'.`
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
