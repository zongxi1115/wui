import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockBody,
  CodeBlockCopy,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/registry/ui/code-block"

const code = `import { useEffect, useState } from "react"

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}`

export default function CodeBlockDemo() {
  return (
    <CodeBlock variant="bordered" highlightLines={["6-9"]} className="w-full max-w-xl">
      <CodeBlockHeader>
        <CodeBlockTitle>hooks/use-debounce.ts</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopy />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockBody code={code} language="ts" />
    </CodeBlock>
  )
}
