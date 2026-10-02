import {
  PlaygroundClient,
  type PlaygroundProps as ClientProps,
} from "@/components/playground-client"
import { playgroundConfigs } from "@/lib/playground-config"
import { getPlaygroundControls } from "@/lib/playground"
import { getRegistrySource } from "@/lib/registry-source"
import { Props } from "@/registry/__props__"

export type PlaygroundProps = Omit<
  ClientProps,
  "config" | "controls" | "source"
>

export async function Playground({ name, ...props }: PlaygroundProps) {
  const config = playgroundConfigs[name]
  const source = config.demo
    ? (await getRegistrySource(config.demo)).code
    : undefined
  return (
    <PlaygroundClient
      name={name}
      config={config}
      controls={
        config.demo ? [] : getPlaygroundControls(config, Props[name] ?? [])
      }
      source={source}
      {...props}
    />
  )
}
