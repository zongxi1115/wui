import { Step, Steps } from "fumadocs-ui/components/steps"
import { Tab, Tabs } from "fumadocs-ui/components/tabs"
import defaultMdxComponents from "fumadocs-ui/mdx"
import type { MDXComponents } from "mdx/types"

import { AnimatedIconLibrary } from "@/components/animated-icon-library"
import { CodeTabs } from "@/components/code-tabs"
import { ComponentPreview } from "@/components/component-preview"
import { ComponentSource } from "@/components/component-source"
import { IconLibrary } from "@/components/icon-library"
import { Playground } from "@/components/playground"
import { PropsTable } from "@/components/props-table"
import { TokenConfigurator } from "@/components/token-configurator"

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    AnimatedIconLibrary,
    ComponentPreview,
    ComponentSource,
    IconLibrary,
    CodeTabs,
    Playground,
    PropsTable,
    TokenConfigurator,
    Steps,
    Step,
    Tabs,
    Tab,
    ...components,
  }
}
