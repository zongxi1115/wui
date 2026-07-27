import { z } from "zod"

export const registryItemFileSchema = z.object({
  path: z.string(),
  type: z.string(),
  target: z.string().optional(),
  content: z.string().optional(),
})
export type RegistryItemFile = z.infer<typeof registryItemFileSchema>

export const registryItemSchema = z.object({
  $schema: z.string().optional(),
  name: z.string(),
  type: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  author: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(registryItemFileSchema).default([]),
  cssVars: z.record(z.string(), z.record(z.string(), z.string())).optional(),
  css: z.record(z.string(), z.unknown()).optional(),
  docs: z.string().optional(),
  categories: z.array(z.string()).optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
})
export type RegistryItem = z.infer<typeof registryItemSchema>

export const configSchema = z.object({
  $schema: z.string().optional(),
  style: z.string().default("default"),
  rsc: z.boolean().default(true),
  tsx: z.boolean().default(true),
  tailwind: z
    .object({
      css: z.string().default("app/globals.css"),
      baseColor: z.string().default("neutral"),
      cssVariables: z.boolean().default(true),
    })
    .default({}),
  aliases: z
    .object({
      components: z.string().default("@/components"),
      ui: z.string().default("@/components/ui"),
      lib: z.string().default("@/lib"),
      hooks: z.string().default("@/hooks"),
      utils: z.string().default("@/lib/utils"),
    })
    .default({}),
  registries: z.record(z.string(), z.string()).default({}),
})
export type Config = z.infer<typeof configSchema>
