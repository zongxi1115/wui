import { describe, expect, it } from "vitest"

import { isLocalJson, isUrl, resolveAddress } from "./fetcher"
import { configSchema } from "./schema"

const config = configSchema.parse({
  registries: { "@wui": "http://registry.test/r/{name}.json" },
  aliases: {},
})

describe("resolveAddress", () => {
  it("resolves bare names via the default registry", () => {
    expect(resolveAddress("button", config)).toEqual({
      url: "http://registry.test/r/button.json",
    })
  })

  it("resolves namespaced names", () => {
    expect(resolveAddress("@wui/dialog", config)).toEqual({
      url: "http://registry.test/r/dialog.json",
    })
  })

  it("passes through absolute URLs", () => {
    expect(resolveAddress("https://a.com/b.json", config)).toEqual({
      url: "https://a.com/b.json",
    })
  })

  it("detects local json files", () => {
    expect(resolveAddress("./button.json", config)).toEqual({
      file: "./button.json",
    })
  })

  it("throws for unknown namespaces", () => {
    expect(() => resolveAddress("@nope/x", config)).toThrow()
  })
})

describe("helpers", () => {
  it("isUrl / isLocalJson", () => {
    expect(isUrl("http://x")).toBe(true)
    expect(isUrl("button")).toBe(false)
    expect(isLocalJson("./x.json")).toBe(true)
    expect(isLocalJson("button")).toBe(false)
  })
})
