import { createMDX } from "fumadocs-mdx/next"

const withMDX = createMDX()

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // @wui/mcp/core ships as TypeScript source so the docs app and the stdio
  // server share one implementation without a build step between them.
  transpilePackages: ["@wui/mcp"],
  // The MCP route reads the generated registry JSON from disk at runtime;
  // without this it would be traced out of the serverless bundle.
  outputFileTracingIncludes: {
    "/api/mcp": ["./public/r/llms/**", "./public/r/*.json"],
  },
}

export default withMDX(config)
