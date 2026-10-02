import { DemoPlaygrounds } from "@/registry/__playground-config__"
import { standalonePlaygroundConfigs } from "@/lib/playground-standalone"
import type { PlaygroundConfig } from "@/lib/playground-types"

export type {
  PlaygroundConfig,
  PlaygroundControl,
  PlaygroundValue,
} from "@/lib/playground-types"

export const playgroundConfigs: Record<string, PlaygroundConfig> = {
  ...DemoPlaygrounds,
  ...standalonePlaygroundConfigs,
}
