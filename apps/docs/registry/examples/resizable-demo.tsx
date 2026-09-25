import { FileCode2Icon, FileJsonIcon, FolderIcon } from "lucide-react"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/ui/resizable"

const files = [
  { name: "app", icon: FolderIcon, depth: 0 },
  { name: "layout.tsx", icon: FileCode2Icon, depth: 1 },
  { name: "page.tsx", icon: FileCode2Icon, depth: 1, active: true },
  { name: "components", icon: FolderIcon, depth: 0 },
  { name: "package.json", icon: FileJsonIcon, depth: 0 },
]

export default function ResizableDemo() {
  return (
    <ResizablePanelGroup
      defaultSize={32}
      minSize={22}
      maxSize={60}
      className="h-64 w-full max-w-2xl rounded-lg border"
    >
      <ResizablePanel className="bg-muted/30 p-2">
        <p className="text-muted-foreground px-2 pb-2 text-xs font-medium">
          资源管理器
        </p>
        <ul className="space-y-0.5 text-sm">
          {files.map(({ name, icon: Icon, depth, active }) => (
            <li
              key={name}
              className={
                active
                  ? "bg-accent text-accent-foreground flex items-center gap-2 truncate rounded-md px-2 py-1"
                  : "text-muted-foreground flex items-center gap-2 truncate rounded-md px-2 py-1"
              }
              style={{ paddingLeft: 8 + depth * 16 }}
            >
              <Icon className="size-3.5 shrink-0" />
              {name}
            </li>
          ))}
        </ul>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel className="p-4 font-mono text-xs leading-6">
        <p className="text-muted-foreground">app/page.tsx</p>
        <p className="mt-2">
          <span className="text-primary">export default</span> function Page()
          {" {"}
        </p>
        <p className="pl-4">
          <span className="text-primary">return</span> &lt;Dashboard /&gt;
        </p>
        <p>{"}"}</p>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
