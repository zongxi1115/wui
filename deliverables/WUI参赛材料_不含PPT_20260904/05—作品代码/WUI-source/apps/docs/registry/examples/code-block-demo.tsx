"use client"

import * as React from "react"
import { Badge } from "@/registry/ui/badge"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockBody,
  CodeBlockCopy,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/registry/ui/code-block"

const CODE_SAMPLE = `import { useMemo, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}`

export default function CodeBlockDemo() {
  return (
    <div className="w-full max-w-lg">
      <CodeBlock variant="bordered">
        <CodeBlockHeader>
          <CodeBlockTitle>use-debounce.ts</CodeBlockTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-sans text-[10px] py-0">
              TypeScript
            </Badge>
            <CodeBlockActions>
              <CodeBlockCopy content={CODE_SAMPLE} />
            </CodeBlockActions>
          </div>
        </CodeBlockHeader>
        <CodeBlockBody
          code={CODE_SAMPLE}
          language="ts"
          showLineNumbers
          highlightLines={[3, 7, 8]}
        />
      </CodeBlock>
    </div>
  )
}
