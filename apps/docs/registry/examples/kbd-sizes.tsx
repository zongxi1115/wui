import { Kbd, KbdGroup } from "@/registry/ui/kbd"

export default function KbdSizes() {
  return (
    <div className="grid w-full max-w-md grid-cols-[5rem_1fr] items-center gap-x-4 gap-y-5 text-sm">
      <span className="text-muted-foreground text-xs">default</span>
      <div className="flex flex-wrap items-center gap-3">
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>Shift</Kbd>
          <Kbd>P</Kbd>
        </KbdGroup>
        <Kbd>Enter</Kbd>
        <Kbd>Esc</Kbd>
      </div>

      <span className="text-muted-foreground text-xs">sm</span>
      <div className="flex flex-wrap items-center gap-3">
        <KbdGroup>
          <Kbd size="sm">⌘</Kbd>
          <Kbd size="sm">C</Kbd>
        </KbdGroup>
        <KbdGroup>
          <Kbd size="sm">Alt</Kbd>
          <Kbd size="sm">F4</Kbd>
        </KbdGroup>
        <Kbd size="sm">Tab</Kbd>
        <Kbd size="sm">Space</Kbd>
      </div>
    </div>
  )
}
