import { z } from "zod"

const registryIndexSchema = z.object({
  name: z.string().optional(),
  homepage: z.string().optional(),
  items: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      title: z.string().optional(),
      description: z.string().optional(),
    })
  ),
})

export type RegistryIndex = z.infer<typeof registryIndexSchema>

export async function fetchRegistryIndex(
  template: string
): Promise<RegistryIndex> {
  const url = template.replace("{name}", "index")
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url} (HTTP ${response.status})`)
  }
  return registryIndexSchema.parse(await response.json())
}
