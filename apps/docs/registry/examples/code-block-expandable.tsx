import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockBody,
  CodeBlockCopy,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/registry/ui/code-block"

const code = `name: Deploy

on:
  push:
    branches: [main]

concurrency:
  group: deploy-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - run: ./scripts/deploy.sh
        env:
          DEPLOY_TOKEN: \${{ secrets.DEPLOY_TOKEN }}`

export default function CodeBlockExpandable() {
  return (
    <CodeBlock expandable maxHeight={220} className="w-full max-w-xl">
      <CodeBlockHeader>
        <CodeBlockTitle>.github/workflows/deploy.yml</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopy />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockBody code={code} language="yaml" />
    </CodeBlock>
  )
}
