import Link from "next/link"

import type { CatalogGroup } from "@/lib/component-catalog"

/**
 * The complete, grouped component listing. Rendered on the server from the
 * docs sidebar taxonomy so new components appear here automatically.
 */
export function ComponentIndex({ catalog }: { catalog: CatalogGroup[] }) {
  return (
    <div className="flex flex-col gap-10">
      {catalog.map((group) => (
        <section key={group.en}>
          <div className="mb-3 flex items-baseline gap-2 border-b pb-2">
            <h3 className="text-sm font-semibold tracking-tight">{group.zh}</h3>
            <span className="text-muted-foreground font-mono text-xs">
              {group.en}
            </span>
            <span className="text-muted-foreground ml-auto text-xs tabular-nums">
              {group.items.length}
            </span>
          </div>
          <ul className="grid gap-1 sm:grid-cols-2 xl:grid-cols-3">
            {group.items.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.url}
                  className="hover:bg-accent/60 block rounded-md px-3 py-2 transition-colors"
                >
                  <span className="flex items-baseline gap-2">
                    <span className="text-sm font-medium">{item.zh}</span>
                    <span className="text-muted-foreground truncate font-mono text-xs">
                      {item.en}
                    </span>
                  </span>
                  <span className="text-muted-foreground mt-0.5 block truncate text-xs">
                    {item.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
