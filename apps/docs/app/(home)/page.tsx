import Link from "next/link"

import { Button } from "@/registry/ui/button"

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">wui</h1>
      <p className="max-w-xl text-balance text-muted-foreground sm:text-lg">
        A shadcn-style React component library you own. Copy accessible,
        Tailwind-styled components into your project with the{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
          wui
        </code>{" "}
        CLI.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/docs">Get started</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/docs/components/button">Browse components</Link>
        </Button>
      </div>
    </main>
  )
}
