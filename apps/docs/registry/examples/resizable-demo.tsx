import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/ui/resizable"

export default function ResizableDemo() {
  return (
    <ResizablePanelGroup
      defaultSize={36}
      minSize={24}
      maxSize={64}
      className="border-border h-64 w-full max-w-2xl border"
    >
      <ResizablePanel className="bg-muted/30 p-5">
        <p className="font-medium">导航</p>
        <p className="text-muted-foreground mt-1 text-sm">拖动分隔线调整宽度</p>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel className="p-5">
        <p className="font-medium">内容</p>
        <p className="text-muted-foreground mt-1 text-sm">
          手柄也支持方向键、Home 与 End
        </p>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
